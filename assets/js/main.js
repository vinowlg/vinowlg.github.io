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

  // Header border on scroll
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
