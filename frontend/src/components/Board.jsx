export default function Board({ titulo, celulas, clicavel, onCelulaClick }) {
  return (
    <div className="tabuleiro-box">
      <h3>{titulo}</h3>
      <div className="tabuleiro">
        {Array.from({ length: 5 }, (_, linha) =>
          Array.from({ length: 5 }, (_, coluna) => {
            const posicao = `${linha}-${coluna}`;
            const celula = celulas[posicao] || { status: 'neutro' };
            const bloqueada = !clicavel || celula.status !== 'neutro';

            return (
              <button
                key={posicao}
                type="button"
                className={`celula ${celula.status} ${bloqueada ? 'bloqueada' : ''}`}
                disabled={bloqueada}
                onClick={() => !bloqueada && onCelulaClick(posicao)}
                aria-label={`Célula ${linha},${coluna}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
