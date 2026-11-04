document.documentElement.classList.add('js-ready');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

window.matchMedia('(min-width: 700px)').addEventListener('change', closeMenu);

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionTargets = new Map();
const activeAnimations = new Map();
const revealedTargets = new WeakSet();
let revealObserver;
let anchorScrollActive = false;
let anchorScrollTimer;
const motionEase = 'cubic-bezier(.25,.46,.45,.94)';

function registerMotion(selector, kind, stagger = 0) {
  document.querySelectorAll(selector).forEach((element, index) => {
    motionTargets.set(element, { kind, delay: (index % 3) * stagger });
  });
}

registerMotion('.section-heading, .faq-layout > div:first-child, .about-grid > div:first-of-type, .contact-grid > div:first-child', 'text');
registerMotion('.request-grid .card', 'card', 100);
registerMotion('.steps > li', 'card', 120);
registerMotion('.about-portrait', 'portrait');
registerMotion('.credentials, .conditions, .contact-alternative', 'text');
registerMotion('.price-card', 'card');
registerMotion('.faq-list > details', 'text', 70);
registerMotion('.section-note', 'text');

function playReveal(element, delay) {
  if (revealedTargets.has(element)) return;
  revealedTargets.add(element);
  const options = motionTargets.get(element) || { kind: 'text', delay: 0 };
  const frames = options.kind === 'portrait'
    ? [{ opacity: 0, transform: 'translateY(20px) scale(.98)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }]
    : options.kind === 'card'
      ? [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'translateY(0)' }]
      : [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }];
  const animation = element.animate(frames, {
    duration: options.kind === 'portrait' ? 1800 : options.kind === 'card' ? 1400 : 1200,
    delay: delay ?? options.delay,
    easing: motionEase,
    fill: 'both',
  });
  activeAnimations.set(element, animation);
  element.classList.remove('motion-pending');
  animation.onfinish = () => {
    animation.cancel();
    activeAnimations.delete(element);
  };
  revealObserver?.unobserve(element);
}

function configureMotion() {
  revealObserver?.disconnect();
  activeAnimations.forEach((animation) => animation.cancel());
  activeAnimations.clear();
  motionTargets.forEach((_, element) => element.classList.remove('motion-pending'));
  if (motionPreference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !anchorScrollActive) playReveal(entry.target);
    });
  }, { rootMargin: `0px 0px -${Math.round(innerHeight * .2)}px 0px`, threshold: 0 });

  motionTargets.forEach((_, element) => {
    if (revealedTargets.has(element)) return;
    const bounds = element.getBoundingClientRect();
    if (bounds.top < innerHeight * .8) {
      revealedTargets.add(element);
      return;
    }
    element.classList.add('motion-pending');
    revealObserver.observe(element);
  });
}

function resumeSectionReveals() {
  anchorScrollActive = false;
  document.querySelectorAll('.motion-pending').forEach((element) => {
    revealObserver?.unobserve(element);
    revealObserver?.observe(element);
  });
}

function revealAnchorDestination() {
  const section = document.getElementById(location.hash.slice(1))?.closest('.section');
  section?.querySelectorAll('.motion-pending').forEach((element) => playReveal(element, 0));
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('a[href^="#"]')) return;
  anchorScrollActive = true;
  clearTimeout(anchorScrollTimer);
  anchorScrollTimer = setTimeout(resumeSectionReveals, 1200);
});
window.addEventListener('scroll', () => {
  if (!anchorScrollActive) return;
  clearTimeout(anchorScrollTimer);
  anchorScrollTimer = setTimeout(resumeSectionReveals, 200);
}, { passive: true });
motionPreference.addEventListener('change', configureMotion);
window.addEventListener('hashchange', revealAnchorDestination);
configureMotion();

// Keep first-screen information available while its headline and portrait settle in.
if (!motionPreference.matches && Element.prototype.animate) {
  document.querySelectorAll('.hero-intro, #hero-title, .hero .lead').forEach((element, index) => {
    const animation = element.animate([
      { opacity: 0, transform: 'translateY(16px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 1500, delay: index * 140, easing: motionEase, fill: 'both' });
    activeAnimations.set(element, animation);
    animation.onfinish = () => { animation.cancel(); activeAnimations.delete(element); };
  });
  const portrait = document.querySelector('.hero-portrait');
  const animation = portrait?.animate([
    { opacity: .4, transform: 'scale(1.045)' },
    { opacity: 1, transform: 'scale(1)' },
  ], { duration: 2000, easing: motionEase });
  if (animation) {
    activeAnimations.set(portrait, animation);
    animation.onfinish = () => activeAnimations.delete(portrait);
  }
}

// Animate both opening and closing, including the answer's actual height.
document.querySelectorAll('.faq-list details').forEach((details) => {
  const summary = details.querySelector('summary');
  let expansion;
  let intendedOpen = details.open;
  summary.addEventListener('click', (event) => {
    if (motionPreference.matches || !Element.prototype.animate) return;
    event.preventDefault();
    const fromHeight = details.getBoundingClientRect().height;
    expansion?.cancel();
    intendedOpen = !intendedOpen;
    details.open = true;
    const toHeight = intendedOpen ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 1;
    details.style.overflow = 'hidden';
    expansion = details.animate([
      { height: `${fromHeight}px` }, { height: `${toHeight}px` },
    ], { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' });
    expansion.onfinish = () => {
      details.open = intendedOpen;
      details.style.overflow = '';
      expansion = null;
    };
  });
  motionPreference.addEventListener('change', () => {
    expansion?.cancel();
    expansion = null;
    details.open = intendedOpen;
    details.style.overflow = '';
  });
});
