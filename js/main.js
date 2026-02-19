document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const requestedLang = params.get("lang");

  const menus = {
    pl: {
      labels: [
        { title: "Menu Główne", note: "od 11 do zamknięcia" },
        { title: "Śniadania", note: "10:00 – 12:00" },
        { title: "Napoje", note: "" }
      ],
      images: [
        ["main-pl.jpg"],
        ["breakfast-pl-1.jpg", "breakfast-pl-2.jpg"],
        ["drinks-pl.jpg"]
      ]
    },
    en: {
      labels: [
        { title: "Main Menu", note: "from 11 until close" },
        { title: "Breakfast", note: "10:00 – 12:00" },
        { title: "Drinks", note: "" }
      ],
      images: [
        ["main-eng.jpg"],
        ["breakfast-eng-1.jpg", "breakfast-eng-2.jpg"],
        ["drinks-eng.jpg"]
      ]
    }
  };

  const container = document.getElementById("menu-container");
  const buttons = document.getElementById("menu-buttons");
  const viewer = document.getElementById("imageViewer");
  const viewerClose = document.getElementById("viewerClose");
  const viewerImage = document.getElementById("viewerImage");
  const backBtn = document.querySelector(".back-simple");

  const lang = menus[requestedLang] ? requestedLang : "pl";

  if (!menus[requestedLang]) {
    showUnavailableMessage();
  } else {
    initMenu();
    preloadAll();
  }

  function showUnavailableMessage() {
    if (!container) return;
    if (buttons) buttons.innerHTML = "";
    container.innerHTML = `<div class="unavailable-message">Ta wersja językowa nie jest jeszcze dostępna.</div>`;
  }

  function initMenu() {
    if (!buttons) return;

    buttons.innerHTML = "";

    menus[lang].labels.forEach((item, index) => {
      const btn = document.createElement("button");

      btn.innerHTML = `
        <span class="btn-title">${item.title}</span>
        ${item.note ? `<span class="btn-note">${item.note}</span>` : ""}
      `;

      btn.addEventListener("click", () => {
        document.querySelectorAll("#menu-buttons button")
          .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
        renderMenu(menus[lang].images[index], index);
      });

      buttons.appendChild(btn);
    });

    if (buttons.firstChild) {
      buttons.firstChild.classList.add("active");
      renderMenu(menus[lang].images[0], 0);
    }
  }

  function renderMenu(images, categoryIndex) {
    if (!container) return;

    container.innerHTML = "";
    container.className = `menu-images ${images.length > 1 ? "grid-2" : ""}`;

    images.forEach(src => {
      const img = new Image();
      img.src = `assets/menu/${src}`;
      img.alt = "PORTO menu";
      img.loading = "eager";

      img.onload = () => img.classList.add("loaded");

      img.addEventListener("click", async () => {
        const mode = categoryIndex === 1 ? "long" : "wide";
        try {
          await img.decode();
        } catch {}
        openViewer(img.src, mode);
      });

      container.appendChild(img);
    });
  }

  function preloadAll() {
    const all = menus[lang].images.flat();

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        all.forEach(src => {
          const img = new Image();
          img.src = `assets/menu/${src}`;
        });
      });
    } else {
      setTimeout(() => {
        all.forEach(src => {
          const img = new Image();
          img.src = `assets/menu/${src}`;
        });
      }, 800);
    }
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (viewer.classList.contains("active")) {
        closeViewer();
        return;
      }

      if (history.length > 1) {
        history.back();
      } else {
        window.location.href = "index.html";
      }
    });
  }

  let scrollPosition = 0;

  function freezePage() {
    scrollPosition = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
  }

  function unfreezePage() {
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, scrollPosition);
  }

  function openViewer(src, mode) {
    if (!viewer || !viewerImage) return;

    viewer.classList.add("active");
    viewer.classList.remove("long", "wide");
    viewer.classList.add(mode);

    viewerImage.src = src;
    freezePage();

    if (backBtn) backBtn.style.display = "none";
  }

  function closeViewer() {
    if (!viewer || !viewerImage) return;

    viewer.classList.remove("active", "long", "wide");
    viewerImage.src = "";
    unfreezePage();

    if (backBtn) backBtn.style.display = "flex";
  }

  if (viewerClose) {
    viewerClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeViewer();
    });
  }

  if (viewer) {
    viewer.addEventListener("click", (e) => {
      if (e.target === viewer) {
        closeViewer();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeViewer();
    }
  });

});
