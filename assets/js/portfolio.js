/* Portfolio — Park Hyunwoo */

(function () {
  const intro     = document.getElementById('intro');
  const btn       = document.getElementById('introEnter');
  const line1     = document.getElementById('introLine1');
  const line2     = document.getElementById('introLine2');
  const main      = document.getElementById('main');
  const particles = document.getElementById('introParticles');

  if (!intro || !btn) return;

  if (particles) {
    for (let i = 0; i < 24; i++) {
      const d = document.createElement('div');
      d.className = 'intro__particle';
      const size = Math.random() * 3 + 1.5;
      d.style.cssText = [
        `width:${size}px`, `height:${size}px`,
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `animation-duration:${Math.random() * 9 + 7}s`,
        `animation-delay:-${Math.random() * 6}s`,
        `opacity:${(Math.random() * 0.35 + 0.07).toFixed(2)}`
      ].join(';');
      particles.appendChild(d);
    }
  }

  const buildLine = (el, word) => {
    el.innerHTML = '';
    [...word].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'intro__letter';
      s.textContent = ch === ' ' ? '\u00a0' : ch;
      s.style.transitionDelay = `${i * 0.07}s`;
      el.appendChild(s);
    });
  };
  buildLine(line1, 'PARK');
  buildLine(line2, 'HYUNWOO');

  setTimeout(() => {
    document.querySelectorAll('.intro__letter').forEach(l => l.classList.add('in'));
  }, 1400);

  const dismiss = () => {
    intro.classList.add('leaving');
    setTimeout(() => {
      intro.style.display = 'none';
      document.body.classList.remove('intro-lock');
      if (main) main.style.visibility = '';
    }, 950);
  };

  const reopen = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    intro.style.display = '';
    requestAnimationFrame(() => {
      intro.classList.remove('leaving');
      document.body.classList.add('intro-lock');
      if (main) main.style.visibility = 'hidden';
      document.querySelectorAll('.intro__letter').forEach(l => {
        l.classList.remove('in');
        l.style.transitionDuration = '0s';
      });
      requestAnimationFrame(() => {
        document.querySelectorAll('.intro__letter').forEach(l => {
          l.style.transitionDuration = '';
          setTimeout(() => l.classList.add('in'), 80);
        });
      });
    });
  };

  btn.addEventListener('click', dismiss);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !intro.classList.contains('leaving')) dismiss();
  });

  window._introReopen = reopen;
})();


(function () {
  const target = document.getElementById('typeTarget');
  if (!target) return;

  const phrases = ['설계합니다.', '구현합니다.', '고민합니다.', '만듭니다.'];
  let pi = 0, ci = 0, del = false;

  const type = () => {
    const cur = phrases[pi];
    if (!del) {
      ci++;
      target.textContent = cur.slice(0, ci);
      if (ci === cur.length) { del = true; setTimeout(type, 1800); return; }
      setTimeout(type, 90);
    } else {
      ci--;
      target.textContent = cur.slice(0, ci);
      if (ci === 0) {
        del = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(type, 380);
        return;
      }
      setTimeout(type, 48);
    }
  };
  setTimeout(type, 600);
})();


const glow = document.getElementById('cursorGlow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
} else if (glow) {
  glow.style.display = 'none';
}


const progressBar  = document.getElementById('scrollProgress');
const nav          = document.getElementById('nav');
const navLinks     = document.querySelectorAll('.nav__links a[data-nav]');
const sections     = document.querySelectorAll('main section[id]');
const heroGrid     = document.getElementById('heroGrid');
const heroGhost    = document.querySelector('.hero__ghost');
const floatBtns    = document.getElementById('floatBtns');
const introBackBtn = document.getElementById('btnIntro');
const aboutPhoto   = document.querySelector('.about__photo-wrap');

const onScroll = () => {
  const s  = window.scrollY;
  const dh = document.documentElement.scrollHeight - window.innerHeight;

  if (progressBar) progressBar.style.width = (s / dh * 100) + '%';
  nav.classList.toggle('scrolled', s > 40);

  let current = '';
  const atBottom = s + window.innerHeight >= document.documentElement.scrollHeight - 60;

  if (atBottom) {
    const last = Array.from(sections).filter(sec =>
      document.querySelector(`.nav__links a[data-nav="${sec.id}"]`)
    ).pop();
    if (last) current = last.id;
  } else {
    sections.forEach(sec => { if (s >= sec.offsetTop - 140) current = sec.id; });
  }

  navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === current));

  if (s < window.innerHeight) {
    if (heroGrid)  heroGrid.style.transform  = `translateY(${s * 0.18}px)`;
    if (heroGhost) heroGhost.style.transform = `translateY(${s * 0.08}px)`;
  }

  if (aboutPhoto) {
    const rect = aboutPhoto.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.06;
      aboutPhoto.style.transform = `translateY(${offset}px)`;
    }
  }

  if (floatBtns)    floatBtns.classList.toggle('visible', s > 400);
  if (introBackBtn) introBackBtn.classList.toggle('visible', s > 400);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();


