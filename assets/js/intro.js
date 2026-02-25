$(function () {
  const $overlay = $('#intro_overlay');
  const $enterBtn = $('#intro_enter_btn');
  const $backBtn = $('#intro_back_btn');
  if (!$overlay.length || !$enterBtn.length) return;
  let closeTimer = 0;
  const overlayEl = $overlay[0];

  function moveFocusOutsideIntro() {
    const activeEl = document.activeElement;
    if (!activeEl || !overlayEl || !overlayEl.contains(activeEl)) return;
    if ($backBtn.length) {
      $backBtn[0].focus();
      return;
    }
    activeEl.blur();
  }

  function openIntro() {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = 0;
    }

    $overlay.css('display', 'grid');
    $overlay.removeClass('is_done').removeAttr('inert').attr('aria-hidden', 'false');
    $('body').addClass('intro_lock');

    requestAnimationFrame(function () {
      $overlay.addClass('is_active');
      $enterBtn[0].focus();
    });

    $(document).trigger('intro:opened');
  }

  function closeIntro() {
    if (!$overlay.hasClass('is_active')) return;
    moveFocusOutsideIntro();
    $overlay.attr('inert', '');
    $overlay.removeClass('is_active').addClass('is_done').attr('aria-hidden', 'true');
    $('body').removeClass('intro_lock');

    closeTimer = window.setTimeout(function () {
      closeTimer = 0;
      if ($overlay.hasClass('is_active')) return;
      $overlay.css('display', 'none');
    }, 560);
  }

  openIntro();

  $enterBtn.on('click', function (event) {
    event.preventDefault();
    $(document).trigger('intro:enter');
    closeIntro();
  });

  if ($backBtn.length) {
    $backBtn.on('click', function (event) {
      event.preventDefault();
      openIntro();
    });
  }

  $(document).on('keydown.intro', function (event) {
    if (event.key === 'Enter' && $overlay.hasClass('is_active')) {
      event.preventDefault();
      $(document).trigger('intro:enter');
      closeIntro();
    }
  });
});
