
(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  const menu = $("#sidebar");
  const menuToggle = $("#menuToggle");
  const menuClose = $("#menuClose");
  const overlay = $("#menuOverlay");
  const content = $("#pageContent");
  const title = $("#pageTitle");
  const subtitle = $("#pageSubtitle");

  const pages = {
    home: ["مركز القيادة", "مرحبًا بك في SIS — NIGHT CITY"],
    network: ["NETWORK", "شبكة أشخاص وأنظمة"],
    people: ["الأشخاص", "إدارة ملفات الأشخاص"],
    files: ["الملفات", "إدارة الملفات"],
    reports: ["التقارير", "التقارير الاستخباراتية"],
    search: ["البحث المركزي", "البحث في بيانات النظام"],
    ai: ["SIS AI", "مساعد المعلومات المحفوظة"],
    archive: ["الأرشيف", "العناصر المؤرشفة"],
    settings: ["الإعدادات", "إدارة إعدادات النظام"]
  };

  function openMenu() {
    menu.classList.add("open");
    overlay.classList.add("show");
    menu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menu.classList.remove("open");
    overlay.classList.remove("show");
    menu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function navigate(page) {
    if (!pages[page]) return;

    document.querySelectorAll(".nav-link").forEach(button => {
      button.classList.toggle("active", button.dataset.page === page);
    });

    title.textContent = pages[page][0];
    subtitle.textContent = pages[page][1];

    if (window.SISPages?.render) {
      window.SISPages.render(page, content);
    }

    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  menuToggle.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  menu.addEventListener("click", event => {
    const button = event.target.closest("[data-page]");
    if (button) navigate(button.dataset.page);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();

    if (
      event.key === "Enter" &&
      document.activeElement?.id === "aiQuestion"
    ) {
      document.querySelector('[data-action="ask-ai"]')?.click();
    }
  });

  window.SISApp = {
    navigate,
    openMenu,
    closeMenu
  };

  navigate("home");
})();
