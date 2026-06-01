const Jogador = require('./Jogador');

class Partida {
  constructor(codigoPartida, socketId, nomeJogador) {
    this.codigoPartida = codigoPartida;
    this.jogadores = [new Jogador(nomeJogador, socketId)];
    this.jogadorAtualIndex = 0;
    this.fimDeJogo = false;
    this.historico = [];
  }

  get jogador1() {
    return this.jogadores[0];
  }

  get jogador2() {
    return this.jogadores[1];
  }

  get jogadorAtual() {
    return this.jogadores[this.jogadorAtualIndex];
  }

  get adversarioAtual() {
    return this.jogadores[this.jogadorAtualIndex === 0 ? 1 : 0];
  }

  adicionarSegundoJogador(socketId, nomeJogador) {
    this.jogadores.push(new Jogador(nomeJogador, socketId));
  }

  prontaParaIniciar() {
    return this.jogadores.length === 2;
  }

  getIndiceDoSocket(socketId) {
    return this.jogadores.findIndex((j) => j.socketId === socketId);
  }

  processarJogada(socketIdAtacante, posicao) {
    if (this.fimDeJogo) {
      return { erro: 'O jogo já terminou.' };
    }

    const indiceAtacante = this.getIndiceDoSocket(socketIdAtacante);

    if (indiceAtacante !== this.jogadorAtualIndex) {
      return { erro: 'Não é a sua vez.' };
    }

    const resultado = this.adversarioAtual.tabuleiro.receberTiro(posicao);

    if (resultado.repetido) {
      return { erro: 'Essa posição já foi atacada.' };
    }

    this.jogadorAtual.jogadas++;

    const [linha, coluna] = posicao.split('-');
    let mensagem;

    if (resultado.acerto) {
      this.jogadorAtual.acertos++;
      mensagem = `${this.jogadorAtual.nome} acertou um navio!`;
      this.historico.unshift(
        `${this.jogadorAtual.nome} atacou [${linha}, ${coluna}] e ACERTOU.`
      );
    } else {
      this.jogadorAtual.erros++;
      mensagem = `${this.jogadorAtual.nome} acertou a água.`;
      this.historico.unshift(
        `${this.jogadorAtual.nome} atacou [${linha}, ${coluna}] e caiu na ÁGUA.`
      );
    }

    if (this.historico.length > 12) {
      this.historico.pop();
    }

    const jogoFinalizado = this.adversarioAtual.tabuleiro.todosAfundados();

    if (jogoFinalizado) {
      this.fimDeJogo = true;
      return {
        posicao,
        acerto: resultado.acerto,
        mensagem,
        historico: [...this.historico],
        stats: this.jogadores.map((j) => j.getStats()),
        jogadorAtualIndex: this.jogadorAtualIndex,
        jogoFinalizado: true,
        vencedorIndex: this.jogadorAtualIndex,
      };
    }

    this.trocarTurno();

    return {
      posicao,
      acerto: resultado.acerto,
      mensagem,
      historico: [...this.historico],
      stats: this.jogadores.map((j) => j.getStats()),
      jogadorAtualIndex: this.jogadorAtualIndex,
      jogoFinalizado: false,
    };
  }

  trocarTurno() {
    this.jogadorAtualIndex = this.jogadorAtualIndex === 0 ? 1 : 0;
  }

  getEstadoInicial(meuIndice) {
    return {
      jogadores: this.jogadores.map((j) => ({
        nome: j.nome,
        acertos: j.acertos,
        erros: j.erros,
        jogadas: j.jogadas,
        naviosRestantes: j.tabuleiro.naviosRestantes(),
      })),
      meuIndice,
      tabuleiroProprioNavios: this.jogadores[meuIndice].tabuleiro.getPosicaoNavios(),
      jogadorAtualIndex: this.jogadorAtualIndex,
    };
  }
}

module.exports = Partida;
