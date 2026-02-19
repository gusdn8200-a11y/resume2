const DEFAULT_VIDEO = './assets/img/v_1.mp4';
const DEFAULT_POSTER = './assets/img/s_1.png';

const copyTexts = [
  '안녕하세요,<br><span class="copy_key">퍼블리셔 박현우</span>입니다.',
  '컴포넌트를 구조화해서<br><span class="copy_key">유지보수</span>하기 쉽게 만듭니다.',
  '인터랙션은 과하지 않게,<br>필요한 만큼만 <span class="copy_key">정확히</span> 넣습니다.',
  '아래 프로젝트에서 리뉴얼 작업을<br>확인해 주세요 <span class="copy_arrow">↓</span>',
];
const bubbleSources = {
  left: './assets/img/lp.png',
  right: './assets/img/rp.png',
};
const BUBBLE_SLOTS = ['slot_0', 'slot_1', 'slot_2', 'slot_3'];
const BUBBLE_ADD_MS = 980;
const BUBBLE_ALL_HOLD_MS = 1800;
const BUBBLE_REMOVE_MS = 560;
const BUBBLE_GROUP_GAP_MS = 360;
const BUBBLE_START_DELAY_MS = 620;
const MOBILE_BUBBLE_SLOW_FACTOR = 1.35;

