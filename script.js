// Panther Auto Care interactions: nav, bubbles, reveals, forms, FAQ, footer year.
(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile menu: real toggle with Escape support.
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.hasAttribute("hidden");
      if (open) {
        menu.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");
      } else {
        menu.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hasAttribute("hidden")) {
        menu.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Soap bubbles in hero: decorative only, respects reduced motion.
  var field = document.getElementById("bubble-field");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (field && !reduce) {
    for (var i = 0; i < 16; i++) {
      var b = document.createElement("span");
      b.className = "bubble";
      var size = 6 + Math.random() * 22;
      b.style.width = size + "px";
      b.style.height = size + "px";
      b.style.left = Math.random() * 100 + "%";
      b.style.animationDuration = 7 + Math.random() * 9 + "s";
      b.style.animationDelay = -(Math.random() * 10) + "s";
      b.style.opacity = String(0.25 + Math.random() * 0.5);
      field.appendChild(b);
    }
  }

  // Scroll reveal for sections.
  var items = document.querySelectorAll(".who-grid, .service-grid, .snooker-grid, .step-rail, .gallery, .why-grid, .faq-narrow, .booking-grid");
  items.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }

  // FAQ: single-open accordion.
  var details = Array.prototype.slice.call(document.querySelectorAll(".accordion details"));
  details.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) details.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // Forms: validate, then show loading, success, and error states.
  function wireForm(id) {
    var form = document.getElementById(id);
    if (!form) return;
    var status = form.querySelector(".form-status");
    function show(msg, isError) {
      status.hidden = false;
      status.textContent = msg;
      status.classList.toggle("error", !!isError);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var service = form.querySelector('[name="service"]');
      var bad = false;
      [name, phone, service].forEach(function (f) {
        if (!f) return;
        var empty = !f.value || !f.value.trim();
        f.classList.toggle("field-error", empty);
        if (empty) bad = true;
      });
      if (bad) {
        show("Please add your name, phone number and service so we can call you back.", true);
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending...";
      show("Sending your request...", false);
      window.setTimeout(function () {
        btn.disabled = false;
        btn.textContent = original;
        show("Thanks " + name.value.trim() + ". We will call " + phone.value.trim() + " shortly to confirm your " + service.value + ".", false);
        form.reset();
      }, 900);
    });
  }
  wireForm("hero-form");
  wireForm("booking-form");
})();
