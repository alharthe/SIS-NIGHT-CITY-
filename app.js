
// SIS — NIGHT CITY
// NETWORK MODULE
// Version 1.0
// لا يعدّل index.html أو style.css

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const STORAGE_KEY = "sis-night-city-network-v1";

  // حماية البيانات من التلف عند قراءة التخزين
  function loadData() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

      return {
        people: Array.isArray(saved.people) ? saved.people : [],
        files: Array.isArray(saved.files) ? saved.files : [],
        links: Array.isArray(saved.links) ? saved.links : []
      };
    } catch (error) {
      console.error("SIS: تعذر قراءة بيانات NETWORK", error);
      return { people: [], files: [], links: [] };
    }
  }

  let data = loadData();
  let activeTab = "overview";
  let overlay = null;

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      alert("تعذر حفظ البيانات. قد تكون مساحة التخزين ممتلئة.");
      console.error(error);
      return false;
    }
  }

  // عرض النصوص بأمان داخل HTML
  function safe(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function makeId() {
    return "NC-" + Date.now().toString(36) +
      "-" + Math.random().toString(36).slice(2, 8);
  }

  function empty(message) {
    return `<div class="sis-empty">${safe(message)}</div>`;
  }

  // إنشاء تنسيقات NETWORK دون استبدال تنسيقات الموقع الأصلية
  function installStyles() {
    if (document.getElementById("sis-network-styles")) return;

    const style = document.createElement("style");
    style.id = "sis-network-styles";

    style.textContent = `
      .sis-network-overlay {
        position:fixed; inset:0; z-index:99999;
        overflow:auto; background:#08080b; color:#f5f5f7;
        direction:rtl; font-family:Arial,sans-serif;
      }
      .sis-network-shell { max-width:1050px; margin:auto; padding:18px; }
      .sis-network-header {
        display:flex; justify-content:space-between; align-items:center;
        flex-wrap:wrap; gap:12px; padding:12px 0 20px;
        border-bottom:1px solid #392029;
      }
      .sis-network-brand { color:#f04458; font-size:12px; letter-spacing:2px; }
      .sis-network-title { font-size:27px; margin:8px 0; }
      .sis-network-muted { color:#a4a4af; font-size:13px; line-height:1.8; }
      .sis-network-button {
        border:1px solid #4c2630; background:#171115; color:#fff;
        border-radius:9px; padding:11px 14px; cursor:pointer;
        font-size:13px; font-weight:bold;
      }
      .sis-network-button.primary { background:#b91f35; border-color:#e33b51; }
      .sis-network-button.danger { color:#ff9aa6; }
      .sis-network-button:focus-visible { outline:2px solid #ff596b; outline-offset:2px; }
      .sis-network-stats {
        display:grid; grid-template-columns:repeat(3,minmax(0,1fr));
        gap:10px; margin:18px 0;
      }
      .sis-network-stat,.sis-network-panel,.sis-network-card {
        background:#111115; border:1px solid #2c2c34; border-radius:13px;
      }
      .sis-network-stat { padding:14px; }
      .sis-network-stat strong { display:block; color:#f04458; font-size:24px; margin-bottom:6px; }
      .sis-network-tabs { display:flex; flex-wrap:wrap; gap:8px; margin:18px 0; }
      .sis-network-tab.active { background:#b91f35; border-color:#e33b51; }
      .sis-network-panel { padding:16px; margin:12px 0; }
      .sis-network-panel h3 { margin:0 0 14px; font-size:17px; }
      .sis-network-form { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:11px; }
      .sis-network-field { display:flex; flex-direction:column; gap:7px; font-size:12px; color:#c9c9d0; }
      .sis-network-field.full { grid-column:1/-1; }
      .sis-network-input,.sis-network-select,.sis-network-textarea {
        box-sizing:border-box; width:100%; min-width:0;
        background:#09090c; color:white; border:1px solid #3a3a43;
        border-radius:9px; padding:12px; font-size:14px;
      }
      .sis-network-textarea { min-height:75px; resize:vertical; }
      .sis-network-list { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
      .sis-network-card { padding:13px; min-width:0; overflow-wrap:anywhere; }
      .sis-network-card h4 { margin:0 0 7px; font-size:15px; }
      .sis-network-card p { color:#aaaab5; font-size:12px; line-height:1.7; white-space:pre-wrap; }
      .sis-network-actions { display:flex; gap:7px; flex-wrap:wrap; margin-top:12px; }
      .sis-network-actions .sis-network-button { padding:8px 10px; }
      .sis-network-note {
        background:#180e12; border:1px solid #4a222b; border-radius:10px;
        padding:12px; margin:14px 0; color:#d8b9bf; font-size:12px; line-height:1.8;
      }
      .sis-network-link {
        padding:12px; margin:9px 0; border-right:2px solid #cf2c43;
        background:#171216; border-radius:8px; line-height:1.8;
        overflow-wrap:anywhere;
      }
      .sis-empty {
        padding:22px 12px; text-align:center; color:#a4a4ae;
        border:1px dashed #41414a; border-radius:10px; line-height:1.8;
      }
      @media(max-width:600px) {
        .sis-network-shell { padding:12px; }
        .sis-network-title { font-size:22px; }
        .sis-network-list,.sis-network-form { grid-template-columns:1fr; }
        .sis-network-field.full { grid-column:auto; }
        .sis-network-stat { padding:10px; }
        .sis-network-stat strong { font-size:20px; }
      }
    `;

    document.head.appendChild(style);
  }

  function personName(id) {
    return data.people.find(item => item.id === id)?.name || "شخص غير موجود";
  }

  function fileName(id) {
    return data.files.find(item => item.id === id)?.title || "ملف غير موجود";
  }

  function personCard(person) {
    return `
      <article class="sis-network-card">
        <div style="color:#f04458;font-size:11px;margin-bottom:8px">PERSON / ${safe(person.id)}</div>
        <h4>${safe(person.name)}</h4>
        <div class="sis-network-muted">${safe(person.role || "دون صفة محددة")}</div>
        <p>${safe(person.notes || "لا توجد ملاحظات.")}</p>
        <div class="sis-network-actions">
          <button class="sis-network-button" data-action="connect-person" data-id="${safe(person.id)}">ربط بملف</button>
          <button class="sis-network-button danger" data-action="delete-person" data-id="${safe(person.id)}">حذف</button>
        </div>
      </article>`;
  }

  function fileCard(file) {
    return `
      <article class="sis-network-card">
        <div style="color:#f04458;font-size:11px;margin-bottom:8px">RECORD / ${safe(file.id)}</div>
        <h4>${safe(file.title)}</h4>
        <p>${safe(file.description || "لا يوجد وصف.")}</p>
        <div class="sis-network-actions">
          <button class="sis-network-button danger" data-action="delete-file" data-id="${safe(file.id)}">حذف الملف</button>
        </div>
      </article>`;
  }

  function linkCard(link) {
    return `
      <div class="sis-network-link">
        <strong>${safe(personName(link.personId))}</strong>
        <span style="color:#f04458"> ↔ </span>
        <strong>${safe(fileName(link.fileId))}</strong>
        <div class="sis-network-muted">${safe(link.note || "علاقة مسجلة")}</div>
        <div class="sis-network-actions">
          <button class="sis-network-button danger" data-action="delete-link" data-id="${safe(link.id)}">إزالة العلاقة</button>
        </div>
      </div>`;
  }

  function renderStats() {
    const stats = overlay.querySelector("#sisNetworkStats");
    stats.innerHTML = `
      <div class="sis-network-stat"><strong>${data.people.length}</strong><span class="sis-network-muted">الأشخاص</span></div>
      <div class="sis-network-stat"><strong>${data.files.length}</strong><span class="sis-network-muted">الملفات</span></div>
      <div class="sis-network-stat"><strong>${data.links.length}</strong><span class="sis-network-muted">العلاقات</span></div>`;
  }

  function renderOverview(content) {
    content.innerHTML = `
      <section class="sis-network-panel">
        <h3>مركز الشبكة</h3>
        <p class="sis-network-muted">أضف سجلات تجريبية أو تنظيمية، ثم اربط الشخص بالملف المناسب.</p>
        <div class="sis-network-actions">
          <button class="sis-network-button primary" data-tab="people">＋ إضافة شخص</button>
          <button class="sis-network-button primary" data-tab="files">＋ إضافة ملف</button>
          <button class="sis-network-button" data-tab="links">عرض العلاقات</button>
        </div>
      </section>
      <section class="sis-network-panel">
        <h3>الأشخاص المضافون</h3>
        ${data.people.length ? `<div class="sis-network-list">${data.people.slice(-4).reverse().map(personCard).join("")}</div>` : empty("لا توجد سجلات أشخاص حتى الآن.")}
      </section>
      <section class="sis-network-panel">
        <h3>الملفات المضافة</h3>
        ${data.files.length ? `<div class="sis-network-list">${data.files.slice(-4).reverse().map(fileCard).join("")}</div>` : empty("لا توجد ملفات حتى الآن.")}
      </section>
      <section class="sis-network-panel">
        <h3>العلاقات</h3>
        ${data.links.length ? data.links.slice(-5).reverse().map(linkCard).join("") : empty("لا توجد علاقات مسجلة.")}
      </section>`;
  }

  function renderPeople(content) {
    content.innerHTML = `
      <section class="sis-network-panel">
        <h3>＋ تسجيل شخص</h3>
        <form id="sisPersonForm" class="sis-network-form">
          <label class="sis-network-field">الاسم
            <input class="sis-network-input" name="name" maxlength="80" required placeholder="اسم السجل">
          </label>
          <label class="sis-network-field">الصفة أو القسم
            <input class="sis-network-input" name="role" maxlength="80" placeholder="مثال: إدارة">
          </label>
          <label class="sis-network-field full">ملاحظات
            <textare
