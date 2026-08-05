/* ===== Grupo Arvor — comportamientos compartidos ===== */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // year
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // nav background on scroll
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 40); };
    onScroll(); addEventListener("scroll", onScroll, { passive: true });
  }

  // scroll progress
  var bar = document.getElementById("progress");
  if (bar) {
    var prog = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    };
    prog(); addEventListener("scroll", prog, { passive: true }); addEventListener("resize", prog, { passive: true });
  }

  // reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .14, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // card tilt (post cards)
  if (!reduce) {
    document.querySelectorAll(".post-card, .featured").forEach(function (card) {
      var raf = null;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          card.style.transform = "translateY(-6px) perspective(900px) rotateX(" + ((0.5 - py) * 4) + "deg) rotateY(" + ((px - 0.5) * 5) + "deg)";
          raf = null;
        });
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  // category filter (blog)
  var cats = document.querySelectorAll(".cat");
  if (cats.length) {
    cats.forEach(function (btn) {
      btn.addEventListener("click", function () {
        cats.forEach(function (c) { c.classList.remove("active"); });
        btn.classList.add("active");
        var f = btn.getAttribute("data-cat");
        document.querySelectorAll(".post-card").forEach(function (card) {
          var show = (f === "all" || card.getAttribute("data-cat") === f);
          card.style.display = show ? "" : "none";
        });
      });
    });
  }
})();
