(() => {
  const images = [...document.querySelectorAll('.portfolio-grid .work img')];
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Visualização de trabalhos');
  overlay.innerHTML = `<button class="lightbox-close" aria-label="Fechar">×</button><button class="lightbox-prev" aria-label="Imagem anterior">❮</button><img class="lightbox-image" alt=""><button class="lightbox-next" aria-label="Próxima imagem">❯</button><p class="lightbox-counter"></p>`;
  document.body.append(overlay);
  const full = overlay.querySelector('.lightbox-image');
  const counter = overlay.querySelector('.lightbox-counter');
  const available = () => images.filter(img => !img.hidden && img.complete && img.naturalWidth > 0);
  let current = 0, previousFocus = null;
  function show(index) {
    const items = available();
    if (!items.length) return;
    current = (index + items.length) % items.length;
    full.src = items[current].src;
    full.alt = items[current].alt;
    counter.textContent = `${current + 1} / ${items.length}`;
  }
  function close() {
    overlay.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    if (previousFocus) previousFocus.focus();
  }
  images.forEach(img => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Ampliar ${img.alt}`);
    const open = () => {
      if (img.hidden || !img.naturalWidth) return;
      previousFocus = document.activeElement;
      overlay.classList.add('active');
      document.body.classList.add('lightbox-open');
      show(available().indexOf(img));
      overlay.querySelector('.lightbox-close').focus();
    };
    img.addEventListener('click', open);
    img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  overlay.querySelector('.lightbox-close').addEventListener('click', close);
  overlay.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  overlay.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'Tab') {
      const controls = [...overlay.querySelectorAll('button')];
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let startX = null;
  overlay.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', e => {
    if (startX === null) return;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 55) show(current + (delta < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
})();
