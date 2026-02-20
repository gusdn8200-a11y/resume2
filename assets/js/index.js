const DEFAULT_VIDEO = './assets/img/v_1.mp4';
const DEFAULT_POSTER = './assets/img/s_1.png';

const copyTexts = [
  '<span class="copy_key">퍼블리셔 박현우</span>입니다.',
  '<span class="copy_key">구조화</span>로 유지보수를 단순하게.',
  '인터랙션은 필요한 만큼만,<br><span class="copy_key">정확하게</span> 구현합니다.',
  '아래 프로젝트에서<br><span class="copy_key">확인해 보세요</span> <span class="copy_arrow">↓</span>',
];
const bubbleSources = {
  left: './assets/img/lp.png',
  right: './assets/img/rp.png',
};
const BUBBLE_SLOTS = ['slot_0', 'slot_1', 'slot_2', 'slot_3'];
const BUBBLE_DISPLAY_MS = 1000;
const BUBBLE_REMOVE_MS = 360;
const BUBBLE_SWITCH_GAP_MS = 120;
const BUBBLE_START_DELAY_MS = 620;
const MOBILE_BUBBLE_MAX_WIDTH = 700;
const MOBILE_BUBBLE_SLOW_FACTOR = 1.55;

const copyState = {
  stage: 0,
  slotIndex: 0,
  $stream: null,
  hasStarted: false,
  hasCompletedOnce: false,
  isRunning: false,
  removeTimers: [],
};
const touchSlideState = {
  index: 0,
  total: 0,
};

const PREVIEW_HOVER_DELAY_MS = 160;
let previewTimer = 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const isTouchDevice = () => (
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  window.matchMedia('(hover: none) and (pointer: coarse)').matches
);
const isMobileBubbleMode = () => (
  window.matchMedia(`(max-width: ${MOBILE_BUBBLE_MAX_WIDTH}px)`).matches
);
const syncMobileBubbleModeClass = () => {
  const active = isMobileBubbleMode();
  document.body.classList.toggle('is_mobile_bubble_mode', active);
  return active;
};
const getBubbleDelay = (delayMs) => (
  isMobileBubbleMode() ? Math.round(delayMs * MOBILE_BUBBLE_SLOW_FACTOR) : delayMs
);

const clearCopyTimers = () => {
  if (copyState.removeTimers.length) {
    copyState.removeTimers.forEach((timerId) => window.clearTimeout(timerId));
    copyState.removeTimers = [];
  }
};

const resolveBubbleSide = (stageValue) => (stageValue % 2 === 0 ? 'left' : 'right');
const isIntroOverlayActive = () => $('#intro_overlay').hasClass('is_active');
const hasActiveCopyTimers = () => copyState.removeTimers.length > 0;

const queueBubbleTimer = (callback, delayMs) => {
  const timerId = window.setTimeout(() => {
    copyState.removeTimers = copyState.removeTimers.filter((id) => id !== timerId);
    callback();
  }, delayMs);
  copyState.removeTimers.push(timerId);
  return timerId;
};

const isBubbleTextOverflowing = (element) => (
  element.scrollHeight > element.clientHeight + 1 ||
  element.scrollWidth > element.clientWidth + 1
);

const fitBubbleTextToBounds = (element) => {
  const styles = window.getComputedStyle(element);
  let size = Number.parseFloat(styles.fontSize) || 12;
  const minSize = Number.parseFloat(styles.getPropertyValue('--bubble_min_font_size')) || 10;
  let attempts = 0;
  while (attempts < 28 && size > minSize && isBubbleTextOverflowing(element)) {
    size -= 0.5;
    element.style.fontSize = `${size}px`;
    attempts += 1;
  }
};

const fitBubbleText = (element) => {
  if (!element) return;
  element.classList.remove('is_multiline');
  element.style.fontSize = '';
  fitBubbleTextToBounds(element);

  const computed = window.getComputedStyle(element);
  const lineHeight = Number.parseFloat(computed.lineHeight);
  const isMultiline = Number.isFinite(lineHeight) && lineHeight > 0 && element.scrollHeight > lineHeight * 1.55;
  if (isMultiline) {
    element.classList.add('is_multiline');
    element.style.fontSize = '';
    fitBubbleTextToBounds(element);
  }
};

