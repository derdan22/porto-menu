const params = new URLSearchParams(location.search);
const lang = params.get("lang") || "pl";

const container = document.getElementById("menu-container");
const buttons = document.getElementById("menu-buttons");
const viewer = document.getElementById("imageViewer");
const backBtn = document.querySelector(".back-simple");

function goBack() {
  history.length > 1 ? history.back() : location.href = "index.html";
}

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
  },
  de: {
    labels: [
      { title: "Hauptmenü", note: "ab 11 Uhr" },
      { title: "Frühstück", note: "10:00 – 12:00" },
      { title: "Getränke", note: "" }
    ],
    images: [
      ["main-de.jpg"],
      ["breakfast-de-1.jpg", "breakfast-de-2.jpg"],
      ["drinks-de.jpg"]
    ]
  }
};

function openViewer(src, mode) {
  viewer.className = `image-viewer active ${mode}`;
  viewer.innerHTML = `
    <button class="viewer-close" onclick="closeViewer()">✕</button>
    <img src="${src}" alt="">
  `;

  viewer.scrollTop = 0;
  document.body.style.overflow = "hidden";

  if (backBtn) backBtn.style.display = "none";
}

function closeViewer() {
  viewer.className = "image-viewer";
  viewer.innerHTML = "";
  document.body.style.overflow = "";

  if (backBtn) backBtn.style.display = "flex";
}

viewer.onclick = e => {
  if (e.target === viewer) closeViewer();
};

function renderMenu(images, index) {
  container.innerHTML = "";
  container.className = `menu-images ${images.length > 1 ? "grid-2" : ""}`;

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = `assets/menu/${src}`;
    img.onclick = () => openViewer(img.src, index === 1 ? "long" : "wide");
    container.appendChild(img);
  });
}

menus[lang].labels.forEach((item, i) => {
  const btn = document.createElement("button");

  btn.innerHTML = `
    <span class="btn-title">${item.title}</span>
    ${item.note ? `<span class="btn-note">${item.note}</span>` : ""}
  `;

  btn.onclick = () => {
    document.querySelectorAll(".simple-buttons button")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    renderMenu(menus[lang].images[i], i);
  };

  buttons.appendChild(btn);
});

buttons.firstChild.classList.add("active");
renderMenu(menus[lang].images[0], 0);
