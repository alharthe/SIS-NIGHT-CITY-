
(() => {
  "use strict";

  const KEY = "sis_night_city_v2";

  const emptyData = () => ({
    networks: [],
    people: [],
    files: [],
    reports: [],
    archive: [],
    settings: { name: "SIS — NIGHT CITY" }
  });

  function readData() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return saved && typeof saved === "object"
        ? { ...emptyData(), ...saved }
        : emptyData();
    } catch {
      return emptyData();
    }
  }

  let data = readData();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch {
      toast("تعذر حفظ البيانات على هذا الجهاز");
      return false;
    }
  }

  function toast(message) {
    const box = document.getElementById("sisToast");
    if (!box) return;
    box.textContent = message;
    box.style.display = "block";
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      box.style.display = "none";
    }, 2600);
  }

  const types = {
    networks: "الشبكات",
    people: "الأشخاص",
    files: "الملفات",
    reports: "التقارير"
  };

  function makeId() {
    return Date.now().toString(36) +
      Math.random().toString(36).slice(2, 8);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);
  }

  function getList(type) {
    return data[type] || [];
  }

  function addItem(type, item) {
    if (!types[type]) return;
    data[type].push({
      id: makeId(),
      createdAt: new Date().toISOString(),
      ...item
    });
    save();
    loadSection(type === "networks" ? "network" : type);
    toast("تمت الإضافة بنجاح");
  }

  function renderItems(type, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const items = getList(type);

    if (!items.length) {
      element.innerHTML = `<p class="empty-state">لا توجد ${types[type]} حتى الآن.</p>`;
      return;
    }

    element.innerHTML = items.map(item => `
      <article class="sis-card" style="margin-top:12px">
        <h3>${escapeHTML(item.name || item.title)}</h3>
        <p>${escapeHTML(item.description || "لا يوجد وصف")}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="sis-button" data-action="edit-item"
            data-type="${type}" data-id="${item.id}">تعديل</button>
          <button class="sis-button" data-action="archive-item"
            data-type="${type}" data-id="${item.id}">أرشفة</button>
          <button class="sis-button" data-action="delete-item"
            data-type="${type}" data-id="${item.id}">حذف</button>
        </div>
      </article>
    `).join("");
  }

  function loadSection(page) {
    const mapping = {
      network: ["networks", "networkList"],
      people: ["people", "peopleList"],
      files: ["files", "filesList"],
      reports: ["reports", "reportsList"]
    };

    if (mapping[page]) {
      renderItems(...mapping[page]);
    }

    if (page === "archive") renderArchive();

    if (page === "settings") {
      const field = document.getElementById("systemName");
      if (field) field.value = data.settings.name;
    }
  }

  function askForItem(type) {
    const name = prompt("اكتب الاسم أو العنوان:");
    if (!name || !name.trim()) return;

    const description = prompt("اكتب الوصف (اختياري):") || "";
    addItem(type, { name: name.trim(), description });
  }

  function editItem(type, id) {
    if (!types[type]) return;
    const item = data[type].find(x => x.id === id);
    if (!item) return;

    const name = prompt("تعديل الاسم أو العنوان:", item.name || item.title);
    if (!name || !name.trim()) return;

    const description = prompt("تعديل الوصف:", item.description || "");
    item.name = name.trim();
    item.description = description || "";
    save();
    loadSection(type === "networks" ? "network" : type);
    toast("تم تحديث البيانات");
  }

  function archiveItem(type, id) {
    if (!types[type]) return;
    const index = data[type].findIndex(x => x.id === id);
    if (index < 0) return;

    const item = data[type].splice(index, 1)[0];
    data.archive.push({ ...item, originalType: type });
    save();
    loadSection(type === "networks" ? "network" : type);
    toast("تم نقل العنصر إلى الأرشيف");
  }

  function deleteItem(type, id) {
    if (!types[type]) return;
    if (!confirm("هل تريد حذف هذا العنصر نهائيًا؟")) return;

    data[type] = data[type].filter(x => x.id !== id);
    save();
    loadSection(type === "networks" ? "network" : type);
    toast("تم الحذف");
  }

  function renderArchive() {
    const box = document.getElementById("archiveList");
    if (!box) return;

    if (!data.archive.length) {
      box.innerHTML = "<p>الأرشيف فارغ.</p>";
      return;
    }

    box.innerHTML = data.archive.map(item => `
      <article class="sis-card" style="margin-top:12px">
        <h3>${escapeHTML(item.name || item.title)}</h3>
        <p>${escapeHTML(types[item.originalType] || "عنصر")}</p>
        <button class="sis-button" data-action="restore-item"
          data-id="${item.id}">استعادة</button>
        <button class="sis-button" data-action="delete-archive"
          data-id="${item.id}">حذف نهائي</button>
      </article>
    `).join("");
  }

  function restoreItem(id) {
    const index = data.archive.findIndex(x => x.id === id);
    if (index < 0) return;

    const item = data.archive.splice(index, 1)[0];
    const type = item.originalType;
    delete item.originalType;

    if (!types[type]) return;
    data[type].push(item);
    save();
    renderArchive();
    toast("تمت استعادة العنصر");
  }

  function searchAll(query) {
    const results = [];
    const q = query.trim().toLowerCase();
    if (!q) return results;

    Object.keys(types).forEach(type => {
      data[type].forEach(item => {
        const text = `${item.name || ""} ${item.title || ""} ${item.description || ""}`.toLowerCase();
        if (text.includes(q)) {
          results.push({ ...item, type });
        }
      });
    });

    return results;
  }

  function exportData() {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SIS-NIGHT-CITY-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    toast("تم تصدير البيانات");
  }

  function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          if (!imported || typeof imported !== "object") {
            throw new Error("Invalid data");
          }

          data = {
            ...emptyData(),
            ...imported,
            settings: {
              ...emptyData().settings,
              ...(imported.settings || {})
            }
          };

          save();
          toast("تم استيراد البيانات");
          window.SISApp?.navigate("home");
        } catch {
          toast("ملف النسخة الاحتياطية غير صالح");
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  function askAI() {
    const field = document.getElementById("aiQuestion");
    const box = document.getElementById("aiMessages");
    if (!field || !box) return;

    const question = field.value.trim();
    if (!question) return;

    const results = searchAll(question);
    const answer = results.length
      ? results.map(x => `${x.name || x.title} — ${types[x.type]}`).join("<br>")
      : "لم أعثر على معلومات مطابقة في البيانات المحفوظة.";

    box.innerHTML += `
      <div class="sis-card" style="margin-top:10px">
        <strong>أنت:</strong> ${escapeHTML(question)}
        <p><strong>SIS AI:</strong><br>${answer}</p>
      </div>
    `;

    field.value = "";
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const type = button.dataset.type;
    const id = button.dataset.id;

    switch (action) {
      case "add-network": askForItem("networks"); break;
      case "add-person": askForItem("people"); break;
      case "add-file": askForItem("files"); break;
      case "add-report": askForItem("reports"); break;
      case "edit-item": editItem(type, id); break;
      case "archive-item": archiveItem(type, id); break;
      case "delete-item": deleteItem(type, id); break;
      case "restore-item": restoreItem(id); break;

      case "delete-archive":
        if (confirm("حذف نهائي؟")) {
          data.archive = data.archive.filter(x => x.id !== id);
          save();
          renderArchive();
          toast("تم الحذف النهائي");
        }
        break;

      case "ask-ai": askAI(); break;
      case "export-data": exportData(); break;
      case "import-data": importData(); break;

      case "save-settings": {
        const field = document.getElementById("systemName");
        if (field) {
          data.settings.name = field.value.trim() || "SIS — NIGHT CITY";
          save();
          toast("تم حفظ الإعدادات");
        }
        break;
      }
    }
  });

  document.addEventListener("input", event => {
    if (event.target.id !== "globalSearch") return;

    const box = document.getElementById("searchResults");
    if (!box) return;

    const results = searchAll(event.target.value);
    box.innerHTML = results.length
      ? results.map(x => `
          <div class="sis-card" style="margin-top:10px">
            <strong>${escapeHTML(x.name || x.title)}</strong>
            <p>${escapeHTML(types[x.type])}</p>
          <
