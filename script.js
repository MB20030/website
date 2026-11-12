// Progressive enhancement: every entry and link works without JavaScript.
const root = document.documentElement;
const sidebar = document.getElementById('sidebar');
const shell = document.querySelector('.site-shell');
const mobileMenu = document.querySelector('.mobile-menu');
const backdrop = document.querySelector('.sidebar-backdrop');
const collapseButton = document.querySelector('.sidebar-toggle');
const themeButton = document.querySelector('.theme-toggle');
const mobileQuery = matchMedia('(max-width: 900px)');
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
let menuOpen = false;
let chosenTheme;

try { chosenTheme = localStorage.getItem('mb-theme'); } catch (_) {}

function setTheme(dark) {
  root.dataset.theme = dark ? 'dark' : 'light';
  const next = dark ? 'light' : 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${next} theme`);
  themeButton.querySelector('.theme-label').textContent = dark ? 'Dark theme' : 'Light theme';
  themeButton.querySelector('use').setAttribute('href', `assets/icons.svg#${dark ? 'moon' : 'sun'}`);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#101721' : '#f8fafc');
}
setTheme(chosenTheme === 'dark' || (chosenTheme !== 'light' && darkQuery.matches));
themeButton.addEventListener('click', () => {
  chosenTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(chosenTheme === 'dark');
  try { localStorage.setItem('mb-theme', chosenTheme); } catch (_) {}
});
darkQuery.addEventListener('change', event => {
  if (chosenTheme !== 'light' && chosenTheme !== 'dark') setTheme(event.matches);
});
themeButton.hidden = false;

document.getElementById('year').textContent = new Date().getFullYear();

collapseButton.addEventListener('click', () => {
  const collapsed = document.body.classList.toggle('sidebar-collapsed');
  collapseButton.setAttribute('aria-expanded', String(!collapsed));
  collapseButton.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
});
collapseButton.hidden = false;

function setMenu(open, restoreFocus = true) {
  menuOpen = open && mobileQuery.matches;
  document.body.classList.toggle('sidebar-open', menuOpen);
  backdrop.hidden = !menuOpen;
  shell.inert = menuOpen;
  mobileMenu.setAttribute('aria-expanded', String(menuOpen));
  mobileMenu.setAttribute('aria-label', menuOpen ? 'Close navigation' : 'Open navigation');
  mobileMenu.querySelector('use').setAttribute('href', `assets/icons.svg#${menuOpen ? 'close' : 'panel'}`);
  sidebar.inert = mobileQuery.matches && !menuOpen;
  if (menuOpen) {
    sidebar.setAttribute('role', 'dialog');
    sidebar.setAttribute('aria-modal', 'true');
  } else {
    sidebar.removeAttribute('role');
    sidebar.removeAttribute('aria-modal');
    if (restoreFocus && mobileQuery.matches) mobileMenu.focus();
  }
}
function syncViewport() {
  mobileMenu.hidden = !mobileQuery.matches;
  setMenu(false, false);
}
mobileMenu.addEventListener('click', () => setMenu(!menuOpen));
backdrop.addEventListener('click', () => setMenu(false));
sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  if (menuOpen) setMenu(false, false);
}));
mobileQuery.addEventListener('change', syncViewport);
syncViewport();

document.addEventListener('keydown', event => {
  if (!menuOpen) return;
  if (event.key === 'Escape') {
    setMenu(false);
    return;
  }
  if (event.key !== 'Tab') return;
  const items = [mobileMenu, ...sidebar.querySelectorAll('a, button:not([hidden])')].filter(el => el.getClientRects().length);
  const current = items.indexOf(document.activeElement);
  if (event.shiftKey && current <= 0) {
    event.preventDefault();
    items[items.length - 1].focus();
  } else if (!event.shiftKey && (current === items.length - 1 || current < 0)) {
    event.preventDefault();
    items[0].focus();
  }
});

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.work-card')];
const resultsCount = document.querySelector('.results-count');
filterButtons.forEach(button => {
  const count = cards.filter(card => button.dataset.filter === 'all' || card.dataset.kind === button.dataset.filter).length;
  button.querySelector('span').textContent = count;
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    cards.forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.kind !== button.dataset.filter;
      if (!card.hidden) visible++;
    });
    resultsCount.textContent = `${visible} ${visible === 1 ? 'entry' : 'entries'}`;
  });
});
resultsCount.textContent = `${cards.length} entries`;
document.querySelector('.collection-toolbar').hidden = false;

const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')];
const pageLabel = document.getElementById('page-label');
const backgroundIds = new Set(['education', 'experience', 'engagement', 'skills']);
let scrollQueued = false;
function updateNavigation() {
  const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 16;
  let active = 'about';
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 150) active = section.id;
  }
  if (nearBottom) active = 'contact';
  for (const link of navLinks) {
    const matches = link.hash === `#${active}` || (link.hash === '#about' && backgroundIds.has(active));
    if (matches) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  pageLabel.textContent = active === 'projects' ? 'Projects & Media' : active === 'contact' ? 'Contact' : 'About me';
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
window.addEventListener('load', updateNavigation, { once: true });
updateNavigation();
