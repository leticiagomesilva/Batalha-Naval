import { useState } from 'react';

export default function LandingPage({ fase, codigoPartida, erro, onCriarPartida, onEntrarPartida }) {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [modo, setModo] = useState('inicio'); // 'inicio' | 'entrar'

  function handleCriar(e) {
    e.preventDefault();
    if (!nome.trim()) return;
    onCriarPartida(nome.trim());
  }

  function handleEntrar(e) {
    e.preventDefault();
    if (!nome.trim() || !codigo.trim()) return;
    onEntrarPartida(nome.trim(), codigo.trim());
  }

  if (fase === 'aguardando') {
    return (
      <div className="pagina-inicial">
        <div className="container">
          <div className="card">
            <h1>Batalha Naval</h1>
            <p className="subtitulo">Aguardando adversário...</p>
            <div className="codigo-partida">
              <p>Compartilhe este código com seu adversário:</p>
              <strong className="codigo-destaque">{codigoPartida}</strong>
            </div>
            <p className="hint">Quando o adversário entrar, o jogo começa automaticamente.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-inicial">
      <div className="container">
        <div className="card">
          <h1>Batalha Naval</h1>
          <p className="subtitulo">Jogo multiplayer em tempo real</p>

          {erro && <p className="mensagem-erro">{erro}</p>}

          {modo === 'inicio' && (
            <div className="botoes-inicio">
              <button className="botao-principal" onClick={() => setModo('criar')}>
                Criar Partida
              </button>
              <button className="botao-secundario" onClick={() => setModo('entrar')}>
                Entrar com Código
              </button>
            </div>
          )}

          {modo === 'criar' && (
            <form className="formulario" onSubmit={handleCriar}>
              <div className="campo">
                <label htmlFor="nome">Seu nome</label>
                <input
                  id="nome"
                  type="text"
                  maxLength={20}
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="botao-principal">
                Criar Partida
              </button>
              <button type="button" className="botao-link" onClick={() => setModo('inicio')}>
                Voltar
              </button>
            </form>
          )}

          {modo === 'entrar' && (
            <form className="formulario" onSubmit={handleEntrar}>
              <div className="campo">
                <label htmlFor="nome-entrar">Seu nome</label>
                <input
                  id="nome-entrar"
                  type="text"
                  maxLength={20}
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="campo">
                <label htmlFor="codigo">Código da partida</label>
                <input
                  id="codigo"
                  type="text"
                  maxLength={6}
                  placeholder="Ex: ABC123"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <button type="submit" className="botao-principal">
                Entrar na Partida
              </button>
              <button type="button" className="botao-link" onClick={() => setModo('inicio')}>
                Voltar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
