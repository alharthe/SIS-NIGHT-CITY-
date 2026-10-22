
/* =========================================
   SIS — NIGHT CITY
   SYSTEM CORE v2.0
   Arabic RTL | Mobile First
========================================= */

(() => {
  "use strict";

  if (window.SIS_SYSTEM_LOADED) return;
  window.SIS_SYSTEM_LOADED = true;

  const SIS = {
    name: "SIS — NIGHT CITY",
    version: "2.0.0",
    storageKey: "sis-night-city-v2"
  };

  const state = {
    currentSection: "dashboard",
    searchQuery: "",
    data: {
      people: [],
      files: [],
      reports: [],
      settings: {
        systemName: SIS.name,
        accent: "#e3263a"
      }
    }
  };

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  const makeId = () =>
    "NC-" + Date.now().toString(36) +
    "-" + Math.random().toString(36).slice(2, 7);

  const now = () => new Date().toLocaleString("ar-SA");

  function loadData() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(SIS.storageKey) || "null"
      );

      if (!saved || typeof saved !== "object") return;

      ["people", "files", "reports"].forEach(key => {
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
      console.error("[SIS] Load error:", error);
    }
  }

  function saveData(showMessage = false) {
    try {
      localStorage.setItem(
        SIS.storageKey,
        JSON.stringify(state.data)
      );

      if (showMessage) notify("تم حفظ البيانات بنجاح.");
      return true;
    } catch (error) {
      console.error("[SIS] Save error:", error);
      notify("تعذر الحفظ. قد تكون مساحة التخزين ممتلئة.", "error");
      return false;
    }
  }

  function notify(message, type = "success") {
    let toast = $("#sis-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "sis-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }

    toast.className = "sis-toast " +
      (type === "error" ? "is-error" : "");

    toast.textContent = message;
    toast.hidden = false;

    if (state.toastTimer) clearTimeout(state.toastTimer);

    state.toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 3000);
  }

  function injectStyles() {
    if ($("#sis-v2-styles")) return;

    const style = document.createElement("style");
    style.id = "sis-v2-styles";

    style.textContent = `
      #sis-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: none;
        overflow-y: auto;
        padding: 12px;
        background: rgba(4,4,7,.97);
        color: #f5f5f5;
        direction: rtl;
        font-family: Arial, sans-serif;
      }

      #sis-overlay.sis-visible { display: block; }

      #sis-overlay * { box-sizing: border-box; }

      .sis-shell {
        max-width: 1050px;
        min-height: calc(100vh - 24px);
        margin: 0 auto;
        padding: 18px;
        background: #0c0c10;
        border: 1px solid #3d1820;
        border-radius: 16px;
      }

      .sis-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        padding-bottom: 18px;
        border-bottom: 1px solid #352027;
      }

      .sis-brand {
        margin: 0;
        color: #f04455;
        font-size: 23px;
        letter-spacing: 1px;
      }

      .sis-subtitle {
        display: block;
        margin-top: 7px;
        color: #96939b;
        font-size: 12px;
      }

      .sis-pill {
        display: inline-block;
        padding: 7px 10px;
        border: 1px solid #4c2630;
        border-radius: 20px;
        color: #efb6bd;
        font-size: 11px;
      }

      .sis-nav {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        margin: 16px 0 22px;
      }

      .sis-btn {
        min-height: 42px;
        padding: 10px 12px;
        border: 1px solid #40252c;
        border-radius: 9px;
        background: #171216;
        color: #f4f4f5;
        font: inherit;
        font-size: 13px;
        cursor: pointer;
        transition: background .18s, border-color .18s;
      }

      .sis-btn:hover,
      .sis-btn:focus-visible {
        background: #32151d;
        border-color: #c21d30;
        outline: none;
      }

      .sis-btn.primary {
        background: #a9162b;
        border-color: #d32a40;
      }

      .sis-btn.danger {
        color: #ff9ba5;
        border-color: #73303b;
      }

      .sis-btn:disabled {
        opacity: .55;
        cursor: not-allowed;
      }

      .sis-heading {
        margin: 0 0 8px;
        font-size: 22px;
      }

      .sis-muted {
        color: #a5a0aa;
        font-size: 13px;
        line-height: 1.8;
      }

      .sis-accent { color: #f04455; }

      .sis-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin: 16px 0;
      }

      .sis-panel {
        min-width: 0;
        padding: 16px;
        border: 1px solid #30232a;
        border-radius: 12px;
        background: #151419;
      }

      .sis-panel h3 {
        margin: 0 0 10px;
        font-size: 15px;
      }

      .sis-stat strong {
        display: block;
        margin-top: 12px;
        color: #ff5367;
        font-size: 29px;
      }

      .sis-form { margin: 16px 0; }

      .sis-label {
        display: block;
        margin: 12px 0 6px;
        color: #d9d5dd;
        font-size: 13px;
      }

      .sis-input,
      .sis-select,
      .sis-textarea {
        display: block;
        width: 100%;
        min-height: 44px;
        padding: 12px;
        border: 1px solid #40313a;
        border-radius: 8px;
        background: #09090d;
        color: #fff;
        font: inherit;
        font-size: 14px;
      }

      .sis-textarea {
        min-height: 105px;
        resize: vertical;
      }

      .sis-input:focus,
      .sis-select:focus,
      .sis-textarea:focus {
        border-color: #d72b41;
        outline: 1px solid #d72b41;
      }

      .sis-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }

      .sis-list { margin-top: 18px; }

      .sis-record {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin: 10px 0;
        padding: 14px;
        border: 1px solid #33252c;
        border-radius: 10px;
        background: #141318;
      }

      .sis-record-main {
        min-width: 0;
        overflow-wrap: anywhere;
      }

      .sis-record h3 {
        margin: 0 0 8px;
        font-size: 15px;
      }

      .sis-record p {
        margin: 5px 0;
        color: #b9b4be;
        font-size: 12px;
        line-height: 1.8;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      .sis-avatar {
        width: 64px;
        height: 64px;
        flex-shrink: 0;
        border: 1px solid #632631;
        border-radius: 10px;
        object-fit: cover;
        background: #211419;
      }

      .sis-empty {
        padding: 24px 12px;
        border: 1px dashed #40313a;
        border-radius: 10px;
        color: #aaa;
        text-align: center;
        font-size: 13px;
        line-height: 1.9;
      }

      .sis-notice {
        margin: 14px 0;
        padding: 13px;
        border-right: 3px solid #c21d30;
        border-radius: 6px;
        background: #211419;
        color: #e6dce0;
        font-size: 12px;
        line-height: 1.9;
      }

      .sis-toast {
        position: fixed;
        z-index: 100001;
        bottom: 18px;
        left: 50%;
        transform: translateX(-50%);
        max-width: 90%;
        padding: 13px 18px;
        border: 1px solid #c21d30;
        border-radius: 10px;
        background: #171115;
        color: #fff;
        text-align: center;
        font: 14px Arial, sans-serif;
        box-shadow: 0 8px 28px #0008;
      }

      .sis-toast.is-error { border-color: #ff596b; }

      .sis-footer {
        margin-top: 28px;
        padding-top: 16px;
        border-top: 1px solid #30232a;
        color: #77717b;
        text-align: center;
        font-size: 11px;
      }

      @media (max-width: 600px) {
        #sis-overlay { padding: 6px; }
        .sis-shell { padding: 12px; border-radius: 11px; }
        .sis-nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .sis-grid { grid-template-columns: 1fr; }
        .sis-brand { font-size: 19px; }
        .sis-heading { font-size: 19px; }
        .sis-record { flex-direction: column; }
        .sis-record .sis-actions { width: 100%; }
        .sis-record .sis-btn { flex: 1; }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureOverlay() {
    let overlay = $("#sis-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "sis-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "نظام SIS");

    overlay.innerHTML = `
      <div class="sis-shell">
        <header class="sis-header">
          <div>
            <h2 class="sis-brand">SIS <span style="color:#fff">/ NC</span></h2>
            <span class="sis-subtitle">SECRET INTELLIGENCE SYSTEM</span>
          </div>
          <div class="sis-actions">
            <span class="sis-pill">NIGHT CITY</span>
            <button class="sis-btn" t
