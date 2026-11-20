// ==========================================================
// PARTE 1: ELECTRON + CONEXÃO COM O MYSQL
// ==========================================================
if (typeof window === 'undefined') {
  const { app, BrowserWindow } = require('electron');
  const path = require('node:path');
  const mysql = require('mysql2');

  const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', // <-- COLOQUE AQUI A SENHA DO SEU MYSQL WORKBENCH
    database: 'meu_banco'
  });

  db.connect((err) => {
    if (err) {
      console.error('Erro ao conectar no MySQL:', err.message);
      return;
    }
    console.log('Conectado ao MySQL com sucesso!');
  });

  function criarJanela() {
    const janela = new BrowserWindow({
      width: 410,
      height: 760,
      resizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true
      }
    });
    janela.loadFile(path.join(__dirname, 'index.html'));
  }

  app.whenReady().then(() => {
    criarJanela();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) criarJanela();
    });
  });

  app.on('window-all-closed', () => {
    if (db && db.state !== 'disconnected') {
      db.end();
    }
    if (process.platform !== 'darwin') app.quit();
  });
}
// ==========================================================
// PARTE 2: INÍCIO DA INTERFACE E LOGIN
// ==========================================================
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const CRIADORA_OFICIAL = {
      nome: 'duda',
      email: 'duda.criadora@fanficchat.com',
      numero: '(85) 99876-5432',
      senha: 'duda2004'
    };

    const telaLogin = document.getElementById('tela-login');
    const formLogin = document.getElementById('form-login');
    const erroLogin = document.getElementById('erro-login');
    const btnEsqueci = document.getElementById('btn-esqueci-senha');
    const boxRecuperar = document.getElementById('box-recuperar');
    const appZap = document.getElementById('app-zap');

    let contasSalvas = JSON.parse(localStorage.getItem('fanfic_contas')) || [];
    let codigoRecuperacaoAtual = '';
    let emailRecuperando = '';
    let usuarioAtual = { nome: '', email: '', numero: '', isCriadoraApp: false };

    if (!contasSalvas.find(c => c.email === CRIADORA_OFICIAL.email)) {
      contasSalvas.push({ ...CRIADORA_OFICIAL });
      localStorage.setItem('fanfic_contas', JSON.stringify(contasSalvas));
    }

    function limparNumero(num) {
      return num.replace(/\D/g, '');
    }

    function mostrarNotificacaoCelular(titulo, texto) {
      const notif = document.getElementById('notificacao-celular');
      document.getElementById('notif-tipo').textContent = titulo;
      document.getElementById('notif-texto').textContent = texto;
      notif.classList.remove('escondido');
      setTimeout(() => notif.classList.add('escondido'), 8000);
    }

    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const nomeDigitado = document.getElementById('login-nome').value.trim();
      const emailDigitado = document.getElementById('login-email').value.trim().toLowerCase();
      const numeroDigitado = document.getElementById('login-numero').value.trim();
      const senhaDigitada = document.getElementById('login-senha').value;

      erroLogin.classList.add('escondido');
      btnEsqueci.classList.add('escondido');

      let contaExistente = contasSalvas.find(c => c.email === emailDigitado);

      if (contaExistente) {
        if (contaExistente.senha !== senhaDigitada) {
          erroLogin.textContent = '❌ Senha incorreta para este e-mail!';
          erroLogin.classList.remove('escondido');
          btnEsqueci.classList.remove('escondido');
          emailRecuperando = emailDigitado;
          return;
        }
        contaExistente.nome = nomeDigitado;
        contaExistente.numero = numeroDigitado;
        localStorage.setItem('fanfic_contas', JSON.stringify(contasSalvas));
      } else {
        contaExistente = {
          nome: nomeDigitado,
          email: emailDigitado,
          numero: numeroDigitado,
          senha: senhaDigitada
        };
        contasSalvas.push(contaExistente);
        localStorage.setItem('fanfic_contas', JSON.stringify(contasSalvas));
      }

      const isDuda = (
        nomeDigitado.toLowerCase().includes('duda') &&
        emailDigitado === CRIADORA_OFICIAL.email.toLowerCase() &&
        limparNumero(numeroDigitado) === limparNumero(CRIADORA_OFICIAL.numero)
      );

      usuarioAtual = { ...contaExistente, isCriadoraApp: isDuda };

      document.getElementById('perfil-nome').textContent = usuarioAtual.nome;
      document.getElementById('perfil-badge').textContent = isDuda ? '👑 Criadora do App' : '✍️ Autor(a) & Leitor(a)';

      telaLogin.classList.add('escondido');
      appZap.classList.remove('escondido');
      renderizarContatos(personagens);
    });

    btnEsqueci.addEventListener('click', () => {
      const conta = contasSalvas.find(c => c.email === emailRecuperando);
      if (!conta) return;
      codigoRecuperacaoAtual = Math.floor(1000 + Math.random() * 9000).toString();
      boxRecuperar.classList.remove('escondido');
      mostrarNotificacaoCelular(
        '📩 E-mail e 📱 SMS Recebidos',
        `Enviado para ${conta.email} e SMS ${conta.numero}: Seu código é ${codigoRecuperacaoAtual}`
      );
    });

    document.getElementById('btn-salvar-nova-senha').addEventListener('click', () => {
      const cod = document.getElementById('input-codigo-rec').value.trim();
      const novaSenha = document.getElementById('input-nova-senha').value;

      if (cod !== codigoRecuperacaoAtual || !novaSenha) {
        alert('Código inválido ou nova senha vazia!');
        return;
      }

      const conta = contasSalvas.find(c => c.email === emailRecuperando);
      if (conta) {
        conta.senha = novaSenha;
        localStorage.setItem('fanfic_contas', JSON.stringify(contasSalvas));
        alert('Senha alterada com sucesso! Entre com a nova senha.');
        boxRecuperar.classList.add('escondido');
        erroLogin.classList.add('escondido');
        btnEsqueci.classList.add('escondido');
      }
    });
    // ==========================================================
    // PARTE 3: DADOS DAS HISTÓRIAS E MANIPULAÇÃO DE FOTOS
    // ==========================================================
    const telaContatos = document.getElementById('tela-contatos');
    const telaChat = document.getElementById('tela-chat');
    const modalCriar = document.getElementById('modal-criar');
    const avatarUsuarioEl = document.getElementById('avatar-usuario');
    const inputFotoUsuario = document.getElementById('input-foto-usuario');
    const chatAvatarEl = document.getElementById('chat-avatar');
    const inputFotoPersonagem = document.getElementById('input-foto-personagem');
    const areaMensagens = document.getElementById('area-mensagens');
    const caixaEscolhas = document.getElementById('caixa-escolhas');
    const listaContatos = document.getElementById('lista-contatos');
    const chatNome = document.getElementById('chat-nome');
    const chatAutorTag = document.getElementById('chat-autor-tag');
    const listaMensagens = document.getElementById('lista-mensagens');
    const formMensagem = document.getElementById('form-mensagem');
    const inputMensagem = document.getElementById('input-mensagem');
    const btnAddCapitulo = document.getElementById('btn-add-capitulo');

    let personagemAtivo = null;

    const ideiasFanfic = [
      '🌧️ Presos na biblioteca da escola durante uma tempestade depois da aula.',
      '🎤 Um idol famoso manda mensagem por engano para o seu número privado.',
      '🧛‍♂️ Um vampiro frio que só baixa a guarda quando conversa com você de madrugada.',
      '⚔️ Seu rival de treino confessa que sempre lutou para proteger você.'
    ];

    const fanficsPadrao = [
      {
        id: 'gojo',
        nome: 'Satoru Gojo',
        categoria: 'Anime',
        criadorEmail: CRIADORA_OFICIAL.email,
        criadorNome: 'Duda (Criadora)',
        avatar: '😎',
        foto: '',
        etapa: 0,
        historico: [],
        capitulos: [
          {
            fala: 'Ei, {nome}! Fugi da reunião só para falar com você. Topa comer doces comigo hoje? 🍨',
            opcoes: ['Com certeza! Onde nos encontramos? ❤️', 'Você não devia estar trabalhando? 🙄']
          },
          {
            fala: 'Haha, por você eu largo qualquer missão, {nome}. Vou passar aí às 20h! ✨',
            opcoes: ['Vou estar te esperando! 💕', 'Não se atrase dessa vez! 😎']
          }
        ]
      }
    ];

    let personagens = JSON.parse(localStorage.getItem('fanfic_personagens')) || fanficsPadrao;

    function salvarDados() {
      try {
        localStorage.setItem('fanfic_personagens', JSON.stringify(personagens));
        return true;
      } catch (erro) {
        alert('Erro ao salvar: a imagem escolhida é muito pesada! Tente publicar sem foto ou com uma imagem menor.');
        return false;
      }
    }

    function podeEditarPersonagem(p) {
      if (!p) return false;
      return usuarioAtual.isCriadoraApp || p.criadorEmail === usuarioAtual.email;
    }

    function aplicarFotoPerfilEPapelDeParede(fotoBase64, emojiPadrao) {
      if (fotoBase64) {
        chatAvatarEl.innerHTML = `<img src="${fotoBase64}" alt="Perfil">`;
        areaMensagens.style.backgroundImage = `url('${fotoBase64}')`;
      } else {
        chatAvatarEl.textContent = emojiPadrao;
        areaMensagens.style.backgroundImage = 'none';
      }
    }

    function lerImagem(inputFile, callback) {
      const arq = inputFile.files;
      if (!arq) return;
function lerImagem(arquivo) {
  // Evita o erro caso nenhum arquivo tenha sido selecionado
  if (!arquivo) {
    return Promise.resolve(null); // ou execute a lógica padrão sem imagem
  }

  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = () => reject(leitor.error);
    leitor.readAsDataURL(arquivo);
  });
}

      const reader = new FileReader();
      reader.onload = (e) => callback(e.target.result);
      reader.readAsDataURL(arq);
    }

    avatarUsuarioEl.addEventListener('click', () => inputFotoUsuario.click());
    inputFotoUsuario.addEventListener('change', () => {
      lerImagem(inputFotoUsuario, (b64) => {
        avatarUsuarioEl.innerHTML = `<img src="${b64}">`;
      });
    });

    chatAvatarEl.addEventListener('click', () => {
      if (!podeEditarPersonagem(personagemAtivo)) {
        alert('Apenas quem criou este personagem ou a Duda (criadora do app) pode mudar a foto e o papel de parede!');
        return;
      }
      inputFotoPersonagem.click();
    });

    inputFotoPersonagem.addEventListener('change', () => {
      if (!personagemAtivo || !podeEditarPersonagem(personagemAtivo)) return;
      lerImagem(inputFotoPersonagem, (b64) => {
        const fotoAnterior = personagemAtivo.foto;
        personagemAtivo.foto = b64;
        if (salvarDados()) {
          aplicarFotoPerfilEPapelDeParede(b64, personagemAtivo.avatar);
          renderizarContatos(personagens);
        } else {
          personagemAtivo.foto = fotoAnterior;
        }
      });
    });
    // ==========================================================
    // PARTE 4: PUBLICAÇÃO DA HISTÓRIA E LISTA DE CONTATOS
    // ==========================================================
    document.getElementById('btn-gerar-ideia').addEventListener('click', () => {
      const dica = document.getElementById('texto-ideia');
      dica.textContent = ideiasFanfic[Math.floor(Math.random() * ideiasFanfic.length)];
      dica.classList.remove('escondido');
    });

    document.getElementById('btn-mais-capitulo').addEventListener('click', () => {
      const container = document.getElementById('container-capitulos');
      const num = container.children.length + 1;
      const div = document.createElement('div');
      div.className = 'bloco-capitulo';
      div.innerHTML = `
        <strong>Capítulo ${num}</strong>
        <input type="text" class="cap-fala" placeholder="Fala do personagem..." required>
        <input type="text" class="cap-op1" placeholder="Opção de escolha 1">
        <input type="text" class="cap-op2" placeholder="Opção de escolha 2">
      `;
      container.appendChild(div);
    });

    document.getElementById('btn-abrir-criar').addEventListener('click', () => modalCriar.classList.remove('escondido'));
    document.getElementById('btn-fechar-criar').addEventListener('click', () => modalCriar.classList.add('escondido'));

    // Função centralizada de publicação (funciona no submit e no clique direto)
    function publicarNovaHistoria(e) {
      if (e) e.preventDefault();

      const inputNome = document.getElementById('novo-nome');
      const inputCat = document.getElementById('novo-categoria');
      const nome = inputNome ? inputNome.value.trim() : '';
      const categoria = inputCat ? inputCat.value.trim() : 'Fanfic';

      if (!nome) {
        alert('Por favor, digite o nome do personagem antes de publicar!');
        return;
      }

      const blocos = document.querySelectorAll('.bloco-capitulo');
      const capitulos = [];

      blocos.forEach((b) => {
        const falaEl = b.querySelector('.cap-fala');
        const op1El = b.querySelector('.cap-op1');
        const op2El = b.querySelector('.cap-op2');

        const fala = falaEl ? falaEl.value.trim() : '';
        const op1 = op1El ? op1El.value.trim() : '';
        const op2 = op2El ? op2El.value.trim() : '';

        if (fala) {
          capitulos.push({
            fala,
            opcoes: [op1, op2].filter(x => x !== '')
          });
        }
      });

      if (capitulos.length === 0) {
        alert('Escreva pelo menos a primeira fala do personagem no Capítulo 1!');
        return;
      }

      const concluir = (fotoB64) => {
        const novaHistoria = {
          id: 'fic_' + Date.now(),
          nome,
          categoria: categoria || 'Geral',
          criadorEmail: usuarioAtual.email,
          criadorNome: usuarioAtual.nome || 'Autor(a)',
          avatar: '💘',
          foto: fotoB64 || '',
          etapa: 0,
          historico: [],
          capitulos
        };

        personagens.unshift(novaHistoria);

        if (salvarDados()) {
          // Garante que a lista de contatos apareça na tela com a nova história no topo
          telaChat.classList.add('escondido');
          telaContatos.classList.remove('escondido');
          renderizarContatos(personagens);
          
          const form = document.getElementById('form-criar-personagem');
          if (form) form.reset();
          modalCriar.classList.add('escondido');
          alert('História publicada com sucesso! Ela já está no topo dos seus contatos.');
        } else {
          personagens.shift();
        }
      };

      const inputFoto = document.getElementById('novo-foto');
      if (inputFoto && inputFoto.files && inputFoto.files) {
        lerImagem(inputFoto, concluir);
      } else {
        concluir('');
      }
    }

    const formCriar = document.getElementById('form-criar-personagem');
    if (formCriar) {
      formCriar.addEventListener('submit', publicarNovaHistoria);
      // Garante o clique mesmo se o botão dentro do form não tiver type="submit"
      const btnSubmit = formCriar.querySelector('button[type="submit"], #btn-publicar, .btn-publicar');
      if (btnSubmit) {
        btnSubmit.addEventListener('click', (e) => {
          if (btnSubmit.type !== 'submit') publicarNovaHistoria(e);
        });
      }
    }

    btnAddCapitulo.addEventListener('click', () => {
      if (!podeEditarPersonagem(personagemAtivo)) return;
      const novaFala = prompt('Escreva a próxima fala do personagem (use {nome} para citar o leitor):');
      if (!novaFala) return;
      const op1 = prompt('Opção de escolha 1 para o leitor (ou deixe vazio):') || '';
      const op2 = prompt('Opção de escolha 2 para o leitor (ou deixe vazio):') || '';

      personagemAtivo.capitulos.push({
        fala: novaFala,
        opcoes: [op1, op2].filter(x => x !== '')
      });
      salvarDados();
      alert('Novo capítulo adicionado!');
    });

    function renderizarContatos(lista) {
      listaContatos.innerHTML = '';
      lista.forEach((p) => {
        const av = p.foto ? `<img src="${p.foto}">` : p.avatar;
        const li = document.createElement('li');
        li.className = 'contato-item';
        li.innerHTML = `
          <div class="avatar-contato">${av}</div>
          <div class="contato-info">
            <div class="contato-topo"><strong>${p.nome}</strong><span class="tag-categoria">${p.categoria}</span></div>
            <p class="contato-previa">Por: ${p.criadorNome}</p>
          </div>
        `;
        li.addEventListener('click', () => abrirChat(p));
        listaContatos.appendChild(li);
      });
    }
    // ==========================================================
    // PARTE 5: CHAT INTERATIVO E FECHAMENTO DO ARQUIVO
    // ==========================================================
    function abrirChat(p) {
      personagemAtivo = p;
      chatNome.textContent = p.nome;
      const permissao = podeEditarPersonagem(p);
      chatAutorTag.textContent = permissao ? '✏️ Toque na foto p/ mudar perfil e fundo' : `Autor: ${p.criadorNome}`;
      chatAvatarEl.classList.toggle('clicavel', permissao);
      btnAddCapitulo.classList.toggle('escondido', !permissao);

      aplicarFotoPerfilEPapelDeParede(p.foto, p.avatar);

      telaContatos.classList.add('escondido');
      telaChat.classList.remove('escondido');
      renderizarMensagens();

      if (p.historico.length === 0) avancarHistoria();
    }

    function renderizarMensagens() {
      listaMensagens.innerHTML = '';
      personagemAtivo.historico.forEach((m) => {
        const li = document.createElement('li');
        li.classList.add('msg', m.autor);
        li.innerHTML = `<div>${m.texto}</div><span class="msg-hora">${m.hora}</span>`;
        listaMensagens.appendChild(li);
      });
      areaMensagens.scrollTop = areaMensagens.scrollHeight;
    }

    function avancarHistoria() {
      const p = personagemAtivo;
      const cap = p.capitulos[p.etapa];
      const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const textoFala = cap
        ? cap.fala.replace(/\{nome\}/gi, usuarioAtual.nome)
        : `Você chegou ao fim dos capítulos escritos até agora, ${usuarioAtual.nome}! Continue escrevendo livremente ou adicione capítulos no botão ➕📖 acima! ✨`;

      p.historico.push({ autor: 'bot', texto: textoFala, hora });
      caixaEscolhas.innerHTML = '';

      if (cap && cap.opcoes && cap.opcoes.length > 0) {
        caixaEscolhas.classList.remove('escondido');
        cap.opcoes.forEach((op) => {
          const btn = document.createElement('button');
          btn.className = 'btn-escolha';
          btn.textContent = op;
          btn.addEventListener('click', () => responderUsuario(op));
          caixaEscolhas.appendChild(btn);
        });
      } else {
        caixaEscolhas.classList.add('escondido');
      }

      if (p.etapa < p.capitulos.length) p.etapa++;
      salvarDados();
      renderizarMensagens();
    }

    function responderUsuario(texto) {
      const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      personagemAtivo.historico.push({ autor: 'user', texto, hora });
      caixaEscolhas.classList.add('escondido');
      salvarDados();
      renderizarMensagens();
      setTimeout(avancarHistoria, 700);
    }

    formMensagem.addEventListener('submit', (e) => {
      e.preventDefault();
      const txt = inputMensagem.value.trim();
      if (!txt || !personagemAtivo) return;
      inputMensagem.value = '';
      responderUsuario(txt);
    });

    document.getElementById('btn-voltar').addEventListener('click', () => {
      telaChat.classList.add('escondido');
      telaContatos.classList.remove('escondido');
      renderizarContatos(personagens);
    });

    document.getElementById('btn-reiniciar').addEventListener('click', () => {
      if (!personagemAtivo) return;
      personagemAtivo.historico = [];
      personagemAtivo.etapa = 0;
      salvarDados();
      renderizarMensagens();
      avancarHistoria();
    });

    document.getElementById('btn-tema').addEventListener('click', () => document.body.classList.toggle('dark'));

    document.getElementById('busca-contato').addEventListener('input', (e) => {
      const t = e.target.value.toLowerCase();
      renderizarContatos(personagens.filter(p => p.nome.toLowerCase().includes(t)));
    });
  });
}
