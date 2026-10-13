(function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function scrollToTopOnLoad() {
    var navEntry =
      performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
    var isReload = navEntry && navEntry.type === "reload";

    if (isReload) {
      if (location.hash) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      window.scrollTo(0, 0);
      return;
    }

    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }

  scrollToTopOnLoad();
  window.addEventListener("pageshow", scrollToTopOnLoad);

  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  if (!nav || !toggle) return;

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });
})();

(function () {
  document.querySelectorAll("[data-carousel]").forEach(initCarousel);

  function initCarousel(root) {
  var track = root.querySelector(".program-carousel__track");
  var realSlides = Array.prototype.slice.call(root.querySelectorAll(".program-carousel__slide"));
  var dotsWrap = root.querySelector(".program-carousel__dots");
  var count = realSlides.length;
  var index = 0;
  var startX = 0;
  var wrapping = false;
  var slideLabel = root.getAttribute("data-slide-label") || "photo";

  function cloneSlide(slide) {
    var copy = slide.cloneNode(true);
    copy.classList.remove("is-active");
    copy.setAttribute("aria-hidden", "true");
    return copy;
  }

  var lastClone = cloneSlide(realSlides[count - 1]);
  var firstClone = cloneSlide(realSlides[0]);
  track.insertBefore(lastClone, realSlides[0]);
  track.appendChild(firstClone);

  realSlides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "program-carousel__dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", "Show " + slideLabel + " " + (i + 1));
    dotsWrap.appendChild(dot);
  });

  var dots = Array.prototype.slice.call(dotsWrap.children);

  function markActive(i) {
    realSlides.forEach(function (slide, s) {
      slide.classList.toggle("is-active", s === i);
    });
    firstClone.classList.remove("is-active");
    lastClone.classList.remove("is-active");
    dots.forEach(function (dot, d) {
      dot.classList.toggle("is-active", d === i);
    });
  }

  function centerOn(el, instant) {
    var viewport = root.querySelector(".program-carousel__viewport");
    var pad = (viewport.clientWidth - el.offsetWidth) / 2;
    if (instant) {
      track.style.transition = "none";
    }
    track.style.transform = "translateX(" + (pad - el.offsetLeft) + "px)";
    if (instant) {
      void track.offsetWidth;
      track.style.transition = "";
    }
  }

  function afterTransform(fn) {
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      track.removeEventListener("transitionend", handler);
      fn();
    }
    function handler(e) {
      if (e.target !== track) return;
      if (e.propertyName && e.propertyName !== "transform") return;
      finish();
    }
    requestAnimationFrame(function () {
      track.addEventListener("transitionend", handler);
      setTimeout(finish, 550);
    });
  }

  function goTo(i, instant) {
    if (wrapping && !instant) return;

    if (i >= count) {
      wrapping = true;
      index = 0;
      markActive(0);
      firstClone.classList.add("is-active");
      centerOn(firstClone, false);
      afterTransform(function () {
        firstClone.classList.remove("is-active");
        centerOn(realSlides[0], true);
        wrapping = false;
      });
      return;
    }

    if (i < 0) {
      wrapping = true;
      index = count - 1;
      markActive(count - 1);
      lastClone.classList.add("is-active");
      centerOn(lastClone, false);
      afterTransform(function () {
        lastClone.classList.remove("is-active");
        centerOn(realSlides[count - 1], true);
        wrapping = false;
      });
      return;
    }

    index = i;
    markActive(index);
    centerOn(realSlides[index], instant);
  }

  root.querySelector("[data-carousel-next]").addEventListener("click", function () {
    goTo(index + 1);
  });
  root.querySelector("[data-carousel-prev]").addEventListener("click", function () {
    goTo(index - 1);
  });
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      goTo(i);
    });
  });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });
  root.setAttribute("tabindex", "0");

  root.addEventListener("touchstart", function (e) {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });

  root.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) < 40) return;
    goTo(dx < 0 ? index + 1 : index - 1);
  });

  window.addEventListener("resize", function () {
    goTo(index, true);
  });
  goTo(0, true);
  }
})();
