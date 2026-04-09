class Navio {
  constructor(posicao) {
    this.posicao = posicao;
    this.atingido = false;
  }

  registrarAcerto() {
    this.atingido = true;
  }
}

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
}

class Jogador {
  constructor(nome) {
    this.nome = nome;
    this.tabuleiro = new Tabuleiro();
    this.acertos = 0;
    this.erros = 0;
    this.jogadas = 0;
  }
}

class BatalhaNaval {
  constructor(nome1, nome2) {
    this.jogador1 = new Jogador(nome1);
    this.jogador2 = new Jogador(nome2);
    this.jogadorAtual = this.jogador1;
    this.adversarioAtual = this.jogador2;
    this.fimDeJogo = false;

    this.inicializarElementos();
    this.renderizarInterface();
    this.criarTabuleiros();
    this.atualizarResumo();
  }

  inicializarElementos() {
    this.nomeJ1 = document.getElementById("nome-j1");
    this.nomeJ2 = document.getElementById("nome-j2");
    this.turnoAtual = document.getElementById("turno-atual");
    this.mensagemJogo = document.getElementById("mensagem-jogo");
    this.pontosJ1 = document.getElementById("pontos-j1");
    this.pontosJ2 = document.getElementById("pontos-j2");
    this.restantesJ1 = document.getElementById("restantes-j1");
    this.restantesJ2 = document.getElementById("restantes-j2");
    this.historico = document.getElementById("historico");
    this.corpoTabela = document.getElementById("corpo-tabela");
    this.tabuleiroJ1Ataque = document.getElementById("tabuleiro-j1-ataque");
    this.tabuleiroJ2Ataque = document.getElementById("tabuleiro-j2-ataque");
    this.placarJ1 = document.getElementById("placar-j1");
    this.placarJ2 = document.getElementById("placar-j2");
    this.tituloAtaqueJ1 = document.getElementById("titulo-ataque-j1");
    this.tituloAtaqueJ2 = document.getElementById("titulo-ataque-j2");
  }

  renderizarInterface() {
    this.nomeJ1.textContent = this.jogador1.nome;
    this.nomeJ2.textContent = this.jogador2.nome;
    this.tituloAtaqueJ1.textContent = this.jogador1.nome;
    this.tituloAtaqueJ2.textContent = this.jogador2.nome;
    this.atualizarPainel();
  }

  criarTabuleiros() {
    this.tabuleiroJ1Ataque.innerHTML = "";
    this.tabuleiroJ2Ataque.innerHTML = "";

    for (let linha = 0; linha < 5; linha++) {
      for (let coluna = 0; coluna < 5; coluna++) {
        const celulaJ1 = document.createElement("button");
        celulaJ1.type = "button";
        celulaJ1.classList.add("celula");
        celulaJ1.dataset.linha = linha;
        celulaJ1.dataset.coluna = coluna;
        celulaJ1.dataset.alvo = "j1";
        celulaJ1.addEventListener("click", () =>
          this.realizarJogada(linha, coluna, "j1", celulaJ1)
        );

        const celulaJ2 = document.createElement("button");
        celulaJ2.type = "button";
        celulaJ2.classList.add("celula");
        celulaJ2.dataset.linha = linha;
        celulaJ2.dataset.coluna = coluna;
        celulaJ2.dataset.alvo = "j2";
        celulaJ2.addEventListener("click", () =>
          this.realizarJogada(linha, coluna, "j2", celulaJ2)
        );

        this.tabuleiroJ1Ataque.appendChild(celulaJ1);
        this.tabuleiroJ2Ataque.appendChild(celulaJ2);
      }
    }

    this.atualizarAcessoTabuleiros();
  }

  atualizarAcessoTabuleiros() {
    const celulasJ1 = this.tabuleiroJ1Ataque.querySelectorAll(".celula");
    const celulasJ2 = this.tabuleiroJ2Ataque.querySelectorAll(".celula");

    celulasJ1.forEach((celula) => {
      const jaFoiAtacada =
        celula.classList.contains("agua") || celula.classList.contains("acerto");

      if (this.jogadorAtual !== this.jogador2 || jaFoiAtacada || this.fimDeJogo) {
        celula.disabled = true;
        celula.classList.add("bloqueada");
      } else {
        celula.disabled = false;
        celula.classList.remove("bloqueada");
      }
    });

    celulasJ2.forEach((celula) => {
      const jaFoiAtacada =
        celula.classList.contains("agua") || celula.classList.contains("acerto");

      if (this.jogadorAtual !== this.jogador1 || jaFoiAtacada || this.fimDeJogo) {
        celula.disabled = true;
        celula.classList.add("bloqueada");
      } else {
        celula.disabled = false;
        celula.classList.remove("bloqueada");
      }
    });
  }

