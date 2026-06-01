export default function MoveHistory({ historico }) {
  return (
    <div className="bloco-dados">
      <h3>Histórico de Jogadas</h3>
      <ul className="lista-historico">
        {historico.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
