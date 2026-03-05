/* Core */
'use strict';

// Theme
const themeSwitch = document.getElementById('theme-switch');


let darkmode = localStorage.getItem('darkmode');

const enableDarkmode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
};

const disableDarkmode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
};

if (darkmode === 'active') {
    enableDarkmode();
} else if (darkmode === null || darkmode === 'null') {
    
}

themeSwitch.addEventListener('click', () => {
    darkmode = localStorage.getItem('darkmode');
    darkmode !== 'active' ? enableDarkmode() : disableDarkmode();
});


// Mobile menu
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    });
});


// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
        const destino = document.querySelector(enlace.getAttribute('href'));
        if (destino) {
            e.preventDefault();
            destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Scroll reveal
const scrollObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Retraso escalonado para cada tarjeta
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 100);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.scroll-reveal').forEach((el) => {
    scrollObserver.observe(el);
});


// Counters
let contadoresYaAnimados = false;
const seccionContadores  = document.getElementById('contadores');

const animarContadores = () => {
    document.querySelectorAll('.counter-val[data-target]').forEach((el) => {
        const objetivo   = parseInt(el.getAttribute('data-target'), 10);
        const duracion   = 2000; // ms
        const inicio     = performance.now();

        const tick = (ahora) => {
            const transcurrido = ahora - inicio;
            const progreso     = Math.min(transcurrido / duracion, 1);
            // Easing cúbico
            const suavizado    = 1 - Math.pow(1 - progreso, 3);
            const valorActual  = Math.round(suavizado * objetivo);

            // Formato legible
            if (objetivo >= 1_000_000) {
                el.textContent = (valorActual / 1_000_000).toFixed(1) + 'M';
            } else if (objetivo >= 1_000) {
                el.textContent = (valorActual / 1_000).toFixed(0) + 'k';
            } else {
                el.textContent = valorActual;
            }

            if (progreso < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    });
};

const contadorObserver = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting && !contadoresYaAnimados) {
            contadoresYaAnimados = true;
            animarContadores();
        }
    },
    { threshold: 0.4 }
);

if (seccionContadores) {
    contadorObserver.observe(seccionContadores);
}

// Feature tabs
document.querySelectorAll('.feature-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
        // Quita .active de todos
        document.querySelectorAll('.feature-tab').forEach((t) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
    });
});

// Contact form
const contactForm = document.getElementById('contact-form');

const validarCampo = (idCampo, idError, condicionError) => {
    const campo = document.getElementById(idCampo);
    const error = document.getElementById(idError);

    if (condicionError) {
        campo.classList.add('error');
        error.classList.add('show');
        return false;
    } else {
        campo.classList.remove('error');
        error.classList.remove('show');
        return true;
    }
};

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const v1 = validarCampo('nombre',  'err-nombre',  nombre.length < 2);
    const v2 = validarCampo('email',   'err-email',   !regexEmail.test(email));
    const v3 = validarCampo('mensaje', 'err-mensaje', mensaje.length < 10);

    if (v1 && v2 && v3) {
        const exito = document.getElementById('form-success');
        exito.classList.add('show');
        contactForm.reset();

        setTimeout(() => exito.classList.remove('show'), 4000);
    }
});

// Modal
const modalOverlay = document.getElementById('modal-overlay');
const btnCerrar    = document.getElementById('modal-close');
const btnSubmit    = document.getElementById('modal-submit');

const abrirModal = () => {
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
        const inputModal = document.getElementById('modal-email');
        if (inputModal) inputModal.focus();
    }, 100);
};

const cerrarModal = () => {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
};

document.getElementById('cta-hero').addEventListener('click', abrirModal);

btnCerrar.addEventListener('click', cerrarModal);


modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) cerrarModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
});

btnSubmit.addEventListener('click', () => {
    const inputEmail  = document.getElementById('modal-email');
    const regexEmail  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regexEmail.test(inputEmail.value.trim())) {
        cerrarModal();
        alert('¡Genial! Revisa tu correo para acceder a Slake 🚀');
        inputEmail.value = '';
    } else {
        inputEmail.style.borderColor = '#f87171';
        inputEmail.focus();
    }
});

// Navbar shadow
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});