const toggle     = document.querySelector('.nav__toggle');
const mobileMenu = document.getElementById('mobileMenu');
if (toggle && mobileMenu) {
  const open  = () => { toggle.setAttribute('aria-expanded','true');  mobileMenu.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; };
  const close = () => { toggle.setAttribute('aria-expanded','false'); mobileMenu.setAttribute('aria-hidden','true');  document.body.style.overflow=''; };
  toggle.addEventListener('click', () => toggle.getAttribute('aria-expanded') === 'true' ? close() : open());
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close();
  });
}


const btnTop       = document.getElementById('btnTop');
const btnIntroBack = document.getElementById('btnIntro');

if (btnTop) btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
if (btnIntroBack && window._introReopen) btnIntroBack.addEventListener('click', window._introReopen);


document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -56px 0px' });
  revealEls.forEach(el => io.observe(el));
}


const projItems = document.querySelectorAll('.proj.reveal');
if (projItems.length) {
  const cols = window.innerWidth > 960 ? 3 : window.innerWidth > 560 ? 2 : 1;
  const pIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const idx = Array.from(projItems).indexOf(e.target);
      e.target.style.transitionDelay = `${(idx % cols) * 90}ms`;
      e.target.classList.add('in-view');
      pIO.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  projItems.forEach(el => pIO.observe(el));
}

if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.proj').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, background 0.35s, box-shadow 0.35s';
    });
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 7;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 7;
      card.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(4px)`;
      card.style.boxShadow = `${-x * 2}px ${y * 2}px 30px rgba(0,0,0,0.35)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s var(--ease), background 0.35s, box-shadow 0.5s';
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
  });
}


if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}


const countEls = document.querySelectorAll('.stat__num[data-target]');
const animCount = el => {
  const target = parseInt(el.dataset.target, 10);
  let cur = 0;
  const t = setInterval(() => {
    cur += target / (1500 / 16);
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur);
  }, 16);
};
if (countEls.length) {
  const cIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (!e.isIntersecting) return; animCount(e.target); cIO.unobserve(e.target); });
  }, { threshold: 0.5 });
  countEls.forEach(el => cIO.observe(el));
}

const statEls = document.querySelectorAll('.stat');
if (statEls.length) {
  statEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; });
  const sIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const idx = Array.from(statEls).indexOf(e.target);
      e.target.style.transition = `opacity 0.65s ${idx * 90}ms var(--ease), transform 0.65s ${idx * 90}ms var(--ease)`;
      requestAnimationFrame(() => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; });
      sIO.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  statEls.forEach(el => sIO.observe(el));
}


const skillGroups = document.querySelectorAll('.about__skills.reveal');
if (skillGroups.length) {
  const skIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-col__list li').forEach((li, i) => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(-14px)';
        li.style.transition = `opacity 0.5s ${i * 65}ms var(--ease), transform 0.5s ${i * 65}ms var(--ease)`;
        requestAnimationFrame(() => { li.style.opacity = '1'; li.style.transform = 'translateX(0)'; });
      });
      skIO.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  skillGroups.forEach(el => skIO.observe(el));
}


const timelineEl = document.querySelector('.timeline.reveal');
if (timelineEl) {
  const tlIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.timeline__item').forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(18px)';
        item.style.transition = `opacity 0.6s ${i * 130}ms var(--ease), transform 0.6s ${i * 130}ms var(--ease)`;
        requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; });
      });
      tlIO.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  tlIO.observe(timelineEl);
}


document.querySelectorAll('.marquee').forEach(m => {
  m.addEventListener('mouseenter', () => m.querySelector('.marquee__track').style.animationPlayState = 'paused');
  m.addEventListener('mouseleave', () => m.querySelector('.marquee__track').style.animationPlayState = 'running');
});


const capItems = document.querySelectorAll('.cap-card.reveal');
if (capItems.length) {
  const capIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const idx = Array.from(capItems).indexOf(e.target);
      e.target.style.transitionDelay = `${idx * 100}ms`;
      e.target.classList.add('in-view');
      capIO.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  capItems.forEach(el => capIO.observe(el));
}