  realizarJogada(linha, coluna, alvo, celula) {
    if (this.fimDeJogo) return;

    const posicao = `${linha}-${coluna}`;
    let defensor;

    if (alvo === "j1") {
      defensor = this.jogador1;
      if (this.jogadorAtual !== this.jogador2) return;
    } else {
      defensor = this.jogador2;
      if (this.jogadorAtual !== this.jogador1) return;
    }

    const resultado = defensor.tabuleiro.receberTiro(posicao);

    if (resultado.repetido) {
      this.mensagemJogo.textContent = "Essa posição já foi atacada.";
      return;
    }

    this.jogadorAtual.jogadas++;

    if (resultado.acerto) {
      celula.classList.add("acerto");
      this.jogadorAtual.acertos++;
      this.mensagemJogo.textContent = `${this.jogadorAtual.nome} acertou um navio!`;
      this.adicionarHistorico(
        `${this.jogadorAtual.nome} atacou [${linha}, ${coluna}] e ACERTOU.`
      );
    } else {
      celula.classList.add("agua");
      this.jogadorAtual.erros++;
      this.mensagemJogo.textContent = `${this.jogadorAtual.nome} acertou a água.`;
      this.adicionarHistorico(
        `${this.jogadorAtual.nome} atacou [${linha}, ${coluna}] e caiu na ÁGUA.`
      );
    }

    this.atualizarPainel();
    this.atualizarResumo();

    if (defensor.tabuleiro.todosAfundados()) {
      this.fimDeJogo = true;
      this.turnoAtual.textContent = `${this.jogadorAtual.nome} venceu!`;
      this.mensagemJogo.textContent = `Fim de jogo! ${this.jogadorAtual.nome} afundou todos os navios de ${defensor.nome}.`;
      this.atualizarAcessoTabuleiros();
      return;
    }

    this.trocarTurno();
  }

  trocarTurno() {
    if (this.jogadorAtual === this.jogador1) {
      this.jogadorAtual = this.jogador2;
      this.adversarioAtual = this.jogador1;
    } else {
      this.jogadorAtual = this.jogador1;
      this.adversarioAtual = this.jogador2;
    }

    this.atualizarPainel();
    this.atualizarAcessoTabuleiros();
  }

  atualizarPainel() {
    this.turnoAtual.textContent = this.jogadorAtual.nome;
    this.pontosJ1.textContent = this.jogador1.acertos;
    this.pontosJ2.textContent = this.jogador2.acertos;
    this.restantesJ1.textContent = this.jogador1.tabuleiro.naviosRestantes();
    this.restantesJ2.textContent = this.jogador2.tabuleiro.naviosRestantes();

    this.placarJ1.classList.remove("jogador-ativo");
    this.placarJ2.classList.remove("jogador-ativo");

    if (this.jogadorAtual === this.jogador1) {
      this.placarJ1.classList.add("jogador-ativo");
    } else {
      this.placarJ2.classList.add("jogador-ativo");
    }
  }

  adicionarHistorico(texto) {
    const item = document.createElement("li");
    item.textContent = texto;
    this.historico.prepend(item);

    if (this.historico.children.length > 12) {
      this.historico.removeChild(this.historico.lastChild);
    }
  }

  atualizarResumo() {
    this.corpoTabela.innerHTML = "";

    const linha1 = document.createElement("tr");
    linha1.innerHTML = `
      <td>${this.jogador1.nome}</td>
      <td>${this.jogador1.acertos}</td>
      <td>${this.jogador1.erros}</td>
      <td>${this.jogador1.jogadas}</td>
    `;

    const linha2 = document.createElement("tr");
    linha2.innerHTML = `
      <td>${this.jogador2.nome}</td>
      <td>${this.jogador2.acertos}</td>
      <td>${this.jogador2.erros}</td>
      <td>${this.jogador2.jogadas}</td>
    `;

    this.corpoTabela.appendChild(linha1);
    this.corpoTabela.appendChild(linha2);
  }
}

function obterParametros() {
  const params = new URLSearchParams(window.location.search);
  const j1 = params.get("j1") || "Jogador 1";
  const j2 = params.get("j2") || "Jogador 2";
  return { j1, j2 };
}

const { j1, j2 } = obterParametros();
new BatalhaNaval(j1, j2);

document.getElementById("reiniciar").addEventListener("click", () => {
  window.location.href = "index.html";
});