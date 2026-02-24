document.addEventListener("DOMContentLoaded", () => {

  const viewer = document.getElementById("imageViewer");
  const viewerImage = document.getElementById("viewerImage");
  const viewerClose = document.getElementById("viewerClose");

  let scale = 1;
  let posX = 0;
  let posY = 0;
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let lastTap = 0;

  function updateTransform() {
    viewerImage.style.transform =
      `translate3d(${posX}px, ${posY}px, 0) scale(${scale})`;
  }

  function resetZoom() {
    scale = 1;
    posX = 0;
    posY = 0;
    updateTransform();
  }

  function toggleZoom() {
    if (scale === 1) {
      scale = 2;
    } else {
      resetZoom();
      return;
    }
    updateTransform();
  }

  function detectDoubleTap() {
    const now = Date.now();
    if (now - lastTap < 300) {
      toggleZoom();
    }
    lastTap = now;
  }

  viewerImage.addEventListener("touchstart", (e) => {
    detectDoubleTap();

    if (scale > 1) {
      isDragging = true;
      startX = e.touches[0].clientX - posX;
      startY = e.touches[0].clientY - posY;
    }
  });

  viewerImage.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    posX = e.touches[0].clientX - startX;
    posY = e.touches[0].clientY - startY;

    updateTransform();
  });

  viewerImage.addEventListener("touchend", () => {
    isDragging = false;
  });

  viewerImage.addEventListener("dblclick", toggleZoom);

  viewerImage.addEventListener("mousedown", (e) => {
    if (scale <= 1) return;
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  viewerClose.addEventListener("click", resetZoom);

});
