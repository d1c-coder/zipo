const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const scrollLine = $('.scroll-line');
const glow = $('.cursor-glow');
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  scrollLine.style.width = `${Math.max(0, Math.min(100, scrollY / h * 100))}%`;
}, {passive:true});

window.addEventListener('pointermove', e => {
  if (glow) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.12});
$$('.reveal').forEach(el => observer.observe(el));

$$('.tilt').forEach(card => {
  card.addEventListener('pointermove', e => {
    if (innerWidth < 760) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    card.style.setProperty('--ry', `${x*4}deg`);
    card.style.setProperty('--rx', `${-y*4}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--ry','0deg');
    card.style.setProperty('--rx','0deg');
  });
});

const menuBtn = $('.menu-btn');
const mobileMenu = $('.mobile-menu');
menuBtn?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
$$('.mobile-menu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

$$('.flow-step').forEach((step, i) => {
  step.addEventListener('mouseenter', () => {
    $$('.flow-step').forEach(s => s.classList.remove('active'));
    step.classList.add('active');
  });
});

const timestamp = $('#timestamp');
function updateTime(){
  const d = new Date();
  const pad = n => String(n).padStart(2,'0');
  timestamp.textContent = `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} · ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}
updateTime();
setInterval(updateTime, 1000);

const toast = $('#toast');
$('#caButton')?.addEventListener('click', () => {
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
});
$('#toastClose')?.addEventListener('click', () => toast.classList.remove('show'));

$$('.faq-list details').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) {
      $$('.faq-list details').forEach(other => {
        if (other !== d) other.removeAttribute('open');
      });
    }
  });
});

// Subtle parallax for the hero artwork.
const heroArt = $('.hero-art');
window.addEventListener('scroll', () => {
  if (!heroArt || innerWidth < 760) return;
  heroArt.style.transform = `scale(1.05) translateY(${Math.min(scrollY * .08, 45)}px)`;
}, {passive:true});
