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

test('landing narrative keeps the demo second and includes the requested sales story', () => {
  assert.match(html, /An AI agent that calls your sales representatives/);
  assert.match(html, /Request a Sample Report/);
  assert.match(html, /id="how-it-works"/);
  assert.ok(html.indexOf('id="how-it-works"') < html.indexOf('id="sales-video"'));
  assert.match(html, /You can&#39;t be on every call\.|You can't be on every call\./);
  assert.match(html, /Multiple layers of analysis, in sync/);
});

test('supporting sections use compact tags, use-case cards, and final CTAs', () => {
  assert.match(html, /class="feature-tags"/);
  assert.match(html, /Spec-level accuracy checks/);
  assert.match(html, /id="use-cases"/);
  assert.match(html, /Retail &amp; Consumer Electronics/);
  assert.match(html, /Stop guessing how your team sounds on a real call/);
  assert.ok((html.match(/Request a Sample Report/g) || []).length >= 2);
});

test('video control settles its label after synchronized media events', () => {
  assert.match(html, /setTimeout\(\(\) => \{ heroToggle\.textContent = salesVideo\.paused \? 'Play' : 'Pause'/);
});

test('brand lockup is visible and hero uses the available horizontal canvas', () => {
  assert.match(html, /<img class="brand-logo" src="AILabsLogo\.webp" alt="AI Labs">/);
  assert.match(html, /\.hero h1\s*\{[^}]*max-width:\s*none/s);
  assert.match(html, /\.brand-logo\s*\{[^}]*width:/s);
  assert.match(html, /\.brand\s*\{[^}]*background:\s*#151a25/s);
});

test('supporting sections have distinct visual bands', () => {
  assert.match(html, /class="section-block problem-section"/);
  assert.match(html, /class="section-block highlights-section"/);
  assert.match(html, /class="section-block use-cases-section"/);
  assert.match(html, /\.problem-section\s*\{[^}]*background:/s);
  assert.match(html, /\.use-cases-section\s*\{[^}]*background:/s);
});

test('major narrative bands have labeled divider rules', () => {
  assert.match(html, /class="section-divider"[^>]*>\s*<span>Live evaluation<\/span>/);
  assert.match(html, /class="section-divider"[^>]*>\s*<span>Evidence<\/span>/);
  assert.match(html, /\.section-divider::before, \.section-divider::after\s*\{[^}]*border-top:/s);
});

test('hero does not duplicate the scorecard proof block', () => {
  assert.doesNotMatch(html, /class="hero-aside"/);
});

test('analysis and supporting bands keep deliberate vertical spacing', () => {
  assert.match(html, /#analysis\s*\{[^}]*margin-bottom:\s*44px/s);
});
