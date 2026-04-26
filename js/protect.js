/* inspect protection */
(function () {

  /* no */
  function showNo(e) {
    e.preventDefault();
    var el = document.createElement('div');
    el.textContent = 'no';
    el.style.cssText = 'position:fixed;pointer-events:none;z-index:999999;font-family:system-ui,sans-serif;font-size:0.85rem;font-weight:600;color:#fff;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:4px 10px;border-radius:6px;opacity:1;transition:opacity 0.6s ease;left:' + (e.clientX + 10) + 'px;top:' + (e.clientY + 10) + 'px;';
    document.body.appendChild(el);
    setTimeout(function() { el.style.opacity = '0'; }, 600);
    setTimeout(function() { el.remove(); }, 1200);
  }

  function attachRightClick() {
    document.removeEventListener('contextmenu', showNo);
    document.addEventListener('contextmenu', showNo);
  }
  attachRightClick();
  setInterval(attachRightClick, 2000);

  /* shortcuts */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].includes(e.key)) { e.preventDefault(); return false; }
    if (e.ctrlKey && ['U','u'].includes(e.key)) { e.preventDefault(); return false; }
  });

  /* size */
  var devtoolsOpen = false;
  function checkSize() {
    var threshold = 160;
    if ((window.outerWidth - window.innerWidth > threshold) || (window.outerHeight - window.innerHeight > threshold)) {
      if (!devtoolsOpen) { devtoolsOpen = true; window.location.href = '/dumbass.html'; }
    } else {
      devtoolsOpen = false;
    }
  }
  setInterval(checkSize, 1000);

  /* console */
  var detector = /./;
  detector.toString = function() {
    if (!devtoolsOpen) { devtoolsOpen = true; window.location.href = '/dumbass.html'; }
    return '';
  };
  setInterval(function() { console.log('%c', detector); }, 2000);

  /* 5. Disable text selection */
  document.addEventListener('selectstart', function(e) { e.preventDefault(); });

})();
