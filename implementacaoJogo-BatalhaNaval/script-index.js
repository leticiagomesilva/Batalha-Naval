const form = document.getElementById("form-jogadores");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const jogador1 = document.getElementById("jogador1").value.trim();
  const jogador2 = document.getElementById("jogador2").value.trim();

  if (jogador1 === "" || jogador2 === "") {
    alert("Preencha o nome dos dois jogadores.");
    return;
  }

  const url = `jogo.html?j1=${encodeURIComponent(jogador1)}&j2=${encodeURIComponent(jogador2)}`;
  window.location.href = url;
});