const startBubbleLeave = ($bubble) => {
  if (!$bubble || $bubble.length === 0) return;
  if ($bubble.hasClass('is_leaving')) return;
  if (!$bubble.parent().length) return;

  $bubble.removeClass('is_visible').addClass('is_leaving').attr('aria-hidden', 'true');
  queueBubbleTimer(() => {
    $bubble.remove();
  }, getBubbleDelay(BUBBLE_REMOVE_MS));
};

const appendBubbleMessage = () => {
  if (!copyState.$stream || copyTexts.length === 0) return;
  if (isMobileBubbleMode()) {
    copyState.$stream.children('.bubble_item').remove();
  }

  const stage = copyState.stage % copyTexts.length;
  const side = resolveBubbleSide(stage);
  const slot = BUBBLE_SLOTS[copyState.slotIndex % BUBBLE_SLOTS.length];
  const $bubble = $(`
    <article class="bubble_item ${slot} is_${side}" aria-hidden="true">
      <img class="bubble_img" src="${bubbleSources[side]}" alt="" aria-hidden="true">
      <p class="bubble_text"></p>
    </article>
  `);
  $bubble.find('.bubble_text').html(copyTexts[stage]);
  copyState.$stream.append($bubble);
  fitBubbleText($bubble.find('.bubble_text')[0]);

  requestAnimationFrame(() => {
    $bubble.addClass('is_visible').attr('aria-hidden', 'false');
  });

  copyState.stage = (stage + 1) % copyTexts.length;
  copyState.slotIndex = (copyState.slotIndex + 1) % BUBBLE_SLOTS.length;
  return $bubble;
};

const runBubbleSequence = () => {
  if (!copyState.$stream || copyTexts.length === 0) return;
  copyState.isRunning = true;

  const spawnNext = () => {
    if (!copyState.$stream || isIntroOverlayActive()) {
      copyState.isRunning = false;
      return;
    }

    const stage = copyState.stage % copyTexts.length;
    const isLastMessage = stage === copyTexts.length - 1;
    const $bubble = appendBubbleMessage();
    if (!$bubble || $bubble.length === 0) {
      copyState.isRunning = false;
      return;
    }

    if (isLastMessage) {
      copyState.hasCompletedOnce = true;
      copyState.isRunning = false;
      return;
    }

    queueBubbleTimer(spawnNext, getBubbleDelay(BUBBLE_DISPLAY_MS));
  };

  spawnNext();
};

const resetBubbleSequence = () => {
  if (!copyState.$stream) return;
  copyState.stage = 0;
  copyState.slotIndex = 0;
  copyState.$stream.empty();
};

const setupCopyStage = () => {
  const $stream = $('#speech_stream');
  if ($stream.length === 0) return;
  copyState.$stream = $stream;
  clearCopyTimers();
  resetBubbleSequence();
  if ($('#intro_overlay').length === 0 || !isIntroOverlayActive()) {
    copyState.hasStarted = true;
    startCopyStage(BUBBLE_START_DELAY_MS);
  }
};

const stopCopyStage = () => {
  clearCopyTimers();
  copyState.isRunning = false;
  if (copyState.hasCompletedOnce) return;
  resetBubbleSequence();
};

const resumeCopyStage = () => {
  if (!copyState.$stream) return;
  if (!copyState.hasStarted) return;
  if (copyState.hasCompletedOnce) return;
  if (isIntroOverlayActive()) return;
  if (copyState.isRunning) return;
  if (hasActiveCopyTimers()) return;
  startCopyStage(180);
};

const startCopyStage = (delayMs = BUBBLE_START_DELAY_MS) => {
  if (!copyState.$stream) return;
  if (copyState.hasCompletedOnce) return;
  clearCopyTimers();
  copyState.isRunning = false;
  resetBubbleSequence();
  queueBubbleTimer(() => {
    if (isIntroOverlayActive()) return;
    runBubbleSequence();
  }, Math.max(0, delayMs));
};

const openPreview = (src) => {
  const $video_modal = $('#video_modal');
  const $preview_video = $('#preview_video');
  const preview_video = $preview_video[0];
  if ($video_modal.length === 0 || !preview_video) return;

  const nextSrc = src?.video || src || DEFAULT_VIDEO;
  const nextPoster = src?.poster || DEFAULT_POSTER;
  if ($preview_video.attr('poster') !== nextPoster) {
    $preview_video.attr('poster', nextPoster);
  }
  if ($preview_video.attr('src') !== nextSrc) {
    $preview_video.attr('src', nextSrc);
    preview_video.currentTime = 0;
    preview_video.load();
  }
  $video_modal.addClass('is_open').attr('aria-hidden', 'false');
  preview_video.play().catch(() => {});
};

