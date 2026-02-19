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
  }

  function showUnavailableMessage() {
    if (!container) return;

    if (buttons) buttons.innerHTML = "";

    container.className = "menu-images";
    container.innerHTML = `
      <div class="unavailable-message">
        Ta wersja językowa nie jest jeszcze dostępna.
      </div>
    `;
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
        document
          .querySelectorAll("#menu-buttons button")
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
      const img = document.createElement("img");
      img.src = `assets/menu/${src}`;
      img.loading = "lazy";
      img.alt = "PORTO menu";

      img.addEventListener("click", () => {
        const mode = categoryIndex === 1 ? "long" : "wide";
        openViewer(img.src, mode);
      });

      container.appendChild(img);
    });
  }

  window.goBack = function () {
    if (history.length > 1) {
      history.back();
    } else {
      window.location.href = "index.html";
    }
  };

  function preventZoom(e) {
    e.preventDefault();
  }

  function blockPageZoom() {
    document.addEventListener("gesturestart", preventZoom);
    document.addEventListener("gesturechange", preventZoom);
    document.addEventListener("gestureend", preventZoom);
  }

  function allowPageZoom() {
    document.removeEventListener("gesturestart", preventZoom);
    document.removeEventListener("gesturechange", preventZoom);
    document.removeEventListener("gestureend", preventZoom);
  }

  function openViewer(src, mode) {
    if (!viewer || !viewerImage) return;

    viewer.className = `image-viewer active ${mode}`;
    viewerImage.src = src;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    blockPageZoom(); 

    if (backBtn) backBtn.style.display = "none";
  }

  function closeViewer() {
    if (!viewer || !viewerImage) return;

    viewer.className = "image-viewer";
    viewerImage.src = "";

    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    allowPageZoom(); // 🔥 возвращаем жесты

    if (backBtn) backBtn.style.display = "flex";
  }

  if (viewer) {
    viewer.addEventListener("click", e => {
      if (e.target === viewer) closeViewer();
    });
  }

  if (viewerClose) {
    viewerClose.addEventListener("click", closeViewer);
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeViewer();
  });

});
