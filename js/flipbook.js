(function(){
  const DIR = [{"name": "Aadharsh Pandiyan", "prog": "MBA", "role": "CRM Officer, London School of Hygiene and Tropical Medicine (LSHTM)", "page": 9, "ini": "AP", "img": "images/students/aadharsh-pandiyan.jpg"}, {"name": "Mayur Mohite", "prog": "MBA", "role": "Quality Associate, Coca-Cola", "page": 10, "ini": "MM", "img": "images/students/mayur-mohite.jpg"}, {"name": "Rheanne Quadros", "prog": "MBA", "role": "Communications Manager, Kilowott", "page": 11, "ini": "RQ", "img": "images/students/rheanne-quadros.jpg"}, {"name": "Sunny Akula", "prog": "MBA", "role": "Marketing Coordinator, Bangalore Food Company", "page": 12, "ini": "SA", "img": "images/students/sunny-akula.jpg"}, {"name": "Vikas Kumar", "prog": "MBA", "role": "Highway Engineer, Gayatri Projects Ltd", "page": 13, "ini": "VK", "img": "images/students/vikas-kumar.jpg"}, {"name": "Shikhar Pandey", "prog": "MBA", "role": "Project Architect, Morphogenesis", "page": 14, "ini": "SP", "img": "images/students/shikhar-pandey.jpg"}, {"name": "Nikita Tharakan", "prog": "MBA", "role": "Functional Procurement Controller – Data Analyst, Innomotics (formerly Siemens)", "page": 15, "ini": "NT", "img": "images/students/nikita-tharakan.jpg"}, {"name": "Anbazhagan Amirthalingam", "prog": "MBA", "role": "Machine Learning (Vision) Engineer, TeleRadio Engineering Private Limited, Singapore", "page": 16, "ini": "AA", "img": "images/students/anbazhagan-amirthalingam.jpg"}, {"name": "Shivam Udamale", "prog": "MBA", "role": "Regional Sales Executive, Dew Point Pvt Ltd", "page": 17, "ini": "SU", "img": "images/students/shivam-udamale.jpg"}, {"name": "Akanksha Upadhyay", "prog": "MBA", "role": "Frontend Developer, CodingExpo Technology Pvt. Ltd.", "page": 18, "ini": "AU", "img": "images/students/akanksha-upadhyay.jpg"}, {"name": "Karan Gyanchand Naval", "prog": "MSc Artificial Intelligence", "role": "Fresher", "page": 20, "ini": "KN", "img": "images/students/karan-gyanchand-naval.jpg"}, {"name": "Omair Shaikh", "prog": "MSc Artificial Intelligence", "role": "Fresher", "page": 21, "ini": "OS", "img": "images/students/omair-shaikh.jpg"}, {"name": "Omkar Amrit Surve", "prog": "MSc Artificial Intelligence", "role": "Software Engineer, NeoSoft Ltd", "page": 22, "ini": "OS", "img": "images/students/omkar-amrit-surve.jpg"}, {"name": "Rashmi Janve", "prog": "MSc Artificial Intelligence", "role": "Junior Development Engineer, Akademika Lab Solutions", "page": 23, "ini": "RJ", "img": "images/students/rashmi-janve.jpg"}, {"name": "Omik Vichare", "prog": "MSc Artificial Intelligence", "role": "Fresher", "page": 24, "ini": "OV", "img": "images/students/omik-vichare.jpg"}, {"name": "Vedant Manjrekar", "prog": "MSc Artificial Intelligence", "role": "Fresher", "page": 25, "ini": "VM", "img": "images/students/vedant-manjrekar.jpg"}];
  const N = 32;
  const PW = 560, PH = 792;
  const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.getElementById('stage');
  const holder = document.getElementById('flip');
  const counter = document.getElementById('counter');
  const srcPages = Array.from(document.querySelectorAll('#src > .page'));
  let current = 0, booted = false, flip = null;
  const hm = /page=(\d+)/.exec(location.hash || '');
  if (hm) current = Math.min(N-1, +hm[1]);

  // Build the paper pages: each is a sheet face holding one 560x792 design, scaled to fit.
  const sheets = srcPages.map((p, i) => {
    const d = document.createElement('div');
    d.className = 'sheet' + (p.classList.contains('dark') ? ' sheet-dark' : '');
    if (i === 0 || i === N - 1) d.dataset.density = 'hard';
    const inner = document.createElement('div'); inner.className = 'sheet-in';
    inner.appendChild(p.cloneNode(true));
    const g = document.createElement('div'); g.className = 'gutter';
    d.appendChild(inner); d.appendChild(g);
    holder.appendChild(d);
    return d;
  });

  // Size the book box to the largest spread (or single page) that fits the stage.
  function sizeHolder(){
    const aw = stage.clientWidth - 36, ah = stage.clientHeight - 30;
    const portrait = aw < 760 || aw / ah < 1.05;
    const ratio = (portrait ? PW : PW * 2) / PH;
    let w = Math.min(aw, ah * ratio, portrait ? 760 : 1700), h = w / ratio;
    holder.style.width = Math.floor(w) + 'px'; holder.style.height = Math.floor(h) + 'px';
    return portrait;
  }
  function rescale(){
    if (!flip) return;
    const r = flip.getBoundsRect && flip.getBoundsRect();
    const pw = r ? r.pageWidth : holder.clientWidth / 2;
    holder.style.setProperty('--s', (pw / PW).toFixed(5));
  }

  function make(){
    const portrait = sizeHolder();
    const pw = portrait ? holder.clientWidth : holder.clientWidth / 2;
    if (flip){ try { current = flip.getCurrentPageIndex(); flip.destroy(); } catch(e){} 
      // destroy() removes the pages from the DOM; put them back
      sheets.forEach(s => { s.removeAttribute('style'); s.className = s.className.replace(/\s?--\S+/g,''); holder.appendChild(s); });
    }
    flip = new St.PageFlip(holder, {
      width: Math.floor(pw), height: Math.floor(pw * PH / PW), size: 'fixed',
      showCover: true, usePortrait: portrait, autoSize: false,
      maxShadowOpacity: 0.6, drawShadow: true, flippingTime: REDUCED ? 1 : 1100,
      showPageCorners: true, mobileScrollSupport: false, swipeDistance: 25,
      clickEventForward: true, startPage: current, startZIndex: 2
    });
    flip.loadFromHTML(sheets);
    flip.on('flip', e => { current = e.data; update(); hideHint(); });
    flip.on('changeState', e => { holder.classList.toggle('busy', e.data !== 'read'); });
    rescale(); update(); requestAnimationFrame(fitText);
  }

  function lbl(i){ return String(i).padStart(2,'0'); }
  function update(){
    if (!flip) return;
    const i = flip.getCurrentPageIndex(); current = i;
    const land = flip.getOrientation && flip.getOrientation() === 'landscape';
    let txt;
    if (i === 0) txt = 'Cover';
    else if (i >= N - 1 && (!land || i === N - 1)) txt = 'Back cover';
    else if (land){ const l = i % 2 ? i : i - 1; txt = (l + 1 >= N - 1) ? 'Back cover' : 'Pages ' + lbl(l) + '–' + lbl(l + 1); }
    else txt = 'Page ' + lbl(i) + ' of ' + lbl(N - 2);
    counter.textContent = txt;
    document.getElementById('prev').disabled = i <= 0;
    document.getElementById('first').disabled = i <= 0;
    document.getElementById('next').disabled = i >= N - 1 || (land && i >= N - 2 && i % 2 === 0 && false);
    if (booted){ try { history.replaceState(null, '', i > 0 ? '#page=' + i : location.pathname + location.search); } catch(e){} }
  }

  function turn(dir){ if (!flip) return; dir > 0 ? flip.flipNext('bottom') : flip.flipPrev('bottom'); }
  function spreadLeft(i, land){ return land ? (i <= 0 ? 0 : (i % 2 ? i : i - 1)) : i; }
  function goTo(page, instant){
    if (!flip) return;
    page = Math.max(0, Math.min(N - 1, page | 0));
    const land = flip.getOrientation() === 'landscape';
    const cur = spreadLeft(flip.getCurrentPageIndex(), land), tgt = spreadLeft(page, land);
    if (tgt === cur) return;
    if (instant || REDUCED){ flip.turnToPage(page); update(); return; }
    const fwd = tgt > cur;
    // park on the spread next to the target, then do one real page turn into it
    const step = land ? 2 : 1;
    let park = fwd ? tgt - step : tgt + step;
    if (land && fwd && park < 1) park = 0;
    if (land && !fwd && park > N - 1) park = N - 1;
    if (park !== cur) flip.turnToPage(park);
    requestAnimationFrame(() => requestAnimationFrame(() => { fwd ? flip.flipNext('bottom') : flip.flipPrev('bottom'); }));
  }

  // in-page links (contents, rosters, programme cards): keep the paper engine from treating them as page clicks
  ['mousedown','touchstart','pointerdown'].forEach(ev => holder.addEventListener(ev, e => { if (e.target.closest('a') || e.target.closest('.tl span')) e.stopPropagation(); }, true));
  holder.addEventListener('click', e => {
    const a = e.target.closest('a[data-go]');
    if (a){ e.preventDefault(); e.stopPropagation(); goTo(+a.dataset.go); }
  }, true);


  // size invisible text so it lines up with the printed words (selectable, screen-reader readable)
  function fitText(){
    document.querySelectorAll('.tl span[data-w]').forEach(s => {
      const w = +s.dataset.w; s.style.transform = ''; const m = s.offsetWidth;
      if (m > 0 && w > 0) { s.style.transform = 'scaleX(' + (w / m).toFixed(4) + ')'; s.removeAttribute('data-w'); }
    });
  }
  let rt = null, lastPortrait = null;
  function onResize(){
    clearTimeout(rt);
    rt = setTimeout(() => {
      const aw = stage.clientWidth - 36, ah = stage.clientHeight - 30;
      const portrait = aw < 760 || aw / ah < 1.05;
      make(); lastPortrait = portrait;
    }, 180);
  }

  document.addEventListener('keydown', e => {
    if (dirEl.classList.contains('open')){ if (e.key === 'Escape') closeDir(); return; }
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); turn(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); turn(-1); }
    else if (e.key === 'Home') goTo(0);
    else if (e.key === 'End') goTo(N-1);
  });

  document.getElementById('next').onclick = () => turn(1);
  document.getElementById('prev').onclick = () => turn(-1);
  document.getElementById('first').onclick = () => goTo(0);
  document.getElementById('toc').onclick = () => goTo(1);

  const fsb = document.getElementById('fs');
  if (document.fullscreenEnabled) {
    fsb.hidden = false;
    fsb.onclick = () => { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch(e){} };
  }

  // hint
  const hint = document.getElementById('hint');
  function hideHint(){ hint.style.opacity = 0; }
  setTimeout(hideHint, 6000);

  // directory
  const dirEl = document.getElementById('dir'), list = document.getElementById('dirlist'), q = document.getElementById('q');
  let filt = 'all', lastFocus = null;
  function drawDir(){
    const term = q.value.trim().toLowerCase();
    const items = DIR.filter(s => (filt === 'all' || s.prog.startsWith(filt)) && (!term || (s.name + ' ' + s.role).toLowerCase().includes(term)));
    list.innerHTML = items.length ? items.map(s =>
      '<button class="dir-item" data-p="'+s.page+'">'+(s.img?'<img class="dir-ph" src="'+s.img+'" alt="Photo of '+s.name+'">':'<i>'+s.ini+'</i>')+'<div><b>'+s.name+'</b><span>'+s.role+'</span><small>'+(s.prog==='MBA'?'MBA':'MSc AI')+' · page '+String(s.page).padStart(2,'0')+'</small></div></button>'
    ).join('') : '<p class="dir-empty">No student matches that search. Try a first name or a company.</p>';
  }
  function openDir(){ lastFocus = document.activeElement; dirEl.classList.add('open'); drawDir(); setTimeout(()=>q.focus(), 30); }
  function closeDir(){ dirEl.classList.remove('open'); if (lastFocus) lastFocus.focus(); }
  document.getElementById('dirbtn').onclick = openDir;
  document.getElementById('dirx').onclick = closeDir;
  dirEl.addEventListener('click', e => { if (e.target === dirEl) closeDir(); });
  q.addEventListener('input', drawDir);
  dirEl.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
    filt = b.dataset.f; dirEl.querySelectorAll('.seg button').forEach(x => x.setAttribute('aria-pressed', x === b)); drawDir();
  });
  list.addEventListener('click', e => { const b = e.target.closest('.dir-item'); if (!b) return; closeDir(); goTo(+b.dataset.p); });

  window.addEventListener('resize', onResize);
  make();
  booted = true;

  window.addEventListener('hashchange', () => { const m = /page=(\d+)/.exec(location.hash||''); if (m && +m[1] !== current) goTo(+m[1]); });
})();
