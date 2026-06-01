import { useState, useCallback } from 'react';
import { useSocket } from './hooks/useSocket';
import LandingPage from './components/LandingPage';
import GamePage from './components/GamePage';

const estadoInicial = {
  fase: 'lobby',
  codigoPartida: '',
  meuIndice: null,
  jogadores: [],
  tabuleiroProprioNavios: [],
  tirosNoMeuBoard: [],
  tirosNoBoardInimigo: [],
  jogadorAtualIndex: 0,
  historico: [],
  mensagem: 'Clique em uma posição do tabuleiro inimigo.',
  vencedorIndex: null,
  erro: '',
};

export default function App() {
  const [estado, setEstado] = useState(estadoInicial);

  const handleEvento = useCallback((evento, dados) => {
    switch (evento) {
      case 'partida:aguardando':
        setEstado((prev) => ({
          ...prev,
          fase: 'aguardando',
          codigoPartida: dados.codigoPartida,
          erro: '',
        }));
        break;

      case 'partida:iniciada':
        setEstado((prev) => ({
          ...prev,
          fase: 'jogo',
          meuIndice: dados.meuIndice,
          jogadores: dados.jogadores,
          tabuleiroProprioNavios: dados.tabuleiroProprioNavios,
          jogadorAtualIndex: dados.jogadorAtualIndex,
          tirosNoMeuBoard: [],
          tirosNoBoardInimigo: [],
          historico: [],
          mensagem: 'Clique em uma posição do tabuleiro inimigo.',
          vencedorIndex: null,
          erro: '',
        }));
        break;

      case 'jogada:resultado':
        setEstado((prev) => {
          // prev.jogadorAtualIndex é quem atacou (antes de trocar o turno)
          const quemAtacou = prev.jogadorAtualIndex;
          const novoTiro = { posicao: dados.posicao, acerto: dados.acerto };

          return {
            ...prev,
            jogadores: dados.stats,
            jogadorAtualIndex: dados.jogadorAtualIndex,
            historico: dados.historico,
            mensagem: dados.mensagem,
            tirosNoBoardInimigo:
              quemAtacou === prev.meuIndice
                ? [...prev.tirosNoBoardInimigo, novoTiro]
                : prev.tirosNoBoardInimigo,
            tirosNoMeuBoard:
              quemAtacou !== prev.meuIndice
                ? [...prev.tirosNoMeuBoard, novoTiro]
                : prev.tirosNoMeuBoard,
          };
        });
        break;

      case 'jogo:finalizado':
        setEstado((prev) => {
          // prev.jogadorAtualIndex é quem atacou (deu o golpe final)
          const quemAtacou = prev.jogadorAtualIndex;
          const novoTiro = { posicao: dados.posicao, acerto: dados.acerto };

          return {
            ...prev,
            fase: 'fim',
            vencedorIndex: dados.vencedorIndex,
            jogadores: dados.stats,
            historico: dados.historico,
            mensagem: dados.mensagem,
            tirosNoBoardInimigo:
              quemAtacou === prev.meuIndice
                ? [...prev.tirosNoBoardInimigo, novoTiro]
                : prev.tirosNoBoardInimigo,
            tirosNoMeuBoard:
              quemAtacou !== prev.meuIndice
                ? [...prev.tirosNoMeuBoard, novoTiro]
                : prev.tirosNoMeuBoard,
          };
        });
        break;

      case 'adversario:desconectou':
        setEstado((prev) => ({
          ...prev,
          fase: 'fim',
          mensagem: dados.mensagem,
          erro: dados.mensagem,
        }));
        break;

      case 'erro':
        setEstado((prev) => ({ ...prev, erro: dados.mensagem }));
        break;

      default:
        break;
    }
  }, []);

  const { criarPartida, entrarPartida, fazerJogada } = useSocket(handleEvento);

  const novaPartida = useCallback(() => {
    setEstado(estadoInicial);
  }, []);

  if (estado.fase === 'lobby' || estado.fase === 'aguardando') {
    return (
      <LandingPage
        fase={estado.fase}
        codigoPartida={estado.codigoPartida}
        erro={estado.erro}
        onCriarPartida={criarPartida}
        onEntrarPartida={entrarPartida}
      />
    );
  }

  return (
    <GamePage
      estado={estado}
      onFazerJogada={fazerJogada}
      onNovaPartida={novaPartida}
    />
  );
}
