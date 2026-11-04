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
const pagesFor = (card) => card.dataset.pages
  ? JSON.parse(card.dataset.pages)
  : [{ src: card.querySelector('.document-open').getAttribute('href'), label: '' }];
const visiblePages = () => visibleCards().flatMap((card) => pagesFor(card).map((page, pageIndex) => ({ ...page, card, pageIndex })));

function selectCardPage(card, pageIndex) {
  const page = pagesFor(card)[pageIndex];
  const heading = card.querySelector('h3').textContent;
  const link = card.querySelector('.document-open');
  const preview = card.querySelector('.document-preview img');
  card.dataset.activePage = String(pageIndex);
  link.href = page.src;
  link.setAttribute('aria-label', `Открыть: ${heading} · ${page.label}`);
  preview.src = page.src;
  preview.alt = `${heading} · ${page.label}`;
  card.querySelectorAll('.degree-page').forEach((button) => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.page) === pageIndex));
  });
}
cards.filter((card) => card.dataset.pages).forEach((card) => {
  card.querySelectorAll('.degree-page').forEach((button) => button.addEventListener('click', () => {
    selectCardPage(card, Number(button.dataset.page));
  }));
});

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
  const list = visiblePages();
  current = index;
  const page = list[index];
  const card = page.card;
  if (card.dataset.pages) selectCardPage(card, page.pageIndex);
  const label = card.querySelector('h3').textContent + (page.label ? ` · ${page.label}` : '');
  resetZoom();
  document.querySelector('#viewer-error').hidden = true;
  image.hidden = false;
  image.alt = label;
  image.src = page.src;
  title.textContent = label;
  count.textContent = `Лист ${index + 1} из ${list.length} в выбранной подборке`;
  original.href = page.src;
  previous.disabled = index === 0;
  next.disabled = index === list.length - 1;
}
cards.forEach((card) => card.querySelector('.document-open').addEventListener('click', (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || !viewer.showModal) return;
  event.preventDefault();
  openedBy = event.currentTarget;
  showDocument(visiblePages().findIndex((page) => page.card === card && page.pageIndex === Number(card.dataset.activePage || 0)));
  viewer.showModal();
  document.body.classList.add('viewer-open');
  document.querySelector('.viewer-close').focus();
}));
image.addEventListener('error', () => {
  image.hidden = true;
  document.querySelector('#viewer-error').hidden = false;
});
previous.addEventListener('click', () => { if (current > 0) showDocument(current - 1); });
next.addEventListener('click', () => { if (current < visiblePages().length - 1) showDocument(current + 1); });
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
  if (event.key === 'ArrowRight' && current < visiblePages().length - 1) { event.preventDefault(); showDocument(current + 1); }
});
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  resetZoom();
  image.removeAttribute('src');
  openedBy?.focus();
});