const copyState = {
  stage: 0,
  slotIndex: 0,
  $stream: null,
  hasStarted: false,
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
const isMobileBubbleMode = () => window.matchMedia('(max-width: 700px)').matches;
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

const fitBubbleText = (element) => {
  if (!element) return;
  element.style.fontSize = '';
  let size = Number.parseFloat(window.getComputedStyle(element).fontSize) || 12;
  const minSize = 10;
  let attempts = 0;
  while (
    attempts < 24 &&
    size > minSize &&
    (element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1)
  ) {
    size -= 0.5;
    element.style.fontSize = `${size}px`;
    attempts += 1;
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
  let shownCount = 0;

  const spawnNext = () => {
    appendBubbleMessage();
    shownCount += 1;
    if (shownCount < copyTexts.length) {
      queueBubbleTimer(spawnNext, getBubbleDelay(BUBBLE_ADD_MS));
      return;
    }

    queueBubbleTimer(() => {
      const $activeBubbles = copyState.$stream.children('.bubble_item').not('.is_leaving');
      $activeBubbles.each((_, item) => {
        startBubbleLeave($(item));
      });

      queueBubbleTimer(() => {
        resetBubbleSequence();
        runBubbleSequence();
      }, getBubbleDelay(BUBBLE_REMOVE_MS + BUBBLE_GROUP_GAP_MS));
    }, getBubbleDelay(BUBBLE_ALL_HOLD_MS));
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
  resetBubbleSequence();
};

const resumeCopyStage = () => {
  if (!copyState.$stream) return;
  if (!copyState.hasStarted) return;
  if (isIntroOverlayActive()) return;
  if (hasActiveCopyTimers()) return;
  startCopyStage(180);
};

const startCopyStage = (delayMs = BUBBLE_START_DELAY_MS) => {
  if (!copyState.$stream) return;
  clearCopyTimers();
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
  if (!document.body.classList.contains('is_touch')) return;
  const $row = $('#thumb_row');
  const $items = getTouchThumbItems();
  if ($row.length === 0 || $items.length === 0) return;

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

  touchSlideState.index = closestIndex;
  touchSlideState.total = $items.length;
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

const openImageModal = (imageSrc) => {
  if (!imageSrc) return;
  const resolvedSrc = new URL(imageSrc, window.location.href).href;
  const $image_modal = $('#image_modal');
  const $preview_image = $('#preview_image');
  if ($image_modal.length === 0 || $preview_image.length === 0) return;
  $preview_image.attr('src', resolvedSrc);
  $image_modal.addClass('is_open').attr('aria-hidden', 'false');
};

const closeImageModal = () => {
  const $image_modal = $('#image_modal');
  const $preview_image = $('#preview_image');
  if ($image_modal.length === 0 || $preview_image.length === 0) return;
  $image_modal.removeClass('is_open').attr('aria-hidden', 'true');
  $preview_image.attr('src', '');
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

const THUMB_SPEED = 90;
const MIN_THUMB_DURATION = 12;
const MAX_THUMB_DURATION = 36;
const THUMB_ARROW_HOLD_MS = 520;
let thumbArrowResumeTimer = 0;

const resolveThumbDistance = ($track) => {
  const track = $track[0];
  if (!track) return 0;

  const $items = $track.children('.thumb_item');
  const first = $items.get(0);
  const originalCount = Number($track.data('originalCount')) || 0;
  const firstClone = originalCount > 0 ? $items.get(originalCount) : null;

  if (first && firstClone) {
    const cloneOffset = firstClone.offsetLeft - first.offsetLeft;
    if (cloneOffset > 0) return cloneOffset;
  }

  return track.scrollWidth / 2;
};

const updateThumbLoop = () => {
  const $track = $('#thumb_track');
  if ($track.length === 0) return;
  const distance = resolveThumbDistance($track);
  if (!distance) return;
  const duration = clamp(distance / THUMB_SPEED, MIN_THUMB_DURATION, MAX_THUMB_DURATION);
  $track.css('--thumb_distance', `${distance.toFixed(2)}px`);
  $track.css('--thumb_duration', `${duration.toFixed(2)}s`);
};

const resolveThumbStep = ($track) => {
  const $items = $track.children('.thumb_item');
  const first = $items.get(0);
  const second = $items.get(1);
  if (!first) return 0;
  if (second) return Math.abs(second.offsetLeft - first.offsetLeft);
  return first.getBoundingClientRect().width;
};

const nudgeThumbLoop = (direction) => {
  const $track = $('#thumb_track');
  if ($track.length === 0) return;

  const track = $track[0];
  const animation = track.getAnimations().find((item) => item.playState !== 'finished');
  if (!animation) return;

  const stepPx = resolveThumbStep($track);
  if (!stepPx) return;

  const computed = getComputedStyle(track);
  const distance = Number.parseFloat(computed.getPropertyValue('--thumb_distance')) || (track.scrollWidth / 2);
  if (!distance) return;

  const timing = animation.effect && animation.effect.getTiming ? animation.effect.getTiming() : null;
  const fallbackDuration = (Number.parseFloat(computed.getPropertyValue('--thumb_duration')) || 24) * 1000;
  const loopDuration = typeof timing?.duration === 'number' ? timing.duration : fallbackDuration;
  if (!loopDuration) return;

  const delta = (stepPx / distance) * loopDuration * (direction > 0 ? 1 : -1);
  const current = typeof animation.currentTime === 'number' ? animation.currentTime : 0;
  let next = current + delta;
  next = ((next % loopDuration) + loopDuration) % loopDuration;
  animation.currentTime = next;
};

const moveThumbSlide = (direction) => {
  const step = direction < 0 ? -1 : 1;
  const $thumb_row = $('#thumb_row');
  const $track = $('#thumb_track');
  if ($thumb_row.length === 0 || $track.length === 0) return;

  if (document.body.classList.contains('is_touch')) {
    moveTouchSlide(step);
    return;
  }

  const stepPx = resolveThumbStep($track);
  if (!stepPx) return;

  $track.children('.thumb_item').removeClass('is_selected');
  nudgeThumbLoop(step);
  holdThumbLoopAfterArrow();
};

const resumeThumbLoop = () => {
  const $track = $('#thumb_track');
  if ($track.length === 0) return;
  $track.css('animation-play-state', '');
};

const pauseThumbLoop = () => {
  const $track = $('#thumb_track');
  if ($track.length === 0) return;
  $track.css('animation-play-state', 'paused');
};

const holdThumbLoopAfterArrow = () => {
  pauseThumbLoop();
  if (thumbArrowResumeTimer) {
    window.clearTimeout(thumbArrowResumeTimer);
  }
  thumbArrowResumeTimer = window.setTimeout(() => {
    thumbArrowResumeTimer = 0;
    resumeThumbLoop();
  }, THUMB_ARROW_HOLD_MS);
};

let touchScrollSyncFrame = 0;

$(function () {
  const touchDevice = isTouchDevice();
  if (touchDevice) {
    document.body.classList.add('is_touch');
  }

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
  if (!touchDevice && $thumb_track.length && !$thumb_track.data('looped')) {
    $thumb_track.data('looped', true);
    $thumb_track.data('originalCount', $thumb_track.children('.thumb_item').length);
    $thumb_track.children().clone().appendTo($thumb_track);
    updateThumbLoop();
  }
  if ($thumb_track.length) {
    setActiveThumb($thumb_track.find('.thumb_item').first());
  }
  if (touchDevice && $thumb_track.length) {
    touchSlideState.total = $thumb_track.children('.thumb_item').length;
    touchSlideState.index = 0;
  }

  const $thumb_row = $('#thumb_row');
  if ($thumb_row.length) {
    $thumb_row.on('pointerenter focusin click', '.thumb_item', function () {
      setActiveThumb(this);
      if (touchDevice) {
        touchSlideState.index = $(this).index();
      }
    });

    if (!touchDevice) {
      $thumb_row.on('pointerenter', () => {
        pauseThumbLoop();
      });
      $thumb_row.on('pointerenter', '.thumb_item', function () {
        handleThumbEnter(this);
      });
      $thumb_row.on('focusin', '.thumb_item', function () {
        pauseThumbLoop();
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
      resumeThumbLoop();
    });
    if (!touchDevice) {
      $thumb_row.on('focusout', function (event) {
        if (!$.contains(this, event.relatedTarget)) {
          handleThumbLeave();
          resumeThumbLoop();
        }
      });
    } else {
      $thumb_row.on('scroll', () => {
        if (touchScrollSyncFrame) return;
        touchScrollSyncFrame = window.requestAnimationFrame(() => {
          touchScrollSyncFrame = 0;
          syncTouchSlideState();
        });
      });
    }
  }

  $('#thumb_prev').on('click', () => moveThumbSlide(-1));
  $('#thumb_next').on('click', () => moveThumbSlide(1));

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
    updateThumbLoop();
    $('#speech_stream .bubble_text').each((_, item) => fitBubbleText(item));
    if (touchDevice) {
      touchSlideState.total = $('#thumb_track').children('.thumb_item').length;
      syncTouchSlideState();
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
