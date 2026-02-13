const DEFAULT_VIDEO = './assets/img/v_1.mp4';

const copyTexts = [
  '안녕하세요,<br><span class="copy-key">프론트엔드 박현우</span>입니다.',
  '컴포넌트를 구조화해서<br><span class="copy-key">유지보수</span>하기 쉽게 만듭니다.',
  '인터랙션은 과하지 않게,<br>필요한 만큼만 <span class="copy-key">정확히</span> 넣습니다.',
  '아래 프로젝트에서 리뉴얼 작업을<br>확인해 주세요 <span class="copy-arrow">↓</span>',
];
const bubbleSources = {
  left: './assets/img/lp.png',
  right: './assets/img/rp.png',
};
const BUBBLE_SLOTS = ['slot-0', 'slot-1', 'slot-2', 'slot-3'];
const BUBBLE_ADD_MS = 980;
const BUBBLE_ALL_HOLD_MS = 1800;
const BUBBLE_REMOVE_MS = 560;
const BUBBLE_GROUP_GAP_MS = 360;
const BUBBLE_START_DELAY_MS = 620;

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

const clearCopyTimers = () => {
  if (copyState.removeTimers.length) {
    copyState.removeTimers.forEach((timerId) => window.clearTimeout(timerId));
    copyState.removeTimers = [];
  }
};

const resolveBubbleSide = (stageValue) => (stageValue % 2 === 0 ? 'left' : 'right');
const isIntroOverlayActive = () => $('#introOverlay').hasClass('is-active');
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
  if ($bubble.hasClass('is-leaving')) return;
  if (!$bubble.parent().length) return;

  $bubble.removeClass('is-visible').addClass('is-leaving').attr('aria-hidden', 'true');
  queueBubbleTimer(() => {
    $bubble.remove();
  }, BUBBLE_REMOVE_MS);
};

