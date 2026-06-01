const Partida = require('./Partida');

class GameManager {
  constructor() {
    this.partidas = new Map();
    this.socketParaPartida = new Map();
  }

  gerarCodigo() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codigo;
    do {
      codigo = Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    } while (this.partidas.has(codigo));
    return codigo;
  }

  criarPartida(socketId, nomeJogador) {
    const codigo = this.gerarCodigo();
    const partida = new Partida(codigo, socketId, nomeJogador);
    this.partidas.set(codigo, partida);
    this.socketParaPartida.set(socketId, codigo);
    return codigo;
  }

  entrarPartida(socketId, codigoPartida, nomeJogador) {
    const codigo = codigoPartida.toUpperCase().trim();
    const partida = this.partidas.get(codigo);

    if (!partida) {
      return { erro: 'Partida não encontrada.' };
    }

    if (partida.prontaParaIniciar()) {
      return { erro: 'Partida já está em andamento.' };
    }

    partida.adicionarSegundoJogador(socketId, nomeJogador);
    this.socketParaPartida.set(socketId, codigo);
    return { partida, codigo };
  }

  processarJogada(socketId, posicao) {
    const codigo = this.socketParaPartida.get(socketId);
    if (!codigo) return { erro: 'Você não está em uma partida.' };

    const partida = this.partidas.get(codigo);
    if (!partida) return { erro: 'Partida não encontrada.' };

    return { resultado: partida.processarJogada(socketId, posicao), partida };
  }

  removerJogador(socketId) {
    const codigo = this.socketParaPartida.get(socketId);
    if (!codigo) return null;

    const partida = this.partidas.get(codigo);
    this.socketParaPartida.delete(socketId);

    if (!partida) return null;

    const outroJogador = partida.jogadores.find((j) => j.socketId !== socketId);

    this.partidas.delete(codigo);
    if (outroJogador) {
      this.socketParaPartida.delete(outroJogador.socketId);
    }

    return outroJogador ? outroJogador.socketId : null;
  }

  getPartidaDoSocket(socketId) {
    const codigo = this.socketParaPartida.get(socketId);
    return codigo ? this.partidas.get(codigo) : null;
  }
}

module.exports = GameManager;
