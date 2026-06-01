import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SERVIDOR_URL = 'http://localhost:3001';

export function useSocket(onEvento) {
  const socketRef = useRef(null);
  const onEventoRef = useRef(onEvento);

  useEffect(() => {
    onEventoRef.current = onEvento;
  });

  useEffect(() => {
    const socket = io(SERVIDOR_URL);
    socketRef.current = socket;

    socket.on('partida:aguardando', (dados) =>
      onEventoRef.current('partida:aguardando', dados)
    );
    socket.on('partida:iniciada', (dados) =>
      onEventoRef.current('partida:iniciada', dados)
    );
    socket.on('jogada:resultado', (dados) =>
      onEventoRef.current('jogada:resultado', dados)
    );
    socket.on('jogo:finalizado', (dados) =>
      onEventoRef.current('jogo:finalizado', dados)
    );
    socket.on('adversario:desconectou', (dados) =>
      onEventoRef.current('adversario:desconectou', dados)
    );
    socket.on('erro', (dados) => onEventoRef.current('erro', dados));

    return () => {
      socket.disconnect();
    };
  }, []);

  const criarPartida = useCallback((nomeJogador) => {
    socketRef.current?.emit('partida:criar', { nomeJogador });
  }, []);

  const entrarPartida = useCallback((nomeJogador, codigoPartida) => {
    socketRef.current?.emit('partida:entrar', { nomeJogador, codigoPartida });
  }, []);

  const fazerJogada = useCallback((posicao) => {
    socketRef.current?.emit('jogada:fazer', { posicao });
  }, []);

  return { criarPartida, entrarPartida, fazerJogada };
}
