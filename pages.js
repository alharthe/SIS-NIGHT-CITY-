
/* SIS — NIGHT CITY | Internal Pages */
(() => {
  "use strict";

  const pages = {
    home: {
      title: "مركز القيادة",
      subtitle: "SIS — NIGHT CITY",
      content: `
        <div class="sis-grid">
          <button class="sis-card" data-open-page="profile">🪪<b>الملف الشخصي</b><span>عرض بياناتك</span></button>
          <button class="sis-card" data-open-page="map">🗺️<b>الخريطة</b><span>المواقع والعمليات</span></button>
          <button class="sis-card" data-open-page="headquarters">🏢<b>المقر الرئيسي</b><span>مركز القيادة</span></button>
          <button class="sis-card" data-open-page="members">👥<b>الأعضاء</b><span>إدارة الأشخاص</span></button>
          <button class="sis-card" data-open-page="missions">🎯<b>المهام</b><span>إدارة المهام</span></button>
          <button class="sis-card" data-open-page="network">🌐<b>NETWORK</b><span>شبكة الأشخاص والأنظمة</span></button>
          <button class="sis-card" data-open-page="store">📦<b>المخزن</b><span>العناصر والسجلات</span></button>
          <button class="sis-card" data-open-page="ai">🤖<b>المساعد الذكي</b><span>البحث في المعلومات المحفوظة</span></button>
          <button class="sis-card" data-open-page="activity">📋<b>سجل النشاط</b><span>الأحداث المسجلة</span></button>
          <button class="sis-card" data-open-page="settings">⚙️<b>الإعدادات</b><span>تخصيص النظام</span></button>
        </div>`
    },
    profile: {
      title: "الملف الشخصي",
      subtitle: "PERSONAL PROFILE",
      content: `<form data-save-form="profile">
        <label>الاسم</label><input name="name" placeholder="أدخل الاسم">
        <label>المعرف</label><input name="identity" placeholder="المعرف داخل النظام">
        <label>الرتبة</label><input name="rank" placeholder="الرتبة">
        <label>القسم</label><input name="department" placeholder="القسم">
        <button class="sis-action">حفظ البيانات</button>
      </form>`
    },
    map: {
      title: "الخريطة",
      subtitle: "OPERATION MAP",
      content: `<form data-add-item="locations">
        <label>اسم الموقع</label><input name="name" required placeholder="اسم الموقع">
        <label>تفاصيل الموقع</label><textarea name="details" placeholder="وصف الموقع"></textarea>
        <button class="sis-action">إضافة موقع</button>
      </form><div data-list="locations"></div>`
    },
    headquarters: {
      title: "المقر الرئيسي",
      subtitle: "HEADQUARTERS",
      content: `<p>مركز إدارة نظام SIS.</p>
        <div class="sis-grid">
          <button class="sis-card" data-open-page="members">👥<b>الأعضاء</b></button>
          <button class="sis-card" data-open-page="missions">🎯<b>المهام</b></button>
          <button class="sis-card" data-open-page="activity">📋<b>سجل النشاط</b></button>
        </div>`
    },
    members: {
      title: "الأعضاء",
      subtitle: "MEMBER NETWORK",
      content: `<form data-add-item="members">
        <label>اسم العضو</label><input name="name" required placeholder="الاسم">
        <label>المعرف</label><input name="identity" placeholder="المعرف">
        <label>الرتبة أو الدور</label><input name="role" placeholder="الرتبة أو الدور">
        <label>ملاحظات</label><textarea name="details" placeholder="معلومات إضافية"></textarea>
        <button class="sis-action">إضافة عضو</button>
      </form><div data-list="members"></div>`
    },
    missions: {
      title: "المهام",
      subtitle: "MISSION CONTROL",
      content: `<form data-add-item="missions">
        <label>اسم المهمة</label><input name="name" required placeholder="عنوان المهمة">
        <label>التفاصيل</label><textarea name="details" placeholder="تفاصيل المهمة"></textarea>
        <label>الحالة</label><select name="status"><option>جديدة</option><option>قيد التنفيذ</option><option>مكتملة</option></select>
        <button class="sis-action">إضافة مهمة</button>
      </form><div data-list="missions"></div>`
    },
    network: {
      title: "شبكة الأشخاص والأنظمة",
      subtitle: "NETWORK",
      content: `<form data-add-item="network">
        <label>الاسم</label><input name="name" required placeholder="اسم الشخص أو النظام">
        <label>النوع</label><select name="type"><option>شخص</option><option>نظام</option><option>جهة</option><option>معلومة</option></select>
        <label>الصورة (رابط اختياري)</label><input name="image" type="url" placeholder="https://...">
        <label>المعلومات</label><textarea name="details" placeholder="اكتب المعلومات المرتبطة"></textarea>
        <button class="sis-action">إضافة إلى NETWORK</button>
      </form><div data-list="network"></div>`
    },
    store: {
      title: "المخزن",
      subtitle: "SYSTEM STORAGE",
      content: `<form data-add-item="store">
        <label>اسم العنصر أو السجل</label><input name="name" required placeholder="اسم العنصر">
        <label>الكمية أو التصنيف</label><input name="quantity" placeholder="الكمية أو التصنيف">
        <label>التفاصيل</label><textarea name="details" placeholder="تفاصيل إضافية"></textarea>
        <button class="sis-action">حفظ في المخزن</button>
      </form><div data-list="store"></div>`
    },
    ai: {
      title: "المساعد الذكي",
      subtitle: "SIS INTELLIGENCE ASSISTANT",
      content: `<p>ابحث في البيانات التي حفظتها داخل هذا المتصفح.</p>
        <form id="sisSearchForm">
          <label>كلمة البحث</label><input name="query" required placeholder="اسم عضو أو مهمة أو معلومة">
          <button class="sis-action">بحث</button>
        </form><div data-search-results></div>
        <p class="sis-muted">هذه نسخة بحث محلية وليست اتصالًا بنموذج ذكاء اصطناعي خارجي.</p>`
    },
    activity: {
      title: "سجل النشاط",
      subtitle: "ACTIVITY LOG",
      content: `<div data-list="activity"></div>
        <button class="sis-action" data-refresh>تحديث السجل</button>`
    },
    settings: {
      title: "الإعدادات",
      subtitle: "SYSTEM SETTINGS",
      content: `<form data-save-form="settings">
        <label>اسم النظام</label><input name="systemName" value="SIS — NIGHT CITY">
        <label>لون الواجهة</label><select name="accent"><option value="#e3263a">أحمر</option><option value="#c9a227">ذهبي</option><option value="#3685ff">أزرق</option></select>
        <button class="sis-action">حفظ الإعدادات</button>
      </form>
      <button class="sis-action" data-export>تصدير نسخة احتياطية</button>
      <p class="sis-muted">البيانات محفوظة محليًا في هذا المتصفح فقط.</p>`
    }
  };

  const storageKey = "sis-night-city-pages-v1";
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch (_) {
    data = {};
  }

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function record(message) {
    data.activity ||= [];
    data.activity.unshift({ name: message, details: new Date().toLocaleString("ar-SA") });
    data.activity = data.activity.slice(0, 100);
    save();
  }

  function ensureStyles() {
    if (document.getElementById("sis-pages-style")) return;
    const style = document.createElement("style");
    style.id = "sis-pages-style";
    style.textContent = `
      #sisPageContent{color:#f4f4f4;font-family:Arial,sans-serif;padding:18px;direction:rtl}
      #sisPageContent .sis-heading{border-bottom:1px solid #7d1823;padding-bottom:14px;margin-bottom:20px}
      #sisPageContent h2{margin:0 0 8px;color:#f04455}
      #sisPageContent .sis-muted{color:#aaa;font-size:13px}
      #sisPageContent .sis-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:12px}
      #sisPageContent .sis-card{background:#151515;border:1px solid #343434;border-radius:12px;color:#fff;padding:18px 10px;display:flex;flex-direction:column;gap:9px;align-items:center;cursor:pointer;min-height:110px}
      #sisPageContent .sis-card:hover{border-color:#e3263a}
      #sisPageContent .sis-card span{font-size:12px;color:#aaa}
      #sisPageContent form{display:grid;gap:10px;max-width:650px;margin-bottom:20px}
      #sisPageContent label{font-size:13px;color:#ddd}
      #sisPageContent input,#sisPageContent textarea,#sisPageContent select{width:100%;box-sizing:border-box;background:#101010;color:#fff;border:1px solid #393939;border-radius:8px;padding:12px;font:inherit}
      #sisPageContent textarea{min-height:85px}
      #sisPageContent .sis-action{background:#a91426;color:white;border:0;border-radius:8px;padding:12px 16px;font-weight:bold;cursor:pointer;margin:5px 0}
      #sisPageContent .sis-entry{background:#151515;border:1px solid #333;border-right:3px solid #e3263a;border-radius:8px;padding:13px;margin:10px 0;overflow-wrap:anywhere}
      #sisPageContent .sis-entry img{max-width:100px;max-height:100px;object-fit:cover;border-radius:8px}
      @media(max-width:480px){#sisPageContent{padding:12px}#sisPageContent .sis-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;
    document.head.appendChild(style);
  }

  function getHost() {
    let host = document.getElementById("sisPageContent");
    if (host) return host;

    const candidates = [
      document.querySelector("main"),
      document.querySelector("#content"),
      document.querySelector(".content"),
      document.querySelector(".main-content"),
      document.querySelector(".app-content")
    ];
    const parent = candidates.find(el => el && !el.closest("header,nav,aside"));
    if (!parent) return null;

    host = document.createElement("section");
    host.id = "sisPageContent";
    parent.appendChild(host);
    return host;
  }

  function renderList(host, key) {
    const target = host.querySelector(`[data-list="${key}"]`);
    if (!target) return;
    const items = data[key] || [];
    target.innerHTML = items.length ? items.map(item => `
      <article class="sis-entry">
        ${item.image ? `<img src="${esc(item.image)}" alt="" loading="lazy">` : ""}
        <strong>${esc(item.name)}</strong>
        ${item.identity
