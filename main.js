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
