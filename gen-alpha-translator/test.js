const assert = require('assert');
const { translate } = require('./translator');
const t = (s, l) => translate(s, l);

assert.strictEqual(t('That is cool.', 1), "That's +1000 aura.");
assert.strictEqual(t('No joke, this pizza is delicious.', 1), 'No cap, this pizza is bussin.');
assert.strictEqual(t('Hello my friend', 1), 'Yo my bestie');
assert.strictEqual(t("I don't know", 1), "I don't know");   // level 1 leaves it
assert.strictEqual(t("I don’t know", 2).split(',')[0], 'idk'); // curly apostrophe works
assert.strictEqual(t('GOOD JOB', 1), 'YOU ATE');              // all-caps preserved
assert.strictEqual(t('Good luck!', 2), 'Good luck!');         // "good" not mangled
assert.strictEqual(t('Good morning', 2), 'gm');
assert.strictEqual(t('the carpet', 2), 'the carpet');         // word boundaries
assert.strictEqual(t('We won', 1), 'We took a W');            // no chained rewrites
assert.strictEqual(t('', 2), '');
assert.strictEqual(t('Line one.\n\nLine two.', 1), 'Line one.\n\nLine two.');
assert.strictEqual(t('This is boring', 3), t('This is boring', 3)); // deterministic
console.log('all tests passed');
