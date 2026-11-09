/* Static sanity checks for LIFE KIDS Snack-compatible project. */
const fs = require('fs');
const source = fs.readFileSync('App.js', 'utf8');
const art = fs.readFileSync('worldArt.js', 'utf8');
const required = [
  'assets/audio/life_kids_theme.mp3', 'assets/audio/tap.mp3',
  'assets/audio/correct.mp3', 'assets/audio/try_again.mp3', 'assets/audio/reward.mp3'
];
for (const asset of required) if (!fs.existsSync(asset)) throw new Error(`Missing audio asset: ${asset}`);
const worlds = (source.match(/\{ id: "(?:money|shops|wellbeing|home|safety|help)"/g) || []).length;
const missionIds = (source.match(/\{ id: "m[1-6]", title:/g) || []).length;
if (worlds !== 6) throw new Error(`Expected 6 worlds, found ${worlds}`);
if (missionIds !== 36) throw new Error(`Expected 36 missions, found ${missionIds}`);
if (!source.includes('const FREE_WORLD_IDS = ["money", "shops"]') || !source.includes('function hasWorldAccess') || !source.includes('screen === "paywall"')) throw new Error('Hybrid free/paid access configuration is missing');
if (!source.includes('type: "sort"') || !source.includes('type: "match"') || !source.includes('type: "sequence"')) throw new Error('Missing interactive game mechanics');
for (const key of ['money','shops','wellbeing','home','safety','help','hero','pip','premium']) {
  if (!art.includes(`${key}: "data:image/jpeg;base64,`)) throw new Error(`Missing embedded image: ${key}`);
}
if (/require\(["']\.\/assets\/[^"']+\.(?:png|jpg|jpeg)["']\)/i.test(source)) throw new Error('Static image require() remains in App.js');
console.log('LIFE KIDS Snack validation passed: 6 worlds, 36 missions, embedded artwork, no static image requires, audio assets present.');
