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

  const lang = menus[requestedLang] ? requestedLang : "pl";
  let currentImages = [];
  let currentIndex = 0;

  initMenu();

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
        renderMenu(menus[lang].images[index]);
      });

      buttons.appendChild(btn);
    });

    buttons.firstChild.classList.add("active");
    renderMenu(menus[lang].images[0]);
  }

  function renderMenu(images) {
    container.innerHTML = "";
    container.className = "menu-images";

    if (images.length === 2) {
      container.classList.add("grid-2");
    }

    images.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = `assets/menu/${src}`;
      img.alt = "PORTO menu";
      img.loading = "lazy";

      img.addEventListener("click", () => {
        currentImages = images;
        currentIndex = i;
        openViewer();
      });

      container.appendChild(img);
    });
  }

  function openViewer() {
    viewer.classList.add("active");
    viewerImage.src = `assets/menu/${currentImages[currentIndex]}`;
    document.body.style.overflow = "hidden";
  }

  function closeViewer() {
    viewer.classList.remove("active");
    document.body.style.overflow = "";
  }

  viewerClose.addEventListener("click", closeViewer);

  viewer.addEventListener("click", e => {
    if (e.target === viewer) closeViewer();
  });

  document.addEventListener("keydown", e => {
    if (!viewer.classList.contains("active")) return;

    if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % currentImages.length;
      openViewer();
    }

    if (e.key === "ArrowLeft") {
      currentIndex =
        (currentIndex - 1 + currentImages.length) % currentImages.length;
      openViewer();
    }

    if (e.key === "Escape") closeViewer();
  });

});
