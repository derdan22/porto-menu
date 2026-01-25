const params = new URLSearchParams(window.location.search);
const lang = params.get("lang") || "pl";

const container = document.getElementById("menu-container");
const buttonsContainer = document.getElementById("menu-buttons");

const viewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImage");
const closeViewer = document.getElementById("closeViewer");

let scale = 1;

const menus = {
  pl: {
    labels: [
      { title: "Menu Główne", note: "od 11:00 do zamknięcia" },
      { title: "Menu Śniadaniowe", note: "10:00 – 12:00" },
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
      { title: "Main Menu", note: "from 11:00 until closing" },
      { title: "Breakfast Menu", note: "10:00 – 12:00" },
      { title: "Drinks", note: "" }
    ],
    images: [
      ["main-en.jpg"],
      ["breakfast-en-1.jpg", "breakfast-en-2.jpg"],
      ["drinks-en.jpg"]
    ]
  },
  de: {
    labels: [
      { title: "Hauptmenü", note: "von 11:00 bis zur Schließung" },
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

function openViewer(src) {
  viewerImg.src = src;
  scale = 1;
  viewerImg.style.transform = "scale(1)";
  viewer.classList.add("active");
}

viewerImg.addEventListener("dblclick", () => {
  scale = scale === 1 ? 2 : 1;
  viewerImg.style.transform = `scale(${scale})`;
});

closeViewer.onclick = () => {
  viewer.classList.remove("active");
  scale = 1;
  viewerImg.style.transform = "scale(1)";
};

viewer.onclick = e => {
  if (e.target === viewer) closeViewer.onclick();
};

function renderMenu(images) {
  container.innerHTML = "";
  container.className = `menu-images ${images.length > 1 ? "grid-2" : "grid-1"}`;

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = `assets/menu/${src}`;
    img.onclick = () => openViewer(img.src);
    container.appendChild(img);
  });
}

menus[lang].labels.forEach((item, index) => {
  const btn = document.createElement("button");
  btn.innerHTML = `
    <span class="btn-title">${item.title}</span>
    ${item.note ? `<span class="btn-note">${item.note}</span>` : ""}
  `;

  btn.onclick = () => {
    document.querySelectorAll(".simple-buttons button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenu(menus[lang].images[index]);
  };

  buttonsContainer.appendChild(btn);
});

buttonsContainer.firstChild.classList.add("active");
renderMenu(menus[lang].images[0]);
