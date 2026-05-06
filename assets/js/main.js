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
      if (!hasMoved) {
        var card = slider.closest('.services-grid .card');
        if (card && !card.classList.contains('expanded')) expandCard(card);
      }
    }

    slider.addEventListener('mousedown', function (e) {
      startX = e.clientX;
      hasMoved = false;
      dragging = true;
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
    }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      if (!hasMoved && Math.abs(e.touches[0].clientX - startX) <= DRAG_THRESHOLD) return;
      hasMoved = true;
      move(e.touches[0].clientX);
    });
    window.addEventListener('touchend', release);
  });

  // Service / Work card expand / close
  var expandableCards = document.querySelectorAll('.services-grid .card, .work-grid .card');

  expandableCards.forEach(function (card) {
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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeExpandedCard();
  });
});
