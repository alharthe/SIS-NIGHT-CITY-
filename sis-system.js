
/* ==========================================
   SIS SYSTEM — NIGHT CITY
   British Intelligence Interface
   ========================================== */

"use strict";

(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const STORAGE_KEY = "sis_night_city_v1";

  const state = {
    page: "home",
    search: "",
    data: loadData()
  };

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultData(), ...JSON.parse(saved) };
    } catch (error) {
      console.warn("SIS storage unavailable", error);
    }
    return defaultData();
  }

  function defaultData() {
    return {
      profile: {
        name: "SIS DIRECTOR",
        rank: "DIRECTOR",
        department: "BRITISH INTELLIGENCE",
        status: "ACTIVE",
        code: "SIS-001"
      },
      members: [],
      missions: [],
      networks: [],
      activities: [],
      settings: {
        systemName: "SIS — NIGHT CITY",
        language: "ar",
        notifications: true
      }
    };
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
      return true;
    } catch (error) {
      toast("تعذر حفظ البيانات على هذا الجهاز", "error");
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function recordActivity(action, details = "") {
    state.data.activities.unshift({
      id: createId(),
      action,
      details,
      date: new Date().toLocaleString("ar-SA")
    });

    state.data.activities = state.data.activities.slice(0, 100);
    saveData();
  }

  function createId() {
    return "SIS-" + Date.now().toString(36).toUpperCase()
      + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function toast(message, type = "success") {
    const container = $("#toast-container");
    if (!container) {
      console.log(message);
      return;
    }

    const item = document.createElement("div");
    item.className = `sis-toast ${type}`;
    item.textContent = message;
    container.appendChild(item);

    requestAnimationFrame(() => item.classList.add("show"));

    setTimeout(() => {
      item.classList.remove("show");
      setTimeout(() => item.remove(), 250);
    }, 3000);
  }

  const pages = {
    home: {
      title: "مركز العمليات",
      eyebrow: "COMMAND CENTER",
      description: "نظرة عامة على نظام SIS."
    },
    profile: {
      title: "الملف الشخصي",
      eyebrow: "PERSONNEL PROFILE",
      description: "بيانات الملف المحفوظة على هذا الجهاز."
    },
    map: {
      title: "الخريطة",
      eyebrow: "GLOBAL MAP",
      description: "مساحة تنظيمية للمواقع والملاحظات."
    },
    headquarters: {
      title: "المقر الرئيسي",
      eyebrow: "HEADQUARTERS",
      description: "مركز إدارة معلومات النظام."
    },
    members: {
      title: "الأعضاء",
      eyebrow: "PERSONNEL DATABASE",
      description: "إضافة الأسماء والرتب والبيانات."
    },
    missions: {
      title: "المهام",
      eyebrow: "MISSION CONTROL",
      description: "إدارة المهام وحالاتها."
    },
    network: {
      title: "شبكة الأشخاص",
      eyebrow: "INTELLIGENCE NETWORK",
      description: "تنظيم الأشخاص والعلاقات والملاحظات."
    },
    store: {
      title: "المتجر والمكافآت",
      eyebrow: "REWARDS",
      description: "سجل المكافآت التجريبي."
    },
    ai: {
      title: "مساعد SIS",
      eyebrow: "SIS INTELLIGENCE ASSISTANT",
      description: "ابحث في المعلومات المحفوظة داخل النظام."
    },
    settings: {
      title: "الإعدادات",
      eyebrow: "SYSTEM SETTINGS",
      description: "إعدادات الواجهة والبيانات."
    }
  };

  function setPage(page) {
    if (!pages[page]) page = "home";
    state.page = page;

    $$(".nav-item, [data-page]").forEach(button => {
      if (button.dataset.page) {
        button.classList.toggle("active", button.dataset.page === page);
      }
    });

    const title = $("#page-title");
    const eyebrow = $("#page-eyebrow");
    const description = $("#page-description");
    const welcome = $("#welcome");
    const view = $("#page-view");

    if (title) title.textContent = pages[page].title;
    if (eyebrow) eyebrow.textContent = pages[page].eyebrow;
    if (description) description.textContent = pages[page].description;

    if (welcome) welcome.hidden = page !== "home";
    if (view) view.hidden = page === "home";

    renderPage();
    closeSidebar();
  }

  function renderPage() {
    const content = $("#page-content");
    if (!content) return;

    const renderers = {
      profile: renderProfile,
      map: renderMap,
      headquarters: renderHeadquarters,
      members: renderMembers,
      missions: renderMissions,
      network: renderNetwork,
      store: renderStore,
      ai: renderAI,
      settings: renderSettings
    };

    content.innerHTML = renderers[state.page]
      ? renderers[state.page]()
      : "";

    if (state.page === "home") renderDashboard();
  }

  function renderDashboard() {
    const dashboard = $("#dashboard");
    if (!dashboard) return;

    const stats = [
      ["الأعضاء", state.data.members.length, "USERS"],
      ["المهام", state.data.missions.length, "MISSIONS"],
      ["الشبكة", state.data.networks.length, "NETWORK"],
      ["السجلات", state.data.activities.length, "ACTIVITY LOG"]
    ];

    dashboard.innerHTML = `
      <div class="sis-stats">
        ${stats.map(([label, value, sub]) => `
          <article class="sis-stat-card">
            <span class="sis-stat-label">${escapeHTML(label)}</span>
            <strong>${value}</strong>
            <small>${escapeHTML(sub)}</small>
          </article>
        `).join("")}
      </div>

      <section class="sis-panel">
        <div class="sis-panel-heading">
          <div>
            <span class="sis-eyebrow">SYSTEM STATUS</span>
            <h3>حالة النظام</h3>
          </div>
          <span class="sis-status">واجهة تجريبية</span>
        </div>
        <p>تم تشغيل واجهة SIS محليًا. البيانات التي تضيفها تُحفظ في متصفح هذا الجهاز.</p>
      </section>

      <section class="sis-panel">
        <div class="sis-panel-heading">
          <div>
            <span class="sis-eyebrow">RECENT ACTIVITY</span>
            <h3>آخر النشاطات</h3>
          </div>
        </div>
        ${activityList(5)}
      </section>
    `;
  }

  function renderProfile() {
    const p = state.data.profile;

    return `
      <section class="sis-panel">
        <span class="sis-eyebrow">PERSONNEL RECORD</span>
        <h3>بيانات المستخدم</h3>

        <form id="profile-form" class="sis-form">
          <label>الاسم
            <input name="name" value="${escapeHTML(p.name)}" required>
          </label>
          <label>الرتبة
            <input name="rank" value="${escapeHTML(p.rank)}" required>
          </label>
          <label>القسم
            <input name="department" value="${escapeHTML(p.department)}">
          </label>
          <label>الحالة
            <select name="status">
              ${["ACTIVE", "INACTIVE", "BUSY"].map(status =>
                `<option ${p.status === status ? "selected" : ""}>${status}</option>`
              ).join("")}
            </select>
          </label>
          <label>المعرف
            <input value="${escapeHTML(p.code)}" disabled>
          </label>
          <button class="sis-button primary" type="submit">حفظ الملف</button>
        </form>
      </section>
    `;
  }

  function renderMembers() {
    return `
      <section class="sis-panel">
        <h3>إضافة عضو</h3>
        <form id="member-form" class="sis-form">
          <label>الاسم
            <input name="name" placeholder="اسم العضو" required>
          </label>
          <label>الرتبة
            <input name="rank" placeholder="الرتبة" required>
          </label>
          <label>القسم
            <input name="department" placeholder="القسم">
          </label>
          <button class="sis-button primary" type="submit">+ إضافة عضو</button>
        </form>
      </section>
      <section class="sis-panel">
        <h3>قاعدة بيانات الأعضاء</h3>
        ${state.data.members.length ? `
          <div class="sis-table-wrap"><table class="sis-table">
            <thead><tr><th>الاسم</th><th>الرتبة</th><th>القسم</th><th>إجراء</th></tr></thead>
            <tbody>
              ${state.data.members.map(m => `
                <tr>
                  <td>${escapeHTML(m.name)}</td>
                  <td>${escapeHTML(m.rank)}</td>
                  <td>${escapeHTML(m.department || "—")}</td>
                  <td><button class="sis-button danger small" data-action="delete-member" data-id="${escapeHTML(m.id)}">حذف</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table></div>
        ` : emptyState("لا يوجد أعضاء", "أضف أول عضو إلى القائمة.")}
      </section>
    `;
  }

  function renderMissions() {
    return `
      <section class="sis-panel">
        <h3>إنشاء مهمة</h3>
        <form id="mission-form" class="sis-form">
          <label>عنوان المهمة
            <input name="title" placeholder="عنوان المهمة" required>
          </label>
          <label>الوصف
            <textarea name="description" rows="3" placeholder="تفاصيل المهمة"></textarea>
          </label>
          <label>الحالة
            <select name="status">
              <option>جديدة</option>
              <option>قيد التنفيذ</option>
              <option>مكتملة</option>
              <option>مؤجلة</option>
            </select>
          </label>
          <button class="sis-button primary" type="submit">إضافة المهمة</button>
        </form>
      </section>
      <section class="sis-panel">
        <h3>قائمة المهام</h3>
        ${state.data.missions.length ? state.data.missions.map(m => `
          <art
