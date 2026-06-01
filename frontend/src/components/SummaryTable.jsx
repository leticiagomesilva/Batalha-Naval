export default function SummaryTable({ jogadores }) {
  return (
    <div className="bloco-dados">
      <h3>Resumo da Partida</h3>
      <table className="tabela-resumo">
        <thead>
          <tr>
            <th>Jogador</th>
            <th>Acertos</th>
            <th>Erros</th>
            <th>Jogadas</th>
          </tr>
        </thead>
        <tbody>
          {jogadores.map((j, i) => (
            <tr key={i}>
              <td>{j.nome}</td>
              <td>{j.acertos}</td>
              <td>{j.erros}</td>
              <td>{j.jogadas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
