// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var cardClose = document.querySelector('.card-close');
  var DRAG_THRESHOLD = 4;

  function resetSlider(slider) {
    if (!slider) return;
    var afterImg = slider.querySelector('.ba-after');
    var handle = slider.querySelector('.ba-handle');
    if (afterImg) afterImg.style.clipPath = '';
    if (handle) handle.style.left = '';
  }

  function expandCard(card) {
    if (card.classList.contains('expanded')) return;
    resetSlider(card.querySelector('.ba-slider'));
    card.classList.add('expanded');
    document.body.classList.add('services-modal-open');
    if (cardClose) card.appendChild(cardClose);
  }

  function closeExpandedCard() {
    var open = document.querySelector('.services-grid .card.expanded, .work-grid .card.expanded');
    if (open) {
      resetSlider(open.querySelector('.ba-slider'));
      open.classList.remove('expanded');
    }
    document.body.classList.remove('services-modal-open');
    if (cardClose && cardClose.parentElement !== document.body) {
      document.body.appendChild(cardClose);
    }
  }

  // Before / After sliders
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var afterImg = slider.querySelector('.ba-after');
    var handle = slider.querySelector('.ba-handle');
    var dragging = false;
    var startX = 0;
    var hasMoved = false;

    function move(x) {
      var rect = slider.getBoundingClientRect();
      var pct = Math.min(Math.max((x - rect.left) / rect.width * 100, 0), 100);
      afterImg.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
    }

    function release() {
      if (!dragging) return;
      dragging = false;
      document.body.classList.remove('slider-dragging');
      if (!hasMoved) {
        var card = slider.closest('.services-grid .card');
        if (card && !card.classList.contains('expanded')) expandCard(card);
      }
    }

    slider.addEventListener('mousedown', function (e) {
      startX = e.clientX;
      hasMoved = false;
      dragging = true;
      document.body.classList.add('slider-dragging');
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      if (!hasMoved && Math.abs(e.clientX - startX) <= DRAG_THRESHOLD) return;
      hasMoved = true;
      move(e.clientX);
    });
    window.addEventListener('mouseup', release);

    slider.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      hasMoved = false;
      dragging = true;
      document.body.classList.add('slider-dragging');
    }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      if (!hasMoved && Math.abs(e.touches[0].clientX - startX) <= DRAG_THRESHOLD) return;
      hasMoved = true;
      move(e.touches[0].clientX);
    });
    window.addEventListener('touchend', release);
  });

  // Service / Work card expand / close (anchor cards just navigate)
  var expandableCards = document.querySelectorAll('.services-grid .card, .work-grid .card');

  expandableCards.forEach(function (card) {
    if (card.tagName === 'A') return;
    card.addEventListener('click', function (e) {
      if (card.classList.contains('expanded')) return;
      if (e.target.closest('.card-close')) return;
      if (e.target.closest('.ba-slider')) return;
      expandCard(card);
    });
  });

  if (cardClose) {
    cardClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeExpandedCard();
    });
  }

  // Fullscreen image modal for portfolio category pages
  var imageModal = document.querySelector('.image-modal');
  var imageModalImg = imageModal ? imageModal.querySelector('.image-modal-img') : null;
  var imageModalClose = imageModal ? imageModal.querySelector('.image-modal-close') : null;
  var modalGallery = [];
  var modalIndex = -1;

  if (imageModal && !imageModal.querySelector('.image-modal-prev')) {
    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'image-modal-nav image-modal-prev';
    prev.setAttribute('aria-label', 'Previous image');
    prev.textContent = '‹';
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'image-modal-nav image-modal-next';
    next.setAttribute('aria-label', 'Next image');
    next.textContent = '›';
    imageModal.appendChild(prev);
    imageModal.appendChild(next);
  }
  var imageModalPrev = imageModal ? imageModal.querySelector('.image-modal-prev') : null;
  var imageModalNext = imageModal ? imageModal.querySelector('.image-modal-next') : null;

  function showModalImageAt(idx) {
    if (!modalGallery.length || !imageModalImg) return;
    var len = modalGallery.length;
    modalIndex = ((idx % len) + len) % len;
    var item = modalGallery[modalIndex];
    var src = item.getAttribute('data-src');
    var img = item.querySelector('img');
    imageModalImg.src = src;
    imageModalImg.alt = img ? img.alt : '';
  }

  function openImageModal(item) {
    if (!imageModal || !imageModalImg) return;
    var grid = item.parentElement;
    modalGallery = grid ? Array.prototype.slice.call(grid.querySelectorAll('.portfolio-item')) : [item];
    modalIndex = modalGallery.indexOf(item);
    if (modalIndex < 0) modalIndex = 0;
    showModalImageAt(modalIndex);
    var multi = modalGallery.length > 1;
    if (imageModalPrev) imageModalPrev.hidden = !multi;
    if (imageModalNext) imageModalNext.hidden = !multi;
    imageModal.hidden = false;
    imageModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('image-modal-open');
  }

  function closeImageModal() {
    if (!imageModal || !imageModalImg) return;
    if (imageModal.hidden) return;
    imageModal.hidden = true;
    imageModal.setAttribute('aria-hidden', 'true');
    imageModalImg.removeAttribute('src');
    modalGallery = [];
    modalIndex = -1;
    document.body.classList.remove('image-modal-open');
  }

  document.querySelectorAll('.portfolio-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      var src = item.getAttribute('data-src') || item.getAttribute('href');
      if (!src) return;
      e.preventDefault();
      openImageModal(item);
    });
  });

  if (imageModal) {
    imageModal.addEventListener('click', function (e) {
      if (e.target === imageModal) closeImageModal();
    });
  }
  if (imageModalClose) {
    imageModalClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeImageModal();
    });
  }
  if (imageModalPrev) {
    imageModalPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      showModalImageAt(modalIndex - 1);
    });
  }
  if (imageModalNext) {
    imageModalNext.addEventListener('click', function (e) {
      e.stopPropagation();
      showModalImageAt(modalIndex + 1);
    });
  }

  // Block right-click and drag on protected images
  ['contextmenu', 'dragstart'].forEach(function (type) {
    document.addEventListener(type, function (e) {
      if (e.target.closest('.portfolio-item, .image-modal')) {
        e.preventDefault();
      }
    });
  });

  // Services page: position bouncing arrows centered horizontally in the gap between each row's tiles
  (function initServicesJumps() {
    var section = document.querySelector('.services-section');
    if (!section) return;
    var jumps = section.querySelectorAll('.services-jump');
    if (!jumps.length) return;
    var rowPairs = [
      [document.querySelector('.services-grid .card:nth-child(1)'),
       document.querySelector('.services-grid .card:nth-child(2)')],
      [document.querySelector('.services-grid .card:nth-child(3)'),
       document.querySelector('.services-grid .card:nth-child(4)')]
    ];

    function position() {
      var sectionRect = section.getBoundingClientRect();
      rowPairs.forEach(function (pair, i) {
        var c1 = pair[0], c2 = pair[1];
        if (!c1 || !c2 || !jumps[i]) return;
        var c1Rect = c1.getBoundingClientRect();
        var c2Rect = c2.getBoundingClientRect();
        var slider = c2.querySelector('.ba-slider');
        var vRef = slider ? slider.getBoundingClientRect() : c2Rect;
        var midX = (c1Rect.right + c2Rect.left) / 2;
        jumps[i].style.top = (vRef.top + vRef.height / 2 - sectionRect.top) + 'px';
        jumps[i].style.right = (sectionRect.right - midX) + 'px';
      });
    }

    position();
    window.addEventListener('resize', position);
    window.addEventListener('load', position);
  })();

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeImageModal();
      closeExpandedCard();
      return;
    }
    if (imageModal && !imageModal.hidden) {
      if (e.key === 'ArrowLeft') showModalImageAt(modalIndex - 1);
      if (e.key === 'ArrowRight') showModalImageAt(modalIndex + 1);
    }
  });
});
