
const modoBtn = document.getElementById("modo-btn");
modoBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  modoBtn.textContent = document.body.classList.contains("light-mode") ? "🌞" : "🌙";
});



const idiomaBtn = document.getElementById('idioma-btn');

idiomaBtn.addEventListener('click', () => {
  const es = idiomaBtn.innerText === 'EN';
  idiomaBtn.innerText = es ? 'ES' : 'EN';

  document.querySelector('.logo').innerText = 'Tania Vilches'; 
  document.querySelector('nav a[href="#home"]').innerText = es ? 'Inicio' : 'Home';
  document.querySelector('nav a[href="#servicios"]').innerText = es ? 'Servicios' : 'Services';
  document.querySelector('nav a[href="#experiencia"]').innerText = es ? 'Experiencia' : 'Experience';
  document.querySelector('nav a[href="#habilidades"]').innerText = es ? 'Habilidades' : 'Skills';
  document.querySelector('nav a[href="#contacto"]').innerText = es ? 'Contacto' : 'Contact';

  // Home
  document.querySelector('#home h1').innerHTML = es ? 'Hola, soy <span>Tania Vilches</span>' : 'Hi, I\'m <span>Tania Vilches</span>';
  document.querySelector('#home h3').innerText = es ? 'Analista Programadora' : 'Software Developer';
  document.querySelector('#home .boton').innerText = es ? 'Contratar' : 'Hire me';

  document.querySelector('#servicios h2').innerText = es ? 'Servicios' : 'Services';
  const servicios = document.querySelectorAll('#servicios .servicio');
  if (servicios.length >= 4) {
    servicios[0].querySelector('h3').innerText = es ? 'Desarrollo Web' : 'Web Development';
    servicios[0].querySelector('p').innerText = es ? 'Creación de sitios web responsivos con HTML, CSS y JavaScript, optimizados para todos los dispositivos.' : 'Creation of responsive websites with HTML, CSS and JavaScript, optimized for all devices.';

    servicios[1].querySelector('h3').innerText = es ? 'Base de Datos' : 'Databases';
    servicios[1].querySelector('p').innerText = es ? 'Diseño y gestión de bases de datos eficientes en MongoDB y MySQL para sistemas modernos.' : 'Design and management of efficient databases in MongoDB and MySQL for modern systems.';

    servicios[2].querySelector('h3').innerText = es ? 'Seguridad Informática' : 'Information Security';
    servicios[2].querySelector('p').innerText = es ? 'Análisis de vulnerabilidades y propuestas de mitigación para proyectos web pequeños o medianos.' : 'Vulnerability analysis and mitigation proposals for small or medium web projects.';

    servicios[3].querySelector('h3').innerText = es ? 'Diseño Creativo' : 'Creative Design';
    servicios[3].querySelector('p').innerText = es ? 'Ilustraciones digitales y material visual personalizado para proyectos, portafolios o redes.' : 'Digital illustrations and personalized visual material for projects, portfolios or networks.';
  }

  // Experiencia
  document.querySelector('#experiencia h2').innerText = es ? 'Experiencia' : 'Experience';
  document.querySelector('#experiencia p').innerText = es ? 'Habla de tus proyectos, prácticas, trabajos o freelance.' : 'Talk about your projects, internships, freelance or work experience.';

  // Habilidades
  document.querySelector('#habilidades h2').innerText = es ? 'Mis Habilidades' : 'My Skills';

  document.querySelector('#contacto h2').innerText = es ? 'Contáctame' : 'Contact me';

  document.querySelector('label[for="nombre"]').innerText = es ? 'Nombre' : 'Name';
  document.getElementById('nombre').placeholder = es ? 'Tu nombre' : 'Your name';

  document.querySelector('label[for="email"]').innerText = es ? 'Correo electrónico' : 'Email';
  document.getElementById('email').placeholder = es ? 'tucorreo@email.com' : 'yourmail@email.com';

  document.querySelector('label[for="mensaje"]').innerText = es ? 'Mensaje' : 'Message';
  document.getElementById('mensaje').placeholder = es ? 'Escribe tu mensaje aquí...' : 'Write your message here...';

  document.querySelector('#contacto form button[type="submit"]').innerText = es ? 'Enviar mensaje' : 'Send message';
});


const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});
