// ============================================================
// PORTFÓLIO PESSOAL - JavaScript Principal
// Autor: João Silva
// Descrição: Controla menu, validação, animações e efeitos
// ============================================================


// ============================================================
// 1. MENU HAMBURGUER (MOBILE)
// Abre e fecha o menu em telas pequenas
// ============================================================

const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

// Verifica se os elementos existem na página atual
if (menuToggle && navLinks) {

  menuToggle.addEventListener('click', function () {
    // Adiciona ou remove a classe 'aberto' no menu
    navLinks.classList.toggle('aberto');

    // Acessibilidade: informa o estado do menu para leitores de tela
    const estaAberto = navLinks.classList.contains('aberto');
    menuToggle.setAttribute('aria-expanded', estaAberto);
  });

  // Fecha o menu ao clicar em qualquer link
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('aberto');
      menuToggle.setAttribute('aria-expanded', false);
    });
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener('click', function (evento) {
    const clicouFora =
      !navLinks.contains(evento.target) &&
      !menuToggle.contains(evento.target);

    if (clicouFora) {
      navLinks.classList.remove('aberto');
      menuToggle.setAttribute('aria-expanded', false);
    }
  });
}


// ============================================================
// 2. BOTÃO VOLTAR AO TOPO
// Aparece após rolar 300px — clique sobe suavemente
// ============================================================

const btnTopo = document.getElementById('btnTopo');

if (btnTopo) {

  // Mostra ou esconde o botão conforme a rolagem
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      btnTopo.classList.add('visivel');
    } else {
      btnTopo.classList.remove('visivel');
    }
  });

  // Ao clicar, rola suavemente até o topo
  btnTopo.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


// ============================================================
// 3. ANIMAÇÃO DOS ELEMENTOS AO ROLAR (Scroll Reveal)
// Elementos aparecem com fade-in conforme entram na tela
// ============================================================

// Seleciona todos os elementos que devem ser animados
const elementosAnimados = document.querySelectorAll(
  '.card, .sobre-bloco, .contato-info, .formulario, .habilidade-item'
);

// Configura o Intersection Observer
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      // Quando o elemento entra na tela
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel-scroll');
        // Para de observar depois de animar (economiza performance)
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15 // Ativa quando 15% do elemento está visível
  }
);

// Aplica o observer em cada elemento
elementosAnimados.forEach(function (el) {
  el.classList.add('oculto-scroll'); // Começa invisível
  observer.observe(el);
});


// ============================================================
// 4. ANIMAÇÃO DAS BARRAS DE HABILIDADE
// As barras crescem quando a seção entra na tela
// ============================================================

const barras = document.querySelectorAll('.nivel');

if (barras.length > 0) {

  const observerBarras = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Pega a largura definida no CSS e anima
          const barra = entry.target;
          const larguraFinal = getComputedStyle(barra).width;

          barra.style.width = '0%';

          // Pequeno delay para a transição CSS funcionar
          setTimeout(function () {
            barra.style.width = larguraFinal;
          }, 100);

          observerBarras.unobserve(barra);
        }
      });
    },
    { threshold: 0.5 }
  );

  barras.forEach(function (barra) {
    observerBarras.observe(barra);
  });
}


// ============================================================
// 5. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
// Valida Nome, Email e Mensagem antes de enviar
// ============================================================

const formContato = document.getElementById('formContato');

