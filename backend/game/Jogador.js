const Tabuleiro = require('./Tabuleiro');

class Jogador {
  constructor(nome, socketId) {
    this.nome = nome;
    this.socketId = socketId;
    this.tabuleiro = new Tabuleiro();
    this.acertos = 0;
    this.erros = 0;
    this.jogadas = 0;
  }

  getStats() {
    return {
      nome: this.nome,
      acertos: this.acertos,
      erros: this.erros,
      jogadas: this.jogadas,
      naviosRestantes: this.tabuleiro.naviosRestantes(),
    };
  }
}

module.exports = Jogador;
