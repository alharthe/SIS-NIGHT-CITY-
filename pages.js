
(() => {
  "use strict";

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  const templates = {
    home: () => `
      <div class="sis-card">
        <h2>مرحبًا بك في SIS — NIGHT CITY</h2>
        <p>مركز إدارة المعلومات والشبكات.</p>
        <p>استخدم قائمة الثلاث خطوط للوصول إلى أقسام النظام.</p>
      </div>
    `,

    network: () => `
      <div class="sis-card">
        <h2>◈ NETWORK</h2>
        <p>شبكة أشخاص وأنظمة.</p>
        <button class="sis-button" data-action="add-network">إنشاء شبكة جديدة</button>
        <div id="networkList" class="sis-list"></div>
      </div>
    `,

    people: () => `
      <div class="sis-card">
        <h2>الأشخاص</h2>
        <p>إدارة الأشخاص وربطهم بالشبكات.</p>
        <button class="sis-button" data-action="add-person">إضافة شخص</button>
        <div id="peopleList" class="sis-list"></div>
      </div>
    `,

    files: () => `
      <div class="sis-card">
        <h2>الملفات</h2>
        <p>حفظ وتنظيم الملفات وربطها بالأشخاص والشبكات.</p>
        <button class="sis-button" data-action="add-file">إضافة ملف</button>
        <div id="filesList" class="sis-list"></div>
      </div>
    `,

    reports: () => `
      <div class="sis-card">
        <h2>التقارير الاستخباراتية</h2>
        <button class="sis-button" data-action="add-report">إنشاء تقرير</button>
        <div id="reportsList" class="sis-list"></div>
      </div>
    `,

    search: () => `
      <div class="sis-card">
        <h2>البحث المركزي</h2>
        <input id="globalSearch" type="search" placeholder="ابحث في بيانات النظام...">
        <div id="searchResults"></div>
      </div>
    `,

    ai: () => `
      <div class="sis-card">
        <h2>✦ SIS AI</h2>
        <p>مساعد محلي للبحث في المعلومات المحفوظة.</p>
        <div id="aiMessages" class="sis-list"></div>
        <input id="aiQuestion" placeholder="اكتب سؤالك هنا...">
        <button class="sis-button" data-action="ask-ai">إرسال</button>
      </div>
    `,

    archive: () => `
      <div class="sis-card">
        <h2>الأرشيف</h2>
        <p>العناصر التي تم نقلها إلى الأرشيف.</p>
        <div id="archiveList" class="sis-list"></div>
      </div>
    `,

    settings: () => `
      <div class="sis-card">
        <h2>إعدادات النظام</h2>
        <label>اسم النظام</label>
        <input id="systemName" value="SIS — NIGHT CITY">
        <button class="sis-button" data-action="save-settings">حفظ الإعدادات</button>
        <hr>
        <button class="sis-button" data-action="export-data">تصدير البيانات</button>
        <button class="sis-button" data-action="import-data">استيراد البيانات</button>
      </div>
    `
  };

  function render(page, container) {
    if (!container || !templates[page]) return;

    container.innerHTML = templates[page]();

    if (window.SISSystem?.loadSection) {
      window.SISSystem.loadSection(page);
    }
  }

  window.SISPages = { render, escapeHTML };
})();
