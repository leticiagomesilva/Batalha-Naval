import { useMemo } from 'react';
import Board from './Board';
import PlayerPanel from './PlayerPanel';
import MoveHistory from './MoveHistory';
import SummaryTable from './SummaryTable';

function construirCelulasMeuBoard(navios, tirosRecebidos) {
  const celulas = {};
  navios.forEach((pos) => {
    celulas[pos] = { status: 'navio' };
  });
  tirosRecebidos.forEach(({ posicao, acerto }) => {
    celulas[posicao] = { status: acerto ? 'acerto' : 'agua' };
  });
  return celulas;
}

function construirCelulasAtaque(tirosFeitos) {
  const celulas = {};
  tirosFeitos.forEach(({ posicao, acerto }) => {
    celulas[posicao] = { status: acerto ? 'acerto' : 'agua' };
  });
  return celulas;
}

export default function GamePage({ estado, onFazerJogada, onNovaPartida }) {
  const {
    fase,
    meuIndice,
    jogadores,
    tabuleiroProprioNavios,
    tirosNoMeuBoard,
    tirosNoBoardInimigo,
    jogadorAtualIndex,
    historico,
    mensagem,
    vencedorIndex,
    erro,
  } = estado;

  const ehMinhaVez = jogadorAtualIndex === meuIndice;
  const jogoAcabou = fase === 'fim';

  const celulasMeuBoard = useMemo(
    () => construirCelulasMeuBoard(tabuleiroProprioNavios, tirosNoMeuBoard),
    [tabuleiroProprioNavios, tirosNoMeuBoard]
  );

  const celulasAtaque = useMemo(
    () => construirCelulasAtaque(tirosNoBoardInimigo),
    [tirosNoBoardInimigo]
  );

  const inimigo = jogadores[meuIndice === 0 ? 1 : 0];
  const eu = jogadores[meuIndice];

  let tituloTurno;
  if (jogoAcabou && vencedorIndex !== null) {
    tituloTurno = `${jogadores[vencedorIndex]?.nome} venceu!`;
  } else {
    tituloTurno = jogadores[jogadorAtualIndex]?.nome ?? '...';
  }

  return (
    <div className="container-jogo">
      <header className="topo">
        <h1>Batalha Naval</h1>
        <button className="botao-secundario" onClick={onNovaPartida}>
          Nova Partida
        </button>
      </header>

      <section className="painel-info">
        <PlayerPanel jogador={eu ?? { nome: '...', acertos: 0, naviosRestantes: 3 }} ativo={ehMinhaVez} />

        <div className="card-info centro-card">
          <h2>Vez de</h2>
          <p className="turno-destaque">{tituloTurno}</p>
          <p className="mensagem-jogo">{mensagem}</p>
          {erro && <p className="mensagem-erro">{erro}</p>}
          {!jogoAcabou && (
            <p className="sua-vez-hint">
              {ehMinhaVez ? '⚔️ É a sua vez!' : '⏳ Aguardando adversário...'}
            </p>
          )}
        </div>

        <PlayerPanel
          jogador={inimigo ?? { nome: '...', acertos: 0, naviosRestantes: 3 }}
          ativo={!ehMinhaVez && !jogoAcabou}
        />
      </section>

      <section className="area-tabuleiros">
        <Board
          titulo={`Meu tabuleiro (${eu?.nome ?? '...'})`}
          celulas={celulasMeuBoard}
          clicavel={false}
          onCelulaClick={() => {}}
        />

        <Board
          titulo={`Atacar: ${inimigo?.nome ?? '...'}`}
          celulas={celulasAtaque}
          clicavel={ehMinhaVez && !jogoAcabou}
          onCelulaClick={onFazerJogada}
        />
      </section>

      <section className="painel-dados">
        <MoveHistory historico={historico} />
        <SummaryTable jogadores={jogadores} />
      </section>
    </div>
  );
}
