// English -> Gen Alpha translator. Rule-based: phrase/word substitution plus
// optional sentence flavour at higher intensities. Works in browser and Node.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GenAlpha = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  // [English sources, Gen Alpha replacement, minimum intensity (1-3)]
  const RULES = [
    // Phrases (longest match wins, so these beat the single-word rules below)
    [["that's cool", 'that is cool'], "that's +1000 aura", 1],
    [["that's embarrassing", 'that is embarrassing'], "that's -1000 aura", 1],
    [["that's hilarious", 'that is hilarious'], "that's sending me", 1],
    [['no joke', "i'm not kidding", 'i am not kidding', 'i promise'], 'no cap', 1],
    [['for real', 'seriously'], 'deadass', 1],
    [["what's up", 'what is up', 'how are you', "how's it going"], 'wsg', 1],
    [['good job', 'well done', 'nice work', 'great job'], 'you ate', 1],
    [['the best', 'the greatest'], 'the GOAT', 1],
    [['very good', 'really good', 'so good'], 'bussin', 1],
    [['good at'], 'cracked at', 1],
    [['good morning'], 'gm', 2],
    [['good night'], 'gn', 2],
    [['good luck'], 'good luck', 1], // protects "good" from the single-word rule
    [['let me do my thing', 'leave me to it'], 'let me cook', 1],
    [["let's go", 'lets go'], "let's cook", 2],
    [["i'm tired", 'i am tired', "i'm exhausted", 'i am exhausted', "i'm done", 'i am done'], "I'm cooked", 1],
    [["you're wrong", 'you are wrong'], "you're cooked", 1],
    [["you're weird", 'you are weird'], "you're so Ohio", 1],
    [['i agree', 'i understand', 'sure thing'], 'say less', 1],
    [['i love'], "I'm obsessed with", 1],
    [['i like'], "I'm vibing with", 2],
    [['i think', 'in my opinion'], 'lowkey think', 1],
    [['i guess'], 'ig', 2],
    [["i don't know", 'i do not know'], 'idk', 2],
    [["i don't care", 'i do not care'], 'idc', 2],
    [['oh my god', 'oh my gosh'], 'omg bruh', 2],
    [['to be honest', 'honestly'], 'deadass', 1],
    [['right now'], 'rn', 2],
    [['by the way'], 'btw', 2],
    [['in real life'], 'irl', 2],
    [['what the heck', 'what the hell'], 'what the sigma', 2],
    [['of course', 'obviously'], 'obvi', 2],
    [['go away'], 'go touch grass', 2],
    [['thank you', 'thanks'], 'thx fr', 1],

    // Single words
    [['hello', 'hi', 'hey'], 'yo', 1],
    [['goodbye', 'bye'], 'peace', 1],
    [['yes', 'yeah', 'yep', 'sure', 'okay', 'ok'], 'bet', 1],
    [['no', 'nope'], 'nah', 1],
    [['very', 'extremely'], 'highkey', 1],
    [['really'], 'lowkey', 3],
    [['somewhat', 'kind of', 'sort of'], 'lowkey', 1],
    [['great', 'excellent', 'impressive', 'best'], 'goated', 1],
    [['awesome', 'amazing', 'fantastic'], 'fire', 1],
    [['good'], 'fire', 2],
    [['delicious', 'tasty'], 'bussin', 1],
    [['bad', 'boring', 'average', 'mediocre', 'ordinary', 'lame'], 'mid', 1],
    [['terrible', 'awful', 'horrible'], 'trash', 1],
    [['weird'], 'Ohio', 1],
    [['strange', 'suspicious', 'shady'], 'sus', 1],
    [['embarrassing', 'awkward', 'cheesy'], 'cringe', 1],
    [['charisma', 'charm', 'flirting'], 'rizz', 1],
    [['lie', 'lies', 'lying'], 'cap', 1],
    [['friend'], 'bestie', 1],
    [['friends'], 'besties', 1],
    [['boss', 'leader', 'confident'], 'sigma', 2],
    [['house', 'home'], 'the crib', 2],
    [['car'], 'whip', 2],
    [['tired', 'exhausted'], 'cooked', 1],
    [['crazy', 'insane', 'ridiculous', 'wild'], 'unhinged', 1],
    [['focus', 'focused', 'concentrate'], 'lock in', 1],
    [['delusional'], 'delulu', 1],
    [['dramatic'], 'extra', 1],
    [['excited'], 'hyped', 1],
    [['exciting'], 'hype', 1],
    [['relax', 'calm down'], 'chill', 1],
    [['hilarious'], 'sending me', 1],
    [['fail', 'failed'], 'took an L', 1],
    [['win', 'won'], 'took a W', 1],
    [['agreed', 'correct', 'true'], 'facts', 1],
    [['beautiful', 'gorgeous', 'stunning'], 'snatched', 2],
    [['because'], 'cuz', 2],
    [['please'], 'pls', 2],
    [['you'], 'u', 3],
    [['are'], 'r', 3],
    [['people', 'everyone'], 'the besties', 3],
  ];

  const TAILS_2 = ['no cap', 'fr'];
  const TAILS_3 = ['no cap', 'fr fr', 'on god', 'sheesh', 'skibidi', 'ong', 'bussin'];
  const OPENERS_3 = ['Bro,', 'Yo,', 'Ayo,', 'Bruh,'];

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const norm = (s) => s.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ');
  const toPattern = (s) => esc(s).replace(/'/g, "['’]").replace(/ /g, '\\s+');

  // Pre-compile one regex + lookup table per intensity level.
  const compiled = {};
  for (let level = 1; level <= 3; level++) {
    const table = new Map();
    for (const [sources, out, min] of RULES) {
      if (min > level) continue;
      for (const src of sources) table.set(norm(src), out);
    }
    const keys = [...table.keys()].sort((a, b) => b.length - a.length);
    compiled[level] = {
      table,
      re: new RegExp('\\b(?:' + keys.map(toPattern).join('|') + ')\\b', 'gi'),
    };
  }

  // Chat abbreviations stay lowercase even at the start of a sentence.
  const LOWER = new Set(['idk', 'idc', 'ig', 'rn', 'btw', 'irl', 'gm', 'gn', 'pls', 'u', 'r', 'cuz', 'wsg', 'ong']);

  function matchCase(orig, out) {
    if (LOWER.has(out)) return out;
    if (orig.length > 1 && orig === orig.toUpperCase() && /[A-Z]/.test(orig)) return out.toUpperCase();
    if (/^[A-Z]/.test(orig)) return out.charAt(0).toUpperCase() + out.slice(1);
    return out;
  }

  // Deterministic pick so the same input always gives the same output.
  function pick(list, seed) {
    return list[Math.abs(seed) % list.length];
  }
  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return h;
  }

  function translate(text, intensity) {
    const level = Math.min(3, Math.max(1, Math.round(intensity || 2)));
    const { table, re } = compiled[level];

    // Split into sentences, keeping the terminator, so flavour can be added per sentence.
    const parts = text.match(/[^.!?\n]+[.!?]*|\n+/g) || [];
    let sentenceNo = 0;
    return parts.map((part) => {
      if (/^\n+$/.test(part)) return part;
      let s = part.replace(re, (m) => matchCase(m, table.get(norm(m))));
      const seed = hash(part);
      const m = s.match(/^(\s*)([\s\S]*?)(\s*)([.!?]*)(\s*)$/);
      let [, lead, body, , end] = m;
      if (!body) return s;
      if (level === 3 && sentenceNo % 2 === 0 && !/^yo\b/i.test(body)) {
        const opener = pick(OPENERS_3, seed);
        body = opener + ' ' + body.charAt(0).toLowerCase() + body.slice(1);
      }
      const tailList = level === 3 ? TAILS_3 : level === 2 ? TAILS_2 : null;
      const wantsTail = level === 3 || (level === 2 && sentenceNo % 3 === 2);
      if (wantsTail && tailList) {
        body += (end.startsWith('?') ? '' : ',') + ' ' + pick(tailList, seed >> 3);
      }
      sentenceNo++;
      return lead + body + end + (m[5] || '');
    }).join('');
  }

  return { translate, RULES };
});