if (formContato) {

  formContato.addEventListener('submit', function (evento) {
    // Impede o envio padrão do formulário
    evento.preventDefault();

    // Limpa erros anteriores
    limparErros();

    // Pega os valores dos campos
    const nome     = document.getElementById('nome');
    const email    = document.getElementById('email');
    const mensagem = document.getElementById('mensagem');

    // Flag de controle
    let formularioValido = true;

    // ---- Valida Nome ----
    if (nome.value.trim() === '') {
      mostrarErro(nome, 'erroNome', 'O nome é obrigatório.');
      formularioValido = false;
    } else if (nome.value.trim().length < 3) {
      mostrarErro(nome, 'erroNome', 'O nome deve ter pelo menos 3 caracteres.');
      formularioValido = false;
    }

    // ---- Valida Email ----
    if (email.value.trim() === '') {
      mostrarErro(email, 'erroEmail', 'O email é obrigatório.');
      formularioValido = false;
    } else if (!validarEmail(email.value.trim())) {
      mostrarErro(email, 'erroEmail', 'Informe um email válido. Ex: nome@email.com');
      formularioValido = false;
    }

    // ---- Valida Mensagem ----
    if (mensagem.value.trim() === '') {
      mostrarErro(mensagem, 'erroMensagem', 'A mensagem é obrigatória.');
      formularioValido = false;
    } else if (mensagem.value.trim().length < 10) {
      mostrarErro(mensagem, 'erroMensagem', 'A mensagem deve ter pelo menos 10 caracteres.');
      formularioValido = false;
    }

    // ---- Se tudo estiver correto ----
    if (formularioValido) {
      exibirSucesso();
    }
  });


  // ---- Validação em tempo real (ao sair do campo) ----
  document.getElementById('nome').addEventListener('blur', function () {
    limparErro(this, 'erroNome');
    if (this.value.trim().length > 0 && this.value.trim().length < 3) {
      mostrarErro(this, 'erroNome', 'O nome deve ter pelo menos 3 caracteres.');
    }
  });

  document.getElementById('email').addEventListener('blur', function () {
    limparErro(this, 'erroEmail');
    if (this.value.trim().length > 0 && !validarEmail(this.value.trim())) {
      mostrarErro(this, 'erroEmail', 'Informe um email válido.');
    }
  });
}


// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

/**
 * Exibe mensagem de erro em um campo
 * @param {HTMLElement} campo   - Input ou textarea
 * @param {string}      idErro  - ID do span de erro
 * @param {string}      msg     - Texto da mensagem
 */
function mostrarErro(campo, idErro, msg) {
  campo.classList.add('erro');
  const spanErro = document.getElementById(idErro);
  if (spanErro) spanErro.textContent = msg;
}

/**
 * Remove erro de um campo específico
 * @param {HTMLElement} campo
 * @param {string}      idErro
 */
function limparErro(campo, idErro) {
  campo.classList.remove('erro');
  const spanErro = document.getElementById(idErro);
  if (spanErro) spanErro.textContent = '';
}

/**
 * Remove todos os erros do formulário
 */
function limparErros() {
  document.querySelectorAll('.form-grupo input, .form-grupo textarea')
    .forEach(function (campo) {
      campo.classList.remove('erro');
    });
  document.querySelectorAll('.erro-msg')
    .forEach(function (span) {
      span.textContent = '';
    });
}

/**
 * Valida formato de email com Regex
 * @param {string} email
 * @returns {boolean}
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Exibe mensagem de sucesso e limpa o formulário
 */
function exibirSucesso() {
  const msgSucesso = document.getElementById('msgSucesso');
  const form       = document.getElementById('formContato');

  if (msgSucesso) {
    msgSucesso.style.display = 'block';

    // Esconde a mensagem após 4 segundos
    setTimeout(function () {
      msgSucesso.style.display = 'none';
    }, 4000);
  }

  // Limpa todos os campos
  if (form) form.reset();
}


// ============================================================
// 6. LINK ATIVO NO MENU (destaca a página atual)
// Marca automaticamente o link da página aberta
// ============================================================

(function marcarLinkAtivo() {
  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
  const links       = document.querySelectorAll('.nav-links a');

  links.forEach(function (link) {
    const hrefLink = link.getAttribute('href');

    // Remove classe active de todos
    link.classList.remove('active');

    // Adiciona na página atual
    if (hrefLink === paginaAtual) {
      link.classList.add('active');
    }
  });
})();


// ============================================================
// 7. EFEITO DE DIGITAÇÃO NO HERO (index.html)
// Digita o subtítulo letra por letra
// ============================================================

const elementoDigitacao = document.querySelector('.subtitulo');

if (elementoDigitacao) {
  const textoOriginal = elementoDigitacao.textContent;
  elementoDigitacao.textContent = '';

  let indice = 0;

  function digitar() {
    if (indice < textoOriginal.length) {
      elementoDigitacao.textContent += textoOriginal.charAt(indice);
      indice++;
      setTimeout(digitar, 60); // Velocidade: 60ms por letra
    }
  }

  // Inicia após 800ms (aguarda a página carregar)
  setTimeout(digitar, 800);
}