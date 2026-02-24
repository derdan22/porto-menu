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

  const lang = menus[requestedLang] ? requestedLang : "pl";

  const container = document.getElementById("menu-container");
  const buttons = document.getElementById("menu-buttons");

  const viewer = document.getElementById("imageViewer");
  const viewerTrack = document.getElementById("viewerTrack");
  const viewerDots = document.getElementById("viewerDots");
  const viewerClose = document.getElementById("viewerClose");

  let currentImages = [];
  let currentIndex = 0;

  let startX = 0;
  let currentTranslate = 0;
  let isSwiping = false;

  let scale = 1;
  let lastTap = 0;
  let startDistance = 0;

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
    container.className = `menu-images ${images.length > 1 ? "grid-2" : ""}`;

    images.forEach((name, index) => {
      const img = document.createElement("img");
      img.src = `/assets/menu/${name}.jpg`;
      img.alt = "PORTO menu";

      img.addEventListener("click", () => {
        openViewer(images, index);
      });

      container.appendChild(img);
    });
  }

  function openViewer(images, startIndex) {
    currentImages = images.map(name => `/assets/menu/${name}.jpg`);
    currentIndex = startIndex;

    viewerTrack.innerHTML = "";
    viewerDots.innerHTML = "";

    currentImages.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.classList.add("viewer-image");
      viewerTrack.appendChild(img);

      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === currentIndex) dot.classList.add("active");
      viewerDots.appendChild(dot);
    });

    updateSliderPosition();
    viewer.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function updateSliderPosition() {
    viewerTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    viewerDots.querySelectorAll(".dot").forEach((d, i) => {
      d.classList.toggle("active", i === currentIndex);
    });
  }

  function closeViewer() {
    viewer.classList.remove("active");
    document.body.style.overflow = "";
    scale = 1;
  }

  viewerClose.addEventListener("click", closeViewer);

  viewerTrack.addEventListener("touchstart", e => {

    if (e.touches.length === 2) {
      startDistance = getDistance(e.touches);
      return;
    }

    const now = Date.now();
    if (now - lastTap < 300) {
      scale = scale === 1 ? 2 : 1;
      e.target.style.transform = `scale(${scale})`;
    }
    lastTap = now;

    if (scale > 1) return;

    isSwiping = true;
    startX = e.touches[0].clientX;
  });

  viewerTrack.addEventListener("touchmove", e => {

    if (e.touches.length === 2) {
      const newDistance = getDistance(e.touches);
      scale = Math.min(Math.max(newDistance / startDistance, 1), 3);
      e.target.style.transform = `scale(${scale})`;
      return;
    }

    if (!isSwiping || scale > 1) return;

    const diff = e.touches[0].clientX - startX;
    currentTranslate = diff;
  });

  viewerTrack.addEventListener("touchend", () => {

    if (!isSwiping || scale > 1) return;

    if (currentTranslate < -50 && currentIndex < currentImages.length - 1) {
      currentIndex++;
    } else if (currentTranslate > 50 && currentIndex > 0) {
      currentIndex--;
    }

    updateSliderPosition();
    isSwiping = false;
    currentTranslate = 0;
  });

  function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

});
