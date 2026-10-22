
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.dataset.appReady = "true";

  const sectionMap = {
    "NETWORK": "people",
    "SIS AI": "ai",
    "التقارير": "reports",
    "التقارير الاستخباراتية": "reports",
    "البحث المركزي": "search",
    "الملفات": "files",
    "الإعدادات": "settings"
  };

  document.querySelectorAll(".card").forEach(card => {
    card.style.cursor = "pointer";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    function openSection(event) {
      const heading = card.querySelector("h2, h3");
      const title = heading?.textContent.trim() || "";
      const section = sectionMap[title.toUpperCase()] ||
                      sectionMap[title];

      if (section && window.SISSystem) {
        event.preventDefault();
        window.SISSystem.open(section);
      }
    }

    card.addEventListener("click", openSection);

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSection(event);
      }
    });
  });
});
