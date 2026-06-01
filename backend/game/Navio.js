class Navio {
  constructor(posicao) {
    this.posicao = posicao;
    this.atingido = false;
  }

  registrarAcerto() {
    this.atingido = true;
  }
}

module.exports = Navio;
