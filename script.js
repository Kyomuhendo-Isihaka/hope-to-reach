'use strict';
const config = window.SITE_CONFIG;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const safeUrl = value => { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; } };
const menu = $('.menu-toggle');
const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); $('#navigation').classList.remove('open'); };
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); $('#navigation').classList.toggle('open', open); });
$$('#navigation a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
window.addEventListener('resize', () => { if (innerWidth > 800) closeMenu(); });
const info = $('#info-dialog');
function showInfo(title, message) {
  const content = $('#dialog-content'); content.replaceChildren();
  const heading = document.createElement('h2'); heading.id = 'dialog-title'; heading.textContent = title;
  const p = document.createElement('p'); p.textContent = message;
  content.append(heading, p); info.showModal(); return content;
}
$$('dialog').forEach(dialog => { $('.dialog-close', dialog).addEventListener('click', () => dialog.close()); dialog.addEventListener('click', e => { if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close(); } }); });
function actionButton(label, callback) { const b = document.createElement('button'); b.type = 'button'; b.className = 'button'; b.textContent = label; b.addEventListener('click', callback); return b; }
config.events.forEach(event => {
  const button = document.createElement('button'); button.className = 'event-card';
  const date = document.createElement('span'); date.className = 'event-date'; const day = document.createElement('b'); day.textContent = event.day; date.append(day, event.month);
  const body = document.createElement('span'); body.className = 'event-content'; const h = document.createElement('h3'); h.textContent = event.title; const p = document.createElement('p'); p.textContent = '⌖ ' + event.location; const small = document.createElement('small'); small.textContent = 'Sample event'; body.append(h, p, small);
  const arrow = document.createElement('span'); arrow.className = 'event-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); button.append(date, body, arrow);
  button.addEventListener('click', () => { const content = showInfo(event.title, `${event.day} ${event.month} · ${event.location} — illustrative event only. This is not a confirmed engagement and no tickets are on sale. Invite Hope to Reach to a similar gathering using the booking form.`); content.append(actionButton('Enquire about a similar event ↗', () => { info.close(); $('#event-type').value = event.type; location.hash = 'booking'; $('#event-type').focus({ preventScroll: true }); })); });
  $('#event-list').append(button);
});
$$('[data-event]').forEach(a => a.addEventListener('click', () => { $('#event-type').value = a.dataset.event; }));
$$('[data-watch]').forEach(b => b.addEventListener('click', () => { const video = safeUrl(config.videoUrl); if (video) window.open(video, '_blank', 'noopener,noreferrer'); else { const c = showInfo('Experience the ministry', 'The official Hope to Reach ministry video will appear here once supplied. The images on this concept are illustrative, and no live performance footage is available yet.'); c.append(actionButton('Explore the gallery ↗', () => { info.close(); location.hash = 'gallery'; })); } }));
const cleanPhone = () => config.phone.replace(/[^0-9]/g, '');
$$('[data-contact]').forEach(b => b.addEventListener('click', () => { const kind = b.dataset.contact; let url = ''; if (kind === 'whatsapp' && cleanPhone().length >= 7) url = `https://wa.me/${cleanPhone()}?text=${encodeURIComponent('Hello Hope to Reach, I would like to enquire about an event booking.')}`; else if (kind === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) url = `mailto:${config.email}`; else url = safeUrl(config.socials[kind]); if (url) { if (kind === 'email') location.href = url; else window.open(url, '_blank', 'noopener,noreferrer'); } else showInfo('Contact details coming soon', `This is a sample website. The ministry’s ${kind === 'whatsapp' ? 'WhatsApp number' : kind === 'email' ? 'email address' : kind + ' link'} has not yet been provided. You can prepare a booking enquiry using the form; no message will be sent from this demo.`); }));
if (config.phone) $('[data-phone-display]').textContent = config.phone;
if (config.email) $('[data-email-display]').textContent = config.email;
$$('[data-filter]').forEach(button => button.addEventListener('click', () => { $$('[data-filter]').forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); }); $$('.gallery-item').forEach(item => { item.hidden = button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter; }); }));
$$('.gallery-item').forEach(button => button.addEventListener('click', () => { $('#lightbox-image').src = button.dataset.image; $('#lightbox-image').alt = button.dataset.caption; $('#lightbox-caption').textContent = button.dataset.caption; $('#lightbox').showModal(); }));
const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
$('#event-date').min = localDate();
$('#booking-form').addEventListener('submit', e => {
  e.preventDefault(); const form = e.currentTarget; $('#event-date').min = localDate(); if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  for (const key of ['name', 'phone', 'location']) { if (!data[key].trim()) { form.elements[key].setCustomValidity('Please enter your ' + (key === 'location' ? 'event location' : key) + '.'); form.elements[key].reportValidity(); return; } }
  const text = `HOPE TO REACH — BOOKING ENQUIRY\n\nName: ${data.name.trim()}\nPhone: ${data.phone.trim()}\nEvent: ${data.event}\nPreferred date: ${data.date}\nLocation: ${data.location.trim()}\n\nMessage:\n${data.message.trim() || 'No additional message.'}\n\nThis enquiry is not a confirmed booking.`;
  const content = showInfo('Your enquiry is ready.', 'Nothing has been sent. Review your details, then copy or download the enquiry to share when the ministry’s contact details are available.');
  const area = document.createElement('textarea'); area.readOnly = true; area.value = text; area.setAttribute('aria-label', 'Booking enquiry preview'); content.append(area);
  const actions = document.createElement('div'); actions.className = 'dialog-actions';
  const status = document.createElement('p'); status.setAttribute('role', 'status');
  actions.append(actionButton('Copy enquiry', async () => { try { await navigator.clipboard.writeText(text); status.textContent = 'Enquiry copied. Nothing has been sent.'; } catch { area.focus(); area.select(); status.textContent = 'Select and copy the enquiry above using your device’s copy command.'; } }));
  actions.append(actionButton('Download enquiry ↓', () => { const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'hope-to-reach-enquiry.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); status.textContent = 'Enquiry download prepared. Nothing has been sent.'; }));
  if (cleanPhone().length >= 7) actions.append(actionButton('Share on WhatsApp ↗', () => window.open(`https://wa.me/${cleanPhone()}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')));
  content.append(actions, status);
});
$$('#booking-form input').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
$('#year').textContent = new Date().getFullYear();
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  if (!reduced.matches) document.documentElement.classList.add('js-motion');
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }), { threshold: .08 });
  $$('.reveal').forEach(el => reveal.observe(el));
  const active = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) $$('#navigation a').forEach(a => { const selected = a.hash === '#' + entry.target.id; a.classList.toggle('active', selected); if (selected) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }), { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  $$('main section[id]').forEach(section => active.observe(section));
}
// Lightweight, pointer-reactive stage dust. Pauses offscreen and respects reduced motion.
const canvas = $('#stage-lights'), ctx = canvas.getContext('2d');
if (ctx) {
  let width = 0, height = 0, frame = 0, running = false, onscreen = true, previous = 0;
  const pointer = { x: -1000, y: -1000 };
  const dust = Array.from({ length: 30 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + .4, speed: Math.random() * .000035 + .000015, drift: Math.random() * Math.PI * 2 }));
  function resize() { width = canvas.clientWidth; height = canvas.clientHeight; const ratio = Math.min(devicePixelRatio || 1, 2); canvas.width = width * ratio; canvas.height = height * ratio; ctx.setTransform(ratio, 0, 0, ratio, 0, 0); }
  function draw(time) { if (!running) return; const delta = Math.min(time - previous || 16, 32); previous = time; ctx.clearRect(0, 0, width, height); dust.forEach(p => { p.y -= p.speed * delta; if (p.y < 0) p.y = 1; let x = p.x * width + Math.sin(time * .0003 + p.drift) * 12, y = p.y * height; const dx = x - pointer.x, dy = y - pointer.y, distance = Math.hypot(dx, dy); if (distance < 120 && distance > 0) { x += dx / distance * (120 - distance) * .2; y += dy / distance * (120 - distance) * .2; } ctx.beginPath(); ctx.fillStyle = 'rgba(255,194,100,.36)'; ctx.arc(x, y, p.r, 0, Math.PI * 2); ctx.fill(); }); frame = requestAnimationFrame(draw); }
  function update() { const shouldRun = !reduced.matches && !document.hidden && onscreen; if (shouldRun && !running) { running = true; previous = 0; frame = requestAnimationFrame(draw); } else if (!shouldRun) { running = false; cancelAnimationFrame(frame); ctx.clearRect(0, 0, width, height); } }
  $('#home').addEventListener('pointermove', e => { const rect = canvas.getBoundingClientRect(); pointer.x = e.clientX - rect.left; pointer.y = e.clientY - rect.top; }, { passive: true });
  $('#home').addEventListener('pointerleave', () => { pointer.x = pointer.y = -1000; });
  window.addEventListener('resize', resize, { passive: true }); document.addEventListener('visibilitychange', update); reduced.addEventListener('change', update);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { onscreen = entries[0].isIntersecting; update(); }).observe(canvas);
  resize(); update();
}
