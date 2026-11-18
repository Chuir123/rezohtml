import { prayers, mysteries, verses } from './prayers.js';

const $ = (selector) => document.querySelector(selector);
const icons = {
  cross: '<path d="M12 3v18M6 9h12"/>',
  home: '<path d="m3 10 9-7 9 7v10H3zM9 20v-6h6v6"/>',
  book: '<path d="M12 6C9 4 6 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1zm0 0v14"/>',
  rosary: '<ellipse cx="12" cy="8" rx="6" ry="5" stroke-dasharray=".5 2.65" stroke-width="2.6"/><path d="M12 14v8m-3-4h6"/>',
  heart: '<path d="M20.8 5.8a5 5 0 0 0-7.1 0L12 7.5l-1.7-1.7a5 5 0 0 0-7.1 7.1l1.7 1.7L12 21l7.1-6.4 1.7-1.7a5 5 0 0 0 0-7.1Z"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  spark: '<path d="M12 2c0 6-4 10-10 10 6 0 10 4 10 10 0-6 4-10 10-10-6 0-10-4-10-10Z"/>',
  timer: '<circle cx="12" cy="14" r="7"/><path d="M12 10v4l2 1M9 3h6m-3 0v4"/>',
  reset: '<path d="M3 11a9 9 0 1 1 2 7m-2-2v-5h5"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  play: '<path d="m8 5 12 7-12 7z" fill="currentColor"/>',
  pause: '<path d="M9 5v14m6-14v14" stroke-width="3"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'
};
function icon(name) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[name] + '</svg>';
}
document.querySelectorAll('[data-icon]').forEach((element) => element.innerHTML = icon(element.dataset.icon));

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem('ora.' + key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem('ora.' + key, JSON.stringify(value));
    return true;
  } catch {
    toast('El navegador no permite guardar los cambios en este dispositivo.');
    return false;
  }
}
let toastTimeout;
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => $('#toast').hidden = true, 9000);
}

