/* © 2026 uh.izaak. All rights reserved. */

(function () {

  function spawnNo(x, y) {
    const el = document.createElement('div');
    el.textContent = 'no';
    Object.assign(el.style, {
      position:      'fixed',
      left:          x + 'px',
      top:           y + 'px',
      transform:     'translate(-50%, -120%)',
      color:         '#fff',
      fontSize:      '0.85rem',
      fontWeight:    '600',
      fontFamily:    'sans-serif',
      pointerEvents: 'none',
      zIndex:        '999999',
      opacity:       '1',
      transition:    'opacity 0.6s ease, transform 0.6s ease',
      userSelect:    'none',
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.opacity   = '0';
      el.style.transform = `translate(-50%, -200%)`;
    });
    setTimeout(() => el.remove(), 700);
  }

  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    spawnNo(e.clientX, e.clientY);
  });

  document.addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase();

    if (key === 'f12') { e.preventDefault(); return; }

    if (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(key)) {
      e.preventDefault(); return;
    }

    if (e.ctrlKey && key === 'u') { e.preventDefault(); return; }

    if (e.ctrlKey && key === 's') { e.preventDefault(); return; }
  });

  document.addEventListener('selectstart', function (e) {

    if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
    e.preventDefault();
  });

})();
