const Navio = require('./Navio');

class Tabuleiro {
  constructor(tamanho = 5, quantidadeNavios = 3) {
    this.tamanho = tamanho;
    this.quantidadeNavios = quantidadeNavios;
    this.navios = [];
    this.tirosRecebidos = [];
    this.posicionarNaviosAutomaticamente();
  }

  posicionarNaviosAutomaticamente() {
    while (this.navios.length < this.quantidadeNavios) {
      const linha = Math.floor(Math.random() * this.tamanho);
      const coluna = Math.floor(Math.random() * this.tamanho);
      const posicao = `${linha}-${coluna}`;

      const jaExiste = this.navios.some((navio) => navio.posicao === posicao);
      if (!jaExiste) {
        this.navios.push(new Navio(posicao));
      }
    }
  }

  receberTiro(posicao) {
    if (this.tirosRecebidos.includes(posicao)) {
      return { repetido: true };
    }

    this.tirosRecebidos.push(posicao);

    const navio = this.navios.find((n) => n.posicao === posicao);
    if (navio) {
      navio.registrarAcerto();
      return { repetido: false, acerto: true };
    }

    return { repetido: false, acerto: false };
  }

  naviosRestantes() {
    return this.navios.filter((n) => !n.atingido).length;
  }

  todosAfundados() {
    return this.navios.every((n) => n.atingido);
  }

  getPosicaoNavios() {
    return this.navios.map((n) => n.posicao);
  }
}

module.exports = Tabuleiro;
