/* AirData — Air Quality Monitoring Dashboard */

// ── Mock Data ──────────────────────────────────────────────────────────────

const DATA = {
  current: {
    '서울': { pm25: 19, pm10: 35, o3: 0.041, no2: 0.028 },
    '경기': { pm25: 23, pm10: 41, o3: 0.039, no2: 0.032 },
    '인천': { pm25: 26, pm10: 44, o3: 0.045, no2: 0.036 },
    '부산': { pm25: 11, pm10: 21, o3: 0.027, no2: 0.016 },
    '대구': { pm25: 21, pm10: 38, o3: 0.040, no2: 0.030 }
  },
  weekly: {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    '서울': { pm25: [18, 24, 21, 35, 28, 16, 19], pm10: [32, 45, 38, 61, 52, 31, 35] },
    '경기': { pm25: [22, 31, 26, 42, 33, 19, 23], pm10: [38, 55, 47, 72, 58, 35, 41] },
    '인천': { pm25: [25, 33, 29, 45, 36, 21, 26], pm10: [42, 58, 51, 78, 63, 38, 44] },
    '부산': { pm25: [9,  13, 10, 16, 12,  8, 11], pm10: [17, 23, 18, 28, 21, 15, 21] },
    '대구': { pm25: [19, 26, 22, 38, 29, 17, 21], pm10: [35, 48, 40, 65, 52, 32, 38] }
  },
  stations: {
    '서울': [
      { name: '중구',   pm25: 18, pm10: 32, o3: 0.041, no2: 0.028 },
      { name: '강남구', pm25: 22, pm10: 38, o3: 0.038, no2: 0.031 },
      { name: '마포구', pm25: 19, pm10: 35, o3: 0.043, no2: 0.027 },
      { name: '노원구', pm25: 15, pm10: 29, o3: 0.036, no2: 0.024 }
    ],
    '경기': [
      { name: '수원시', pm25: 24, pm10: 43, o3: 0.040, no2: 0.033 },
      { name: '성남시', pm25: 21, pm10: 39, o3: 0.037, no2: 0.030 },
      { name: '부천시', pm25: 27, pm10: 47, o3: 0.043, no2: 0.036 },
      { name: '군포시', pm25: 20, pm10: 37, o3: 0.038, no2: 0.029 }
    ],
    '인천': [
      { name: '중구',   pm25: 28, pm10: 47, o3: 0.047, no2: 0.038 },
      { name: '남동구', pm25: 25, pm10: 43, o3: 0.044, no2: 0.035 },
      { name: '연수구', pm25: 23, pm10: 41, o3: 0.042, no2: 0.033 },
      { name: '부평구', pm25: 26, pm10: 45, o3: 0.046, no2: 0.037 }
    ],
    '부산': [
      { name: '중구',    pm25: 11, pm10: 20, o3: 0.026, no2: 0.016 },
      { name: '해운대구', pm25: 9,  pm10: 18, o3: 0.024, no2: 0.014 },
      { name: '사하구',  pm25: 14, pm10: 25, o3: 0.031, no2: 0.020 },
      { name: '북구',    pm25: 12, pm10: 22, o3: 0.028, no2: 0.017 }
    ],
    '대구': [
      { name: '중구',   pm25: 22, pm10: 39, o3: 0.041, no2: 0.031 },
      { name: '달서구', pm25: 20, pm10: 37, o3: 0.039, no2: 0.029 },
      { name: '북구',   pm25: 23, pm10: 41, o3: 0.042, no2: 0.032 },
      { name: '수성구', pm25: 19, pm10: 35, o3: 0.038, no2: 0.028 }
    ]
  }
};

// ── Grade ──────────────────────────────────────────────────────────────────

