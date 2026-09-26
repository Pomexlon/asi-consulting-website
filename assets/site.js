
(() => {
  'use strict';
  const root = document.documentElement;
  const motionButtons = Array.from(document.querySelectorAll('[data-motion]'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused = false;
  const syncMotion = () => {
    const paused = reduced.matches || manuallyPaused;
    root.classList.toggle('motion-paused', paused);
    motionButtons.forEach(button => {
      button.textContent = reduced.matches ? 'Motion off · device preference' : paused ? 'Resume orb motion' : 'Pause orb motion';
      button.setAttribute('aria-pressed', String(paused));
      button.disabled = reduced.matches;
    });
  };
  motionButtons.forEach(button => button.addEventListener('click', () => { manuallyPaused = !manuallyPaused; syncMotion(); }));
  if (reduced.addEventListener) reduced.addEventListener('change', syncMotion);
  else if (reduced.addListener) reduced.addListener(syncMotion);
  syncMotion();
  document.addEventListener('visibilitychange', () => root.classList.toggle('tab-hidden', document.hidden));
  const dialog = document.querySelector('#hope-guide');
  let opener = null;
  if (dialog) {
    document.querySelectorAll('[data-open-guide]').forEach(button => button.addEventListener('click', () => {
      if (!dialog.showModal) { window.location.href = 'work-with-us.html'; return; }
      opener = button;
      dialog.showModal();
    }));
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const items = Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    dialog.querySelector('[data-close-guide]').addEventListener('click', () => dialog.close());
    dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      const text = dialog.querySelector('textarea');
      if (text) { text.value = ''; text.dispatchEvent(new Event('input')); }
      if (opener) opener.focus();
    });
  }
  document.querySelectorAll('[data-enquiry-form]').forEach(form => {
    const input = form.querySelector('textarea');
    const counter = form.querySelector('[data-count]');
    input.addEventListener('input', () => {
      if (counter) counter.textContent = `${input.value.length} / 1000 characters`;
      input.setCustomValidity('');
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) { input.setCustomValidity('Write a short question first.'); input.reportValidity(); return; }
      input.setCustomValidity('');
      if (!form.reportValidity()) return;
      const subject = encodeURIComponent('ASI enquiry');
      const body = encodeURIComponent(message);
      window.location.href = `mailto:asicai@protonmail.com?subject=${subject}&body=${body}`;
      const status = form.querySelector('[data-draft-status]');
      if (status) status.textContent = 'Email-draft request opened. Nothing has been sent by this website. Review and send in your email app.';
    });
    const draftButton = form.querySelector('[data-enquiry-submit]');
    if (draftButton) draftButton.disabled = false;
  });
})();
