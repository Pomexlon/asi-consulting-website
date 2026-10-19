/* Three authored illustration states. No model calls, forms, storage or network requests. */
'use strict';
(() => {
 const flow = document.querySelector('[data-flow-state]');
 if (!flow) return;
 const states = {
  original: {
   delivery: ['Monday', 'Original information'],
   installation: ['Tuesday', 'Based on Monday delivery'],
   confirmation: ['Tuesday visit', 'Based on installation plan'],
   message: 'Original plan: installation follows the expected delivery. Select a view above to inspect the proposed difference.'
  },
  'date-only': {
   delivery: ['Thursday', 'Delivery fact updated'],
   installation: ['Tuesday', 'Stale: component arrives later'],
   confirmation: ['Tuesday visit', 'Stale: based on the old plan'],
   message: 'Date-only update: the new delivery date is recorded, but both Tuesday decisions still rely on the old information.'
  },
  review: {
   delivery: ['Thursday', 'Updated information'],
   installation: ['Needs review', 'Original supporting fact changed'],
   confirmation: ['Needs review', 'Depends on revised installation'],
   message: 'Dependency review: both affected decisions are flagged for reconsideration. No replacement date is assumed or approved. The address and specification remain unchanged.'
  }
 };
 const buttons = [...document.querySelectorAll('[data-view]')];
 buttons.forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.view;
  if (!Object.prototype.hasOwnProperty.call(states, key)) return;
  const state = states[key];
  flow.dataset.flowState = key;
  for (const name of ['delivery', 'installation', 'confirmation']) {
   document.querySelector(`[data-value="${name}"]`).textContent = state[name][0];
   document.querySelector(`[data-status="${name}"]`).textContent = state[name][1];
  }
  buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  document.querySelector('[data-illustration-status]').textContent = state.message;
 }));
})();