const GRADE_DEF = {
  pm25: [
    { max: 15,       label: '좋음',   cls: 'good' },
    { max: 35,       label: '보통',   cls: 'moderate' },
    { max: 75,       label: '나쁨',   cls: 'bad' },
    { max: Infinity, label: '매우나쁨', cls: 'very-bad' }
  ],
  pm10: [
    { max: 30,       label: '좋음',   cls: 'good' },
    { max: 80,       label: '보통',   cls: 'moderate' },
    { max: 150,      label: '나쁨',   cls: 'bad' },
    { max: Infinity, label: '매우나쁨', cls: 'very-bad' }
  ],
  o3: [
    { max: 0.030,    label: '좋음',   cls: 'good' },
    { max: 0.090,    label: '보통',   cls: 'moderate' },
    { max: 0.150,    label: '나쁨',   cls: 'bad' },
    { max: Infinity, label: '매우나쁨', cls: 'very-bad' }
  ],
  no2: [
    { max: 0.030,    label: '좋음',   cls: 'good' },
    { max: 0.060,    label: '보통',   cls: 'moderate' },
    { max: 0.200,    label: '나쁨',   cls: 'bad' },
    { max: Infinity, label: '매우나쁨', cls: 'very-bad' }
  ]
};

const GRADE_ORDER = ['good', 'moderate', 'bad', 'very-bad'];
const BAR_MAX     = { pm25: 75, pm10: 150, o3: 0.150, no2: 0.200 };
const METRICS     = [
  { key: 'pm25', label: 'PM2.5', unit: 'μg/m³' },
  { key: 'pm10', label: 'PM10',  unit: 'μg/m³' },
  { key: 'o3',   label: 'O₃',   unit: 'ppm' },
  { key: 'no2',  label: 'NO₂',  unit: 'ppm' }
];

const getGrade = (type, val) => GRADE_DEF[type].find(g => val <= g.max);

const getOverallGrade = (d) =>
  [getGrade('pm25', d.pm25), getGrade('pm10', d.pm10), getGrade('o3', d.o3), getGrade('no2', d.no2)]
    .reduce((a, b) => GRADE_ORDER.indexOf(a.cls) >= GRADE_ORDER.indexOf(b.cls) ? a : b);

// ── DOM refs ───────────────────────────────────────────────────────────────

const regionSelect = document.getElementById('regionSelect');
const gradeBadge   = document.getElementById('gradeBadge');
const headerRegion = document.getElementById('headerRegion');
const metricsGrid  = document.getElementById('metricsGrid');
const stationsGrid = document.getElementById('stationsGrid');
const navTime      = document.getElementById('navTime');
const headerDate   = document.getElementById('headerDate');

// ── Time ───────────────────────────────────────────────────────────────────

const setTime = () => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const yy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  navTime.textContent     = `${yy}.${mm}.${dd} ${hh}:00 업데이트`;
  headerDate.textContent  = `${yy}년 ${mm}월 ${dd}일 ${hh}시 기준`;
};

// ── Grade badge ────────────────────────────────────────────────────────────

const renderGrade = (region) => {
  const g = getOverallGrade(DATA.current[region]);
  gradeBadge.textContent  = g.label;
  gradeBadge.dataset.grade = g.cls;
  headerRegion.textContent = region;
};

// ── Metric cards ───────────────────────────────────────────────────────────

const renderMetrics = (region) => {
  const d = DATA.current[region];
  metricsGrid.innerHTML = METRICS.map(({ key, label, unit }) => {
    const g    = getGrade(key, d[key]);
    const pct  = Math.min((d[key] / BAR_MAX[key]) * 100, 100).toFixed(1);
    const disp = (key === 'o3' || key === 'no2') ? d[key].toFixed(3) : d[key];
    return `
      <li class="metric-card" data-grade="${g.cls}" role="listitem">
        <div class="metric-card__top">
          <span class="metric-card__name">${label}</span>
          <span class="metric-card__grade-tag grade-tag--${g.cls}">${g.label}</span>
        </div>
        <span class="metric-card__val">${disp}</span>
        <span class="metric-card__unit">${unit}</span>
        <div class="metric-card__bar-wrap">
          <div class="metric-card__bar-fill" style="--w:${pct}%"></div>
        </div>
      </li>`;
  }).join('');
};

// ── Chart ──────────────────────────────────────────────────────────────────

let chart = null;

