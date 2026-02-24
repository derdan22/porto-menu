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
    }
  };

  const lang = menus[requestedLang] ? requestedLang : "pl";

  const container = document.getElementById("menu-container");
  const buttons = document.getElementById("menu-buttons");

  const viewer = document.getElementById("viewer");
  const track = document.getElementById("viewerTrack");
  const dotsContainer = document.getElementById("viewerDots");
  const closeBtn = document.getElementById("viewerClose");

  let images = [];
  let index = 0;

  let startX = 0;
  let deltaX = 0;
  let isSwiping = false;

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  let lastTap = 0;

  initMenu();

  function initMenu() {
    buttons.innerHTML = "";

    menus[lang].labels.forEach((item, i) => {

      const btn = document.createElement("button");
      btn.innerHTML = `
        <span class="btn-title">${item.title}</span>
        ${item.note ? `<span class="btn-note">${item.note}</span>` : ""}
      `;

      btn.addEventListener("click", () => {
        document.querySelectorAll("#menu-buttons button")
          .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
        renderMenu(menus[lang].images[i]);
      });

      buttons.appendChild(btn);
    });

    buttons.firstChild.classList.add("active");
    renderMenu(menus[lang].images[0]);
  }

  function renderMenu(imgs) {

    container.innerHTML = "";
    container.className = `menu-images ${imgs.length > 1 ? "grid-2" : ""}`;

    imgs.forEach((name, i) => {

      const img = document.createElement("img");
      img.src = `/assets/menu/${name}.jpg`;

      img.addEventListener("click", () => {
        openViewer(imgs, i);
      });

      container.appendChild(img);
    });
  }

  function openViewer(imgs, startIndex) {

    images = imgs.map(n => `/assets/menu/${n}.jpg`);
    index = startIndex;

    track.innerHTML = "";
    dotsContainer.innerHTML = "";

    images.forEach((src, i) => {

      const slide = document.createElement("div");
      slide.className = "viewer-slide";

      const img = document.createElement("img");
      img.src = src;
      img.className = "viewer-img";

      slide.appendChild(img);
      track.appendChild(slide);

      const dot = document.createElement("span");
      dot.className = "dot";
      if (i === index) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    });

    updateSlider();
    viewer.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function updateSlider() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsContainer.querySelectorAll(".dot").forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }

  function closeViewer() {
    viewer.classList.remove("active");
    document.body.style.overflow = "";
    resetZoom();
  }

  closeBtn.addEventListener("click", closeViewer);

  track.addEventListener("touchstart", e => {

    if (scale > 1) return;

    startX = e.touches[0].clientX;
    isSwiping = true;

    const now = Date.now();
    if (now - lastTap < 250) {
      toggleZoom(e.touches[0]);
    }
    lastTap = now;
  });

  track.addEventListener("touchmove", e => {

    if (!isSwiping || scale > 1) return;

    deltaX = e.touches[0].clientX - startX;
  });

  track.addEventListener("touchend", () => {

    if (!isSwiping || scale > 1) return;

    if (deltaX < -60 && index < images.length - 1) index++;
    if (deltaX > 60 && index > 0) index--;

    updateSlider();
    deltaX = 0;
    isSwiping = false;
  });

  track.addEventListener("touchmove", e => {

    if (e.touches.length === 2) {

      const img = getCurrentImage();
      const dist = getDistance(e.touches);

      if (!img.dataset.startDist) {
        img.dataset.startDist = dist;
      }

      const scaleFactor = dist / img.dataset.startDist;
      scale = Math.min(Math.max(scaleFactor, 1), 3);

      applyTransform(img);
    }
  });

  track.addEventListener("touchend", () => {
    const img = getCurrentImage();
    if (img) delete img.dataset.startDist;
  });

  function toggleZoom(touch) {

    const img = getCurrentImage();

    if (scale === 1) {
      scale = 2;
    } else {
      resetZoom();
    }

    applyTransform(img);
  }

  function resetZoom() {
    scale = 1;
    translateX = 0;
    translateY = 0;

    const img = getCurrentImage();
    if (img) img.style.transform = "";
  }

  function applyTransform(img) {
    img.style.transform =
      `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function getCurrentImage() {
    return track.children[index]?.querySelector("img");
  }

  function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

});
