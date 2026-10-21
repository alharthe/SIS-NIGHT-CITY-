
document.addEventListener("DOMContentLoaded", () => {
  console.log("SIS — NIGHT CITY initialized");

  // البحث داخل عناصر التطبيق
  const searchInputs = document.querySelectorAll(
    'input[type="search"], [data-search]'
  );

  searchInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();

      const section =
        input.closest("section") || document;

      const items = section.querySelectorAll(
        "[data-searchable], .card"
      );

      items.forEach((item) => {
        const text = item.textContent.toLowerCase();

        item.hidden =
          query !== "" && !text.includes(query);
      });
    });
  });

  // تأكيد تشغيل الواجهة
  document.documentElement.dataset.appReady = "true";
});
