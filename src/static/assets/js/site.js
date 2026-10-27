(function () {
  "use strict";

  // Header shadow on scroll
  var header = document.querySelector("[data-header]");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.querySelector("[data-menu-toggle]");
  var list = document.getElementById("nav-list");
  if (toggle && list) {
    toggle.addEventListener("click", function () {
      var open = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) { list.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  // Years in business (founded 2011)
  var years = String(new Date().getFullYear() - 2011);
  document.querySelectorAll("[data-years]").forEach(function (el) { el.textContent = years; });

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Gallery lightbox
  var box = document.querySelector("[data-lightbox]");
  var boxImg = document.querySelector("[data-lightbox-img]");
  var items = [];
  var index = 0;
  function show(i) {
    index = (i + items.length) % items.length;
    boxImg.src = items[index].getAttribute("data-full");
    boxImg.alt = items[index].querySelector("img").alt;
  }
  function close() { box.hidden = true; document.body.style.overflow = ""; boxImg.removeAttribute("src"); }
  document.querySelectorAll("[data-gallery] button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      items = Array.prototype.slice.call(btn.closest("[data-gallery]").querySelectorAll("button"));
      show(items.indexOf(btn));
      box.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });
  if (box) {
    box.querySelector("[data-lightbox-close]").addEventListener("click", close);
    box.querySelector("[data-lightbox-prev]").addEventListener("click", function () { show(index - 1); });
    box.querySelector("[data-lightbox-next]").addEventListener("click", function () { show(index + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  // Product filter
  var filters = document.querySelectorAll("[data-filter]");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      document.querySelectorAll("[data-cat]").forEach(function (card) {
        card.hidden = cat !== "all" && card.getAttribute("data-cat") !== cat;
      });
    });
  });

  // Inquiry form: compose an email in the visitor's mail app
  var form = document.querySelector("[data-inquiry]");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    if (params.get("product")) {
      form.elements.interest.value = "Apparel";
      form.elements.message.value = "I'd like to know more about: " + params.get("product") + "\n\n";
    }
    if (params.get("topic") === "tech") form.elements.interest.value = "Tech";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var to = f.interest.value === "Tech" ? "Sifat@prismbd.net" : "saadi@prismbd.net";
      var subject = "Inquiry: " + f.interest.value + " - " + f.name.value;
      var body = [
        f.message.value, "",
        "Name: " + f.name.value,
        "Company: " + f.company.value,
        "Email: " + f.email.value,
        "Phone: " + f.phone.value
      ].join("\n");
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var note = form.querySelector("[data-form-note]");
      if (note) note.textContent = "Your email app should open with the message ready to send. If it doesn't, email " + to + " directly.";
    });
  }
})();
