# Batalha Naval

Jogo de **Batalha Naval** multiplayer em tempo real, com frontend em **React** e backend em **Node.js + Socket.io**. A lógica do jogo (regras, pontuação, controle de turno) roda exclusivamente no servidor, permitindo que dois jogadores se enfrentem em **computadores diferentes**.

> O código original em HTML/CSS/JavaScript puro está preservado na pasta `implementacaoJogo-BatalhaNaval/`.

---

## Como jogar

### 1. Inicie os servidores

**Terminal 1 — Backend:**
```bash
cd backend
npm install
node server.js
# Servidor rodando em http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# App disponível em http://localhost:5173
```

### 2. Criar uma partida

- Abra `http://localhost:5173` no seu navegador
- Digite seu nome e clique em **"Criar Partida"**
- Um **código de 6 caracteres** será exibido (ex: `K7R2NX`)
- Compartilhe esse código com seu adversário e aguarde ele entrar

### 3. Entrar em uma partida

- O adversário abre `http://localhost:5173` no **seu próprio computador**
- Digita seu nome, clica em **"Entrar com Código"** e insere o código recebido
- O jogo começa automaticamente assim que os dois jogadores estiverem conectados

### 4. Jogando

- Os navios são posicionados **automaticamente** pelo servidor antes do início
- Cada jogador vê dois tabuleiros:
  - **Meu tabuleiro** — sua frota (navios visíveis) e os ataques recebidos
  - **Atacar** — tabuleiro inimigo onde você clica para disparar
- Apenas o jogador da vez consegue clicar; o adversário aguarda em tempo real
- Células **vermelhas** = acerto | Células **azuis** = água
- Vence quem afundar todos os 3 navios do adversário primeiro

---

## Recursos

- Multiplayer em tempo real via WebSockets (dois computadores diferentes)
- Toda a inteligência do jogo no backend (regras, turno, pontuação)
- Código de partida para conectar os jogadores
- Detecção de desconexão do adversário
- Tabuleiro de defesa com navios visíveis e ataques recebidos
- Tabuleiro de ataque com histórico de disparos
- Painel de informações com acertos e navios restantes
- Histórico de jogadas em tempo real
- Tabela de resumo da partida
- Destaque visual para o jogador da vez

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React 18, Vite, Socket.io Client |
| Backend | Node.js, Express, Socket.io |
| Comunicação | WebSockets (Socket.io) |

---

## Estrutura do projeto

```
Batalha-Naval/
├── implementacaoJogo-BatalhaNaval/   # versão original (vanilla JS)
│   ├── index.html
│   ├── jogo.html
│   ├── style.css
│   ├── script-index.js
│   └── script-jogo.js
├── backend/
│   ├── package.json
│   ├── server.js                     # Express + Socket.io
│   └── game/
│       ├── Navio.js
│       ├── Tabuleiro.js
│       ├── Jogador.js
│       ├── Partida.js                # lógica central da partida
│       └── GameManager.js            # gerencia partidas em memória
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── hooks/
        │   └── useSocket.js
        ├── styles/
        │   └── App.css
        └── components/
            ├── LandingPage.jsx
            ├── GamePage.jsx
            ├── Board.jsx
            ├── PlayerPanel.jsx
            ├── MoveHistory.jsx
            └── SummaryTable.jsx
```

---

## Eventos WebSocket

| Direção | Evento | Descrição |
|---|---|---|
| Cliente → Servidor | `partida:criar` | Cria nova partida |
| Cliente → Servidor | `partida:entrar` | Entra em partida existente pelo código |
| Cliente → Servidor | `jogada:fazer` | Envia coordenada de ataque |
| Servidor → Cliente | `partida:aguardando` | Confirmação de criação + código gerado |
| Servidor → Cliente | `partida:iniciada` | Estado inicial do jogo para cada jogador |
| Servidor → Cliente | `jogada:resultado` | Resultado do tiro + novo estado |
| Servidor → Cliente | `jogo:finalizado` | Fim de jogo com vencedor e estatísticas |
| Servidor → Cliente | `adversario:desconectou` | Avisa quando o oponente sai |
