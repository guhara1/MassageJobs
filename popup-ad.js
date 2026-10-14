/*!
 * 일손마당 공통 광고 팝업(꿀알바 것과 같은 그림·같은 규칙) — 「한 번 등록으로 구인구직 사이트에 동시 노출」
 * 2026-10-08 사장님 지시: 1시간 단위로 노출 · 배너를 누르면 광고문의로 이동.
 *
 * ★한 시간 재는 법 — 닫은 시각을 localStorage 에 적고 1시간이 안 지났으면 띄우지 않는다.
 *   세션 단위로 하면 탭을 새로 열 때마다 떠서 금방 성가셔진다.
 * ★localStorage 가 막힌 브라우저(사생활 보호 모드)에서도 화면이 깨지지 않게 전부 try 로 감싼다.
 *   읽기가 실패하면 '안 본 것'으로 보고 띄우되, 저장이 실패하면 그 세션에서만 숨긴다.
 * ★LCP 를 밀지 않도록 **로드가 끝난 뒤** 띄운다. 이미지는 lazy 가 아니라 **그릴 때 받는다**.
 * ★접근성: role=dialog + aria-modal, Esc 로 닫힘, 닫기 버튼으로 초점 이동, 닫으면 원래 자리로 돌아간다.
 */
(function () {
  'use strict';
  if (window.__adpop) return; window.__adpop = 1;   // 넷리파이 스니펫 + 본문 태그가 겹쳐도 한 번만
  var S = document.currentScript;
  if (!S) return;
  var IMG  = S.getAttribute('data-img')  || '/img/popup-ad.webp';
  var LINK = S.getAttribute('data-link') || '/inquiry';
  var KEY  = S.getAttribute('data-key')  || 'adpop_v1';
  var GAP  = (parseInt(S.getAttribute('data-hours') || '1', 10) || 1) * 3600 * 1000;
  var ALT  = S.getAttribute('data-alt')  || '한 번의 유료 등록으로 구인구직 사이트에 동시 노출 — 광고 문의';
  var sessionHidden = false;

  function recently() {
    if (sessionHidden) return true;
    try {
      var t = parseInt(window.localStorage.getItem(KEY) || '0', 10);
      return t > 0 && (Date.now() - t) < GAP;
    } catch (e) { return false; }          // 저장소가 막혔으면 '안 본 것'으로 본다
  }
  function stamp() {
    sessionHidden = true;
    try { window.localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
  }

  function build() {
    if (recently() || document.getElementById('adpop-wrap')) return;

    var wrap = document.createElement('div');
    wrap.id = 'adpop-wrap';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', '광고 안내');

    var css = document.createElement('style');
    css.textContent =
      '#adpop-wrap{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;' +
      'justify-content:center;padding:16px;padding:max(16px,env(safe-area-inset-top)) 16px ' +
      'max(16px,env(safe-area-inset-bottom));background:rgba(12,10,18,.62);' +
      '-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);animation:adpopIn .18s ease-out}' +
      '@keyframes adpopIn{from{opacity:0}to{opacity:1}}' +
      '#adpop-box{position:relative;width:min(92vw,420px);max-height:calc(100vh - 32px);' +
      'display:flex;flex-direction:column;border-radius:14px;overflow:hidden;' +
      'box-shadow:0 18px 50px -12px rgba(0,0,0,.55);background:#fff}' +
      '#adpop-box>a{display:block;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch}' +
      '#adpop-box img{display:block;width:100%;height:auto}' +
      '#adpop-x{position:absolute;top:8px;right:8px;z-index:2;width:38px;height:38px;' +
      'border:0;border-radius:50%;background:rgba(18,16,24,.62);color:#fff;font-size:21px;' +
      'line-height:38px;cursor:pointer;padding:0}' +
      '#adpop-x:hover{background:rgba(18,16,24,.85)}' +
      '#adpop-x:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
      '#adpop-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;' +
      'padding:10px 12px;background:#15121c;color:#e9e3f0;font-size:13px;' +
      'font-family:"Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif}' +
      '#adpop-bar button{background:none;border:0;color:#cfc6da;font-size:13px;cursor:pointer;' +
      'padding:6px 8px;border-radius:6px}' +
      '#adpop-bar button:hover{color:#fff;background:rgba(255,255,255,.1)}' +
      '@media (prefers-reduced-motion:reduce){#adpop-wrap{animation:none}}';

    var box = document.createElement('div');
    box.id = 'adpop-box';

    var a = document.createElement('a');
    a.href = LINK;
    var img = document.createElement('img');
    img.src = IMG; img.alt = ALT;
    img.width = 480; img.height = 600;         // 자리를 먼저 잡아 글이 튀지 않게
    a.appendChild(img);

    var x = document.createElement('button');
    x.id = 'adpop-x'; x.type = 'button';
    x.setAttribute('aria-label', '닫기');
    x.innerHTML = '&times;';

    var bar = document.createElement('div');
    bar.id = 'adpop-bar';
    var note = document.createElement('span');
    note.textContent = '닫으면 1시간 동안 보이지 않습니다';
    var close2 = document.createElement('button');
    close2.type = 'button';
    close2.textContent = '닫기';
    bar.appendChild(note); bar.appendChild(close2);

    box.appendChild(x); box.appendChild(a); box.appendChild(bar);
    wrap.appendChild(css); wrap.appendChild(box);

    var prev = document.activeElement;
    function shut() {
      stamp();
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      document.removeEventListener('keydown', onKey, true);
      try { if (prev && prev.focus) prev.focus(); } catch (e) {}
    }
    function onKey(e) {
      if (e.key === 'Escape' || e.keyCode === 27) { e.preventDefault(); shut(); }
    }
    x.addEventListener('click', shut);
    close2.addEventListener('click', shut);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) shut(); });
    document.addEventListener('keydown', onKey, true);
    // 배너를 눌러 광고문의로 가는 것도 '봤다'로 친다 — 돌아왔을 때 또 뜨지 않게
    a.addEventListener('click', stamp);

    document.body.appendChild(wrap);
    try { x.focus({ preventScroll: true }); } catch (e) {}
  }

  function start() { setTimeout(build, 800); }   // 첫 화면을 다 그린 뒤에 띄운다
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
