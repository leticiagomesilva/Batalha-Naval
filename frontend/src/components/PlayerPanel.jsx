export default function PlayerPanel({ jogador, ativo }) {
  return (
    <div className={`card-info jogador-card ${ativo ? 'jogador-ativo' : ''}`}>
      <h2>{jogador.nome}</h2>
      <p>Acertos: <span>{jogador.acertos}</span></p>
      <p>Navios restantes: <span>{jogador.naviosRestantes}</span></p>
    </div>
  );
}
