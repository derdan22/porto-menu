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
        ["main-pl"],
        ["breakfast-pl-1", "breakfast-pl-2"],
        ["drinks-pl"]
      ]
    },
    en: {
      labels: [
        { title: "Main Menu", note: "from 11 until close" },
        { title: "Breakfast", note: "10:00 – 12:00" },
        { title: "Drinks", note: "" }
      ],
      images: [
        ["main-eng"],
        ["breakfast-eng-1", "breakfast-eng-2"],
        ["drinks-eng"]
      ]
    },
    de: {
      labels: [
        { title: "Hauptmenü", note: "ab 11 Uhr bis Küchenschluss" },
        { title: "Frühstück", note: "10:00 – 12:00" },
        { title: "Getränke", note: "" }
      ],
      images: [
        ["main-de"],
        ["breakfast-de-1", "breakfast-de-2"],
        ["drinks-de"]
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

  initMenu();
  preloadAllImages();

  function initMenu() {
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
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      buttons.appendChild(btn);
    });

    buttons.firstChild.classList.add("active");
    renderMenu(menus[lang].images[0], 0);
  }

  function renderMenu(images, categoryIndex) {
    container.innerHTML = "";
    container.className = `menu-images ${images.length > 1 ? "grid-2" : ""}`;

    images.forEach(name => {
      const img = document.createElement("img");
      img.src = `/assets/menu/${name}.jpg`;
      img.alt = "PORTO menu";

      img.addEventListener("click", () => {
        const mode = categoryIndex === 1 ? "long" : "wide";
        openViewer(img.src, mode);
      });

      container.appendChild(img);
    });
  }

  function preloadAllImages() {
    Object.values(menus[lang].images).forEach(group => {
      group.forEach(name => {
        const img = new Image();
        img.src = `/assets/menu/${name}.jpg`;
      });
    });
  }

  window.goBack = function () {
    history.length > 1 ? history.back() : window.location.href = "index.html";
  };

  let scrollPosition = 0;
  let scale = 1;
  let lastTap = 0;

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
    viewer.className = `image-viewer active ${mode}`;
    viewerImage.src = src;

    scale = 1;
    viewerImage.style.transform = "scale(1)";

    freezePage();
    backBtn.style.display = "none";
  }

  function closeViewer() {
    viewer.className = "image-viewer";
    viewerImage.src = "";

    scale = 1;
    viewerImage.style.transform = "scale(1)";

    unfreezePage();
    backBtn.style.display = "flex";
  }

  /* ===== NORMAL GALLERY DOUBLE TAP ===== */

  viewerImage.addEventListener("click", (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {

      const rect = viewerImage.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      if (scale === 1) {
        scale = 2;
        viewerImage.style.transformOrigin = `${offsetX}px ${offsetY}px`;
        viewerImage.style.transform = "scale(2)";
      } else {
        scale = 1;
        viewerImage.style.transformOrigin = "center center";
        viewerImage.style.transform = "scale(1)";
      }
    }

    lastTap = currentTime;
  });

  viewer.addEventListener("click", e => {
    if (e.target === viewer) closeViewer();
  });

  viewerClose.addEventListener("click", closeViewer);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeViewer();
  });

});
