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
  const viewerImage = document.getElementById("viewerImage");

  const lang = menus[requestedLang] ? requestedLang : "pl";

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
        renderMenu(menus[lang].images[index], index);
      });

      buttons.appendChild(btn);
    });

    buttons.firstChild.classList.add("active");
    renderMenu(menus[lang].images[0], 0);
  }

  function renderMenu(images, categoryIndex) {
    container.innerHTML = "";
    container.className = `menu-images ${images.length > 1 ? "grid-2" : ""}`;

    images.forEach(src => {
      const img = document.createElement("img");
      img.src = `assets/menu/${src}`;
      img.loading = "lazy";
      img.alt = "PORTO menu";

      img.addEventListener("click", () => openViewer(img.src));

      container.appendChild(img);
    });
  }

  window.goBack = function () {
    window.location.href = "index.html";
  };

  function openViewer(src) {
    viewer.classList.add("active");
    viewerImage.src = src;
  }

  document.getElementById("viewerClose")
    .addEventListener("click", () => viewer.classList.remove("active"));

});