const appendBubbleMessage = () => {
  if (!copyState.$stream || copyTexts.length === 0) return;

  const stage = copyState.stage % copyTexts.length;
  const side = resolveBubbleSide(stage);
  const slot = BUBBLE_SLOTS[copyState.slotIndex % BUBBLE_SLOTS.length];
  const $bubble = $(`
    <article class="speech-bubble-item ${slot} is-${side}" aria-hidden="true">
      <img class="speech-bubble-img" src="${bubbleSources[side]}" alt="" aria-hidden="true">
      <p class="bubble-copy-line"></p>
    </article>
  `);
  $bubble.find('.bubble-copy-line').html(copyTexts[stage]);
  copyState.$stream.append($bubble);
  fitBubbleText($bubble.find('.bubble-copy-line')[0]);

  requestAnimationFrame(() => {
    $bubble.addClass('is-visible').attr('aria-hidden', 'false');
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
      queueBubbleTimer(spawnNext, BUBBLE_ADD_MS);
      return;
    }

    queueBubbleTimer(() => {
      const $activeBubbles = copyState.$stream.children('.speech-bubble-item').not('.is-leaving');
      $activeBubbles.each((_, item) => {
        startBubbleLeave($(item));
      });

      queueBubbleTimer(() => {
        resetBubbleSequence();
        runBubbleSequence();
      }, BUBBLE_REMOVE_MS + BUBBLE_GROUP_GAP_MS);
    }, BUBBLE_ALL_HOLD_MS);
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
  const $stream = $('#speechStream');
  if ($stream.length === 0) return;
  copyState.$stream = $stream;
  clearCopyTimers();
  resetBubbleSequence();
  if ($('#introOverlay').length === 0 || !isIntroOverlayActive()) {
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
  const $videoModal = $('#videoModal');
  const $previewVideo = $('#previewVideo');
  const previewVideo = $previewVideo[0];
  if ($videoModal.length === 0 || !previewVideo) return;

  const nextSrc = src || DEFAULT_VIDEO;
  if ($previewVideo.attr('src') !== nextSrc) {
    $previewVideo.attr('src', nextSrc);
    previewVideo.currentTime = 0;
  }
  $videoModal.addClass('is-open').attr('aria-hidden', 'false');
  previewVideo.play().catch(() => {});
};

const closePreview = () => {
  const $videoModal = $('#videoModal');
  const $previewVideo = $('#previewVideo');
  const previewVideo = $previewVideo[0];
  if ($videoModal.length === 0 || !previewVideo) return;

  previewVideo.pause();
  $videoModal.removeClass('is-open').attr('aria-hidden', 'true');
};

const clearPreviewTimer = () => {
  if (!previewTimer) return;
  window.clearTimeout(previewTimer);
  previewTimer = 0;
};

const handleThumbEnter = (target, immediate = false) => {
  if (!target) return;
  const src = $(target).attr('data-video') || DEFAULT_VIDEO;
  clearPreviewTimer();
  if (immediate) {
    openPreview(src);
    return;
  }
  previewTimer = window.setTimeout(() => {
    openPreview(src);
    previewTimer = 0;
  }, PREVIEW_HOVER_DELAY_MS);
};

const setActiveThumb = (target) => {
  const $items = $('#thumbRow .thumb-item');
  if ($items.length === 0) return;
  $items.removeClass('is-selected');
  if (target) {
    $(target).addClass('is-selected');
  }
};

const getTouchThumbItems = () => $('#thumbTrack').children('.thumb-item');

const normalizeSlideIndex = (value, total) => {
  if (total <= 0) return 0;
  return ((value % total) + total) % total;
};

const syncTouchSlideState = () => {
  if (!document.body.classList.contains('is-touch')) return;
  const $row = $('#thumbRow');
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
  const $row = $('#thumbRow');
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
  const $previewVideo = $('#previewVideo');
  const previewVideo = $previewVideo[0];
  if (!previewVideo) return;
  const current = $previewVideo.attr('src');
  if (current && current !== DEFAULT_VIDEO) {
    openPreview(DEFAULT_VIDEO);
  }
};

const openImageModal = (imageSrc) => {
  if (!imageSrc) return;
  const resolvedSrc = new URL(imageSrc, window.location.href).href;
  const $imageModal = $('#imageModal');
  const $previewImage = $('#previewImage');
  if ($imageModal.length === 0 || $previewImage.length === 0) return;
  $previewImage.attr('src', resolvedSrc);
  $imageModal.addClass('is-open').attr('aria-hidden', 'false');
};

const closeImageModal = () => {
  const $imageModal = $('#imageModal');
  const $previewImage = $('#previewImage');
  if ($imageModal.length === 0 || $previewImage.length === 0) return;
  $imageModal.removeClass('is-open').attr('aria-hidden', 'true');
  $previewImage.attr('src', '');
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
  $panel.toggleClass('is-open', willOpen).attr('aria-hidden', String(!willOpen));
  if (willOpen) {
    $panel.removeAttr('inert');
  } else {
    $panel.attr('inert', '');
  }
  if ($backdrop && $backdrop.length) {
    $backdrop.toggleClass('is-open', willOpen).attr('aria-hidden', String(!willOpen));
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
  const $panel = $('#psPanel');
  const $backdrop = $('#psBackdrop');
  const $toggle = $('#psToggle');
  if ($panel.length === 0) return;
  const willOpen = typeof forceOpen === 'boolean' ? forceOpen : !$panel.hasClass('is-open');
  setDrawerState($panel, $backdrop, $toggle, willOpen);
};

const THUMB_SPEED = 90;
const MIN_THUMB_DURATION = 12;
const MAX_THUMB_DURATION = 36;
const THUMB_ARROW_HOLD_MS = 520;
let thumbArrowResumeTimer = 0;

const resolveThumbDistance = ($track) => {
  const track = $track[0];
  if (!track) return 0;

  const $items = $track.children('.thumb-item');
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
  const $track = $('#thumbTrack');
  if ($track.length === 0) return;
  const distance = resolveThumbDistance($track);
  if (!distance) return;
  const duration = clamp(distance / THUMB_SPEED, MIN_THUMB_DURATION, MAX_THUMB_DURATION);
  $track.css('--thumb-distance', `${distance.toFixed(2)}px`);
  $track.css('--thumb-duration', `${duration.toFixed(2)}s`);
};

const resolveThumbStep = ($track) => {
  const $items = $track.children('.thumb-item');
  const first = $items.get(0);
  const second = $items.get(1);
  if (!first) return 0;
  if (second) return Math.abs(second.offsetLeft - first.offsetLeft);
  return first.getBoundingClientRect().width;
};

const nudgeThumbLoop = (direction) => {
  const $track = $('#thumbTrack');
  if ($track.length === 0) return;

  const track = $track[0];
  const animation = track.getAnimations().find((item) => item.playState !== 'finished');
  if (!animation) return;

  const stepPx = resolveThumbStep($track);
  if (!stepPx) return;

  const computed = getComputedStyle(track);
  const distance = Number.parseFloat(computed.getPropertyValue('--thumb-distance')) || (track.scrollWidth / 2);
  if (!distance) return;

  const timing = animation.effect && animation.effect.getTiming ? animation.effect.getTiming() : null;
  const fallbackDuration = (Number.parseFloat(computed.getPropertyValue('--thumb-duration')) || 24) * 1000;
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
  const $thumbRow = $('#thumbRow');
  const $track = $('#thumbTrack');
  if ($thumbRow.length === 0 || $track.length === 0) return;

  if (document.body.classList.contains('is-touch')) {
    moveTouchSlide(step);
    return;
  }

  const stepPx = resolveThumbStep($track);
  if (!stepPx) return;

  $track.children('.thumb-item').removeClass('is-selected');
  nudgeThumbLoop(step);
  holdThumbLoopAfterArrow();
};

const resumeThumbLoop = () => {
  const $track = $('#thumbTrack');
  if ($track.length === 0) return;
  $track.css('animation-play-state', '');
};

const pauseThumbLoop = () => {
  const $track = $('#thumbTrack');
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
    document.body.classList.add('is-touch');
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

  const $thumbTrack = $('#thumbTrack');
  if (!touchDevice && $thumbTrack.length && !$thumbTrack.data('looped')) {
    $thumbTrack.data('looped', true);
    $thumbTrack.data('originalCount', $thumbTrack.children('.thumb-item').length);
    $thumbTrack.children().clone().appendTo($thumbTrack);
    updateThumbLoop();
  }
  if ($thumbTrack.length) {
    setActiveThumb($thumbTrack.find('.thumb-item').first());
  }
  if (touchDevice && $thumbTrack.length) {
    touchSlideState.total = $thumbTrack.children('.thumb-item').length;
    touchSlideState.index = 0;
  }

  const $thumbRow = $('#thumbRow');
  if ($thumbRow.length) {
    $thumbRow.on('pointerenter focusin click', '.thumb-item', function () {
      setActiveThumb(this);
      if (touchDevice) {
        touchSlideState.index = $(this).index();
      }
    });

    if (!touchDevice) {
      $thumbRow.on('pointerenter', () => {
        pauseThumbLoop();
      });
      $thumbRow.on('pointerenter', '.thumb-item', function () {
        handleThumbEnter(this);
      });
      $thumbRow.on('focusin', '.thumb-item', function () {
        pauseThumbLoop();
        handleThumbEnter(this, true);
      });
      $thumbRow.on('pointerleave', () => {
        handleThumbLeave();
        resumeThumbLoop();
      });
    }
    $thumbRow.on('click', '.thumb-action-preview', function (event) {
      event.preventDefault();
      event.stopPropagation();
      const $item = $(this).closest('.thumb-item');
      openImageModal($item.data('home'));
    });
    $thumbRow.on('click', '.thumb-action-detail', function () {
      // Keep marquee animation from staying paused after opening a new tab.
      this.blur();
      resumeThumbLoop();
    });
    if (!touchDevice) {
      $thumbRow.on('focusout', function (event) {
        if (!$.contains(this, event.relatedTarget)) {
          handleThumbLeave();
          resumeThumbLoop();
        }
      });
    } else {
      $thumbRow.on('scroll', () => {
        if (touchScrollSyncFrame) return;
        touchScrollSyncFrame = window.requestAnimationFrame(() => {
          touchScrollSyncFrame = 0;
          syncTouchSlideState();
        });
      });
    }
  }

  $('#thumbPrev').on('click', () => moveThumbSlide(-1));
  $('#thumbNext').on('click', () => moveThumbSlide(1));

  $('#previewVideo').on('error', handleVideoError);
  $('#imageModal').on('click', (event) => {
    if (event.target.id === 'imageModal') {
      closeImageModal();
    }
  });
  $('#imageModal').on('click', '.image-close', closeImageModal);
  $('#psToggle').on('click', () => togglePsPanel());
  $('#psPanel').on('click', '.drawer-close', () => togglePsPanel(false));

  $(window).on('load resize orientationchange', () => {
    updateThumbLoop();
    $('#speechStream .bubble-copy-line').each((_, item) => fitBubbleText(item));
    if (touchDevice) {
      touchSlideState.total = $('#thumbTrack').children('.thumb-item').length;
      syncTouchSlideState();
    }
  });
  $(window).on('focus pageshow', () => {
    const active = document.activeElement;
    if (active && active.closest && active.closest('#thumbRow')) {
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
