const contents = document.querySelector('.contract-toc');
const desktopContents = window.matchMedia('(min-width: 1000px)');
function updateContents() { contents.open = desktopContents.matches; }
updateContents();
desktopContents.addEventListener('change', updateContents);
const contentsLinks = [...document.querySelectorAll('.contract-toc a')];
contentsLinks.forEach((link) => link.addEventListener('click', () => {
  contentsLinks.forEach((item) => item.removeAttribute('aria-current'));
  link.setAttribute('aria-current', 'true');
}));
if ('IntersectionObserver' in window) {
  const readingObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (!visible.length) return;
    const id = visible[0].target.id;
    contentsLinks.forEach((link) => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-5% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('.contract-part').forEach((section) => readingObserver.observe(section));
}