function navigate() {
  const pages = [...document.querySelectorAll('[data-page]')];
  const active = pages.find((page) => '#' + page.id === location.hash) ?? pages[0];
  for (const page of pages) page.hidden = page !== active;
  for (const link of document.querySelectorAll('[data-nav]')) {
    if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', navigate);
navigate();

const dateFormat = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' });
function localDate(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}
function renderDay(now) {
  const day = localDate(now);
  if ($('#today').dateTime === day) return;
  $('#today').dateTime = day;
  $('#today').textContent = dateFormat.format(now);
  const [verse, reference] = verses[now.getDay()];
  $('#verse').textContent = '«' + verse + '»';
  $('#verse-ref').textContent = reference;
}

const clock = $('#clock');
const toggle = $('#toggle-timer');
let duration = 300;
let elapsed = 0;
let startedAt = null;
let completed = false;
const durationButtons = [...document.querySelectorAll('[data-duration]')];

function renderTimer() {
  let seconds = elapsed + (startedAt === null ? 0 : (Date.now() - startedAt) / 1000);
  if (duration && seconds >= duration && !completed) {
    elapsed = seconds = duration;
    startedAt = null;
    completed = true;
    toast('Ha terminado tu tiempo de oración.');
  }
  const shown = duration ? Math.ceil(Math.max(0, duration - seconds)) : Math.floor(seconds);
  clock.value = [Math.floor(shown / 60), shown % 60].map((part) => String(part).padStart(2, '0')).join(':');
  $('#timer-face').style.setProperty('--progress', (duration ? Math.min(1, seconds / duration) * 360 : 0) + 'deg');
  const running = startedAt !== null;
  const status = running ? 'EN ORACIÓN' : completed ? 'TIEMPO COMPLETADO' : elapsed ? 'EN PAUSA' : 'LISTO PARA EMPEZAR';
  if ($('#timer-status').textContent !== status) $('#timer-status').textContent = status;
  const label = running ? 'Pausar' : completed ? 'Volver a empezar' : elapsed ? 'Continuar' : 'Comenzar oración';
  if (toggle.textContent !== label) toggle.innerHTML = icon(running ? 'pause' : 'play') + label;
}
function resetTimer() {
  elapsed = 0;
  startedAt = null;
  completed = false;
  for (const button of durationButtons) button.setAttribute('aria-pressed', Number(button.dataset.duration) === duration);
  renderTimer();
}
for (const button of durationButtons) {
  button.addEventListener('click', () => {
    duration = Number(button.dataset.duration);
    resetTimer();
  });
}
toggle.addEventListener('click', () => {
  renderTimer();
  if (startedAt !== null) {
    elapsed += (Date.now() - startedAt) / 1000;
    startedAt = null;
  } else {
    if (completed) resetTimer();
    startedAt = Date.now();
  }
  renderTimer();
});
$('#reset-timer').addEventListener('click', resetTimer);
resetTimer();
setInterval(renderTimer, 250);

function prayerText(key) {
  return prayers[key][2].replaceAll('{ave}', prayers.ave[2]);
}
function prayerButton(key) {
  const [title, detail] = prayers[key];
  const button = document.createElement('button');
  button.className = 'prayer-row';
  const marian = ['ave', 'salve', 'angelus', 'regina'].includes(key);
  button.innerHTML = '<span class="row-icon ' + (marian ? 'blue' : 'gold') + '">' + icon(marian ? 'spark' : 'cross') + '</span><span><strong></strong><small></small></span><i>' + icon('chevron') + '</i>';
  button.querySelector('i').style.width = '17px';
  button.querySelector('strong').textContent = title;
  button.querySelector('small').textContent = detail;
  button.addEventListener('click', () => {
    $('#prayer-title').textContent = title;
    $('#prayer-text').textContent = prayerText(key);
    $('#prayer-dialog').showModal();
  });
  return button;
}
$('#quick-prayers').append(...['padre', 'ave', 'gloria', 'credo'].map(prayerButton));
const normalize = (text) => text.toLocaleLowerCase('es').normalize('NFD').replace(/\p{Diacritic}/gu, '');
function renderLibrary() {
  const query = normalize($('#search').value.trim());
  const results = Object.keys(prayers).filter((key) => normalize(prayers[key].slice(0, 2).join(' ')).includes(query));
  $('#library').replaceChildren(...results.map(prayerButton));
  if (!results.length) $('#library').textContent = 'No se encontraron oraciones.';
}
$('#search').addEventListener('input', renderLibrary);
renderLibrary();

const days = [3, 0, 2, 3, 1, 2, 0];
const mysterySelect = $('#mysteries');
const opening = [
  ['senal', 'Inicio'], ['credo', 'Inicio'], ['padre', 'Inicio'],
  ['ave', 'Por la fe'], ['ave', 'Por la esperanza'], ['ave', 'Por la caridad'], ['gloria', 'Inicio']
];
let rosary = read('rosary', { set: days[new Date().getDay()], step: 0, day: '' });
if (rosary.day !== localDate(new Date()) && rosary.step === 0) rosary.set = days[new Date().getDay()];
mysterySelect.value = rosary.set;
function renderRosary() {
  const group = mysteries[rosary.set];
  $('#mystery-list').replaceChildren(...group.map((name) => {
    const item = document.createElement('li');
    item.textContent = name;
    return item;
  }));
  const decades = group.flatMap((name, index) => {
    const position = (index + 1) + '.º misterio · ' + name;
    return [['padre', position], ...Array.from({ length: 10 }, (_, count) => ['ave', position + ' · ' + (count + 1) + '/10']), ['gloria', position]];
  });
  const steps = [...opening, ...decades, ['salve', 'Para terminar'], ['senal', 'Para terminar']];
  const step = steps[rosary.step];
  $('#bead-position').textContent = step ? step[1] : 'Rosario completado';
  $('#bead-title').textContent = step ? prayers[step[0]][0] : 'Amén';
  $('#bead-prayer').textContent = step ? prayerText(step[0]) : '';
  $('#bead-prev').disabled = rosary.step === 0;
  $('#bead-next').disabled = !step;
  $('#bead-next').textContent = rosary.step === steps.length - 1 ? 'Terminar Rosario' : 'Siguiente cuenta';
}
function updateRosary(step) {
  rosary = { set: Number(mysterySelect.value), step, day: localDate(new Date()) };
  save('rosary', rosary);
  renderRosary();
}
mysterySelect.addEventListener('change', () => updateRosary(0));
$('#bead-prev').addEventListener('click', () => updateRosary(rosary.step - 1));
$('#bead-next').addEventListener('click', () => updateRosary(rosary.step + 1));
$('#bead-reset').addEventListener('click', () => updateRosary(0));
renderRosary();

let intentions = read('intentions', []);
function renderIntentions() {
  const list = $('#intentions');
  list.replaceChildren();
  intentions.forEach((intention, index) => {
    const item = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = intention;
    const remove = document.createElement('button');
    remove.className = 'secondary';
    remove.textContent = 'Eliminar';
    remove.addEventListener('click', () => {
      const updated = intentions.filter((_, current) => current !== index);
      if (save('intentions', updated)) {
        intentions = updated;
        renderIntentions();
        $('#intention').focus();
      }
    });
    item.append(text, remove);
    list.append(item);
  });
}
$('#intention-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('#intention');
  const value = input.value.trim();
  if (value && save('intentions', [...intentions, value])) {
    intentions.push(value);
    renderIntentions();
    input.value = '';
    input.focus();
  }
});
renderIntentions();

let reminder = read('reminder', '');
const reminderInput = $('#reminder-time');
function renderReminder() {
  $('#reminder-status').textContent = reminder ? 'Recordatorio activo a las ' + reminder + '.' : 'Recordatorio desactivado.';
  $('#disable-reminder').disabled = !reminder;
}
document.querySelector('[data-open-reminders]').addEventListener('click', () => {
  reminderInput.value = reminder || '20:00';
  renderReminder();
  $('#reminder-dialog').showModal();
});
$('#reminder-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!save('reminder', reminderInput.value)) return;
  reminder = reminderInput.value;
  renderReminder();
  if ('Notification' in window && Notification.permission === 'default') {
    try {
      await Notification.requestPermission();
    } catch {
      // The in-app reminder works without system notification permissions.
    }
  }
});
$('#disable-reminder').addEventListener('click', () => {
  if (save('reminder', '')) {
    reminder = '';
    renderReminder();
  }
});
let lastReminder = read('lastReminder', '');
async function checkDay() {
  const now = new Date();
  renderDay(now);
  const time = [now.getHours(), now.getMinutes()].map((part) => String(part).padStart(2, '0')).join(':');
  const key = localDate(now) + 'T' + time;
  if (reminder !== time || lastReminder === key || read('lastReminder', '') === key) return;
  lastReminder = key;
  save('lastReminder', key);
  toast('Es la hora de tu oración.');
  if ('Notification' in window && Notification.permission === 'granted' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.active) await registration.showNotification('Hora de rezar', { body: 'Haz un espacio para Dios en tu día.', tag: 'ora-diaria', icon: './assets/icon-192.png' });
    } catch {
      // The toast already displays the reminder.
    }
  }
}
$('#export-reminder').addEventListener('click', () => {
  if (!reminderInput.reportValidity()) return;
  const [hour, minute] = reminderInput.value.split(':').map(Number);
  const now = new Date();
  const start = new Date(now);
  start.setHours(hour, minute, 0, 0);
  if (start <= now) start.setDate(start.getDate() + 1);
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const localStart = localDate(start).replaceAll('-', '') + 'T' + reminderInput.value.replace(':', '') + '00';
  const calendar = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ora//Recordatorio diario//ES','BEGIN:VEVENT',
    'UID:' + crypto.randomUUID() + '@ora','DTSTAMP:' + stamp,'DTSTART:' + localStart,
    'DURATION:PT5M','RRULE:FREQ=DAILY','SUMMARY:Tiempo de oración','BEGIN:VALARM',
    'ACTION:DISPLAY','TRIGGER:PT0M','DESCRIPTION:Es la hora de tu oración.',
    'END:VALARM','END:VEVENT','END:VCALENDAR',''
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'oracion-diaria.ics';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
});
checkDay();
setInterval(checkDay, 10000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    renderTimer();
    checkDay();
  }
});

let installPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
});
$('#install').addEventListener('click', async () => {
  if (!installPrompt) {
    $('#install-dialog').showModal();
    return;
  }
  await installPrompt.prompt();
  installPrompt = undefined;
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch((error) => console.warn('Ora sin conexión:', error));
}
