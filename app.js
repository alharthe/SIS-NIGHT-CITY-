

/* =====================================================
   SIS — BRITISH INTELLIGENCE
   APP CONTROLLER v1.0
   ===================================================== */

(() => {
  "use strict";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const elements = {
    menu: $("#menu-toggle"),
    sidebar: $("#sidebar"),
    backdrop: $("#sidebar-backdrop"),
    dashboard: $("#dashboard-section"),
    welcome: $("#welcome-banner"),
    page: $("#page-view"),
    title: $("#page-title"),
    eyebrow: $("#page-eyebrow"),
    description: $("#page-description"),
    content: $("#page-content"),
    toast: $("#toast-container"),
    main: $("#main-content")
  };

  const pages = {
    home: {
      title: "مركز العمليات",
      description: "مرحبًا بك في الوكالة الاستخباراتية البريطانية.",
      eyebrow: "AGENCY OVERVIEW"
    },
    profile: {
      title: "ملف المستخدم",
      description: "البيانات الشخصية والهوية والرتبة.",
      eyebrow: "PERSONNEL DOSSIER"
    },
    map: {
      title: "الخريطة الرئيسية",
      description: "مساحة مخصصة لخريطة الوكالة ومواقعها.",
      eyebrow: "OPERATIONAL MAP"
    },
    headquarters: {
      title: "مقرات الوكالة",
      description: "إدارة المقرات والصور والمعلومات المرتبطة بها.",
      eyebrow: "AGENCY LOCATIONS"
    },
    members: {
      title: "الأعضاء والرتب",
      description: "إدارة العضويات والترقيات والصلاحيات.",
      eyebrow: "PERSONNEL MANAGEMENT"
    },
    missions: {
      title: "المهام والمكافآت",
      description: "متابعة المهام والمكافآت المالية المعتمدة.",
      eyebrow: "MISSION CONTROL"
    },
    network: {
      title: "NETWORK",
      description: "إدارة الشبكات والأشخاص والعلاقات بينهم.",
      eyebrow: "NETWORK INTELLIGENCE"
    },
    store: {
      title: "متجر الوكالة",
      description: "العناصر والمشتريات والرصيد المكتسب.",
      eyebrow: "AGENCY EXCHANGE"
    },
    ai: {
      title: "SIS AI",
      description: "المساعد الذكي للبحث في المعلومات المصرح بها.",
      eyebrow: "INTELLIGENCE ASSISTANT"
    },
    settings: {
      title: "إعدادات النظام",
      description: "تفضيلات العرض وإدارة بيانات التطبيق.",
      eyebrow: "SYSTEM CONFIGURATION"
    }
  };

  let currentPage = "home";
  let toastTimer;

  function showToast(message, type = "info") {
    if (!elements.toast) return;

    const toast = document.createElement("div");
    toast.className = `sis-toast sis-toast-${type}`;
    toast.setAttribute("role", "status");
    toast.textContent = message;

    elements.toast.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  function setMenu(open) {
    const isOpen = Boolean(open);

    elements.sidebar?.classList.toggle("is-open", isOpen);
    elements.backdrop?.classList.toggle("is-visible", isOpen);
    elements.menu?.classList.toggle("is-active", isOpen);
    elements.menu?.setAttribute("aria-expanded", String(isOpen));

    document.body.classList.toggle("menu-open", isOpen);
  }

  function renderPageContent(pageId) {
    if (!elements.content) return;

    elements.content.replaceChildren();

    // محتوى الأقسام الفعلي سيأتي من SISSystem.
    if (window.SISSystem &&
        typeof window.SISSystem.renderPage === "function") {
      window.SISSystem.renderPage(pageId, elements.content);
      return;
    }

    const placeholders = {
      profile: "ستظهر هنا بيانات المستخدم وصورته ورتبته.",
      map: "أضف خريطتك لاحقًا من إعدادات المشروع.",
      headquarters: "ستظهر هنا المقرات وإدارة صورها.",
      members: "ستظهر هنا إدارة الأعضاء والرتب.",
      missions: "ستظهر هنا المهام والمكافآت.",
      network: "ستظهر هنا شبكات الأشخاص والمخططات التفاعلية.",
      store: "ستظهر هنا العناصر وأسعارها والرصيد.",
      ai: "واجهة المساعد جاهزة للربط بخدمة ذكاء اصطناعي.",
      settings: "ستظهر هنا إعدادات النظام وإدارة البيانات."
    };

    const panel = document.createElement("div");
    panel.className = "empty-state";

    const heading = document.createElement("h3");
    heading.textContent = pages[pageId]?.title || "القسم";

    const message = document.createElement("p");
    message.textContent =
      placeholders[pageId] || "لا يوجد محتوى متاح لهذا القسم بعد.";

    panel.append(heading, message);
    elements.content.appendChild(panel);
  }

  function navigate(pageId) {
    if (!pages[pageId]) {
      showToast("القسم المطلوب غير موجود.", "error");
      return;
    }

    currentPage = pageId;
    setMenu(false);

    $$(".nav-item").forEach(button => {
      const active = button.dataset.page === pageId;
      button.classList.toggle("active", active);

      if (active) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    const isHome = pageId === "home";

    if (elements.dashboard) {
      elements.dashboard.hidden = !isHome;
    }

    if (elements.welcome) {
      elements.welcome.hidden = !isHome;
    }

    if (elements.page) {
      elements.page.hidden = isHome;
    }

    if (!isHome) {
      const config = pages[pageId];

      if (elements.title) {
        elements.title.textContent = config.title;
      }

      if (elements.eyebrow) {
        elements.eyebrow.textContent = config.eyebrow;
      }

      if (elements.description) {
        elements.description.textContent = config.description;
      }

      renderPageContent(pageId);
    }

    document.title = isHome
      ? "SIS — British Intelligence"
      : `${pages[pageId].title} | SIS`;

    window.history.replaceState(
      { page: pageId },
      "",
      pageId === "home" ? "#" : `#${pageId}`
    );

    if (elements.main) {
      elements.main.scrollTo({ top: 0, behavior: "smooth" });
    }

    document.dispatchEvent(
      new CustomEvent("sis:pagechange", {
        detail: { page: pageId }
      })
    );
  }

  function handleClick(event) {
    const pageButton = event.target.closest("[data-page]");

    if (pageButton) {
      event.preventDefault();
      navigate(pageButton.dataset.page);
      return;
    }

    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) return;

    switch (actionButton.dataset.action) {
      case "home":
        navigate("home");
        break;

      case "toggle-menu":
        setMenu(
          !elements.sidebar?.classList.contains("is-open")
        );
        break;

      default:
        document.dispatchEvent(
          new CustomEvent("sis:action", {
            detail: { action: actionButton.dataset.action }
          })
        );
    }
  }

  function init() {
    if (!elements.menu || !elements.sidebar || !elements.page) {
      console.error(
        "SIS: بعض عناصر الواجهة غير موجودة. راجع Index.html."
      );
      return;
    }

    document.addEventListener("click", handleClick);

    elements.backdrop?.addEventListener("click", () => {
      setMenu(false);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        setMenu(false);
      }
    });

    window.addEventListener("hashchange", () => {
      const pageId = window.location.hash.slice(1) || "home";

      if (pages[pageId] && pageId !== currentPage) {
        navigate(pageId);
      }
    });

    const initialPage = window.location.hash.slice(1);

    navigate(pages[initialPage] ? initialPage : "home");

    window.SISApp = Object.freeze({
      navigate,
      showToast,
      getCurrentPage: () => currentPage,
      getPages: () => ({ ...pages })
    });

    console.info("SIS App Controller initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();
