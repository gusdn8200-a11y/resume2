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
let imageModalReturnFocusEl = null;
const PROGRAM_BADGE_IMAGE_SOURCES = {
  vue: './assets/img/details/vue_icon.png',
  react: './assets/img/details/react_icon.png',
};
const PROGRAM_BADGE_ICONS = {
  vue: `
    <svg viewBox="0 0 261.76 226.69" aria-hidden="true" focusable="false">
      <path fill="#41B883" d="M161.096 0L130.88 52.304 100.664 0H0l130.88 226.69L261.76 0z"></path>
      <path fill="#35495E" d="M161.096 0L130.88 52.304 100.664 0H48.32l82.56 143.04L213.44 0z"></path>
    </svg>
  `,
};
const HOME_TEMPLATE_DATA = {
  jinro: {
    title: '진로 글로벌',
    introLines: [
      '기존 랜딩은 제품 정보가 분산돼 비교·선택에 시간이 걸렸습니다.',
      '이를 개선하기 위해 랜딩 구조를 인지 → 비교 → 전환 흐름으로 재구성했습니다.',
    ],
    colors: [
      { dot: '#111111', code: '#111' },
      { dot: '#ff6a4d', code: '#ff6a4d' },
      { dot: '#f637b2', code: '#f637b2' },
    ],
    period: '5일',
    contribution: '100%',
    programBadges: [
      { type: 'html', label: '5' },
      { type: 'js', label: 'JS' },
      { type: 'css', label: '3' },
    ],
    introImage: './assets/img/details/m1.png',
    introAlt: '진로 메인 랜딩 미리보기',
    sections: [
      {
        image: './assets/img/details/1_1.png',
        alt: '히어로 섹션 시안',
        heading: '(히어로 캡션)',
        lines: [
          '· 히어로는 제품 비주얼을 크게 고정해 첫 인상을 강화했습니다.',
          '· CTA는 한 번에 보이도록 좌측에 배치했습니다.',
        ],
      },
      {
        image: './assets/img/details/1_2.png',
        alt: '추천 섹션 시안',
        heading: '(추천 섹션 캡션)',
        lines: [
          '· 도수·무드가 다른 제품을 카드로 나란히 비교하도록 구성했습니다.',
          '· 제품 보기 CTA로 상세 페이지 진입을 자연스럽게 유도했습니다.',
        ],
      },
      {
        image: './assets/img/details/1_3.png',
        alt: '뉴스레터 섹션 시안',
        heading: '(뉴스레터 캡션)',
        lines: [
          '· 뉴스레터 섹션은 SNS 콘텐츠를 그리드로 큐레이션해 브랜드 무드가 연속적으로 쌓이게 구성했습니다.',
          '· 동일한 라운드·간격 규칙을 유지해 섹션이 바뀌어도 시각 리듬이 끊기지 않도록 정리했습니다.',
        ],
      },
    ],
  },
  walld: {
    title: 'WALLD',
    introLines: [
      '대표 작업을 큼직한 갤러리 형태로 먼저 노출해 사이트의 정체성과 작업 스케일을 한 번에 보여주었습니다.',
      '상단 네비게이션은 최소 요소만 남기고 중앙 정렬로 배치해 콘텐츠 몰입을 방해하지 않도록 구성했습니다.',
    ],
    colors: [
      { dot: '#c50608', code: '#c50608' },
      { dot: '#151a20', code: '#151a20' },
      { dot: '#f3f4f6', code: '#f3f4f6' },
    ],
    period: '4일',
    contribution: '100%',
    programBadges: [
      { type: 'vue', label: 'VUE' },
    ],
    introImage: './assets/img/details/m2.png',
    introAlt: 'WALLD 상세 시안',
    sections: [
      {
        image: './assets/img/details/2_1.png',
        alt: 'WALLD 타임라인 섹션 시안',
        heading: '(타임라인 캡션)',
        lines: [
          '· 브랜드 성장 과정을 Vue 컴포넌트 기반 타임라인 섹션으로 구성해, 연도별 히스토리를 한눈에 확인할 수 있도록 구현했습니다.',
          '· 좌측 타이틀/우측 리스트를 데이터 바인딩(v-for) 구조로 분리해 핵심 이벤트만 빠르게 스캔되도록 가독성을 높였습니다.',
        ],
      },
      {
        image: './assets/img/details/2_2.png',
        alt: 'WALLD 포트폴리오 그리드 시안',
        heading: '(포트폴리오 그리드 캡션)',
        lines: [
          '· 실제 시공 이미지를 Vue 카드 그리드 컴포넌트로 정돈해, 다양한 작업을 빠르게 훑고 비교할 수 있도록 구현했습니다.',
          '· 카드 하단 정보 영역은 props로 고정 레이아웃을 유지하고, 콘텐츠는 배열 기반 렌더링으로 교체/확장이 쉽도록 구성했습니다.',
        ],
      },
      {
        image: './assets/img/details/2_3.png',
        alt: 'WALLD 컨택트 섹션 시안',
        heading: '(컨택트 캡션)',
        lines: [
          '· 좌측 타이틀/우측 폼을 Vue 섹션 컴포넌트로 분리해 문의 목적을 명확히 하고 입력 흐름을 단순화했습니다.',
          '· 입력 필드는 v-model로 상태를 관리하고, 제출 버튼은 폼 검증/전송 로직 이벤트 핸들링으로 묶어 전환 행동이 한 번에 끝나도록 설계했습니다.',
        ],
      },
    ],
  },
  kpet: {
    title: 'K-PETFAIR',
    introLines: [
      '기존 페이지는 전시 일정과 지역 정보가 분산돼 원하는 정보를 빠르게 찾기 어려웠습니다.',
      '이를 개선하기 위해 방문자가 한눈에 비교할 수 있도록 정보 우선순위를 재정렬했습니다.',
    ],
    colors: [
      { dot: '#0f1116', code: '#0f1116' },
      { dot: '#ff2d55', code: '#ff2d55' },
      { dot: '#ffffff', code: '#ffffff' },
    ],
    period: '4일',
    contribution: '100%',
    programBadges: [
      { type: 'html', label: '5' },
      { type: 'js', label: 'JS' },
      { type: 'css', label: '3' },
    ],
    introImage: './assets/img/details/m3.png',
    introAlt: 'K-PETFAIR 상세 시안',
    sections: [
      {
        image: './assets/img/details/3_1.png',
        alt: 'K-PETFAIR 전시일정 슬라이드 시안',
        heading: '(전시일정 슬라이드 캡션)',
        lines: [
          '· 전시 일정을 포스터 슬라이드로 구성해 날짜·지역을 한눈에 비교할 수 있게 했습니다.',
          '· 좌우 전환만으로 다음 일정으로 넘어가며 탐색 부담을 줄였습니다.',
        ],
      },
      {
        image: './assets/img/details/3_2.png',
        alt: 'K-PETFAIR 전시소개 갤러리 시안',
        heading: '(전시소개 갤러리 캡션)',
        lines: [
          '· 전시 현장 사진을 그리드로 모아 규모와 분위기를 한눈에 전달했습니다.',
          '· 텍스트 설명보다 이미지 중심으로 어떤 행사인지 빠르게 이해하게 했습니다.',
        ],
      },
      {
        image: './assets/img/details/3_3.png',
        alt: 'K-PETFAIR 전시 카테고리 시안',
        heading: '(전시 카테고리 캡션)',
        lines: [
          '· 카테고리별 대표 이미지를 카드 형태로 정리해, 전시 품목을 빠르게 훑을 수 있게 했습니다.',
          '· 한 화면에서 비교가 되도록 동일한 그리드/비율로 구성해 탐색 흐름을 단순화했습니다.',
        ],
      },
    ],
  },
  samsung: {
    title: 'Samsung Design',
    introLines: [
      '기존 페이지는 상단 정보 비중이 크고 콘텐츠 탐색이 스크롤 중심이라, 원하는 글을 빠르게 찾기 어려웠습니다. 타이틀/내비를 단순화하고 카드 그리드로 재구성해 첫 화면에서 주요 콘텐츠를 즉시 훑을 수 있게 개선했습니다.',
    ],
    colors: [
      { dot: '#111111', code: '#111111' },
      { dot: '#ffffff', code: '#ffffff' },
    ],
    period: '5일',
    contribution: '100%',
    programBadges: [
      { type: 'html', label: '5' },
      { type: 'js', label: 'JS' },
      { type: 'css', label: '3' },
    ],
    introImage: './assets/img/details/m4.png',
    introAlt: 'SAMSUNG DESIGN AWARDS 상세 시안',
    sections: [
      {
        image: './assets/img/details/4_1.png',
        alt: 'Samsung Design 그리드 시스템 시안',
        heading: '(그리드 시스템 캡션)',
        lines: [
          '· 콘텐츠를 카드 그리드로 구성해 제목과 요약, 이미지를 한 화면에서 빠르게 비교할 수 있게 했습니다.',
          '· 상단 내비와 본문 카드 비율을 고정해 섹션이 바뀌어도 시각 리듬이 유지되도록 설계했습니다.',
        ],
      },
      {
        image: './assets/img/details/4_2.png',
        alt: 'Samsung Design 뉴스레터 구독 폼 시안',
        heading: '(뉴스레터 구독 폼 캡션)',
        lines: [
          '· 입력 항목을 그리드로 정리해, 필요한 정보만 빠르게 작성할 수 있게 구성했습니다.',
          '· 수신 주기/관심 분야를 옵션으로 분리하고, CTA(구독하기)를 하단에 고정해 완료 흐름을 명확히 했습니다.',
        ],
      },
    ],
  },
  lemona: {
    title: 'LEMONA',
    introLines: [
      '기존 랜딩은 제품 정보가 분산돼 비교·선택에 시간이 걸렸습니다.',
      '이를 개선하기 위해 인지 → 비교 → 전환 흐름으로 재구성하고, React 컴포넌트로 섹션을 모듈화했습니다.',
    ],
    colors: [
      { dot: '#ffffff', code: '#ffffff' },
      { dot: '#222222', code: '#222222' },
      { dot: '#fee993', code: '#fee993' },
    ],
    period: '5일',
    contribution: '100%',
    programBadges: [
      { type: 'react', label: 'REACT' },
    ],
    introImage: './assets/img/details/m5.png',
    introAlt: 'LEMONA 상세 시안',
    sections: [
      {
        image: './assets/img/details/5_1.png',
        alt: 'LEMONA 신제품 섹션 시안',
        heading: '(신제품 캡션)',
        lines: [
          '· 신제품 섹션을 React 캐러셀 컴포넌트 기반으로 구성해, 한 화면에서 대표 제품 3개를 빠르게 탐색/선택할 수 있도록 구성했습니다.',
          '· 가격/할인 정보는 props로 분리해 하단 영역을 고정하고, 슬라이드 전환 시에도 정보 흐름이 끊기지 않도록 설계했습니다.',
        ],
      },
      {
        image: './assets/img/details/5_2.png',
        alt: 'LEMONA 브랜드 배너 시안',
        heading: '(브랜드 배너 캡션)',
        lines: [
          '· 브랜드 배너를 배경/키비주얼/카드 영역으로 분리한 React 섹션 컴포넌트로 구성해, 브랜드 톤앤매너를 일관되게 유지했습니다.',
          '· 우측 추천 상품 카드는 데이터 배열 기반 렌더링으로 구현해, 상품 교체/확장 시 코드 수정 비용을 최소화했습니다.',
        ],
      },
      {
        image: './assets/img/details/5_3.png',
        alt: 'LEMONA 리뷰 섹션 시안',
        heading: '(리뷰 섹션 캡션)',
        lines: [
          '· 실시간 리뷰 리스트 렌더링(데이터 기반) 그리드 컴포넌트로 구현해 이미지·별점·요약 정보를 빠르게 스캔할 수 있게 구성했습니다.',
          '· 더보기는 상태(state) 기반 인터랙션으로 처리해, 탐색 흐름을 유지하면서 핵심 리뷰만 우선 노출되도록 설계했습니다.',
        ],
      },
    ],
  },
  kauai: {
    title: '카우아이 씨앤씨',
    introLines: [
      '라운드 프레임/은은한 배경 그라데이션으로 시선을 중앙에 모으고, 네비·아이콘은 헤더에 고정해 접근성을 유지했습니다.',
    ],
    colors: [
      { dot: '#f6f2e8', code: '#f6f2e8' },
      { dot: '#162a2f', code: '#162a2f' },
      { dot: '#0e5f67', code: '#0e5f67' },
    ],
    period: '5일',
    contribution: '100%',
    programBadges: [
      { type: 'html', label: '5' },
      { type: 'js', label: 'JS' },
      { type: 'css', label: '3' },
    ],
    introImage: './assets/img/details/m6.png',
    introAlt: 'KAUAI COFFEE 상세 시안',
    sections: [
      {
        image: './assets/img/details/6_1.png',
        alt: '카우아이 원두 오리진 루트 카드 섹션 시안',
        heading: '(원두 오리진 루트 카드 섹션)',
        lines: [
          '· 원두가 컵에 담기기까지의 과정을 4개 카드로 나눠, 단계별 특징을 한 화면에서 빠르게 훑을 수 있게 구성했습니다.',
          '· 이미지 중심 카드 + 짧은 설명으로 정보 밀도를 줄이고, 동일한 그리드/라운드 스타일로 리듬감 있게 이어지도록 정리했습니다.',
        ],
      },
      {
        image: './assets/img/details/6_2.png',
        alt: '카우아이 뉴스레터 팔로우 CTA 섹션 시안',
        heading: '(뉴스레터·팔로우 CTA 섹션)',
        lines: [
          '· 원두/농장 소식을 가장 먼저 받을 수 있도록, 팔로우 아이콘과 뉴스레터 구독 폼을 한 영역에 묶어 CTA를 명확히 했습니다.',
          '· 좌측은 감성 이미지를 배치해 분위기를 유지하고, 우측은 입력+버튼을 크게 하여 가입 흐름이 빠르게 끝나도록 구성했습니다.',
        ],
      },
      {
        image: './assets/img/details/6_3.png',
        alt: '카우아이 블렌드 추천 폼 섹션 시안',
        heading: '(블렌드 추천 폼 섹션)',
        lines: [
          '· 무드와 향을 선택하면 어울리는 원두를 추천받을 수 있도록, 입력·버튼·결과 영역을 한 카드 안에 단순하게 구성했습니다.',
          '· 선택값에 따라 결과가 바로 갱신되는 구조로 만들어, 탐색 시간을 줄이고 맞춤 경험을 강조했습니다.',
        ],
      },
    ],
  },
};

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
const syncBackButtonVisibility = () => {
  const shouldHide = (
    $('#video_modal').hasClass('is_open') ||
    $('#image_modal').hasClass('is_open') ||
    $('#ps_panel').hasClass('is_open')
  );
  document.body.classList.toggle('is_cover_ui_open', shouldHide);
};

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
  syncBackButtonVisibility();
  preview_video.play().catch(() => {});
};

