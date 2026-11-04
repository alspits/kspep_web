const cards = [...document.querySelectorAll('.document-card')];
const filters = [...document.querySelectorAll('[data-filter]')];
const viewer = document.querySelector('.document-viewer');
const image = document.querySelector('#viewer-image');
const canvas = document.querySelector('.viewer-canvas');
const title = document.querySelector('#viewer-title');
const count = document.querySelector('#viewer-count');
const original = document.querySelector('#viewer-original');
const previous = document.querySelector('#viewer-prev');
const next = document.querySelector('#viewer-next');
const zoom = document.querySelector('#viewer-zoom');
let category = 'all';
let current = 0;
let openedBy;
const visibleCards = () => cards.filter((card) => !card.hidden);

function applyFilters() {
  cards.forEach((card) => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
  });
}
filters.forEach((button) => button.addEventListener('click', () => {
  category = button.dataset.filter;
  filters.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
  applyFilters();
}));

function resetZoom() {
  canvas.classList.remove('is-zoomed');
  zoom.setAttribute('aria-pressed', 'false');
  zoom.textContent = 'Увеличить';
  canvas.scrollTop = 0;
  canvas.scrollLeft = 0;
}
function showDocument(index) {
  const list = visibleCards();
  current = index;
  const card = list[index];
  const link = card.querySelector('.document-open');
  const label = card.querySelector('h3').textContent;
  resetZoom();
  document.querySelector('#viewer-error').hidden = true;
  image.hidden = false;
  image.alt = label;
  image.src = link.href;
  title.textContent = label;
  count.textContent = `Документ ${index + 1} из ${list.length} в выбранной подборке`;
  original.href = link.href;
  previous.disabled = index === 0;
  next.disabled = index === list.length - 1;
}
cards.forEach((card) => card.querySelector('.document-open').addEventListener('click', (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || !viewer.showModal) return;
  event.preventDefault();
  openedBy = event.currentTarget;
  showDocument(visibleCards().indexOf(card));
  viewer.showModal();
  document.body.classList.add('viewer-open');
  document.querySelector('.viewer-close').focus();
}));
image.addEventListener('error', () => {
  image.hidden = true;
  document.querySelector('#viewer-error').hidden = false;
});
previous.addEventListener('click', () => { if (current > 0) showDocument(current - 1); });
next.addEventListener('click', () => { if (current < visibleCards().length - 1) showDocument(current + 1); });
zoom.addEventListener('click', () => {
  const enlarged = canvas.classList.toggle('is-zoomed');
  zoom.setAttribute('aria-pressed', String(enlarged));
  zoom.textContent = enlarged ? 'Вписать в окно' : 'Увеличить';
});
document.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', (event) => {
  const bounds = viewer.getBoundingClientRect();
  if (event.target === viewer && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) viewer.close();
});
viewer.addEventListener('keydown', (event) => {
  if (canvas.classList.contains('is-zoomed')) return;
  if (event.key === 'ArrowLeft' && current > 0) { event.preventDefault(); showDocument(current - 1); }
  if (event.key === 'ArrowRight' && current < visibleCards().length - 1) { event.preventDefault(); showDocument(current + 1); }
});
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  resetZoom();
  image.removeAttribute('src');
  openedBy?.focus();
});
