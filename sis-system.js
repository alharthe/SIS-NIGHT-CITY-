
/* =========================================
   SIS — NIGHT CITY
   SYSTEM CORE v1.0
   File: sis-system.js
========================================= */

(() => {
  "use strict";

  if (window.SIS_SYSTEM_LOADED) return;
  window.SIS_SYSTEM_LOADED = true;

  const SIS = {
    name: "SIS — NIGHT CITY",
    version: "1.0.0",
    storageKey: "sis-night-city-system-v1"
  };

  const state = {
    currentSection: "dashboard",
    data: {
      people: [],
      files: [],
      reports: [],
      links: [],
      settings: {
        systemName: SIS.name
      }
    }
  };

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function createId(prefix = "NC") {
    return prefix + "-" +
      Date.now().toString(36) + "-" +
      Math.random().toString(36).slice(2, 8);
  }

  function loadData() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(SIS.storageKey) || "null"
      );

      if (!saved || typeof saved !== "object") return;

      ["people", "files", "reports", "links"].forEach(key => {
        if (Array.isArray(saved[key])) {
          state.data[key] = saved[key];
        }
      });

      if (saved.settings && typeof saved.settings === "object") {
        state.data.settings = {
          ...state.data.settings,
          ...saved.settings
        };
      }
    } catch (error) {
      console.error("[SIS] Data loading error:", error);
    }
  }

  function saveData() {
    try {
      localStorage.setItem(
        SIS.storageKey,
        JSON.stringify(state.data)
      );
      return true;
    } catch (error) {
      console.error("[SIS] Data saving error:", error);
      notify("تعذر حفظ البيانات.", "error");
      return false;
    }
  }

  function notify(message, type = "success") {
    let toast = $("#sis-system-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "sis-system-toast";
      toast.setAttribute("role", "status");

      Object.assign(toast.style, {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "100000",
        padding: "13px 18px",
        maxWidth: "90%",
        background: "#171115",
        color: "#fff",
        border: "1px solid #c21d30",
        borderRadius: "10px",
        fontFamily: "Arial,sans-serif",
        textAlign: "center"
      });

      document.body.appendChild(toast);
    }

    toast.style.borderColor =
      type === "error" ? "#ff596b" : "#c21d30";

    toast.textContent = message;
    toast.hidden = false;
  }

  // بقية وظائف النظام تُضاف في الجزء التالي.
