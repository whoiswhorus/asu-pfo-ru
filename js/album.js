/* ============================================
   Школьный альбом — инициализация StPageFlip
   ============================================ */

(function () {
  'use strict';

  const albumEl = document.getElementById('album');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const pageInfo = document.getElementById('page-info');

  if (!window.St || !window.St.PageFlip) {
    console.error('StPageFlip не загрузился. Проверь подключение CDN.');
    return;
  }

  // Создаём флипбук
  const pageFlip = new St.PageFlip(albumEl, {
    width: 460,           // базовая ширина страницы
    height: 620,          // базовая высота страницы
    size: 'stretch',      // адаптивный размер
    minWidth: 300,
    maxWidth: 560,
    minHeight: 400,
    maxHeight: 760,
    maxShadowOpacity: 0.5,
    showCover: true,      // первая страница — обложка (одиночная)
    mobileScrollSupport: false,
    flippingTime: 900,
    drawShadow: true,
    usePortrait: true,    // на узких экранах показывает по 1 странице
    autoSize: true,
    showPageCorners: true,
  });

  // Загружаем страницы из HTML
  pageFlip.loadFromHTML(document.querySelectorAll('.page'));

  // --- Управление ---
  prevBtn.addEventListener('click', () => pageFlip.flipPrev());
  nextBtn.addEventListener('click', () => pageFlip.flipNext());

  // Клавиатура: стрелки влево/вправо
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  pageFlip.flipPrev();
    if (e.key === 'ArrowRight') pageFlip.flipNext();
  });

  // --- Обновление счётчика и состояния кнопок ---
  function updateState() {
    const current = pageFlip.getCurrentPageIndex();
    const total = pageFlip.getPageCount();
    pageInfo.textContent = `${current + 1} / ${total}`;
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= total - 1;
  }

  pageFlip.on('flip', updateState);
  pageFlip.on('init', updateState);
  pageFlip.on('changeState', updateState);

  // На случай, если init уже отстрелил
  setTimeout(updateState, 100);
})();