const isDark    = () => document.documentElement.dataset.theme !== 'light';
const pm25Color = () => isDark() ? '#c8ff57' : '#4d8c00';
const pm10Color = () => isDark() ? '#60a5fa' : '#2563eb';
const gridColor = () => isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
const tickColor = () => isDark() ? '#666' : '#999';
const tooltipBg = () => isDark() ? '#1a1a1a' : '#ffffff';
const tooltipBd = () => isDark() ? '#333333' : '#e0e0da';
const tooltipFg = () => isDark() ? '#efefef' : '#111111';

const renderChart = (region) => {
  const w = DATA.weekly[region];

  if (chart) {
    chart.data.datasets[0].data         = w.pm25;
    chart.data.datasets[0].borderColor  = pm25Color();
    chart.data.datasets[0].pointBackgroundColor = pm25Color();
    chart.data.datasets[1].data         = w.pm10;
    chart.data.datasets[1].borderColor  = pm10Color();
    chart.data.datasets[1].pointBackgroundColor = pm10Color();
    chart.options.scales.x.ticks.color  = tickColor();
    chart.options.scales.y.ticks.color  = tickColor();
    chart.options.scales.x.grid.color   = gridColor();
    chart.options.scales.y.grid.color   = gridColor();
    chart.options.plugins.tooltip.backgroundColor = tooltipBg();
    chart.options.plugins.tooltip.borderColor     = tooltipBd();
    chart.options.plugins.tooltip.titleColor      = tooltipFg();
    chart.update('active');
    return;
  }

  const ctx = document.getElementById('weeklyChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: DATA.weekly.labels,
      datasets: [
        {
          label: 'PM2.5',
          data: w.pm25,
          borderColor: pm25Color(),
          backgroundColor: 'transparent',
          pointBackgroundColor: pm25Color(),
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 1.5,
          tension: 0.4
        },
        {
          label: 'PM10',
          data: w.pm10,
          borderColor: pm10Color(),
          backgroundColor: 'transparent',
          pointBackgroundColor: pm10Color(),
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 1.5,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tooltipBg(),
          borderColor:      tooltipBd(),
          borderWidth: 1,
          titleColor:  tooltipFg(),
          bodyColor:   tickColor(),
          padding: 10,
          titleFont: { family: "'JetBrains Mono', monospace", size: 11 },
          bodyFont:  { family: "'JetBrains Mono', monospace", size: 11 },
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} μg/m³`
          }
        }
      },
      scales: {
        x: {
          grid:   { color: gridColor() },
          ticks:  { color: tickColor(), font: { family: "'JetBrains Mono', monospace", size: 10 } },
          border: { display: false }
        },
        y: {
          grid:   { color: gridColor() },
          ticks:  { color: tickColor(), font: { family: "'JetBrains Mono', monospace", size: 10 }, stepSize: 20 },
          border: { display: false }
        }
      }
    }
  });
};

// ── Stations ───────────────────────────────────────────────────────────────

const renderStations = (region) => {
  stationsGrid.innerHTML = DATA.stations[region].map(s => {
    const g = getOverallGrade(s);
    return `
      <div class="station-card" role="listitem">
        <p class="station-card__name">
          <span class="station-dot dot--${g.cls}"></span>
          ${s.name}
        </p>
        <div class="station-card__rows">
          <div class="station-card__row">
            <span class="station-card__key">PM2.5</span>
            <span class="station-card__val">${s.pm25} μg/m³</span>
          </div>
          <div class="station-card__row">
            <span class="station-card__key">PM10</span>
            <span class="station-card__val">${s.pm10} μg/m³</span>
          </div>
          <div class="station-card__row">
            <span class="station-card__key">O₃</span>
            <span class="station-card__val">${s.o3.toFixed(3)} ppm</span>
          </div>
          <div class="station-card__row">
            <span class="station-card__key">NO₂</span>
            <span class="station-card__val">${s.no2.toFixed(3)} ppm</span>
          </div>
        </div>
      </div>`;
  }).join('');
};

// ── Update ─────────────────────────────────────────────────────────────────

const update = (region) => {
  renderGrade(region);
  renderMetrics(region);
  renderChart(region);
  renderStations(region);
};

// ── Events ─────────────────────────────────────────────────────────────────

regionSelect.addEventListener('change', () => update(regionSelect.value));

// ── Init ───────────────────────────────────────────────────────────────────

setTime();
update('서울');
