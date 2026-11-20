document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================
  // 1. SEU CÓDIGO DE TESTE DO ELECTRON (INTEGRADO COM SEGURANÇA)
  // ==========================================================
  const botaoTeste = document.querySelector('#btnTeste');
  const mensagem = document.querySelector('#mensagem');

  if (botaoTeste && mensagem) {
    botaoTeste.addEventListener('click', () => {
      mensagem.textContent = 'JavaScript funcionando no Electron!';
    });
  }

  // ==========================================================
  // 2. SISTEMA DE LOGIN E CHAT ESTILO WHATSAPP (WHATSLOVE)
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
  const formMensagem = document.getElementById('form-mensagem');
  const inputMensagem = document.getElementById('input-mensagem');
  const btnEnviar = document.getElementById('btn-enviar');
  const btnTema = document.getElementById('btn-tema');
  const btnReiniciar = document.getElementById('btn-reiniciar');

  let usuarioAtual = { nome: '', email: '', numero: '' };
  let personagemAtivo = null;

  // PERSONAGENS COM HISTÓRIAS DE AMOR INTERATIVAS
  const personagens = [
    {
      id: 'gojo',
      nome: 'Satoru Gojo',
      categoria: 'Anime',
      avatar: '😎',
      etapa: 0,
      historico: [],
      historia: (nomeUser) => [
        `Ei, ${nomeUser}! Finalmente você me respondeu. Estava aqui pensando em você entre uma missão e outra... ✨`,
        `Sabe, eu sou considerado o mais forte, mas toda vez que recebo mensagem sua eu fico meio bobo. Você topa sair comigo hoje à noite? 🍨`,
        `Perfeito! Vou passar aí às 20h. Prometo tirar a venda só pra olhar nos seus olhos, ${nomeUser} ❤️`,
        `Você já ganhou meu coração faz tempo, ${nomeUser}. Mal posso esperar para te ver!`
      ]
    },
    {
      id: 'jungkook',
      nome: 'Jungkook',
      categoria: 'K-Pop',
      avatar: '🎤',
      etapa: 0,
      historico: [],
      historia: (nomeUser) => [
        `Annyeong, ${nomeUser}! Acabei de sair do ensaio agora e a primeira coisa que fiz foi pegar o celular para falar com você 💜`,
        `Escrevi uma música nova hoje e, sendo bem sincero, lembrei do seu sorriso o tempo todo. Quer ouvir primeiro antes de todo mundo? 🎶`,
        `Você é minha inspiração favorita, ${nomeUser}. Quando a turnê acabar, quero passar o dia inteiro só com você! ✨`,
        `Saranghae, ${nomeUser}! Nunca vou cansar de conversar com você 💜`
      ]
    },
    {
      id: 'damon',
      nome: 'Damon Salvatore',
      categoria: 'Série',
      avatar: '🧛‍♂️',
      etapa: 0,
      historico: [],
      historia: (nomeUser) => [
        `Ora, ora... olha quem resolveu aparecer. Estava tomando um bourbon e pensando em você, ${nomeUser}. 🥃`,
        `Não sou muito bom em demonstrar sentimentos, você sabe. Mas por você eu atravessaria Mystic Falls inteira sem pensar duas vezes. 🖤`,
        `Admire minha sinceridade, ${nomeUser}: você virou minha fraqueza favorita. Vamos fugir da cidade esse fim de semana?`,
        `Você me conquistou por completo, ${nomeUser}. Agora não tem mais volta. ❤️`
      ]
    },
    {
      id: 'levi',
      nome: 'Levi Ackerman',
      categoria: 'Anime',
      avatar: '⚔️',
      etapa: 0,
      historico: [],
      historia: (nomeUser) => [
        `Tsc. Você demorou para mandar mensagem, ${nomeUser}. Estava preocupado... quer dizer, só queria saber se você estava bem. ☕`,
        `Não sou de falar muito, mas tomar um chá com você é a única hora do dia em que eu realmente consigo relaxar.`,
        `Fique perto de mim, ${nomeUser}. Eu prometo proteger você de qualquer coisa nesse mundo. 🖤`,
        `Você é a pessoa mais importante para mim, ${nomeUser}. Não esqueça disso.`
      ]
    }
  ];

  // ENTRADA NO APP
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      usuarioAtual.nome = document.getElementById('login-nome').value.trim();
      usuarioAtual.email = document.getElementById('login-email').value.trim();
      usuarioAtual.numero = document.getElementById('login-numero').value.trim();

      document.getElementById('perfil-nome').textContent = usuarioAtual.nome;
      document.getElementById('perfil-numero').textContent = usuarioAtual.numero;

      telaLogin.classList.add('escondido');
      appZap.classList.remove('escondido');

      renderizarContatos(personagens);
    });
  }

  function renderizarContatos(lista) {
    listaContatos.innerHTML = '';
    lista.forEach((p) => {
      const ultimaMsg = p.historico.length > 0
        ? p.historico[p.historico.length - 1].texto
        : 'Toque para iniciar a história...';

      const li = document.createElement('li');
      li.classList.add('contato-item');
      if (personagemAtivo && personagemAtivo.id === p.id) {
        li.classList.add('ativo');
      }

      li.innerHTML = `
        <div class="avatar-contato">${p.avatar}</div>
        <div class="contato-info">
          <div class="contato-topo">
            <strong>${p.nome}</strong>
            <span class="tag-categoria">${p.categoria}</span>
          </div>
          <p class="contato-previa">${ultimaMsg}</p>
        </div>
      `;

      li.addEventListener('click', () => selecionarPersonagem(p));
      listaContatos.appendChild(li);
    });
  }

  function selecionarPersonagem(personagem) {
    personagemAtivo = personagem;
    chatNome.textContent = `${personagem.nome} (${personagem.categoria})`;
    chatAvatar.textContent = personagem.avatar;
    chatStatus.textContent = 'online';

    inputMensagem.disabled = false;
    btnEnviar.disabled = false;
    inputMensagem.focus();

    renderizarContatos(personagens);
    atualizarTelaMensagens();

    if (personagem.historico.length === 0) {
      enviarRespostaDoPersonagem();
    }
  }

  function pegarHora() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function atualizarTelaMensagens() {
    listaMensagens.innerHTML = '';
    if (!personagemAtivo) return;

    personagemAtivo.historico.forEach((m) => {
      const li = document.createElement('li');
      li.classList.add('msg', m.autor);
      const check = m.autor === 'user' ? '<span class="check-azul">✓✓</span>' : '';
      li.innerHTML = `
        <div>${m.texto}</div>
        <span class="msg-hora">${m.hora} ${check}</span>
      `;
      listaMensagens.appendChild(li);
    });

    areaMensagens.scrollTop = areaMensagens.scrollHeight;
  }

  function enviarRespostaDoPersonagem() {
    if (!personagemAtivo) return;
    const alvo = personagemAtivo;
    chatStatus.textContent = 'digitando...';

    setTimeout(() => {
      const falas = alvo.historia(usuarioAtual.nome);
      const falaEscolhida = falas[alvo.etapa] || falas[falas.length - 1];

      if (alvo.etapa < falas.length - 1) {
        alvo.etapa++;
      }

      alvo.historico.push({
        autor: 'bot',
        texto: falaEscolhida,
        hora: pegarHora()
      });

      if (personagemAtivo && personagemAtivo.id === alvo.id) {
        chatStatus.textContent = 'online';
        atualizarTelaMensagens();
      }
      renderizarContatos(personagens);
    }, 1000);
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
      renderizarContatos(personagens);

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
      atualizarTelaMensagens();
      enviarRespostaDoPersonagem();
    });
  }

  if (btnTema) {
    btnTema.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }
});