j
  
  function injectStyles() {
    if ($("#sis-system-styles")) return;

    const style = document.createElement("style");
    style.id = "sis-system-styles";
    style.textContent = `
      #sis-system-overlay {
        position: fixed;
        inset: 0;
        z-index: 99998;
        display: none;
        overflow-y: auto;
        padding: 18px;
        background: rgba(5, 5, 8, .96);
        color: #f4f4f5;
        font-family: Arial, sans-serif;
        direction: rtl;
      }

      #sis-system-overlay.sis-open { display: block; }

      .sis-shell {
        max-width: 950px;
        margin: 0 auto;
        padding: 18px;
        border: 1px solid #57202a;
        border-radius: 16px;
        background: #101014;
      }

      .sis-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        border-bottom: 1px solid #342027;
        padding-bottom: 14px;
      }

      .sis-brand {
        margin: 0;
        color: #f04455;
        font-size: 22px;
      }

      .sis-muted { color: #aaa6ae; font-size: 13px; }

      .sis-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 16px 0;
      }

      .sis-btn {
        padding: 10px 13px;
        border: 1px solid #55212b;
        border-radius: 9px;
        background: #211419;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
      }

      .sis-btn:hover { background: #481923; }
      .sis-btn.primary { background: #a9152b; }
      .sis-btn.danger { border-color: #a9152b; color: #ff9ba5; }

      .sis-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
        gap: 12px;
        margin: 15px 0;
      }

      .sis-stat, .sis-card {
        padding: 15px;
        border: 1px solid #30232a;
        border-radius: 12px;
        background: #17171d;
      }

      .sis-stat strong {
        display: block;
        margin-top: 8px;
        color: #ff5367;
        font-size: 25px;
      }

      .sis-field {
        display: block;
        width: 100%;
        box-sizing: border-box;
        margin: 8px 0 13px;
        padding: 12px;
        border: 1px solid #40313a;
        border-radius: 8px;
        background: #09090d;
        color: #fff;
        font-size: 15px;
      }

      .sis-record {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
        margin: 10px 0;
        padding: 13px;
        border: 1px solid #30232a;
        border-radius: 10px;
        background: #15151a;
      }

      .sis-record h3 { margin: 0 0 7px; font-size: 16px; }
      .sis-record p { margin: 4px 0; color: #c8c4cc; font-size: 13px; }
      .sis-actions { display: flex; flex-wrap: wrap; gap: 6px; }

      .sis-close {
        font-size: 20px;
        min-width: 42px;
      }

      .sis-warning {
        padding: 12px;
        border-right: 3px solid #c21d30;
        background: #211419;
        color: #e6dce0;
        font-size: 13px;
        line-height: 1.7;
      }

      @media (max-width: 480px) {
        #sis-system-overlay { padding: 8px; }
        .sis-shell { padding: 12px; }
        .sis-record { flex-direction: column; }
        .sis-brand { font-size: 18px; }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureOverlay() {
    let overlay = $("#sis-system-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "sis-system-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    overlay.innerHTML = `
      <div class="sis-shell">
        <header class="sis-topbar">
          <div>
            <h2 class="sis-brand">SIS — NIGHT CITY</h2>
            <span class="sis-muted">مركز الأنظمة والمعلومات</span>
          </div>
          <button class="sis-btn sis-close" data-action="close"
            aria-label="إغلاق">✕</button>
        </header>

        <nav class="sis-nav" aria-label="أقسام النظام">
          <button class="sis-btn" data-section="dashboard">الرئيسية</button>
          <button class="sis-btn" data-section="people">NETWORK</button>
          <button class="sis-btn" data-section="files">الملفات</button>
          <button class="sis-btn" data-section="reports">التقارير</button>
          <button class="sis-btn" data-section="search">البحث المركزي</button>
          <button class="sis-btn" data-section="ai">SIS AI</button>
          <button class="sis-btn" data-section="settings">الإعدادات</button>
        </nav>

        <main id="sis-system-content"></main>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener("click", event => {
      if (event.target === overlay) closeSystem();
    });

    return overlay;
  }

  function openSystem(section = "dashboard") {
    injectStyles();
    ensureOverlay();
    $("#sis-system-overlay").classList.add("sis-open");
    navigate(section);
  }

  function closeSystem() {
    $("#sis-system-overlay")?.classList.remove("sis-open");
  }

  function navigate(section) {
    const allowed = [
      "dashboard", "people", "files", "reports",
      "search", "ai", "settings"
    ];

    state.currentSection = allowed.includes(section)
      ? section
      : "dashboard";

    render();
  }

  function render() {
    const content = $("#sis-system-content");
    if (!content) return;

    const data = state.data;
    const section = state.currentSection;

    if (section === "dashboard") {
      content.innerHTML = `
        <h2>مركز العمليات</h2>
        <p class="sis-muted">لوحة SIS الرئيسية</p>
        <div class="sis-grid">
          <div class="sis-stat">الأشخاص<strong>${data.people.length}</strong></div>
          <div class="sis-stat">الملفات<strong>${data.files.length}</strong></div>
          <div class="sis-stat">التقارير<strong>${data.reports.length}</strong></div>
          <div class="sis-stat">الروابط<strong>${data.links.length}</strong></div>
        </div>
        <div class="sis-warning">
          البيانات محفوظة محليًا في هذا المتصفح فقط.
          لا يوجد حاليًا خادم مركزي أو مزامنة بين الأجهزة.
        </div>
      `;
      return;
    }

    if (section === "people" || section === "files" || section === "reports") {
      const config = {
        people: {
          title: "NETWORK — شبكة الأشخاص",
          label: "اسم الشخص",
          placeholder: "الاسم أو المعرّف",
          extra: "الصفة أو الجهة",
          extraPlaceholder: "مثال: محلل"
        },
        files: {
          title: "ملفات المعلومات",
          label: "عنوان الملف",
          placeholder: "عنوان الملف",
          extra: "التفاصيل",
          extraPlaceholder: "اكتب ملخصًا غير حساس"
        },
        reports: {
          title: "التقارير",
          label: "عنوان التقرير",
          placeholder: "عنوان التقرير",
          extra: "محتوى التقرير",
          extraPlaceholder: "اكتب تفاصيل التقرير"
        }
      }[section];

      content.innerHTML = `
        <h2>${config.title}</h2>
        <form id="sis-add-form" data-kind="${section}">
          <label>${config.label}</label>
          <input class="sis-field" name="title"
            placeholder="${config.placeholder}" required maxlength="120">
          <label>${config.extra}</label>
          <textarea class="sis-field" name="details"
            placeholder="${config.extraPlaceholder}" rows="3"
            maxlength="4000"></textarea>
          <button class="sis-btn primary" type="submit">＋ إضافة سجل</button>
        </form>
        <hr style="border-color:#30232a;margin:20px 0">
        <div id="sis-record-list"></div>
      `;

      renderRecords(section);
      return;
    }

    if (section === "search") {
      content.innerHTML = `
        <h2>البحث المركزي</h2>
        <input class="sis-field" id="sis-search-input"
          placeholder="ابحث في الأشخاص والملفات والتقارير..." maxlength="200">
        <div id="sis-search-results"></div>
      `;
      return;
    }

    if (section === "ai") {
      content.innerHTML = `
        <h2>SIS AI</h2>
        <div class="sis-warning">
          واجهة SIS AI جاهزة للتطوير، لكن الذكاء الاصطناعي الحقيقي
          يحتاج إلى خدمة API واتصال آمن بخادم.
          لا يوجد اتصال فعلي بالذكاء الاصطناعي في هذه النسخة.
        </div>
        <p>يمكنك استخدام البحث المركزي للعثور على السجلات المحفوظة.</p>
        <button class="sis-btn primary" data-section="search">
          فتح البحث المركزي
        </button>
      `;
      return;
    }

    if (section === "settings") {
      content.innerHTML = `
        <h2>إعدادات النظام</h2>
        <label>اسم النظام</label>
        <input class="sis-field" id="sis-system-name"
          maxlength="100"
          value="${escapeHTML(data.settings.systemName || SIS.name)}">
        <button class="sis-btn primary" data-action="save-settings">
          حفظ الإعدادات
        </button>
        <hr style="border-color:#30232a;margin:20px 0">
        <h3>النسخ الاحتياطي</h3>
        <button class="sis-btn" data-action="export">تصدير البيانات</button>
        <label class="sis-btn" style="display:inline-block;margin-top:10px">
          استيراد نسخة احتياطية
          <input id="sis-import-file" type="file"
            accept=".json,application/json" hidden>
        </label>
        <p class="sis-muted">
          احتفظ بنسخة احتياطية. الاستيراد يستبدل البيانات الحالية.
        </p>
      `;
    }
  }

  function renderRecords(kind) {
    const container = $("#sis-record-list");
    if (!container) return;

    const records = state.data[kind];

    if (!records.length) {
      container.innerHTML = '<p class="sis-muted">لا توجد سجلات حتى الآن.</p>';
      return;
    }

    container.innerHTML = records.map(record => `
      <article class="sis-record">
        <div>
          <h3>${escapeHTML(record.title)}</h3>
          <p>${escapeHTML(record.details || "لا توجد تفاصيل")}</p>
          <p class="sis-muted">${escapeHTML(record.createdAt || "")}</p>
        </div>
        <div class="sis-actions">
          <button class="sis-btn danger"
            data-action="delete-record"
            data-kind="${kind}"
            data-id="${escapeHTML(record.id)}">حذف</button>
        </div>
      </article>
    `).join("");
  }

  function runSearch(query) {
    const output = $("#sis-search-results");
    if (!output) return;

    const term = query.trim().toLocaleLowerCase();

    if (!term) {
      output.innerHTML = '<p class="sis-muted">اكتب كلمة للبحث.</p>';
      return;
    }

    const kinds = [
      ["people", "الأشخاص"],
      ["files", "الملفات"],
      ["reports", "التقارير"]
    ];

    const matches = [];

    kinds.forEach(([kind, label]) => {
      state.data[kind].forEach(record => {
        const text = `${record.title} ${record.details || ""}`;
        if (text.toLocaleLowerCase().includes(term)) {
          matches.push({ ...record, kind, label });
        }
      });
    });

    output.innerHTML = matches.length
      ? matches.map(record => `
          <article class="sis-record">
            <div>
              <h3>${escapeHTML(record.title)}</h3>
              <p>${escapeHTML(record.label)}</p>
              <p>${escapeHTML(record.details || "")}</p>
            </div>
          </article>
        `).join("")
      : '<p class="sis-muted">لا توجد نتائج مطابقة.</p>';
  }

  function exportData() {
    const file = new Blob(
      [JSON.stringify(state.data, null, 2)],
      { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SIS-NIGHT-CITY-backup.json";
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("تم تجهيز ملف النسخة الاحتياطية.");
  }

  function importData(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);

        if (!imported || typeof imported !== "object" ||
            Array.isArray(imported)) {
          throw new Error("Invalid backup");
        }

        for (const key of ["people", "files", "reports", "links"]) {
          if (imported[key] !== undefined &&
              !Array.isArray(imported[key])) {
            throw new Error("Invalid section");
          }
        }

        const next = {
          people: imported.people || [],
          files: imported.files || [],
          reports: imported.reports || [],
          links: imported.links || [],
          settings: {
            systemName: String(imported.settings?.systemName || SIS.name)
          }
        };

        const previous = state.data;
        state.data = next;

        if (!saveData()) {
          state.data = previous;
          return;
        }

        render();
        notify("تم استيراد النسخة الاحتياطية.");
      } catch {
        notify("الملف غير صالح أو ليس نسخة SIS احتياطية.", "error");
      }
    };

    reader.onerror = () => notify("تعذرت قراءة الملف.", "error");
    reader.readAsText(file);
  }

  document.addEventListener("click", event => {
    const sectionButton = event.target.closest("[data-section]");
    if (sectionButton) {
      navigate(sectionButton.dataset.section);
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    const action = actionButton.dataset.action;

    if (action === "close") {
      closeSystem();
    }

    if (action === "delete-record") {
      const kind = actionButton.dataset.kind;
      const id = actionButton.dataset.id;

      if (!["people", "files", "reports"].includes(kind)) return;
      if (!confirm("هل تريد حذف هذا السجل؟")) return;

      state.data[kind] = state.data[kind].filter(item => item.id !== id);

      if (saveData()) {
        renderRecords(kind);
        notify("تم حذف السجل.");
      }
    }

    if (action === "save-settings") {
      const input = $("#sis-system-name");
      const name = input?.value.trim();

      if (!name) {
        notify("اكتب اسمًا للنظام.", "error");
        return;
      }

      state.data.settings.systemName = name;

      if (saveData()) {
        notify("تم حفظ الإعدادات.");
        render();
      }
    }

    if (action === "export") exportData();
  });

  document.addEventListener("submit", event => {
    const form = event.target.closest("#sis-add-form");
    if (!form) return;

    event.preventDefault();

    const kind = form.dataset.kind;
    if (!["people", "files", "reports"].includes(kind)) return;

    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    const details = String(formData.get("details") || "").trim();

    if (!title) {
      notify("اكتب عنوان السجل أولًا.", "error");
      return;
    }

    state.data[kind].unshift({
      id: createId(),
      title,
      details,
      createdAt: new Date().toLocaleString("ar-SA")
    });

    if (saveData()) {
      render();
      notify("تمت إضافة السجل.");
    }
  });

  document.addEventListener("input", event => {
    if (event.target.id === "sis-search-input") {
      runSearch(event.target.value);
    }
  });

  document.addEventListener("change", event => {
    if (event.target.id === "sis-import-fil
