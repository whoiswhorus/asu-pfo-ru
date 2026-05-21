/* ============================================================
   10A · ALBUM — page builder + StPageFlip init
   ------------------------------------------------------------
   Структура данных альбома:
     - PHOTOS:   список путей для 49 обычных фото + main + group-1/2
     - SPREADS:  декларативный список страниц по шаблонам
     - builders: функции, которые превращают spread в DOM-страницу

   Чтобы добавить/убрать фотки — редактируй массив SPREADS ниже.
   Чтобы подменить картинки — положи файлы в assets/photos/
   с теми же именами и переключи USE_PLACEHOLDERS = false.
   ============================================================ */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // 1. CONFIG: пути к фоткам
  // -------------------------------------------------------------
  // Пока не положены реальные файлы — берём демо-картинки с picsum.photos.
  // Когда сложишь свои фото в assets/photos/ — поставь USE_PLACEHOLDERS = false.
  const USE_PLACEHOLDERS = true;

  const LOCAL = {
    main:    'assets/photos/main.jpg',
    group1:  'assets/photos/group-1.jpg',
    group2:  'assets/photos/group-2.jpg',
    // 49 пронумерованных кадров
    set: Array.from({ length: 49 }, (_, i) => {
      const n = String(i + 1).padStart(2, '0');
      return `assets/photos/${n}.jpg`;
    }),
  };

  const PLACEHOLDER = {
    main:   'https://picsum.photos/seed/album-main/1400/1800',
    group1: 'https://picsum.photos/seed/album-group-1/1600/1100',
    group2: 'https://picsum.photos/seed/album-group-2/1600/1100',
    set: Array.from({ length: 49 }, (_, i) =>
      `https://picsum.photos/seed/album-${i + 1}/900/1100`),
  };

  const SOURCE = USE_PLACEHOLDERS ? PLACEHOLDER : LOCAL;

  // Удобный ярлык для "обычной" фотки по 1-based индексу
  const p = (n) => SOURCE.set[n - 1];

  // -------------------------------------------------------------
  // 2. SPREADS: вся структура книги в одном месте
  //    Шаблоны: cover, endpaper, title, index, chapter,
  //             hero, duo, mosaic3, mosaic3alt, grid4, mosaic4,
  //             grid6, portrait-text, quote, back-cover
  // -------------------------------------------------------------
  // Распределение 49 фото по разделам:
  //   Сентябрь   — 4   (01-04)
  //   Уроки      — 6   (05-10)
  //   Перемены   — 5   (11-15)
  //   Праздники  — 8   (16-23)
  //   Поездки    — 8   (24-31)
  //   Класс      — 12  (32-43)
  //   Финал      — 6   (44-49)
  // -------------------------------------------------------------

  const CHAPTERS = {
    c1: { num: '01', tag: 'Часть первая', title: 'Сентябрь',  meta: 'когда всё снова начинается — звонок, белые рубашки, неловкие приветствия и запах нового учебника.' },
    c2: { num: '02', tag: 'Часть вторая', title: 'Уроки',     meta: 'формулы на доске, чужие конспекты, шёпот на задней парте — всё, что складывалось в наш почерк.' },
    c3: { num: '03', tag: 'Часть третья', title: 'Перемены',  meta: 'десять минут свободы между двумя 45-ми. Здесь ели, спорили, влюблялись и придумывали клички.' },
    c4: { num: '04', tag: 'Часть четвёртая', title: 'Праздники', meta: 'дни, ради которых мы готовили номера за неделю, а помнить их будем — всю жизнь.' },
    c5: { num: '05', tag: 'Часть пятая', title: 'Поездки',     meta: 'вокзалы, автобусы, фотографии у мест, где раньше никто из нас не был.' },
    c6: { num: '06', tag: 'Часть шестая', title: 'Класс',      meta: 'каждое лицо — отдельная история. Вместе они складываются в нашу.' },
    c7: { num: '07', tag: 'Часть седьмая', title: 'Финал',     meta: 'последний звонок, последнее фото у школы, последнее «увидимся завтра».' },
  };

  const SPREADS = [
    // ---------- ОБЛОЖКА ----------
    {
      type: 'cover',
      hard: true,
      photo: SOURCE.main,
      eyebrow: '10 «А» · ШКОЛА · 2025',
      title: ['Наш', { nb: 'Альбом' }],
      footLeft: 'edition · 01',
      footRight: 'mmxxiv — mmxxv',
    },

    // ---------- ФОРЗАЦ + ТИТУЛ ----------
    {
      type: 'endpaper',
      hard: true,
      quote: 'Эти страницы — всё, что мы успели не забыть.',
      tag: 'forewordings',
    },
    {
      type: 'title',
      eyebrow: '10 А · 2024 — 2025',
      h: ['Наш ', { em: 'класс' }, '.', '\n', 'Один год.'],
      sub: 'Сорок девять кадров, семь глав, одна общая память. Листай не торопясь.',
      credit: 'curated by · 10A',
    },

    // ---------- ЭДИТОРИАЛ-ИНТРО (общая фотка #1) ----------
    {
      type: 'hero',
      photo: SOURCE.group1,
      capText: 'Мы — те самые, что на фото в учительской расписан график на год.',
      capTag: 'opening · plate I',
      page: '003',
      section: 'opening',
    },

    // ---------- СОДЕРЖАНИЕ ----------
    {
      type: 'index',
      h: 'Содержание',
      items: [
        { num: '01', name: 'Сентябрь',   pg: '008' },
        { num: '02', name: 'Уроки',      pg: '014' },
        { num: '03', name: 'Перемены',   pg: '022' },
        { num: '04', name: 'Праздники',  pg: '028' },
        { num: '05', name: 'Поездки',    pg: '038' },
        { num: '06', name: 'Класс',      pg: '048' },
        { num: '07', name: 'Финал',      pg: '060' },
      ],
      page: '004',
      section: 'index',
    },

    // ============================================================
    // ГЛАВА 01 · СЕНТЯБРЬ (4 фото: 01-04)
    // ============================================================
    { type: 'chapter', chapter: CHAPTERS.c1, page: '008' },
    { type: 'hero', photo: p(1), capText: 'Первый звонок. Двор пахнет осенью и нафталином школьной формы.', capTag: 'sep · 01', page: '009', section: 'Сентябрь' },
    { type: 'duo', photos: [p(2), p(3)], capLeft: 'линейка', capRight: 'свои', page: '010', section: 'Сентябрь' },
    { type: 'portrait-text', photo: p(4),
      eyebrow: 'дневник · 01',
      h: 'Ещё не до конца поверилось.',
      text: 'Что вот это — и есть наш десятый. Что год пролетит. Что в кадре сегодня — те, с кем доедем до конца.',
      meta: '— заметки на полях',
      page: '011', section: 'Сентябрь' },

    // ============================================================
    // ГЛАВА 02 · УРОКИ (6 фото: 05-10)
    // ============================================================
    { type: 'chapter', chapter: CHAPTERS.c2, page: '014' },
    { type: 'mosaic3', photos: [p(5), p(6), p(7)], caps: ['доска', 'тетрадь', 'окно'], page: '015', section: 'Уроки' },
    { type: 'duo', photos: [p(8), p(9)], capLeft: 'физика', capRight: 'литература', page: '016', section: 'Уроки' },
    { type: 'hero', photo: p(10), capText: 'Кабинет, в котором мы знали, какая парта самая скрипучая.', capTag: 'lessons · X', page: '017', section: 'Уроки' },
    { type: 'quote', text: 'Мы не запомнили формулы. Мы запомнили, как смеялись, когда их выводили.', author: '10 А' },

    // ============================================================
    // ГЛАВА 03 · ПЕРЕМЕНЫ (5 фото: 11-15)
    // ============================================================
    { type: 'chapter', chapter: CHAPTERS.c3, page: '022' },
    { type: 'mosaic3alt', photos: [p(11), p(12), p(13)], caps: ['буфет', 'коридор', 'компания'], page: '023', section: 'Перемены' },
    { type: 'duo', photos: [p(14), p(15)], capLeft: 'смех', capRight: 'двор', page: '024', section: 'Перемены' },

    // ============================================================
    // ГЛАВА 04 · ПРАЗДНИКИ (8 фото: 16-23)
    // ============================================================
    { type: 'chapter', chapter: CHAPTERS.c4, page: '028' },
    { type: 'hero', photo: p(16), capText: 'Новый год — всегда повод собраться всем классом и забыть про дресс-код.', capTag: 'NYE', page: '029', section: 'Праздники' },
    { type: 'grid4', photos: [p(17), p(18), p(19), p(20)], page: '030', section: 'Праздники' },
    { type: 'duo', photos: [p(21), p(22)], capLeft: '23 февраля', capRight: '8 марта', page: '031', section: 'Праздники' },
    { type: 'portrait-text', photo: p(23),
      eyebrow: 'праздник',
      h: 'День учителя.',
      text: 'Мы знаем, что вы всё видели. Спасибо, что иногда — делали вид, что не заметили.',
      meta: 'с любовью · 10 А',
      page: '032', section: 'Праздники' },

    // ============================================================
    // ГЛАВА 05 · ПОЕЗДКИ (8 фото: 24-31)
    // ============================================================
    { type: 'chapter', chapter: CHAPTERS.c5, page: '038' },
    { type: 'hero', photo: p(24), capText: 'Автобус, шесть утра, кто-то спит на чужом плече.', capTag: 'roadtrip', page: '039', section: 'Поездки' },
    { type: 'mosaic4', photos: [p(25), p(26), p(27), p(28)], caps: ['музей','площадь','улица','река'], page: '040', section: 'Поездки' },
    { type: 'duo', photos: [p(29), p(30)], capLeft: 'мост', capRight: 'набережная', page: '041', section: 'Поездки' },
    { type: 'portrait-text', photo: p(31),
      eyebrow: 'локация',
      h: 'Где-то между двумя городами.',
      text: 'Карта показывала час дороги. Мы успели и сфотографироваться, и поссориться, и помириться.',
      meta: '— по дороге',
      page: '042', section: 'Поездки' },

    // ============================================================
    // ОБЩАЯ ФОТКА #2 (между поездками и классом)
    // ============================================================
    { type: 'hero', photo: SOURCE.group2, capText: 'Все. Один кадр. Это и есть наш десятый «А».', capTag: 'class portrait · plate II', page: '047', section: 'Класс' },

    // ============================================================
    // ГЛАВА 06 · КЛАСС (12 фото: 32-43)
    // ============================================================
    { type: 'chapter', chapter: CHAPTERS.c6, page: '048' },
    { type: 'grid6', photos: [p(32), p(33), p(34), p(35), p(36), p(37)], page: '049', section: 'Класс' },
    { type: 'grid6', photos: [p(38), p(39), p(40), p(41), p(42), p(43)], page: '050', section: 'Класс' },
    { type: 'quote', text: 'Класс — это не список фамилий. Это интонация, по которой узнают своих.', author: '10 А' },

    // ============================================================
    // ГЛАВА 07 · ФИНАЛ (6 фото: 44-49)
    // ============================================================
    { type: 'chapter', chapter: CHAPTERS.c7, page: '060' },
    { type: 'hero', photo: p(44), capText: 'Последний звонок. Колонки громче, чем обычно. Глаза — мокрее.', capTag: 'final · I', page: '061', section: 'Финал' },
    { type: 'mosaic3', photos: [p(45), p(46), p(47)], caps: ['речь','слёзы','объятия'], page: '062', section: 'Финал' },
    { type: 'duo', photos: [p(48), p(49)], capLeft: 'у школы', capRight: 'после', page: '063', section: 'Финал' },
    { type: 'quote', text: 'Это не «прощай». Это «до встречи на пятилетие выпуска».', author: '10 А · 2025' },

    // ---------- ФИНАЛЬНЫЙ ФОРЗАЦ + ЗАДНЯЯ ОБЛОЖКА ----------
    {
      type: 'endpaper',
      hard: true,
      quote: 'Один год — а сколько всего поместилось.',
      tag: 'afterwords',
    },
    {
      type: 'back-cover',
      hard: true,
      eyebrow: 'first edition',
      text: 'Сделано нами,\nдля нас.',
      year: 'mmxxiv — mmxxv',
    },
  ];

  // -------------------------------------------------------------
  // 3. DOM HELPERS
  // -------------------------------------------------------------
  function el(tag, opts = {}) {
    const node = document.createElement(tag);
    if (opts.class) node.className = opts.class;
    if (opts.text) node.textContent = opts.text;
    if (opts.html) node.innerHTML = opts.html;
    if (opts.attrs) for (const k in opts.attrs) node.setAttribute(k, opts.attrs[k]);
    return node;
  }

  function img(src, alt = '') {
    const i = el('img');
    i.src = src;
    i.alt = alt;
    i.loading = 'lazy';
    i.decoding = 'async';
    i.addEventListener('error', () => {
      const cell = i.closest('.cell, .hero-img-wrap, .cover-photo-wrap');
      if (cell) cell.classList.add('is-placeholder');
      i.remove();
    }, { once: true });
    return i;
  }

  function cell(src, captionText) {
    const c = el('div', { class: 'cell' });
    c.appendChild(img(src));
    if (captionText) {
      const cap = el('div', { class: 'cell-cap' });
      cap.appendChild(el('span', { class: 'cell-cap-text', text: captionText }));
      c.appendChild(cap);
    }
    return c;
  }

  function pageMeta(section, num) {
    const meta = el('div', { class: 'page-meta' });
    meta.appendChild(el('span', { text: section || '' }));
    meta.appendChild(el('span', { text: num ? num : '' }));
    return meta;
  }

  function richTitle(parts) {
    // [{nb:'X'}, 'plain', {em:'X'}, '\n']  →  HTML
    return parts.map(piece => {
      if (typeof piece === 'string') {
        return piece === '\n' ? '<br>' : escapeHtml(piece);
      }
      if (piece.nb) return `<span class="nb">${escapeHtml(piece.nb)}</span>`;
      if (piece.em) return `<em>${escapeHtml(piece.em)}</em>`;
      return '';
    }).join('');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // -------------------------------------------------------------
  // 4. PAGE BUILDERS — каждая возвращает DOM-страницу .page
  // -------------------------------------------------------------
  function buildPage(spread) {
    const page = el('div', { class: 'page' });
    if (spread.hard) page.setAttribute('data-density', 'hard');

    let inner;
    switch (spread.type) {
      case 'cover':         inner = tplCover(spread); page.classList.add('page-cover'); break;
      case 'back-cover':    inner = tplBackCover(spread); page.classList.add('page-cover-back'); break;
      case 'endpaper':      inner = tplEndpaper(spread); break;
      case 'title':         inner = tplTitle(spread); page.classList.add('tpl-title'); break;
      case 'index':         inner = tplIndex(spread); page.classList.add('tpl-index'); break;
      case 'chapter':       inner = tplChapter(spread); page.classList.add('tpl-chapter'); break;
      case 'hero':          inner = tplHero(spread); page.classList.add('tpl-hero'); break;
      case 'duo':           inner = tplDuo(spread); break;
      case 'mosaic3':       inner = tplMosaic3(spread); break;
      case 'mosaic3alt':    inner = tplMosaic3(spread, true); break;
      case 'grid4':         inner = tplGrid4(spread); break;
      case 'mosaic4':       inner = tplMosaic4(spread); break;
      case 'grid6':         inner = tplGrid6(spread); break;
      case 'portrait-text': inner = tplPortraitText(spread); break;
      case 'quote':         inner = tplQuote(spread); page.classList.add('tpl-quote'); break;
      default:              inner = el('div', { class: 'page-content', text: '— ' + spread.type });
    }
    page.appendChild(inner);
    return page;
  }

  // ----- Cover -----
  function tplCover(s) {
    const wrap = el('div', { class: 'page-content' });

    if (s.photo) {
      const photo = el('img', { class: 'cover-photo', attrs: { src: s.photo, alt: '' } });
      photo.addEventListener('error', () => photo.remove(), { once: true });
      wrap.appendChild(photo);
    }

    wrap.appendChild(el('div', { class: 'cover-overlay' }));
    wrap.appendChild(el('div', { class: 'cover-frame' }));

    const content = el('div', { class: 'cover-content-wrap' });
    if (s.eyebrow) content.appendChild(el('p', { class: 'cover-eyebrow', text: s.eyebrow }));

    const title = el('h1', { class: 'cover-title' });
    title.innerHTML = Array.isArray(s.title) ? richTitle(s.title) : escapeHtml(s.title || '');
    content.appendChild(title);

    const foot = el('div', { class: 'cover-foot' });
    foot.appendChild(el('div', { class: 'cover-foot-left', text: s.footLeft || '' }));
    foot.appendChild(el('div', { class: 'cover-foot-right', text: s.footRight || '' }));
    content.appendChild(foot);

    wrap.appendChild(content);
    return wrap;
  }

  function tplBackCover(s) {
    const wrap = el('div', { class: 'page-content' });
    if (s.eyebrow) wrap.appendChild(el('p', { class: 'back-mono', text: s.eyebrow }));
    wrap.appendChild(el('div', { class: 'back-divider' }));
    const text = el('p', { class: 'back-mark', html: escapeHtml(s.text || '').replace(/\n/g, '<br>') });
    wrap.appendChild(text);
    wrap.appendChild(el('div', { class: 'back-divider' }));
    if (s.year) wrap.appendChild(el('p', { class: 'back-mono', text: s.year }));
    return wrap;
  }

  // ----- Endpaper -----
  function tplEndpaper(s) {
    const wrap = el('div', { class: 'page-content endpaper' });
    if (s.quote) wrap.appendChild(el('p', { class: 'endpaper-quote', text: s.quote }));
    if (s.tag) wrap.appendChild(el('p', { class: 'endpaper-tag', text: s.tag }));
    return wrap;
  }

  // ----- Title -----
  function tplTitle(s) {
    const wrap = el('div', { class: 'page-content' });
    if (s.eyebrow) wrap.appendChild(el('p', { class: 'title-eyebrow', text: s.eyebrow }));
    const h = el('h1', { class: 'title-h' });
    h.innerHTML = Array.isArray(s.h) ? richTitle(s.h) : escapeHtml(s.h || '');
    wrap.appendChild(h);
    if (s.sub) wrap.appendChild(el('p', { class: 'title-sub', text: s.sub }));
    wrap.appendChild(el('div', { class: 'title-rule' }));
    if (s.credit) wrap.appendChild(el('p', { class: 'title-credit', text: s.credit }));
    return wrap;
  }

  // ----- Chapter divider -----
  function tplChapter(s) {
    const c = s.chapter || {};
    const wrap = el('div', { class: 'page-content' });
    wrap.appendChild(el('p', { class: 'chapter-tag', text: c.tag || '' }));
    wrap.appendChild(el('div', { class: 'chapter-num', text: c.num || '' }));
    wrap.appendChild(el('h2', { class: 'chapter-title', text: c.title || '' }));
    if (c.meta) wrap.appendChild(el('p', { class: 'chapter-meta', text: c.meta }));
    wrap.appendChild(pageMeta(c.title || '', s.page));
    return wrap;
  }

  // ----- Index -----
  function tplIndex(s) {
    const wrap = el('div', { class: 'page-content' });
    wrap.appendChild(el('h2', { class: 'index-h', text: s.h || 'Содержание' }));
    const ul = el('ul', { class: 'index-list' });
    (s.items || []).forEach(item => {
      const li = el('li', { class: 'index-item' });
      li.appendChild(el('span', { class: 'num', text: item.num }));
      li.appendChild(el('span', { class: 'name', text: item.name }));
      li.appendChild(el('span', { class: 'pg', text: item.pg }));
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    wrap.appendChild(pageMeta(s.section, s.page));
    return wrap;
  }

  // ----- Hero (full-bleed photo) -----
  function tplHero(s) {
    const wrap = el('div', { class: 'page-content' });
    const imgWrap = el('div', { class: 'hero-img-wrap' });
    imgWrap.appendChild(img(s.photo || '', s.capText || ''));
    wrap.appendChild(imgWrap);

    if (s.capText || s.capTag) {
      const cap = el('div', { class: 'hero-cap' });
      cap.appendChild(el('p', { class: 'hero-cap-text', text: s.capText || '' }));
      if (s.capTag) cap.appendChild(el('span', { class: 'hero-cap-tag', text: s.capTag }));
      wrap.appendChild(cap);
    }
    wrap.appendChild(pageMeta(s.section, s.page));
    return wrap;
  }

  // ----- Spread (with header + body) helper -----
  function spreadShell(s) {
    const wrap = el('div', { class: 'page-content' });
    const spread = el('div', { class: 'spread' });
    if (s.section || s.eyebrow || s.spreadTitle) {
      const head = el('div', { class: 'spread-head' });
      head.appendChild(el('span', { class: 'spread-eyebrow', text: s.eyebrow || s.section || '' }));
      if (s.spreadTitle) {
        const t = el('h3', { class: 'spread-title' });
        t.innerHTML = escapeHtml(s.spreadTitle);
        head.appendChild(t);
      }
      spread.appendChild(head);
    }
    const body = el('div', { class: 'spread-body' });
    spread.appendChild(body);
    wrap.appendChild(spread);
    wrap.appendChild(pageMeta(s.section, s.page));
    return { wrap, body };
  }

  // ----- Duo -----
  function tplDuo(s) {
    const { wrap, body } = spreadShell(s);
    const layout = el('div', { class: 'layout layout-duo' });
    layout.appendChild(cell(s.photos[0], s.capLeft));
    layout.appendChild(cell(s.photos[1], s.capRight));
    body.appendChild(layout);
    return wrap;
  }

  // ----- Mosaic 3 -----
  function tplMosaic3(s, alt = false) {
    const { wrap, body } = spreadShell(s);
    const layout = el('div', { class: `layout ${alt ? 'layout-mosaic-3-alt' : 'layout-mosaic-3'}` });
    s.photos.forEach((src, i) => layout.appendChild(cell(src, (s.caps || [])[i])));
    body.appendChild(layout);
    return wrap;
  }

  // ----- Grid 4 -----
  function tplGrid4(s) {
    const { wrap, body } = spreadShell(s);
    const layout = el('div', { class: 'layout layout-grid-4' });
    s.photos.forEach((src, i) => layout.appendChild(cell(src, (s.caps || [])[i])));
    body.appendChild(layout);
    return wrap;
  }

  // ----- Mosaic 4 -----
  function tplMosaic4(s) {
    const { wrap, body } = spreadShell(s);
    const layout = el('div', { class: 'layout layout-mosaic-4' });
    s.photos.forEach((src, i) => layout.appendChild(cell(src, (s.caps || [])[i])));
    body.appendChild(layout);
    return wrap;
  }

  // ----- Grid 6 -----
  function tplGrid6(s) {
    const { wrap, body } = spreadShell(s);
    const layout = el('div', { class: 'layout layout-grid-6' });
    s.photos.forEach((src, i) => layout.appendChild(cell(src, (s.caps || [])[i])));
    body.appendChild(layout);
    return wrap;
  }

  // ----- Portrait + text -----
  function tplPortraitText(s) {
    const { wrap, body } = spreadShell(s);
    const layout = el('div', { class: 'layout layout-portrait-text' });
    layout.appendChild(cell(s.photo));
    const block = el('div', { class: 'portrait-text-block' });
    if (s.eyebrow) block.appendChild(el('p', { class: 'ptb-eyebrow', text: s.eyebrow }));
    if (s.h)       block.appendChild(el('h3', { class: 'ptb-h', text: s.h }));
    if (s.text)    block.appendChild(el('p', { class: 'ptb-text', text: s.text }));
    block.appendChild(el('div', { class: 'ptb-rule' }));
    if (s.meta)    block.appendChild(el('p', { class: 'ptb-meta', text: s.meta }));
    layout.appendChild(block);
    body.appendChild(layout);
    return wrap;
  }

  // ----- Quote -----
  function tplQuote(s) {
    const wrap = el('div', { class: 'page-content' });
    const q = el('blockquote', { class: 'pull-quote', text: s.text || '' });
    wrap.appendChild(q);
    if (s.author) wrap.appendChild(el('p', { class: 'quote-author', text: s.author }));
    return wrap;
  }

  // -------------------------------------------------------------
  // 5. RENDER + INIT FLIP
  // -------------------------------------------------------------
  const albumEl = document.getElementById('album');
  if (!albumEl) return;

  // Чистим контейнер и засыпаем построенные страницы
  albumEl.innerHTML = '';
  SPREADS.forEach(s => albumEl.appendChild(buildPage(s)));

  if (!window.St || !window.St.PageFlip) {
    console.error('StPageFlip не загрузился — проверь подключение CDN.');
    return;
  }

  const pageFlip = new window.St.PageFlip(albumEl, {
    width: 520,
    height: 700,
    size: 'stretch',
    minWidth: 300,
    maxWidth: 620,
    minHeight: 420,
    maxHeight: 820,
    maxShadowOpacity: 0.55,
    showCover: true,
    mobileScrollSupport: false,
    flippingTime: 950,
    drawShadow: true,
    usePortrait: true,
    autoSize: true,
    showPageCorners: true,
    swipeDistance: 28,
    clickEventForward: true,
    useMouseEvents: true,
  });

  pageFlip.loadFromHTML(document.querySelectorAll('#album .page'));

  // -------------------------------------------------------------
  // 6. CONTROLS
  // -------------------------------------------------------------
  const prevBtn   = document.getElementById('prev');
  const nextBtn   = document.getElementById('next');
  const elCurrent = document.getElementById('page-current');
  const elTotal   = document.getElementById('page-total');

  const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

  function updateState() {
    const current = pageFlip.getCurrentPageIndex();
    const total = pageFlip.getPageCount();
    if (elCurrent) elCurrent.textContent = pad(current + 1);
    if (elTotal)   elTotal.textContent   = pad(total);
    if (prevBtn)   prevBtn.disabled = current <= 0;
    if (nextBtn)   nextBtn.disabled = current >= total - 1;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => pageFlip.flipPrev());
  if (nextBtn) nextBtn.addEventListener('click', () => pageFlip.flipNext());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  pageFlip.flipPrev();
    if (e.key === 'ArrowRight') pageFlip.flipNext();
  });

  pageFlip.on('flip', updateState);
  pageFlip.on('init', updateState);
  pageFlip.on('changeState', updateState);

  setTimeout(updateState, 120);
})();
