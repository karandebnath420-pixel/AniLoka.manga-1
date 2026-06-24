
/* =============================================
   ANILOKA MANGA — app.js (Global)
   ============================================= */

/* ── State ── */
const AL = {
  get user()      { try{return JSON.parse(localStorage.getItem('al_user'))||null}catch{return null} },
  set user(v)     { localStorage.setItem('al_user', JSON.stringify(v)) },
  get premium()   { const u=this.user; return u&&['weekly','monthly','yearly'].includes(u.plan) },
  get bookmarks() { try{return JSON.parse(localStorage.getItem('al_bookmarks'))||[]}catch{return[]} },
  set bookmarks(v){ localStorage.setItem('al_bookmarks', JSON.stringify(v)) },
  get history()   { try{return JSON.parse(localStorage.getItem('al_history'))||[]}catch{return[]} },
  set history(v)  { localStorage.setItem('al_history', JSON.stringify(v)) },
  get progress()  { try{return JSON.parse(localStorage.getItem('al_progress'))||{}}catch{return{}} },
  set progress(v) { localStorage.setItem('al_progress', JSON.stringify(v)) },
  get favorites() { try{return JSON.parse(localStorage.getItem('al_favorites'))||[]}catch{return[]} },
  set favorites(v){ localStorage.setItem('al_favorites', JSON.stringify(v)) },
  get readMode()  { return localStorage.getItem('al_readmode')||'rtl' },
  set readMode(v) { localStorage.setItem('al_readmode', v) },
  get theme()     { return localStorage.getItem('al_theme')||'dark' },
  set theme(v)    { localStorage.setItem('al_theme', v) },
};

/* ── Theme ── */
function applyTheme(){
  document.body.classList.toggle('premium-theme', !!AL.premium);
}

