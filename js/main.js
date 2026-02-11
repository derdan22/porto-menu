const params = new URLSearchParams(location.search);
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

const lang = requestedLang || "pl";

if (!menus[lang]) {
  showUnavailableMessage();
} else {
  initMenu();
}

function showUnavailableMessage() {
  buttons.innerHTML = "";
  container.className = "menu-images";

  container.innerHTML = `
    <div class="unavailable-message">
      Deutsche Version ist noch nicht verfügbar.
    </div>
  `;
}

function initMenu() {
  menus[lang].labels.forEach((item, i) => {
    const btn = document.createElement("button");

    btn.innerHTML = `
      <span class="btn-title">${item.title}</span>
      ${item.note ? `<span class="btn-note">${item.note}</span>` : ""}
    `;

    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".simple-buttons button")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      renderMenu(menus[lang].images[i], i);
    });

    buttons.appendChild(btn);
  });

  if (buttons.firstChild) {
    buttons.firstChild.classList.add("active");
    renderMenu(menus[lang].images[0], 0);
  }
}

function renderMenu(images, index) {
  container.innerHTML = "";
  container.className = `menu-images ${
    images.length > 1 ? "grid-2" : ""
  }`;

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = `assets/menu/${src}`;
    img.loading = "lazy";

    img.addEventListener("click", () =>
      openViewer(img.src, index === 1 ? "long" : "wide")
    );

    container.appendChild(img);
  });
}

function goBack() {
  if (history.length > 1) {
    history.back();
  } else {
    location.href = "index.html";
  }
}

function openViewer(src, mode) {
  viewer.className = `image-viewer active ${mode}`;
  viewerImage.src = src;

  viewer.scrollTop = 0;
  document.body.style.overflow = "hidden";

  if (backBtn) backBtn.style.display = "none";
}

function closeViewer() {
  viewer.className = "image-viewer";
  viewerImage.src = "";

  document.body.style.overflow = "";

  if (backBtn) backBtn.style.display = "flex";
}

viewer.addEventListener("click", e => {
  if (e.target === viewer) closeViewer();
});

viewerClose.addEventListener("click", closeViewer);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeViewer();
});