const closePreview = () => {
  const $video_modal = $('#video_modal');
  const $preview_video = $('#preview_video');
  const preview_video = $preview_video[0];
  if ($video_modal.length === 0 || !preview_video) return;

  preview_video.pause();
  $video_modal.removeClass('is_open').attr('aria-hidden', 'true');
};

const clearPreviewTimer = () => {
  if (!previewTimer) return;
  window.clearTimeout(previewTimer);
  previewTimer = 0;
};

const resolveThumbPoster = (target) => {
  if (!target) return DEFAULT_POSTER;
  return $(target).find('.thumb_img').attr('src') || DEFAULT_POSTER;
};

const warmPreview = (videoSrc, posterSrc) => {
  const $preview_video = $('#preview_video');
  const preview_video = $preview_video[0];
  if (!preview_video) return;

  const nextVideoSrc = videoSrc || DEFAULT_VIDEO;
  const nextPosterSrc = posterSrc || DEFAULT_POSTER;

  if ($preview_video.attr('poster') !== nextPosterSrc) {
    $preview_video.attr('poster', nextPosterSrc);
  }
  if ($preview_video.attr('src') !== nextVideoSrc) {
    $preview_video.attr('src', nextVideoSrc);
    preview_video.currentTime = 0;
    preview_video.load();
  }
};

const handleThumbEnter = (target, immediate = false) => {
  if (!target) return;
  const src = $(target).attr('data-video') || DEFAULT_VIDEO;
  const poster = resolveThumbPoster(target);
  clearPreviewTimer();
  warmPreview(src, poster);
  if (immediate) {
    openPreview({ video: src, poster });
    return;
  }
  previewTimer = window.setTimeout(() => {
    openPreview({ video: src, poster });
    previewTimer = 0;
  }, PREVIEW_HOVER_DELAY_MS);
};

const setActiveThumb = (target) => {
  const $items = $('#thumb_row .thumb_item');
  if ($items.length === 0) return;
  $items.removeClass('is_selected');
  if (target) {
    $(target).addClass('is_selected');
  }
};

const getTouchThumbItems = () => $('#thumb_track').children('.thumb_item');

const normalizeSlideIndex = (value, total) => {
  if (total <= 0) return 0;
  return ((value % total) + total) % total;
};

