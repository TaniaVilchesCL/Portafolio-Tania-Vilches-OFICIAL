// ===================== MODO CLARO / OSCURO =====================
const modoBtn = document.getElementById("modo-btn");

modoBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  modoBtn.textContent = document.body.classList.contains("light-mode") ? "🌙" : "🌞";
});

// ===================== TRADUCCIÓN =====================
const idiomaBtn = document.getElementById('idioma-btn');
let idiomaActual = 'es';

idiomaBtn.addEventListener('click', () => {
  idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
  idiomaBtn.innerText = idiomaActual === 'es' ? 'EN' : 'ES';
  traducir(idiomaActual);
});

function traducir(lang) {
  // Traducir todos los elementos con data-es / data-en
  const elementos = document.querySelectorAll('[data-es]');
  elementos.forEach(el => {
    const texto = el.getAttribute(`data-${lang}`);
    if (!texto) return;

    // Si el texto contiene HTML (como <span>), usar innerHTML
    if (texto.includes('<')) {
      el.innerHTML = texto;
    } else {
      el.innerText = texto;
    }
  });

  // Placeholders del formulario
  const placeholders = {
    es: {
      nombre: 'Tu nombre',
      email: 'tucorreo@email.com',
      mensaje: 'Escribe tu mensaje aquí...'
    },
    en: {
      nombre: 'Your name',
      email: 'yourmail@email.com',
      mensaje: 'Write your message here...'
    }
  };

  const p = placeholders[lang];
  const inputNombre = document.getElementById('nombre');
  const inputEmail = document.getElementById('email');
  const inputMensaje = document.getElementById('mensaje');
  if (inputNombre) inputNombre.placeholder = p.nombre;
  if (inputEmail) inputEmail.placeholder = p.email;
  if (inputMensaje) inputMensaje.placeholder = p.mensaje;
}

// ===================== MENÚ HAMBURGUESA =====================
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// ===================== ACTIVE LINK EN SCROLL =====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Header background al hacer scroll
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
    header.style.backdropFilter = 'blur(10px)';
  } else {
    header.style.backgroundColor = 'transparent';
    header.style.backdropFilter = 'none';
  }
});
