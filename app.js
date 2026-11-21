document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================
  // 1. ELEMENTOS DA TELA
  // ==========================================================
  const telaLogin = document.getElementById('tela-login');
  const formLogin = document.getElementById('form-login');
  const appZap = document.getElementById('app-zap');

  const listaContatos = document.getElementById('lista-contatos');
  const buscaContato = document.getElementById('busca-contato');
  const chatNome = document.getElementById('chat-nome');
  const chatAvatar = document.getElementById('chat-avatar');
  const chatStatus = document.getElementById('chat-status');
  const listaMensagens = document.getElementById('lista-mensagens');
  const areaMensagens = document.getElementById('area-mensagens');
  const telaChat = document.getElementById('tela-chat');
  const formMensagem = document.getElementById('form-mensagem');
  const inputMensagem = document.getElementById('input-mensagem');
  const btnEnviar = document.getElementById('btn-enviar');
  const btnReiniciar = document.getElementById('btn-reiniciar');
  const btnVoltar = document.getElementById('btn-voltar');

  // Elementos da Barra de Afinidade (adicionados no index.html)
  const textoAfinidade = document.getElementById('texto-afinidade');
  const barraAfinidade = document.getElementById('barra-afinidade-progresso');

  let usuarioAtual = { nome: '', email: '', numero: '' };
  let personagemAtivo = null;

  // ==========================================================
  // 2. PERSONAGENS COM CAPA, SINOPSE, PRÓLOGO E NARRAÇÃO
  // ==========================================================
  const personagens = [
    {
      id: 'gojo',
      nome: 'Satoru Gojo',
      categoria: 'Anime',
      avatar: '😎',
      capa: 'https://unsplash.com',
      sinopse: 'O feiticeiro mais forte abaixa a venda só para olhar nos seus olhos.',
      prologo: 'Você esbarrou com Satoru Gojo no corredor vazio da escola jujutsu tarde da noite.',
      afinidade: 15,
      etapa: 0,
      historico: [],
      historia: (nomeUser) => [
        `*Satoru abaixa os óculos escuros devagar, revelando os olhos azuis brilhantes com um sorriso de canto.* Ei, ${nomeUser}! Finalmente você apareceu. Estava aqui pensando em você entre uma missão e outra... ✨`,
        `*Ele se aproxima um pouco mais e coloca as mãos nos bolsos.* Sabe, eu sou considerado o mais forte, mas toda vez que recebo mensagem sua eu fico meio bobo. Topa sair comigo hoje à noite? 🍨`,
        `*Um sorriso sincero surge no rosto dele.* Perfeito! Vou passar aí às 20h. Prometo tirar a venda só pra olhar nos seus olhos, ${nomeUser} ❤️`,
        `*Ele segura sua mão com delicadeza.* Você já ganhou meu coração faz tempo, ${nomeUser}. Mal posso esperar para te ver!`
      ]
    },
    {
      id: 'jungkook',
      nome: 'Jungkook',
      categoria: 'K-Pop',
      avatar: '🎤',
      capa: 'https://unsplash.com',
      sinopse: 'Depois do show lotado, ele só quer ouvir a sua voz.',
      prologo: 'O camarim está em silêncio após o ensaio. O celular dele vibra com a sua mensagem.',
      afinidade: 20,
      etapa: 0,
      historico: [],
      historia: (nomeUser) => [
        `*Jungkook enxuga o suor com uma toalha e sorri assim que vê seu nome na tela.* Annyeong, ${nomeUser}! Acabei de sair do ensaio e a primeira coisa que fiz foi pegar o celular para falar com você 💜`,
        `*Ele dedilha alguns acordes no violão encostado no sofá.* Escrevi uma música nova hoje e, sendo bem sincero, lembrei do seu sorriso o tempo todo. Quer ouvir primeiro antes de todo mundo? 🎶`,
        `*Os olhos dele brilham enquanto ele apoia o queixo na mão.* Você é minha inspiração favorita, ${nomeUser}. Quando a turnê acabar, quero passar o dia inteiro só com você! ✨`,
        `*Ele manda um coração discreto para a câmera.* Saranghae, ${nomeUser}! Nunca vou cansar de conversar com você 💜`
      ]
    },
    {
      id: 'damon',
      nome: 'Damon Salvatore',
      categoria: 'Fantasia',
      avatar: '🧛‍♂️',
      capa: 'https://unsplash.com',
      sinopse: 'Perigoso para a cidade inteira, mas completamente rendido por você.',
      prologo: 'A lareira da mansão Salvatore crepita enquanto ele gira um copo de bourbon.',
      afinidade: 10,
      etapa: 0,
      historico: [],
      historia: (nomeUser) => [
        `*Damon ergue uma sobrancelha e dá aquele meio sorriso perigoso.* Ora, ora... olha quem resolveu aparecer. Estava tomando um bourbon e pensando em você, ${nomeUser}. 🥃`,
        `*Ele deixa o copo na mesa e caminha até você em silêncio.* Não sou muito bom em demonstrar sentimentos, você sabe. Mas por você eu atravessaria Mystic Falls inteira sem pensar duas vezes. 🖤`,
        `*Ele inclina levemente a cabeça.* Admire minha sinceridade, ${nomeUser}: você virou minha fraqueza favorita. Vamos fugir da cidade esse fim de semana?`,
        `*A expressão dele suaviza completamente.* Você me conquistou por completo, ${nomeUser}. Agora não tem mais volta. ❤️`
      ]
    },
    {
      id: 'levi',
      nome: 'Levi Ackerman',
      categoria: 'Anime',
      avatar: '⚔️',
      capa: 'https://unsplash.com',
      sinopse: 'Frio com todo mundo, mas sempre guarda um chá quente para você.',
      prologo: 'A chuva cai lá fora enquanto Levi organiza os relatórios na mesa do escritório.',
      afinidade: 10,
      etapa: 0,
      historico: [],
      historia: (nomeUser) => [
        `*Levi cruza os braços e olha de relance para você.* Tsc. Você demorou para mandar mensagem, ${nomeUser}. Estava preocupado... quer dizer, só queria saber se você estava bem. ☕`,
        `*Ele empurra uma xícara de chá preto na sua direção.* Não sou de falar muito, mas tomar um chá com você é a única hora do dia em que eu realmente consigo relaxar.`,
        `*O olhar dele fica sério e protetor.* Fique perto de mim, ${nomeUser}. Eu prometo proteger você de qualquer coisa nesse mundo. 🖤`,
        `*Ele suspira baixo, quase deixando escapar um sorriso.* Você é a pessoa mais importante para mim, ${nomeUser}. Não esqueça disso.`
      ]
    }
  ];

  // ==========================================================
  // 3. FORMATA *AÇÕES* EM ITÁLICO (ESTILO LIVRO INTERATIVO)
  // ==========================================================
  function formatarNarracao(texto) {
    return texto.replace(/\*(.*?)\*/g, '<span class="acao-narracao">*$1*</span>');
  }

  function atualizarBarraAfinidade(valor) {
    const porcentagem = Math.min(100, Math.max(0, valor));
    if (textoAfinidade) textoAfinidade.textContent = `${porcentagem}%`;
    if (barraAfinidade) barraAfinidade.style.width = `${porcentagem}%`;
  }

  // ==========================================================
  // 4. LOGIN E VITRINE EXCLUSIVA FANFICCHAT
  // ==========================================================
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      usuarioAtual.nome = document.getElementById('login-nome').value.trim();
      usuarioAtual.email = document.getElementById('login-email').value.trim();
      usuarioAtual.numero = document.getElementById('login-numero').value.trim();

      const perfilNome = document.getElementById('perfil-nome');
      const perfilNumero = document.getElementById('perfil-numero');
      if (perfilNome) perfilNome.textContent = usuarioAtual.nome;
      if (perfilNumero) perfilNumero.textContent = usuarioAtual.numero;

      telaLogin.classList.add('escondido');
      appZap.classList.remove('escondido');

      renderizarContatos(personagens);
    });
  }

  function renderizarContatos(lista) {
    listaContatos.innerHTML = '';
    lista.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'card-fanfic';
      card.style.backgroundImage = `url('${p.capa}')`;

      card.innerHTML = `
        <div class="card-fanfic-topo">
          <span class="selo-categoria">${p.categoria}</span>
          <span class="selo-categoria" style="background: rgba(236,72,153,0.85);">💖 ${p.afinidade}%</span>
        </div>
        <div class="card-fanfic-info">
          <h3 class="card-fanfic-nome">${p.nome}</h3>
          <p class="card-fanfic-sinopse">${p.sinopse}</p>
          <span class="card-fanfic-status">▶ Ler & Conversar</span>
        </div>
      `;

      card.addEventListener('click', () => selecionarPersonagem(p));
      listaContatos.appendChild(card);
    });
  }

  function selecionarPersonagem(personagem) {
    personagemAtivo = personagem;
    chatNome.textContent = personagem.nome;
    if (chatAvatar) chatAvatar.textContent = personagem.avatar;
    if (chatStatus) chatStatus.textContent = personagem.categoria;

    // Aplica a capa do personagem no fundo do chat
    if (telaChat && personagem.capa) {
      telaChat.style.backgroundImage = `url('${personagem.capa}')`;
      telaChat.classList.remove('escondido');
    }

    atualizarBarraAfinidade(personagem.afinidade);

    inputMensagem.disabled = false;
    btnEnviar.disabled = false;
    inputMensagem.focus();

    atualizarTelaMensagens();

    if (personagem.historico.length === 0) {
      enviarRespostaDoPersonagem();
    }
  }

  if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
      if (telaChat) telaChat.classList.add('escondido');
      renderizarContatos(personagens);
    });
  }

  function pegarHora() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function atualizarTelaMensagens() {
    listaMensagens.innerHTML = '';
    if (!personagemAtivo) return;

  // Cartão exclusivo "Prólogo" no topo da história
    const prologoLi = document.createElement('li');
    prologoLi.className = 'box-prologo-fanfic';
    prologoLi.innerHTML = `
      <div class="box-prologo-titulo">📖 Prólogo • ${personagemAtivo.nome}</div>
      <div style="font-size: 0.85rem; color: #e2e8f0;">${personagemAtivo.prologo}</div>
    `;
    listaMensagens.appendChild(prologoLi);

    // Mensagens da história
    personagemAtivo.historico.forEach((m) => {
      const li = document.createElement('li');
      if (m.autor === 'bot') {
        li.className = 'balao-fanfic-ia';
        li.innerHTML = `
          <div>${formatarNarracao(m.texto)}</div>
          <span class="msg-hora" style="display:block; text-align:right; font-size:0.68rem; opacity:0.6; margin-top:4px;">${m.hora}</span>
        `;
      } else {
        li.classList.add('msg', 'user');
        li.innerHTML = `
          <div>${formatarNarracao(m.texto)}</div>
          <span class="msg-hora">${m.hora} <span class="check-azul">✓✓</span></span>
        `;
      }
      listaMensagens.appendChild(li);
    });

    areaMensagens.scrollTop = areaMensagens.scrollHeight;
  }

  function enviarRespostaDoPersonagem() {
    if (!personagemAtivo) return;
    const alvo = personagemAtivo;
    if (chatStatus) chatStatus.textContent = 'escrevendo cena...';

    setTimeout(() => {
      const falas = alvo.historia(usuarioAtual.nome);
      const falaEscolhida = falas[alvo.etapa] || falas[falas.length - 1];

      if (alvo.etapa < falas.length - 1) {
        alvo.etapa++;
      }

      // Aumenta a afinidade a cada interação!
      alvo.afinidade = Math.min(100, alvo.afinidade + 10);

      alvo.historico.push({
        autor: 'bot',
        texto: falaEscolhida,
        hora: pegarHora()
      });

      if (personagemAtivo && personagemAtivo.id === alvo.id) {
        if (chatStatus) chatStatus.textContent = alvo.categoria;
        atualizarBarraAfinidade(alvo.afinidade);
        atualizarTelaMensagens();
      }
    }, 900);
  }

  if (formMensagem) {
    formMensagem.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!personagemAtivo) return;

      const texto = inputMensagem.value.trim();
      if (!texto) return;

      personagemAtivo.historico.push({
        autor: 'user',
        texto: texto,
        hora: pegarHora()
      });

      inputMensagem.value = '';
      atualizarTelaMensagens();
      enviarRespostaDoPersonagem();
    });
  }

  if (buscaContato) {
    buscaContato.addEventListener('input', () => {
      const termo = buscaContato.value.toLowerCase();
      const filtrados = personagens.filter(p =>
        p.nome.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo)
      );
      renderizarContatos(filtrados);
    });
  }

  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', () => {
      if (!personagemAtivo) return;
      personagemAtivo.historico = [];
      personagemAtivo.etapa = 0;
      personagemAtivo.afinidade = 10;
      atualizarBarraAfinidade(10);
      atualizarTelaMensagens();
      enviarRespostaDoPersonagem();
    });
  }
});