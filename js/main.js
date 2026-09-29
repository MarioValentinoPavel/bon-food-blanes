/* Bon Food — tragaperras de neón: tira de la palanca, la máquina arma el combo y lo pides por WhatsApp */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const IC = {
  kebab: '<path d="M12 3v18"/><path d="M8 5h8l-1.5 12h-5z"/><path d="M9 9h6M9.5 13h5"/>',
  durum: '<path d="M5 7h13a3 3 0 0 1 0 10H5a3 3 0 0 1 0-10z"/><path d="M9 7c-2 3-2 7 0 10M13 7c-2 3-2 7 0 10"/>',
  plate: '<circle cx="12" cy="13" r="8"/><path d="M8 12c1-2 3-3 4-3M12 16h4"/><circle cx="15" cy="11" r="1.2"/>',
  pizza: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/><circle cx="9" cy="9" r=".8"/><circle cx="15" cy="15" r=".8"/>',
  falafel: '<circle cx="8" cy="14" r="3"/><circle cx="16" cy="14" r="3"/><circle cx="12" cy="8" r="3"/>',
  fries: '<path d="M6 10h12l-2 10H8z"/><path d="M8 10V4M11 10V3M14 10V4M17 10V5"/>',
  salad: '<path d="M4 12h16a8 8 0 0 1-16 0z"/><path d="M8 11c0-3 2-5 4-5M12 11c1-3 3-4 5-4"/>',
  rice: '<path d="M4 12h16a8 8 0 0 1-16 0z"/><circle cx="9" cy="10" r=".7"/><circle cx="12" cy="9" r=".7"/><circle cx="15" cy="10" r=".7"/>',
  sauce: '<path d="M10 3h4v3l2 3v12H8V9l2-3z"/><path d="M9 14h6"/>',
  can: '<path d="M8 4h8v16H8z"/><path d="M8 7h8M8 17h8"/>',
  water: '<path d="M10 3h4v2l2 3v13H8V8l2-3z"/><path d="M8 13h8"/>',
  juice: '<path d="M7 5h10l-1.5 15h-7z"/><path d="M14 5l2-3"/><path d="M8 10h8"/>',
  tea: '<path d="M8 5c-1 5 0 9 4 11 4-2 5-6 4-11z"/><path d="M9 20h6M12 16v4"/>'
};
const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;
const REELS = [
  [['kebab', 'Kebab XL'], ['kebab', 'Kebab XXL'], ['durum', 'Dürüm'], ['plate', 'Plato kebab'], ['pizza', 'Pizza'], ['falafel', 'Falafel']],
  [['fries', 'Patatas'], ['salad', 'Ensalada'], ['rice', 'Arroz'], ['sauce', 'Salsa picante'], ['sauce', 'Salsa de yogur']],
  [['can', 'Refresco'], ['water', 'Agua'], ['juice', 'Zumo'], ['tea', 'Té']]
];
const REP = 9;
const reels = [0, 1, 2].map(i => $('#r' + i));
reels.forEach((r, i) => { $('.strip', r).innerHTML = Array.from({ length: REP }, () => REELS[i].map(([k, t]) => `<div class="item">${svg(k)}<span>${t}</span></div>`).join('')).join(''); });
let ih = 110;
const pos = [0, 0, 0];
function sizeReels() {
  ih = reels[0].offsetHeight / 3;
  reels.forEach((r, i) => { r.style.setProperty('--ih', ih + 'px'); gsap.set($('.strip', r), { y: -((REELS[i].length + pos[i]) * ih) + ih }); });
}
sizeReels(); addEventListener('resize', sizeReels);

let busy = false;
function spin() {
  if (busy) return; busy = true;
  $('#maquina').classList.remove('is-win');
  gsap.fromTo('.lever__arm', { scaleY: 1 }, { scaleY: .25, duration: .25, yoyo: true, repeat: 1, ease: 'power2.in' });
  const picks = REELS.map(r => Math.floor(Math.random() * r.length));
  let done = 0;
  reels.forEach((r, i) => {
    const s = $('.strip', r), len = REELS[i].length, loops = 5 + i;
    gsap.to(s, { y: -((loops * len + picks[i]) * ih) + ih, duration: 1.5 + i * .45, ease: 'back.out(1.1)', onComplete: () => {
      pos[i] = picks[i]; gsap.set(s, { y: -((len + picks[i]) * ih) + ih });
      if (++done === 3) finish(picks);
    } });
  });
}
function finish(p) {
  const names = p.map((k, i) => REELS[i][k][1]);
  const jackpot = p[0] === 1;
  $('#combo').innerHTML = `${jackpot ? '¡JACKPOT! ' : ''}<span><b>${names[0]}</b> + ${names[1]} + ${names[2]}</span>`;
  $('#wa').href = 'https://wa.me/34613929855?text=' + encodeURIComponent(`¡Hola Bon Food! La máquina de vuestra web me ha dado este combo: ${names.join(' + ')}. ¿Me decís el precio? Lo quiero para recoger / a domicilio.`);
  if (jackpot) $('#maquina').classList.add('is-win');
  gsap.fromTo('#combo', { scale: .9, opacity: .3 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(2)' });
  busy = false;
}
$('#spin').addEventListener('click', spin);
$('#lever').addEventListener('click', spin);

/* ---------- carta ---------- */
$$('.ico').forEach(e => e.innerHTML = svg(e.dataset.i));
$('#ticker').innerHTML = ('Kebab XL ✦ Kebab XXL ✦ Dürüm ✦ Pizzas ✦ Falafel ✦ Halal ✦ 12:00 – 23:00 ✦ ').repeat(6).split('✦').map(w => `<span>${w.trim()}</span><span>✦</span>`).join('');
gsap.to('#ticker', { xPercent: -50, ease: 'none', duration: 34, repeat: -1 });

/* ---------- entrada ---------- */
gsap.timeline({ delay: .2 })
  .from('.neon', { opacity: 0, duration: .06, repeat: 7, yoyo: true, ease: 'none' })
  .from(['.halal', '.hero__lead', '.hero__row'], { y: 24, opacity: 0, duration: .7, stagger: .08 }, '<.2')
  .from('.machine', { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out' }, '<')
  .add(spin, '+=.1');

$$('.head, .cards article, .local__pics img, .local__txt > *').forEach(n => gsap.from(n, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: n, start: 'top 88%', once: true } }));