const syncTouchSlideState = () => {
  const $row = $('#thumb_row');
  const $track = $('#thumb_track');
  const $items = getTouchThumbItems();
  if ($row.length === 0 || $track.length === 0 || $items.length === 0) return;

  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;
  const currentLeft = $row[0].scrollLeft;

  $items.each((index, item) => {
    const distance = Math.abs(item.offsetLeft - currentLeft);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  const originalCount = Number($track.data('originalCount')) || $items.length;
  touchSlideState.index = normalizeSlideIndex(closestIndex, originalCount);
  touchSlideState.total = originalCount;
  setActiveThumb($items.get(closestIndex));
};

const moveTouchSlide = (direction) => {
  const $row = $('#thumb_row');
  const $items = getTouchThumbItems();
  if ($row.length === 0 || $items.length === 0) return;

  touchSlideState.total = $items.length;
  const isForwardLoop = direction > 0 && touchSlideState.index >= touchSlideState.total - 1;
  const isBackwardLoop = direction < 0 && touchSlideState.index <= 0;
  const nextIndex = normalizeSlideIndex(touchSlideState.index + direction, touchSlideState.total);
  const target = $items.get(nextIndex);
  if (!target) return;

  touchSlideState.index = nextIndex;
  setActiveThumb(target);
  $row[0].scrollTo({
    left: target.offsetLeft,
    behavior: (isForwardLoop || isBackwardLoop) ? 'auto' : 'smooth',
  });
};

const resolveThumbStepPx = () => {
  const $items = $('#thumb_track').children('.thumb_item');
  const first = $items.get(0);
  const second = $items.get(1);
  if (!first) return 0;
  if (!second) return first.getBoundingClientRect().width;
  return Math.abs(second.offsetLeft - first.offsetLeft);
};

const nudgeThumbSlide = (direction) => {
  const step = direction < 0 ? -1 : 1;
  if (isAutoThumbLoopDisabled()) {
    moveTouchSlide(step);
    return;
  }

  const row = getThumbRowEl();
  if (!row) return;
  const stepPx = resolveThumbStepPx();
  if (!stepPx) return;

  const loopDistance = getThumbLoopDistance();
  if (!loopDistance) return;

  pauseThumbLoop();
  let target = row.scrollLeft + (stepPx * step);
  if (target < 0) {
    target += loopDistance;
  } else if (target >= loopDistance) {
    target -= loopDistance;
  }
  row.scrollTo({ left: target, behavior: 'smooth' });
  resumeThumbLoop(THUMB_RESUME_DELAY_MS);
};

const handleThumbLeave = () => {
  clearPreviewTimer();
  closePreview();
};

const handleVideoError = () => {
  const $preview_video = $('#preview_video');
  const preview_video = $preview_video[0];
  if (!preview_video) return;
  const current = $preview_video.attr('src');
  if (current && current !== DEFAULT_VIDEO) {
    openPreview({ video: DEFAULT_VIDEO, poster: DEFAULT_POSTER });
  }
};

const positionImageCloseButton = () => {
  const $image_modal = $('#image_modal');
  const $image_card = $image_modal.find('.image_card');
  const $image_close = $image_modal.find('.image_close');
  if ($image_modal.length === 0 || $image_card.length === 0 || $image_close.length === 0) return;
  if (!$image_modal.hasClass('is_open')) return;

  const cardRect = $image_card[0].getBoundingClientRect();
  const offset = window.matchMedia('(max-width: 700px)').matches ? 10 : 14;
  const top = Math.max(offset, Math.round(cardRect.top + offset));
  const right = Math.max(offset, Math.round(window.innerWidth - cardRect.right + offset));

  $image_close.css({
    top: `${top}px`,
    right: `${right}px`,
  });
};

const openImageModal = (imageSrc) => {
  if (!imageSrc) return;
  const resolvedSrc = new URL(imageSrc, window.location.href).href;
  const $image_modal = $('#image_modal');
  const $preview_image = $('#preview_image');
  if ($image_modal.length === 0 || $preview_image.length === 0) return;
  $preview_image.attr('src', resolvedSrc);
  $image_modal.addClass('is_open').attr('aria-hidden', 'false');
  requestAnimationFrame(positionImageCloseButton);
};

const closeImageModal = () => {
  const $image_modal = $('#image_modal');
  const $preview_image = $('#preview_image');
  const $image_close = $image_modal.find('.image_close');
  if ($image_modal.length === 0 || $preview_image.length === 0) return;
  $image_modal.removeClass('is_open').attr('aria-hidden', 'true');
  $preview_image.attr('src', '');
  $image_close.css({
    top: '',
    right: '',
  });
};

const setDrawerState = ($panel, $backdrop, $toggle, willOpen) => {
  if ($panel.length === 0) return;
  const panelEl = $panel[0];
  if (!willOpen) {
    const active = document.activeElement;
    if (active && panelEl.contains(active)) {
      if ($toggle && $toggle.length) {
        $toggle[0].focus();
      } else if (active.blur) {
        active.blur();
      }
    }
  }
  $panel.toggleClass('is_open', willOpen).attr('aria-hidden', String(!willOpen));
  if (willOpen) {
    $panel.removeAttr('inert');
  } else {
    $panel.attr('inert', '');
  }
  if ($backdrop && $backdrop.length) {
    $backdrop.toggleClass('is_open', willOpen).attr('aria-hidden', String(!willOpen));
    if (willOpen) {
      $backdrop.removeAttr('inert');
    } else {
      $backdrop.attr('inert', '');
    }
  }
  if ($toggle && $toggle.length) {
    $toggle.attr('aria-expanded', String(willOpen));
  }
};

const togglePsPanel = (forceOpen) => {
  const $panel = $('#ps_panel');
  const $backdrop = $('#ps_backdrop');
  const $toggle = $('#ps_toggle');
  if ($panel.length === 0) return;
  const willOpen = typeof forceOpen === 'boolean' ? forceOpen : !$panel.hasClass('is_open');
  setDrawerState($panel, $backdrop, $toggle, willOpen);
};

const togglePsFlipCard = (target, forceState) => {
  const $card = $(target);
  if ($card.length === 0) return;
  const nextState = typeof forceState === 'boolean' ? forceState : !$card.hasClass('is_flipped');
  $card.toggleClass('is_flipped', nextState).attr('aria-pressed', String(nextState));
};

const THUMB_AUTO_SCROLL_PX_PER_FRAME = 1.2;
const THUMB_RESUME_DELAY_MS = 680;
let thumbAutoRaf = 0;
let thumbAutoResumeTimer = 0;
let thumbAutoPaused = false;

const isAutoThumbLoopDisabled = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

const getThumbRowEl = () => {
  const $row = $('#thumb_row');
  if ($row.length === 0) return null;
  return $row[0];
};

const getThumbLoopDistance = () => {
  const $track = $('#thumb_track');
  if ($track.length === 0) return 0;
  const $items = $track.children('.thumb_item');
  const originalCount = Number($track.data('originalCount')) || 0;
  if (originalCount <= 0 || $items.length <= originalCount) return 0;

  const first = $items.get(0);
  const firstClone = $items.get(originalCount);
  if (!first || !firstClone) return 0;
  return Math.max(0, firstClone.offsetLeft - first.offsetLeft);
};

const tickThumbLoop = () => {
  const row = getThumbRowEl();
  if (!row || isAutoThumbLoopDisabled()) {
    thumbAutoRaf = 0;
    return;
  }

  if (!thumbAutoPaused && !document.hidden) {
    const loopDistance = getThumbLoopDistance();
    if (loopDistance > 0) {
      row.scrollLeft += THUMB_AUTO_SCROLL_PX_PER_FRAME;
      if (row.scrollLeft >= loopDistance) {
        row.scrollLeft -= loopDistance;
      }
    }
  }

  thumbAutoRaf = window.requestAnimationFrame(tickThumbLoop);
};

const startThumbLoop = () => {
  if (isAutoThumbLoopDisabled()) return;
  if (thumbAutoRaf) return;
  thumbAutoRaf = window.requestAnimationFrame(tickThumbLoop);
};

const stopThumbLoop = () => {
  if (thumbAutoRaf) {
    window.cancelAnimationFrame(thumbAutoRaf);
    thumbAutoRaf = 0;
  }
  if (thumbAutoResumeTimer) {
    window.clearTimeout(thumbAutoResumeTimer);
    thumbAutoResumeTimer = 0;
  }
};

const pauseThumbLoop = () => {
  if (isAutoThumbLoopDisabled()) return;
  thumbAutoPaused = true;
  if (thumbAutoResumeTimer) {
    window.clearTimeout(thumbAutoResumeTimer);
    thumbAutoResumeTimer = 0;
  }
};

const resumeThumbLoop = (delayMs = 0) => {
  if (isAutoThumbLoopDisabled()) return;
  if (thumbAutoResumeTimer) {
    window.clearTimeout(thumbAutoResumeTimer);
    thumbAutoResumeTimer = 0;
  }
  if (delayMs > 0) {
    thumbAutoResumeTimer = window.setTimeout(() => {
      thumbAutoResumeTimer = 0;
      thumbAutoPaused = false;
    }, delayMs);
  } else {
    thumbAutoPaused = false;
  }
  startThumbLoop();
};

let touchScrollSyncFrame = 0;

$(function () {
  const touchDevice = isTouchDevice();
  if (touchDevice) {
    document.body.classList.add('is_touch');
  }
  let currentMobileBubbleMode = syncMobileBubbleModeClass();

  setupCopyStage();
  $(document).on('intro:enter', () => {
    copyState.hasStarted = true;
    startCopyStage(BUBBLE_START_DELAY_MS);
  });
  $(document).on('intro:opened', () => {
    copyState.hasStarted = false;
    stopCopyStage();
  });

  const $thumb_track = $('#thumb_track');
  if ($thumb_track.length) {
    if (!touchDevice && !$thumb_track.data('looped')) {
      const originalCount = $thumb_track.children('.thumb_item').length;
      $thumb_track.data('originalCount', originalCount);
      $thumb_track.children('.thumb_item').clone().appendTo($thumb_track);
      $thumb_track.data('looped', true);
    }
    setActiveThumb($thumb_track.find('.thumb_item').first());
    touchSlideState.total = Number($thumb_track.data('originalCount')) || $thumb_track.children('.thumb_item').length;
    touchSlideState.index = 0;
  }

  const $thumb_row = $('#thumb_row');
  if ($thumb_row.length) {
    $thumb_row[0].scrollLeft = 0;
  }
  startThumbLoop();
  if ($thumb_row.length) {
    $thumb_row.on('pointerenter focusin click', '.thumb_item', function () {
      setActiveThumb(this);
      touchSlideState.index = $(this).index();
    });

    if (!touchDevice) {
      $thumb_row.on('pointerenter', () => {
        pauseThumbLoop();
      });
      $thumb_row.on('pointerenter', '.thumb_item', function () {
        handleThumbEnter(this);
      });
      $thumb_row.on('focusin', '.thumb_item', function () {
        handleThumbEnter(this, true);
      });
      $thumb_row.on('pointerleave', () => {
        handleThumbLeave();
        resumeThumbLoop();
      });
    }
    $thumb_row.on('click', '.thumb_btn_view', function (event) {
      event.preventDefault();
      event.stopPropagation();
      const $item = $(this).closest('.thumb_item');
      openImageModal($item.data('home'));
    });
    $thumb_row.on('click', '.thumb_btn_link', function () {
      // Keep marquee animation from staying paused after opening a new tab.
      this.blur();
      resumeThumbLoop(THUMB_RESUME_DELAY_MS);
    });
    if (!touchDevice) {
      $thumb_row.on('focusout', function (event) {
        if (!$.contains(this, event.relatedTarget)) {
          handleThumbLeave();
        }
      });
    }
    $thumb_row.on('scroll', () => {
      if (touchScrollSyncFrame) return;
      touchScrollSyncFrame = window.requestAnimationFrame(() => {
        touchScrollSyncFrame = 0;
        syncTouchSlideState();
      });
    });
  }
  $('#thumb_prev').on('click', () => nudgeThumbSlide(-1));
  $('#thumb_next').on('click', () => nudgeThumbSlide(1));

  $('#preview_video').on('error', handleVideoError);
  $('#image_modal').on('click', (event) => {
    if (event.target.id === 'image_modal') {
      closeImageModal();
    }
  });
  $('#image_modal').on('click', '.image_close', closeImageModal);
  $('#ps_toggle').on('click', () => togglePsPanel());
  $('#ps_panel').on('click', '.drawer_close', () => togglePsPanel(false));
  $('#ps_panel .ps_main.ps_flip').attr('role', 'button').attr('aria-pressed', 'false');
  $('#ps_panel').on('click', '.ps_main.ps_flip', function (event) {
    event.preventDefault();
    togglePsFlipCard(this);
  });
  $('#ps_panel').on('keydown', '.ps_main.ps_flip', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    togglePsFlipCard(this);
  });

  $(window).on('load resize orientationchange', () => {
    const nextMobileBubbleMode = syncMobileBubbleModeClass();
    const modeChanged = nextMobileBubbleMode !== currentMobileBubbleMode;
    currentMobileBubbleMode = nextMobileBubbleMode;

    if (nextMobileBubbleMode) {
      const $bubbles = $('#speech_stream .bubble_item');
      if ($bubbles.length > 1) {
        $bubbles.not(':last').remove();
      }
    }
    if (modeChanged && copyState.hasStarted && !isIntroOverlayActive()) {
      copyState.hasCompletedOnce = false;
      startCopyStage(120);
    }
    $('#speech_stream .bubble_text').each((_, item) => fitBubbleText(item));
    positionImageCloseButton();
    touchSlideState.total = Number($('#thumb_track').data('originalCount')) || $('#thumb_track').children('.thumb_item').length;
    syncTouchSlideState();
    if (isAutoThumbLoopDisabled()) {
      stopThumbLoop();
      thumbAutoPaused = false;
    } else {
      startThumbLoop();
    }
  });
  $(window).on('focus pageshow', () => {
    const active = document.activeElement;
    if (active && active.closest && active.closest('#thumb_row')) {
      active.blur();
    }
    resumeThumbLoop();
    resumeCopyStage();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      resumeThumbLoop();
      resumeCopyStage();
    } else {
      pauseThumbLoop();
      stopCopyStage();
    }
  });
  $(window).on('keydown', (event) => {
    if (event.key === 'Escape') {
      clearPreviewTimer();
      closePreview();
      closeImageModal();
      togglePsPanel(false);
    }
  });
});
