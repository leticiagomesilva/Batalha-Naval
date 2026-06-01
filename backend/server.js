const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const GameManager = require('./game/GameManager');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const gameManager = new GameManager();

io.on('connection', (socket) => {
  console.log(`[+] Socket conectado: ${socket.id}`);

  socket.on('partida:criar', ({ nomeJogador }) => {
    if (!nomeJogador || !nomeJogador.trim()) {
      socket.emit('erro', { mensagem: 'Nome do jogador é obrigatório.' });
      return;
    }

    const codigoPartida = gameManager.criarPartida(socket.id, nomeJogador.trim());
    socket.join(codigoPartida);
    socket.emit('partida:aguardando', { codigoPartida });
    console.log(`[Partida] Criada: ${codigoPartida} por ${nomeJogador}`);
  });

  socket.on('partida:entrar', ({ nomeJogador, codigoPartida }) => {
    if (!nomeJogador || !nomeJogador.trim()) {
      socket.emit('erro', { mensagem: 'Nome do jogador é obrigatório.' });
      return;
    }

    if (!codigoPartida || !codigoPartida.trim()) {
      socket.emit('erro', { mensagem: 'Código da partida é obrigatório.' });
      return;
    }

    const resultado = gameManager.entrarPartida(socket.id, codigoPartida, nomeJogador.trim());

    if (resultado.erro) {
      socket.emit('erro', { mensagem: resultado.erro });
      return;
    }

    const { partida, codigo } = resultado;
    socket.join(codigo);

    // Envia estado inicial para cada jogador separadamente (cada um vê seus próprios navios)
    partida.jogadores.forEach((jogador, indice) => {
      const estadoInicial = partida.getEstadoInicial(indice);
      io.to(jogador.socketId).emit('partida:iniciada', estadoInicial);
    });

    console.log(`[Partida] Iniciada: ${codigo} — ${partida.jogador1.nome} vs ${partida.jogador2.nome}`);
  });

  socket.on('jogada:fazer', ({ posicao }) => {
    if (!posicao) {
      socket.emit('erro', { mensagem: 'Posição inválida.' });
      return;
    }

    const { resultado, partida, erro } = gameManager.processarJogada(socket.id, posicao);

    if (erro) {
      socket.emit('erro', { mensagem: erro });
      return;
    }

    if (resultado.erro) {
      socket.emit('erro', { mensagem: resultado.erro });
      return;
    }

    if (resultado.jogoFinalizado) {
      io.to(partida.codigoPartida).emit('jogo:finalizado', {
        vencedorIndex: resultado.vencedorIndex,
        posicao: resultado.posicao,
        acerto: resultado.acerto,
        mensagem: resultado.mensagem,
        historico: resultado.historico,
        stats: resultado.stats,
      });
      console.log(`[Partida] Finalizada: ${partida.codigoPartida} — Vencedor índice ${resultado.vencedorIndex}`);
    } else {
      io.to(partida.codigoPartida).emit('jogada:resultado', resultado);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[-] Socket desconectado: ${socket.id}`);
    const outroSocketId = gameManager.removerJogador(socket.id);
    if (outroSocketId) {
      io.to(outroSocketId).emit('adversario:desconectou', {
        mensagem: 'Seu adversário desconectou. A partida foi encerrada.',
      });
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor Batalha Naval rodando na porta ${PORT}`);
});
