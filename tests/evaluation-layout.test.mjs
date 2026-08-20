import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('expanded evaluation uses the full panel without nested scrolling', () => {
  assert.match(html, /\.analysis-details \.full-evaluation\s*\{[^}]*width:\s*100%/s);
  assert.match(html, /\.analysis-details \.full-evaluation\s*\{[^}]*max-height:\s*none/s);
  assert.match(html, /\.analysis-details \.full-evaluation\s*\{[^}]*overflow:\s*visible/s);
});

test('evaluation content has responsive evidence and coaching groups', () => {
  assert.match(html, /class="evaluation-grid"/);
  assert.match(html, /class="evaluation-callout"/);
  assert.match(html, /class="evaluation-actions"/);
  assert.match(html, /\.evaluation-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s);
  assert.match(html, /@media \(max-width: 900px\)[\s\S]*\.evaluation-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
