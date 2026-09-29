# English to Gen Alpha Translator

Static page, no build step. Open `index.html` in a browser.

- `translator.js` – the engine (`GenAlpha.translate(text, intensity 1-3)`). Add slang by editing the `RULES` table.
- `test.js` – run with `node test.js`.

It is a dictionary of phrase/word swaps, not a language model: it can't handle context
(e.g. "good" is always "fire" at intensity 2+), and slang goes out of date quickly.
