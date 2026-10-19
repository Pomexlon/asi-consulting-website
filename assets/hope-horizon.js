/* Bounded local arithmetic and explicitly scripted evidence-route illustrations.
   No model, network, browser storage, upload, or telemetry connection. */
(function () {
  'use strict';
  const MAX_STEPS = 2000;
  const MAX_BITS = 4096;
  function parseStart(text) {
    if (typeof BigInt !== 'function') throw new Error('This browser does not support exact integer arithmetic for this explorer.');
    const cleaned = String(text).trim();
    if (!/^[0-9]{1,30}$/.test(cleaned)) throw new Error('Enter a positive whole number using up to 30 digits, without commas, signs or decimal points.');
    const n = BigInt(cleaned);
    if (n < BigInt(1)) throw new Error('Start at 1 or a larger positive whole number.');
    return n;
  }
  function traceCollatz(start, maxSteps = MAX_STEPS, maxBits = MAX_BITS) {
    if (typeof start !== 'bigint' || start < BigInt(1)) throw new Error('A positive exact integer is required.');
    if (!Number.isInteger(maxSteps) || maxSteps < 0 || maxSteps > MAX_STEPS) throw new Error('Invalid step limit.');
    if (!Number.isInteger(maxBits) || maxBits < 1 || maxBits > MAX_BITS) throw new Error('Invalid size limit.');
    if (start.toString(2).length > maxBits) throw new Error('Starting value is larger than the size limit.');
    const one = BigInt(1), two = BigInt(2), three = BigInt(3), zero = BigInt(0);
    const values = [start]; let n = start, peak = start, reason = 'step-limit';
    while (n !== one && values.length - 1 < maxSteps) {
      const next = n % two === zero ? n / two : three * n + one;
      if (next.toString(2).length > maxBits) { reason = 'value-limit'; break; }
      n = next; values.push(n); if (n > peak) peak = n;
    }
    if (n === one) reason = 'reached-one';
    return { start, values, peak, steps: values.length - 1, reason, maxSteps };
  }
  // Only the plotting coordinates are approximate. The trajectory remains exact.
  function log2Integer(n) {
    const bits = n.toString(2), taken = bits.slice(0, 52);
    return Math.log2(parseInt(taken, 2)) + bits.length - taken.length;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { parseStart, traceCollatz, log2Integer };
  if (typeof document === 'undefined') return;
  function init() {
    const byId = id => document.getElementById(id);
    const startInput = byId('collatz-start'), runButton = byId('collatz-run');
    const error = byId('collatz-error');
    function svgNode(tag, attributes, text) {
      const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.keys(attributes).forEach(k => node.setAttribute(k, String(attributes[k])));
      if (text !== undefined) node.textContent = text;
      return node;
    }
    function drawChart(result) {
      const svg = byId('collatz-chart'); svg.replaceChildren();
      const width = 960, height = 250, left = 50, right = 18, top = 22, bottom = 32;
      const maxY = Math.max(1, ...result.values.map(log2Integer));
      const x = i => left + (width - left - right) * (result.steps === 0 ? 0 : i / result.steps);
      const y = n => height - bottom - (height - top - bottom) * log2Integer(n) / maxY;
      svg.appendChild(svgNode('title', {}, 'Starting at ' + result.start + ': ' + result.steps + ' calculated steps. Highest value ' + result.peak + '.'));
      for (let i = 0; i <= 4; i++) {
        const yy = top + (height - top - bottom) * i / 4;
        svg.appendChild(svgNode('line', { x1: left, x2: width - right, y1: yy, y2: yy, class: 'hz-chart-grid' }));
        svg.appendChild(svgNode('text', { x: left - 9, y: yy + 4, 'text-anchor': 'end', class: 'hz-chart-label' }, (maxY * (1 - i / 4)).toFixed(1)));
      }
      const d = result.values.map((n, i) => (i === 0 ? 'M' : 'L') + x(i).toFixed(2) + ' ' + y(n).toFixed(2)).join(' ');
      svg.appendChild(svgNode('path', { d, class: 'hz-chart-line' }));
      svg.appendChild(svgNode('circle', { cx: x(result.steps), cy: y(result.values[result.steps]), r: 4, class: 'hz-chart-dot' }));
      svg.appendChild(svgNode('text', { x: left, y: height - 9, class: 'hz-chart-label' }, 'Step 0'));
      svg.appendChild(svgNode('text', { x: width - right, y: height - 9, 'text-anchor': 'end', class: 'hz-chart-label' }, 'Step ' + result.steps));
    }
    function showError(message) {
      error.textContent = message; error.hidden = false;
      startInput.setAttribute('aria-invalid', 'true');
      byId('collatz-result').hidden = true; byId('collatz-empty').hidden = false;
    }
    function run() {
      try {
        const start = parseStart(startInput.value), limit = Number(byId('collatz-limit').value);
        if (![10, 100, 2000].includes(limit)) throw new Error('Select one of the displayed step limits.');
        const result = traceCollatz(start, limit);
        error.hidden = true; error.textContent = ''; startInput.removeAttribute('aria-invalid');
        byId('collatz-empty').hidden = true; byId('collatz-result').hidden = false;
        byId('collatz-result-start').textContent = String(result.start);
        byId('collatz-steps').textContent = String(result.steps);
        byId('collatz-peak').textContent = String(result.peak);
        const status = byId('collatz-status');
        status.dataset.limited = result.reason === 'reached-one' ? 'false' : 'true';
        if (result.reason === 'reached-one') status.textContent = 'Reached 1 after ' + result.steps + ' steps. This checks this starting number only—not the conjecture.';
        else if (result.reason === 'step-limit') status.textContent = 'Stopped at the ' + result.maxSteps + '-step limit before reaching 1. This is an unfinished computation, not a counterexample.';
        else status.textContent = 'Stopped before a value exceeded the 4,096-bit size limit. This is an unfinished computation, not a counterexample.';
        byId('collatz-trace-caption').textContent = result.values.length + ' exact terms, including the starting number. Each arrow represents one standard Collatz step.';
        byId('collatz-trace').textContent = result.values.map(String).join(' → ');
        drawChart(result);
      } catch (e) { showError(e instanceof Error ? e.message : 'The calculation could not be completed.'); }
    }
    if (startInput && runButton) {
      if (typeof BigInt !== 'function') { runButton.disabled = true; showError('This browser does not support the exact integer arithmetic required here. The written explanation is still available.'); }
      else {
        runButton.addEventListener('click', run);
        startInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); run(); } });
        document.querySelectorAll('[data-collatz-preset]').forEach(b => b.addEventListener('click', () => { startInput.value = b.dataset.collatzPreset; startInput.focus(); }));
      }
    }
    const routes = {
      self: {
        proposal: 'AI-generated claim', 'proposal-note': 'A result and its supporting story.',
        check: 'AI-generated checker', 'check-note': 'The same proposer supplies the test and assessor.',
        outcome: '“It passed.”', 'outcome-note': 'A self-report, not an independent ground for acceptance.',
        gain: 'A proposed check. A claim that it passed is still something to verify.',
        assumption: 'The claim, test, implementation and reported result all depend on the proposer.'
      },
      certificate: {
        proposal: 'Formal claim + certificate', 'proposal-note': 'The proposer supplies an explicit, checkable witness.',
        check: 'Separately audited checker', 'check-note': 'The evaluator controls a small checker and the agreed specification.',
        outcome: 'A scoped verification result', 'outcome-note': 'Evidence about this formal claim under the chosen rules.',
        gain: 'Verification can be separated from the difficult search that found the answer.',
        assumption: 'The axioms, specification, checker implementation and execution must be trusted or checked. A formal certificate does not automatically establish a claim about the physical world.'
      },
      measurement: {
        proposal: 'Claim + committed predictions', 'proposal-note': 'Predictions and failure criteria are fixed before held-out testing.',
        check: 'Independent measurements', 'check-note': 'The evaluator controls the apparatus, trials, data and analysis.',
        outcome: 'Evidence that could disagree', 'outcome-note': 'Measured results can support, constrain or contradict the prediction.',
        gain: 'The evidence need not be whatever the proposer says happened.',
        assumption: 'Measurement validity, test selection, leakage controls and statistical assumptions still matter. Passing finite tests supports only the tested scope; it is not a universal proof.'
      }
    };
    document.querySelectorAll('[data-evidence-route]').forEach(button => {
      button.addEventListener('click', () => {
        const key = button.dataset.evidenceRoute, data = routes[key]; if (!data) return;
        document.querySelectorAll('[data-evidence-route]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        byId('evidence-chain').dataset.route = key;
        Object.keys(data).forEach(field => { byId('route-' + field).textContent = data[field]; });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