const closePreview = () => {
  const $video_modal = $('#video_modal');
  const $preview_video = $('#preview_video');
  const preview_video = $preview_video[0];
  if ($video_modal.length === 0 || !preview_video) return;

  preview_video.pause();
  $video_modal.removeClass('is_open').attr('aria-hidden', 'true');
  syncBackButtonVisibility();
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
  const offset = window.matchMedia('(max-width: 700px)').matches ? 6 : 8;
  const top = Math.max(offset, Math.round(cardRect.top + offset));
  const right = Math.max(offset, Math.round(window.innerWidth - cardRect.right + offset));

  $image_close.css({
    top: `${top}px`,
    right: `${right}px`,
  });
};

const parseImageSet = (rawSetValue) => (
  String(rawSetValue || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
);

const renderHomeTemplate = (templateKey) => {
  const data = HOME_TEMPLATE_DATA[templateKey];
  const $template = $('#preview_home_template');
  if (!data || $template.length === 0) return false;

  const introHtml = (data.introLines || [])
    .map((line) => $('<div>').text(line).html())
    .join('<br />');

  $('#home_tpl_title').text(data.title || '');
  $('#home_tpl_intro').html(introHtml);

  const colors = data.colors || [];
  [0, 1, 2].forEach((index) => {
    const color = colors[index];
    const $set = $(`#home_tpl_color${index + 1}_set`);
    const $dot = $(`#home_tpl_color${index + 1}_dot`);
    const $code = $(`#home_tpl_color${index + 1}_code`);
    if (!color) {
      $set.css('display', 'none');
      $dot.css('display', 'none');
      $code.css('display', 'none').text('');
      return;
    }
    $set.css('display', 'inline-flex');
    $dot.css({
      background: color.dot || '#111111',
      display: 'inline-block',
    });
    $code.css('display', '').text(color.code || '');
  });

  $('#home_tpl_period').text(data.period || '');
  $('#home_tpl_contribution').text(data.contribution || '');
  const $program = $('#home_tpl_program');
  $program.empty();
  const badges = Array.isArray(data.programBadges) ? data.programBadges : [];
  if (badges.length > 0) {
    badges.forEach((badge) => {
      const type = String(badge.type || 'text').replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'text';
      const $badge = $('<span>').addClass(`program-badge ${type}`);
      const iconImageSrc = PROGRAM_BADGE_IMAGE_SOURCES[type];
      const iconSvg = PROGRAM_BADGE_ICONS[type];
      if (iconImageSrc) {
        const resolvedIconImageSrc = new URL(iconImageSrc, window.location.href).href;
        $badge
          .addClass('is_icon')
          .attr('role', 'img')
          .attr('aria-label', `${type} icon`);
        $('<img>', {
          src: resolvedIconImageSrc,
          alt: '',
          decoding: 'async',
          loading: 'lazy',
          'aria-hidden': 'true',
        }).appendTo($badge);
      } else if (iconSvg) {
        $badge
          .addClass('is_icon')
          .attr('role', 'img')
          .attr('aria-label', `${type} icon`)
          .html(iconSvg);
      } else {
        $badge.text(String(badge.label || '').trim());
      }
      $badge.appendTo($program);
    });
  } else {
    $program.text(data.program || '');
  }

  const introImageSrc = new URL(data.introImage || '', window.location.href).href;
  $('#home_tpl_intro_image')
    .attr('src', introImageSrc)
    .attr('alt', data.introAlt || `${data.title || '상세'} 메인 시안`);

  const $sections = $('#home_tpl_sections');
  $sections.empty();
  (data.sections || []).forEach((section) => {
    const sectionImageSrc = new URL(section.image || '', window.location.href).href;
    const $section = $('<section>').addClass('content-section');
    $('<img>', {
      src: sectionImageSrc,
      alt: section.alt || `${data.title || '상세'} 섹션 시안`,
      class: 'section-image',
      loading: 'lazy',
      decoding: 'async',
    }).appendTo($section);
    $('<h2>').text(section.heading || '(상세 캡션)').appendTo($section);
    (section.lines || []).forEach((line) => {
      $('<p>').text(line).appendTo($section);
    });
    $sections.append($section);
  });

  return true;
};

const openImageModal = ({ imageSrc, imageSet = [], template = '' }) => {
  if (!imageSrc) return;
  const resolvedSrc = new URL(imageSrc, window.location.href).href;
  const $image_modal = $('#image_modal');
  const $image_card = $image_modal.find('.image_card');
  const $preview_image = $('#preview_image');
  const $preview_templates = $image_modal.find('.preview_home1');
  const $preview_stack = $('#preview_stack');
  if ($image_modal.length === 0 || $image_card.length === 0 || $preview_image.length === 0) return;

  const hasTemplateData = template ? renderHomeTemplate(template) : false;
  if (hasTemplateData) {
    if ($preview_templates.length) {
      $preview_templates.attr('hidden', '').attr('aria-hidden', 'true');
    }
    $('#preview_home_template').removeAttr('hidden').attr('aria-hidden', 'false');
    if ($preview_stack.length) {
      $preview_stack.attr('hidden', '').attr('aria-hidden', 'true').empty();
    }
    $preview_image.attr('src', '').attr('hidden', '').attr('aria-hidden', 'true');
    $image_card.addClass('is_home1');
    $image_modal.removeAttr('inert').addClass('is_open').attr('aria-hidden', 'false');
    syncBackButtonVisibility();
    requestAnimationFrame(positionImageCloseButton);
    return;
  }

  const normalizedSet = Array.isArray(imageSet) ? imageSet.filter(Boolean) : [];
  if (normalizedSet.length > 0 && $preview_stack.length) {
    if ($preview_templates.length) {
      $preview_templates.attr('hidden', '').attr('aria-hidden', 'true');
    }
    $preview_stack.empty();
    normalizedSet.forEach((src, index) => {
      const stackSrc = new URL(src, window.location.href).href;
      $('<img>', {
        src: stackSrc,
        alt: `detail preview ${index + 1}`,
        loading: index === 0 ? 'eager' : 'lazy',
        decoding: 'async',
      }).appendTo($preview_stack);
    });
    $preview_stack.removeAttr('hidden').attr('aria-hidden', 'false');
    $preview_image.attr('src', '').attr('hidden', '').attr('aria-hidden', 'true');
  } else {
    if ($preview_templates.length) {
      $preview_templates.attr('hidden', '').attr('aria-hidden', 'true');
    }
    if ($preview_stack.length) {
      $preview_stack.attr('hidden', '').attr('aria-hidden', 'true').empty();
    }
    $preview_image.attr('src', resolvedSrc).removeAttr('hidden').attr('aria-hidden', 'false');
  }
  $image_card.removeClass('is_home1');

  $image_modal.removeAttr('inert').addClass('is_open').attr('aria-hidden', 'false');
  syncBackButtonVisibility();
  requestAnimationFrame(positionImageCloseButton);
};

const closeImageModal = () => {
  const $image_modal = $('#image_modal');
  const $image_card = $image_modal.find('.image_card');
  const $preview_image = $('#preview_image');
  const $preview_templates = $image_modal.find('.preview_home1');
  const $preview_stack = $('#preview_stack');
  const $image_close = $image_modal.find('.image_close');
  if ($image_modal.length === 0 || $preview_image.length === 0) return;

  const modalEl = $image_modal[0];
  const active = document.activeElement;
  if (active && modalEl && modalEl.contains(active)) {
    const fallbackFocusEl = imageModalReturnFocusEl && document.contains(imageModalReturnFocusEl)
      ? imageModalReturnFocusEl
      : $('#thumb_row .thumb_item.is_selected').get(0);
    if (fallbackFocusEl && fallbackFocusEl.focus) {
      fallbackFocusEl.focus({ preventScroll: true });
    } else if (active.blur) {
      active.blur();
    }
  }
  imageModalReturnFocusEl = null;

  $image_modal.removeClass('is_open').attr('aria-hidden', 'true').attr('inert', '');
  $preview_image.attr('src', '').removeAttr('hidden').attr('aria-hidden', 'false');
  if ($preview_templates.length) {
    $preview_templates.attr('hidden', '').attr('aria-hidden', 'true');
  }
  if ($preview_stack.length) {
    $preview_stack.attr('hidden', '').attr('aria-hidden', 'true').empty();
  }
  if ($image_card.length) {
    $image_card.removeClass('is_home1');
  }
  $image_close.css({
    top: '',
    right: '',
  });
  syncBackButtonVisibility();
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
  syncBackButtonVisibility();
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

const isMobilePointerMode = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const isAutoThumbLoopDisabled = isMobilePointerMode;
const isPsFlipClickEnabled = isMobilePointerMode;

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
  syncBackButtonVisibility();

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
      imageModalReturnFocusEl = this;
      const imageSet = parseImageSet($item.attr('data-home-set'));
      const template = String($item.attr('data-home-template') || '').trim();
      openImageModal({
        imageSrc: $item.data('home'),
        imageSet,
        template,
      });
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
    if (!isPsFlipClickEnabled()) return;
    event.preventDefault();
    togglePsFlipCard(this);
    if (this.blur) this.blur();
  });
  $('#ps_panel').on('keydown', '.ps_main.ps_flip', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (!isPsFlipClickEnabled()) return;
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
    if (!isPsFlipClickEnabled()) {
      $('#ps_panel .ps_main.ps_flip').removeClass('is_flipped').attr('aria-pressed', 'false');
    }
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
