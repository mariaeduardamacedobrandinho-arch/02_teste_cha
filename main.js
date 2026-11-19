document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-chat');
  const campoTexto = document.getElementById('campo-texto');
  const listaMensagens = document.getElementById('lista-mensagens');
  const chatArea = document.getElementById('chat-area');
  const statusBot = document.getElementById('status');
  const btnTema = document.getElementById('btn-tema');
  const btnLimpar = document.getElementById('btn-limpar');

  // Função que retorna a hora atual formatada
  function pegarHora() {
    const agora = new Date();
    return agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // Função garantida para desenhar a mensagem na tela
  function adicionarMensagem(texto, remetente) {
    const li = document.createElement('li');
    li.classList.add('mensagem', remetente); // 'user' ou 'bot'
    
    li.innerHTML = `
      <div>${texto}</div>
      <span class="hora">${pegarHora()}</span>
    `;

    listaMensagens.appendChild(li);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // Inteligência básica do Robô
  function gerarRespostaDoRobo(mensagemUsuario) {
    const texto = mensagemUsuario.toLowerCase();

    if (texto.includes('oi') || texto.includes('olá') || texto.includes('ola') || texto.includes('bom dia') || texto.includes('boa tarde') || texto.includes('boa noite')) {
      return 'Olá! Tudo lindo por aqui e meus circuitos estão prontos para trabalhar. Manda a boa: como posso te ajudar?';
    }
    if (texto.includes('tudo bem') || texto.includes('como vai')) {
      return 'Estou funcionando perfeitamente! E com você, tudo certo?';
    }
    if (texto.includes('hora') || texto.includes('horas')) {
      return `Agora são exatamente ${pegarHora()}.`;
    }
    if (texto.includes('data') || texto.includes('dia')) {
      const hoje = new Date().toLocaleDateString('pt-BR');
      return `Hoje é dia ${hoje}.`;
    }
    if (texto.includes('nome')) {
      return 'Eu sou o seu Assistente Virtual feito em JavaScript!';
    }
    if (texto.includes('piada')) {
      return 'Por que o programador foi ao médico? Porque estava com um vírus e precisava de um byte!';
    }
    if (texto.includes('ajuda') || texto.includes('comandos')) {
      return 'Você pode me perguntar as <b>horas</b>, a <b>data</b>, pedir uma <b>piada</b> ou conversar normalmente comigo!';
    }
    if (texto.includes('obrigado') || texto.includes('valeu')) {
      return 'Por nada! Sempre que precisar, é só chamar.';
    }
   

    // Respostas aleatórias caso ele não reconheça uma palavra-chave
    const respostasPadrao = [
      'Interessante isso que você disse! Me conte mais.',
      'Entendi! Como posso te ajudar com isso?',
      'Legal! Se quiser testar meus comandos, digite "ajuda".',
      'Estou acompanhando! Pode continuar.'
    ];
    const sorteio = Math.floor(Math.random() * respostasPadrao.length);
    return respostasPadrao[sorteio];
  }

  // Quando você envia uma mensagem
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const textoDigitado = campoTexto.value.trim();
    if (textoDigitado === '') return;

    // 1. Mostra a SUA mensagem na hora
    adicionarMensagem(textoDigitado, 'user');
    campoTexto.value = '';

    // 2. Simula o robô pensando e digitando
    statusBot.textContent = 'Digitando...';

    setTimeout(() => {
      const resposta = gerarRespostaDoRobo(textoDigitado);
      adicionarMensagem(resposta, 'bot');
      statusBot.textContent = 'Online agora';
    }, 900); // Responde após 0.9 segundos
  });

  // Botão de mudar tema (Claro / Escuro)
  btnTema.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

  // Botão de limpar a tela
  btnLimpar.addEventListener('click', () => {
    listaMensagens.innerHTML = '';
    adicionarMensagem('Conversa limpa! Pode mandar uma nova mensagem.', 'bot');
  });

  // Mensagem inicial de boas-vindas do robô
  adicionarMensagem('Bem-vindo! Sou sua assistente de atendimento. Digite sua dúvida abaixo o que deseja', 'bot');
});
