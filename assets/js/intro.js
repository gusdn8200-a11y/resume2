$(function () {
  const $overlay = $('#introOverlay');
  const $enterBtn = $('#introEnterBtn');
  const $backBtn = $('#introBackBtn');
  if (!$overlay.length || !$enterBtn.length) return;
  let closeTimer = 0;

  function openIntro() {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = 0;
    }

    $overlay.css('display', 'grid');
    $overlay.removeClass('is-done').attr('aria-hidden', 'false');
    $('body').addClass('intro-lock');

    requestAnimationFrame(function () {
      $overlay.addClass('is-active');
    });

    $(document).trigger('intro:opened');
  }

  function closeIntro() {
    if (!$overlay.hasClass('is-active')) return;
    $overlay.removeClass('is-active').addClass('is-done').attr('aria-hidden', 'true');
    $('body').removeClass('intro-lock');

    closeTimer = window.setTimeout(function () {
      closeTimer = 0;
      if ($overlay.hasClass('is-active')) return;
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
    if (event.key === 'Enter' && $overlay.hasClass('is-active')) {
      event.preventDefault();
      $(document).trigger('intro:enter');
      closeIntro();
    }
  });
});