/* ── Toast ── */
function toast(msg, type='ok', ms=3000){
  let root = document.getElementById('toast-root');
  if(!root){ root=document.createElement('div'); root.id='toast-root'; document.body.appendChild(root); }
  const icons = {
    ok:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    err:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16.01"/></svg>`,
    info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = (icons[type]||icons.info) + msg;
  root.appendChild(el);
  setTimeout(()=>{ el.style.animation='toastOut .3s ease forwards'; setTimeout(()=>el.remove(),300); }, ms);
}

/* ── Ripple ── */
function ripple(el){
  el.addEventListener('click', e=>{
    const r=document.createElement('span'); r.className='ripple-wave';
    const rect=el.getBoundingClientRect(), sz=Math.max(rect.width,rect.height);
    r.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-rect.left-sz/2}px;top:${e.clientY-rect.top-sz/2}px`;
    el.appendChild(r); setTimeout(()=>r.remove(),600);
  });
}

/* ── Manga Database ── */
const MANGA_DB = [
  { id:1, slug:'one-piece', title:'One Piece', author:'Eiichiro Oda', genres:['Adventure','Action','Comedy'],
    status:'ongoing', chapters:1100, rating:9.2, plan:'free', tags:['hot','popular'],
    cover:'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80',
    desc:'Monkey D. Luffy sets sail to find the legendary One Piece treasure and become King of the Pirates, assembling a crew of powerful allies along the way.',
    year:1997, direction:'rtl' },
  { id:2, slug:'demon-slayer', title:'Demon Slayer', author:'Koyoharu Gotouge', genres:['Action','Fantasy','Horror'],
    status:'completed', chapters:205, rating:8.9, plan:'free', tags:['trending','popular'],
    cover:'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&q=80',
    desc:'Tanjiro Kamado becomes a Demon Slayer after his family is slaughtered and his sister Nezuko is turned into a demon.',
    year:2016, direction:'rtl' },
  { id:3, slug:'attack-on-titan', title:'Attack on Titan', author:'Hajime Isayama', genres:['Action','Drama','Horror'],
    status:'completed', chapters:139, rating:9.1, plan:'premium', tags:['trending','hot'],
    cover:'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1400&q=80',
    desc:'Humanity lives inside massive walls, threatened by giant humanoid creatures called Titans. Eren Yeager swears to annihilate them all.',
    year:2009, direction:'rtl' },
  { id:4, slug:'jujutsu-kaisen', title:'Jujutsu Kaisen', author:'Gege Akutami', genres:['Action','Supernatural'],
    status:'ongoing', chapters:245, rating:8.7, plan:'free', tags:['new','trending'],
    cover:'https://images.unsplash.com/photo-1624213111452-35e8d3d5cc18?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&q=80',
    desc:'Yuji Itadori swallows a cursed finger of the most powerful demon and joins a secret organization that battles supernatural curses.',
    year:2018, direction:'rtl' },
  { id:5, slug:'naruto', title:'Naruto', author:'Masashi Kishimoto', genres:['Action','Adventure','Fantasy'],
    status:'completed', chapters:700, rating:8.4, plan:'free', tags:['popular','classic'],
    cover:'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&q=80',
    desc:'Naruto Uzumaki, a young ninja shunned by his village, dreams of becoming Hokage — the greatest ninja of all.',
    year:1999, direction:'rtl' },
  { id:6, slug:'fullmetal-alchemist', title:'Fullmetal Alchemist', author:'Hiromu Arakawa', genres:['Action','Fantasy','Drama'],
    status:'completed', chapters:108, rating:9.2, plan:'premium', tags:['classic','popular'],
    cover:'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=80',
    desc:'Two brothers use alchemy to try to resurrect their dead mother, paying a terrible price and setting off on a quest to reclaim what they lost.',
    year:2001, direction:'rtl' },
  { id:7, slug:'chainsaw-man', title:'Chainsaw Man', author:'Tatsuki Fujimoto', genres:['Action','Horror','Dark'],
    status:'ongoing', chapters:160, rating:8.7, plan:'premium', tags:['hot','new'],
    cover:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?w=1400&q=80',
    desc:'Denji merges with his devil dog Pochita to become Chainsaw Man — a half-human, half-devil Public Safety Devil Hunter.',
    year:2018, direction:'rtl' },
  { id:8, slug:'spy-x-family', title:'Spy × Family', author:'Tatsuya Endo', genres:['Comedy','Action','Slice of Life'],
    status:'ongoing', chapters:98, rating:8.5, plan:'free', tags:['popular','new'],
    cover:'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1400&q=80',
    desc:'A spy, an assassin, and a telepath child form a fake family — but the mission might just turn into something real.',
    year:2019, direction:'rtl' },
  { id:9, slug:'vinland-saga', title:'Vinland Saga', author:'Makoto Yukimura', genres:['Historical','Action','Drama'],
    status:'ongoing', chapters:200, rating:8.9, plan:'premium', tags:['new'],
    cover:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1400&q=80',
    desc:'Young Thorfinn fights for revenge in the brutal Viking age, searching for the legendary land of Vinland.',
    year:2005, direction:'rtl' },
  { id:10, slug:'solo-leveling', title:'Solo Leveling', author:'Chugong', genres:['Action','Fantasy','Isekai'],
    status:'completed', chapters:179, rating:8.8, plan:'premium', tags:['hot','trending'],
    cover:'https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80',
    desc:'The weakest hunter Sung Jinwoo discovers a mysterious system that allows only him to level up, defying all known limits.',
    year:2018, direction:'ltr' },
  { id:11, slug:'tower-of-god', title:'Tower of God', author:'SIU', genres:['Fantasy','Adventure','Mystery'],
    status:'ongoing', chapters:590, rating:8.6, plan:'free', tags:['popular'],
    cover:'https://images.unsplash.com/photo-1580130775562-0ef92da028de?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&q=80',
    desc:'Bam enters a mysterious tower to find his friend Rachel, climbing floors filled with deadly tests and conspiracies.',
    year:2010, direction:'scroll' },
  { id:12, slug:'berserk', title:'Berserk', author:'Kentaro Miura', genres:['Dark Fantasy','Action','Horror'],
    status:'ongoing', chapters:374, rating:9.4, plan:'premium', tags:['classic','hot'],
    cover:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    banner:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&q=80',
    desc:'Guts, a lone mercenary, battles demonic forces while seeking revenge against his former friend who sacrificed their mercenary band.',
    year:1989, direction:'rtl' },
];

const HERO_BANNERS = [
  { id:3, title:'Attack on Titan', sub:'The dark masterpiece. Read all 139 chapters.', badge:'#1 All Time', slug:'attack-on-titan' },
  { id:10, title:'Solo Leveling', sub:'The weakest hunter becomes the strongest. New webtoon.', badge:'Fan Favourite', slug:'solo-leveling' },
  { id:7, title:'Chainsaw Man', sub:'Chaos, chainsaws, and devils. Nothing else like it.', badge:'Trending Now', slug:'chainsaw-man' },
];

/* ── Build manga card ── */
function buildCard(m){
  return `
  <div class="manga-card" data-id="${m.id}" onclick="goDetail('${m.slug}')">
    <img src="${m.cover}" alt="${m.title}" loading="lazy">
    <div class="card-badges">
      ${m.plan==='premium'?`<span class="badge badge-premium">⭐ Premium</span>`:`<span class="badge badge-free">Free</span>`}
      ${m.tags?.includes('new')?`<span class="badge badge-new">New</span>`:''}
    </div>
    <div class="card-chapter">Ch.${m.chapters}</div>
    <div class="card-read-btn">📖</div>
    <div class="card-overlay">
      <div class="card-title">${m.title}</div>
      <div class="card-meta"><span>${m.author}</span><span>⭐${m.rating}</span></div>
    </div>
  </div>`;
}

/* ── Stars HTML ── */
function starsHTML(r){
  const f=Math.round(r/2);
  return `<span class="stars">${[1,2,3,4,5].map(i=>`<span class="star ${i<=f?'on':'off'}">★</span>`).join('')}
  <span style="margin-left:5px;color:var(--text-dim);font-size:.78rem">${r}/10</span></span>`;
}

/* ── Navigation ── */
function goDetail(slug){ location.href=`manga-details.html?slug=${slug}` }
function goHome()      { location.href='home.html' }
function goSearch(q)   { location.href=`search.html${q?'?q='+encodeURIComponent(q):''}` }
function goReader(slug,ch){ location.href=`reader.html?slug=${slug}&ch=${ch||1}` }
function goProfile()   { location.href='profile.html' }
function goAdmin()     { location.href='admin.html' }

/* ── Navbar builder ── */
function buildNavbar(active=''){
  const u=AL.user, isPrem=AL.premium;
  const init = u?(u.name||u.email||'U')[0].toUpperCase():'?';
  return `<nav id="navbar">
    <a href="home.html" class="logo nav-logo"><span class="ani">Ani</span><span class="loka">Loka</span><small>MANGA</small></a>
    <div class="nav-links" id="navLinks">
      <a href="home.html"                       class="nav-link ${active==='home'?'active':''}">Home</a>
      <a href="search.html?genre=manga"         class="nav-link ${active==='manga'?'active':''}">Manga</a>
      <a href="search.html?genre=manhwa"        class="nav-link ${active==='manhwa'?'active':''}">Manhwa</a>
      <a href="search.html?genre=manhua"        class="nav-link ${active==='manhua'?'active':''}">Manhua</a>
      <a href="search.html?genre=webtoon"       class="nav-link ${active==='webtoon'?'active':''}">Webtoons</a>
      <a href="search.html?genre=indian"        class="nav-link ${active==='indian'?'active':''}">Indian</a>
      ${!isPrem?`<a href="profile.html#plans" class="nav-link" style="color:var(--accent);font-weight:700">✦ Premium</a>`:''}
    </div>
    <div class="nav-right">
      <button class="nav-icon-btn" onclick="goSearch()" aria-label="Search">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
      <button class="nav-icon-btn" aria-label="Notifications">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      </button>
      ${u
        ?`<div class="nav-avatar" onclick="goProfile()" title="${u.name||u.email}">${init}</div>`
        :`<a href="login.html" class="btn btn-primary btn-sm">Sign In</a>`}
      <button class="nav-hamburger" id="navHam" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;
}

/* ── Footer builder ── */
function buildFooter(){
  return `<footer>
    <div class="footer-grid">
      <div>
        <div class="logo footer-logo"><span class="ani">Ani</span><span class="loka">Loka</span><small>MANGA</small></div>
        <p class="footer-desc">India's premium manga reading platform. Read manga, manhwa, manhua & webtoons in stunning quality.</p>
      </div>
      <div class="footer-col">
        <h4>Browse</h4>
        <a href="search.html?genre=manga">Manga</a>
        <a href="search.html?genre=manhwa">Manhwa</a>
        <a href="search.html?genre=webtoon">Webtoons</a>
        <a href="search.html?genre=indian">Indian Comics</a>
      </div>
      <div class="footer-col">
        <h4>Account</h4>
        <a href="profile.html">My Profile</a>
        <a href="profile.html#bookmarks">Bookmarks</a>
        <a href="profile.html#plans">Premium Plans</a>
        <a href="profile.html#history">Read History</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="#">About Us</a>
        <a href="#">Careers</a>
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 AniLoka Manga. All rights reserved.</span>
      <span>Made with ❤️ for Manga Lovers</span>
    </div>
  </footer>`;
}

/* ── Navbar init ── */
function initNav(){
  const nb=document.getElementById('navbar');
  if(!nb)return;
  const fn=()=>nb.classList.toggle('scrolled',scrollY>20);
  window.addEventListener('scroll',fn,{passive:true}); fn();
  const ham=document.getElementById('navHam'), links=document.getElementById('navLinks');
  if(ham&&links) ham.addEventListener('click',()=>links.classList.toggle('open'));
}

/* ── Progress helpers ── */
function saveProgress(slug,ch,page){
  const p=AL.progress; p[`${slug}_${ch}`]={page,slug,ch,ts:Date.now()}; AL.progress=p;
}
function getProgress(slug,ch){ return AL.progress[`${slug}_${ch}`]||null }

/* ── Bookmark helpers ── */
function toggleBookmark(id,title){
  let bm=AL.bookmarks;
  if(bm.includes(id)){ bm=bm.filter(x=>x!==id); toast(`Removed from Bookmarks`,'ok'); }
  else               { bm.push(id); toast(`"${title}" bookmarked`,'ok'); }
  AL.bookmarks=bm;
}
function toggleFavorite(id,title){
  let fv=AL.favorites;
  if(fv.includes(id)){ fv=fv.filter(x=>x!==id); toast(`Removed from Favorites`,'ok'); }
  else               { fv.push(id); toast(`"${title}" added to Favorites`,'ok'); }
  AL.favorites=fv;
}

/* ── Add to history ── */
function addHistory(m){
  const h=AL.history.filter(x=>x.id!==m.id);
  h.unshift({...m,readAt:Date.now()});
  AL.history=h.slice(0,60);
}

/* ── DOMContentLoaded bootstrap ── */
document.addEventListener('DOMContentLoaded',()=>{
  applyTheme();
  const np=document.getElementById('nav-ph');
  if(np){ np.outerHTML=buildNavbar(np.dataset.p||''); initNav(); }
  const fp=document.getElementById('foot-ph');
  if(fp){ fp.outerHTML=buildFooter(); }
  document.querySelectorAll('.btn').forEach(ripple);
  const tr=document.getElementById('toast-root');
  if(!tr){ const d=document.createElement('div'); d.id='toast-root'; document.body.appendChild(d); }
});