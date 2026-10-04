(function () {
  document.documentElement.classList.remove('no-js');

  // Mobile nav
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Header border on scroll (non-home pages only — home hides the header via CSS)
  var skyHero = document.querySelector('.sky-hero');
  var onScroll = function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
    if (skyHero) {
      header.classList.toggle('sky-mode', window.scrollY < skyHero.offsetHeight - 80);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Show brand logo in header once the hero "kali.ltd" name scrolls out of view
  var skyBrand = document.querySelector('.sky-brand');
  if (skyBrand) {
    var onScrollBrand = function () {
      header.classList.toggle('past-title', skyBrand.getBoundingClientRect().bottom < 20);
    };
    window.addEventListener('scroll', onScrollBrand, { passive: true });
    onScrollBrand();
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Kali mark animation: 6-arm star → K → inverted K flow, then idle every 60s
  (function () {
    var svg = document.getElementById('kali-mark-svg');
    if (!svg) return;

    var CX = 52, CY = 48;
    var lines = [], dots = [];
    for (var i = 0; i < 6; i++) {
      lines.push(document.getElementById('km-l' + i));
      dots.push(document.getElementById('km-d' + i));
    }
    var armsG = document.getElementById('km-arms');
    var dotsG = document.getElementById('km-dots');
    var wrap  = document.getElementById('hero-mark-wrap');

    function ep(i, x, y) {
      lines[i].setAttribute('x2', x.toFixed(1));
      lines[i].setAttribute('y2', y.toFixed(1));
      dots[i].setAttribute('cx', x.toFixed(1));
      dots[i].setAttribute('cy', y.toFixed(1));
    }
    function opa(i, a) {
      lines[i].style.opacity = a.toFixed(3);
      dots[i].style.opacity  = a.toFixed(3);
    }
    function rot(deg) {
      var tr = 'rotate(' + deg.toFixed(1) + ' ' + CX + ' ' + CY + ')';
      armsG.setAttribute('transform', tr);
      dotsG.setAttribute('transform', tr);
    }

    function easeOut3(t)   { return 1 - Math.pow(1 - t, 3); }
    function easeInOut3(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; }

    // Arc interpolation: sweeps along the shorter angular path while also
    // interpolating the radius, so arms follow a natural curving arc.
    function arcLerp(x1, y1, x2, y2, t) {
      var a1 = Math.atan2(y1 - CY, x1 - CX);
      var a2 = Math.atan2(y2 - CY, x2 - CX);
      var da = a2 - a1;
      if (da >  Math.PI) da -= 2 * Math.PI;
      if (da < -Math.PI) da += 2 * Math.PI;
      var r1 = Math.sqrt((x1-CX)*(x1-CX) + (y1-CY)*(y1-CY));
      var r2 = Math.sqrt((x2-CX)*(x2-CX) + (y2-CY)*(y2-CY));
      var a  = a1 + da * t;
      var r  = r1 + (r2 - r1) * t;
      return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
    }

    // Star: 6 arms at 60° intervals, r=40. arm4/5 fade out → K shape remains.
    var S = [
      {x:52, y:8 },  // 0  up
      {x:87, y:28},  // 1  upper-right  (K right diagonal → flips to IK upper-left)
      {x:87, y:68},  // 2  lower-right  (K right diagonal → flips to IK lower-left)
      {x:52, y:88},  // 3  down
      {x:17, y:68},  // 4  lower-left   (fades during spin)
      {x:17, y:28}   // 5  upper-left   (fades during spin)
    ];

    // Inverted K final positions
    var IK = [
      {x:52, y:9 },
      {x:11, y:21},
      {x:11, y:78},
      {x:52, y:87}
    ];

    // ---- Idle animation: plays every 60 s after the intro settles ----
    // Sequence: arm 1 alone swings to K and back,
    //           pause, then both arms 1+2 swing to K and back.
    function scheduleIdle() {
      setTimeout(function runIdle() {
        var t0 = null;
        // Keyframes (ms): [0] arm1→K, [600] arm1→IK, [1200] pause,
        //                 [1600] both→K, [2200] both→IK, [2800] done
        var SEG = 600;

        function idleTick(ts) {
          if (!t0) t0 = ts;
          var e  = ts - t0;
          var t, p, p1, p2;

          if (e < SEG) {                           // arm 1 → K
            t = easeInOut3(e / SEG);
            p = arcLerp(IK[1].x, IK[1].y, S[1].x, S[1].y, t);
            ep(1, p.x, p.y);

          } else if (e < SEG * 2) {               // arm 1 → IK
            t = easeInOut3((e - SEG) / SEG);
            p = arcLerp(S[1].x, S[1].y, IK[1].x, IK[1].y, t);
            ep(1, p.x, p.y);

          } else if (e < SEG * 2 + 400) {         // pause
            ep(1, IK[1].x, IK[1].y);

          } else if (e < SEG * 2 + 400 + SEG) {   // both → K
            t  = easeInOut3((e - SEG*2 - 400) / SEG);
            p1 = arcLerp(IK[1].x, IK[1].y, S[1].x, S[1].y, t);
            p2 = arcLerp(IK[2].x, IK[2].y, S[2].x, S[2].y, t);
            ep(1, p1.x, p1.y);
            ep(2, p2.x, p2.y);

          } else if (e < SEG * 3 + 400 + SEG) {   // both → IK
            t  = easeInOut3((e - SEG*2 - 400 - SEG) / SEG);
            p1 = arcLerp(S[1].x, S[1].y, IK[1].x, IK[1].y, t);
            p2 = arcLerp(S[2].x, S[2].y, IK[2].x, IK[2].y, t);
            ep(1, p1.x, p1.y);
            ep(2, p2.x, p2.y);

          } else {                                  // settled — schedule next
            ep(1, IK[1].x, IK[1].y);
            ep(2, IK[2].x, IK[2].y);
            scheduleIdle();
            return;
          }
          requestAnimationFrame(idleTick);
        }
        requestAnimationFrame(idleTick);
      }, 60000);
    }

    // ---- Intro animation: spin → K hold → scissors flip to inverted K ----
    var phase = 0, phaseT = null, t0 = null;

    function tick(ts) {
      if (!t0) { t0 = ts; phaseT = ts; }
      var e = ts - phaseT;

      if (phase === 0) {
        // Spin 3 full rotations (1080°), easing out
        var t  = Math.min(e / 1600, 1);
        rot(1080 * easeOut3(t));
        var ft = Math.max(0, (t - 0.45) / 0.55);
        opa(4, 1 - easeInOut3(ft));
        opa(5, 1 - easeInOut3(ft));
        if (t >= 1) { phase = 1; phaseT = ts; rot(0); opa(4, 0); opa(5, 0); }

      } else if (phase === 1) {
        // Hold as regular K for 850 ms
        if (e >= 850) { phase = 2; phaseT = ts; }

      } else if (phase === 2) {
        // Scissors flip: arms 1 & 2 arc from right-side to left-side
        var t  = Math.min(e / 1200, 1);
        var et = easeInOut3(t);
        var p1 = arcLerp(S[1].x, S[1].y, IK[1].x, IK[1].y, et);
        var p2 = arcLerp(S[2].x, S[2].y, IK[2].x, IK[2].y, et);
        ep(1, p1.x, p1.y);
        ep(2, p2.x, p2.y);
        if (t >= 1) {
          ep(1, IK[1].x, IK[1].y);
          ep(2, IK[2].x, IK[2].y);
          if (wrap) wrap.classList.add('floating');
          scheduleIdle();
          return;
        }
      }
      requestAnimationFrame(tick);
    }

    setTimeout(function () { requestAnimationFrame(tick); }, 250);
  }());

  // Sky hero — twinkling stars + northern lights aurora on canvas
  var skyCanvas = document.getElementById('sky-canvas');
  if (skyCanvas) {
    var ctx = skyCanvas.getContext('2d');
    var W, H, stars = [];

    // Draw a 4-pointed AI sparkle star (very slim waist, elongated points)
    function drawSparkle(x, y, r, rot) {
      var k = r * 0.18;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo( k, -k); ctx.lineTo( r,  0);
      ctx.lineTo( k,  k); ctx.lineTo( 0,  r);
      ctx.lineTo(-k,  k); ctx.lineTo(-r,  0);
      ctx.lineTo(-k, -k);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function skyResize() {
      W = skyCanvas.width = skyCanvas.offsetWidth || window.innerWidth;
      H = skyCanvas.height = skyCanvas.offsetHeight || window.innerHeight;
      var count = Math.round(W * H / 5000);
      stars = [];
      for (var i = 0; i < count; i++) {
        var sparkle = Math.random() < 0.10; // ~10 % are 4-pointed sparkles
        stars.push({
          x:       Math.random() * W,
          y:       Math.random() * H * 0.68,
          r:       sparkle ? Math.random() * 2.2 + 1.2 : Math.random() * 1.3 + 0.3,
          phase:   Math.random() * Math.PI * 2,
          spd:     sparkle ? Math.random() * 0.012 + 0.006 : Math.random() * 0.005 + 0.0015,
          sparkle: sparkle,
          rot:     Math.random() * Math.PI,
          rotSpd:  (Math.random() - 0.5) * 0.003
        });
      }
    }
    skyResize();
    window.addEventListener('resize', skyResize, { passive: true });

    function frame() {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.phase += s.spd;

        if (s.sparkle) {
          // 4-pointed sparkle: sharp in/out pulse, slow rotation
          s.rot += s.rotSpd;
          var raw = Math.sin(s.phase);
          // Spend most time dim, flash bright
          var a = raw > 0.6 ? (raw - 0.6) / 0.4 * 0.95 : 0;
          if (a <= 0) continue;
          ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
          drawSparkle(s.x, s.y, s.r, s.rot);
        } else {
          // Regular circular star: gentle twinkle
          var a = (Math.sin(s.phase) * 0.5 + 0.5) * 0.70 + 0.12;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
          ctx.fill();
        }
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Contact form — static site, delivered by FormSubmit (https://formsubmit.co)
  var form = document.getElementById('contact-form');
  if (!form) return;

  // Preselect interest from ?topic=ai|automation|training
  var topic = new URLSearchParams(location.search).get('topic');
  if (topic) {
    var box = form.querySelector('input[name="interest"][value="' + topic + '"]');
    if (box) box.checked = true;
  }

  var status = document.getElementById('form-status');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.reportValidity()) return;

    var data = new FormData(form);
    var interests = data.getAll('interest');
    var payload = {
      name: data.get('name'),
      email: data.get('email'),
      company: data.get('company') || '-',
      interests: interests.length ? interests.join(', ') : '-',
      message: data.get('message'),
      _subject: 'kali.ltd enquiry from ' + data.get('name'),
      _replyto: data.get('email'),
      _template: 'table',
      _honey: data.get('_honey') || ''
    };

    button.disabled = true;
    button.firstChild.textContent = 'Sending… ';
    status.className = 'form-status';

    fetch(form.getAttribute('data-endpoint'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok || String(res.body.success) !== 'true') throw new Error(res.body.message || 'Send failed');
        form.reset();
        status.textContent = 'Thank you — your message is on its way. We’ll be in touch shortly.';
        status.className = 'form-status ok';
      })
      .catch(function () {
        status.innerHTML = 'Sorry, the message could not be sent. Please email us directly at ' +
          '<a href="mailto:vino.kali.ltd@gmail.com">vino.kali.ltd@gmail.com</a>.';
        status.className = 'form-status err';
      })
      .finally(function () {
        button.disabled = false;
        button.firstChild.textContent = 'Send message ';
      });
  });
})();
