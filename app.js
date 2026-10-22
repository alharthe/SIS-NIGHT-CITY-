document.addEventListener("DOMContentLoaded", () => {
  // تفعيل البطاقات لتصبح قابلة للضغط
  document.querySelectorAll(".card").forEach((card) => {
    card.style.cursor = "pointer";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    function openSection() {
      const title = card.querySelector("h2")?.textContent || "القسم";

      alert(
        title +
        "\n\nهذا القسم قيد التجهيز في نظام SIS — NIGHT CITY."
      );
    }

    card.addEventListener("click", openSection);

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSection();
      }
    });
  });

  // إظهار أن التطبيق تم تحميله
  document.documentElement.dataset.appReady = "true";
});
