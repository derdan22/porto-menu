const params = new URLSearchParams(window.location.search);
const lang = params.get("lang") || "pl";

const container = document.getElementById("menu-container");
const buttonsContainer = document.getElementById("menu-buttons");

const menus = {
  pl: {
    labels: ["Menu Główne", "Menu Śniadaniowe", "Drinki"],
    images: [
      ["main-pl.jpg"],
      ["breakfast-pl-1.jpg", "breakfast-pl-2.jpg"],
      ["drinks-pl.jpg"]
    ]
  }
};

function renderMenu(images) {
  container.innerHTML = "";

  container.classList.remove("grid-1", "grid-2");
  container.classList.add(images.length === 2 ? "grid-2" : "grid-1");

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = `assets/menu/${src}`;
    img.alt = "Menu PORTO";
    container.appendChild(img);
  });
}

menus[lang].labels.forEach((label, index) => {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.className = "glow-btn";

  btn.onclick = () => {
    document.querySelectorAll(".glow-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenu(menus[lang].images[index]);
  };

  buttonsContainer.appendChild(btn);
});

buttonsContainer.children[0].classList.add("active");
renderMenu(menus[lang].images[0]);
