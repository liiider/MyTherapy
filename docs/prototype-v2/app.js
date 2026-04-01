document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
      <svg class="sr-only" aria-hidden="true" focusable="false">
        <symbol id="i-calendar" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Z"/></symbol>
        <symbol id="i-pill" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9.5 4.5a5 5 0 0 1 7.1 0l2.9 2.9a5 5 0 0 1 0 7.1l-5.1 5.1a5 5 0 0 1-7.1 0l-2.9-2.9a5 5 0 0 1 0-7.1zM9 15l6-6"/></symbol>
        <symbol id="i-chart" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 19h16M7 16V9M12 16V5M17 16v-3"/></symbol>
        <symbol id="i-spark" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z"/><path fill="currentColor" d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z"/><path fill="currentColor" d="M5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z"/></symbol>
        <symbol id="i-user" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0"/></symbol>
        <symbol id="i-measure" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M6 4h12l2 5-8 11L4 9l2-5Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" d="M9 9h6"/></symbol>
        <symbol id="i-activity" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M3 13h4l2-5 4 10 2-5h6"/></symbol>
        <symbol id="i-mood" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M8.5 14.5a5 5 0 0 0 7 0M9 10h.01M15 10h.01"/></symbol>
        <symbol id="i-camera" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 7h3l1.5-2h7L17 7h3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m5 12 4.2 4.2L19 6.5"/></symbol>
        <symbol id="i-plus" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 5v14M5 12h14"/></symbol>
        <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 7v5l3 2"/></symbol>
        <symbol id="i-upload" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 16V5m0 0-4 4m4-4 4 4M5 19h14"/></symbol>
        <symbol id="i-chevron" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/></symbol>
      </svg>
    `
  );

  const currentPage = document.body.dataset.page;
  document.querySelectorAll("[data-nav-page]").forEach((item) => {
    item.classList.toggle("active", item.dataset.navPage === currentPage);
  });

  const monthSheet = document.getElementById("monthSheet");
  const closeMonthSheet = document.getElementById("closeMonthSheet");
  document.querySelectorAll(".js-open-month").forEach((trigger) => {
    trigger.addEventListener("click", () => monthSheet?.classList.add("open"));
  });
  closeMonthSheet?.addEventListener("click", () => monthSheet?.classList.remove("open"));
  monthSheet?.addEventListener("click", (event) => {
    if (event.target === monthSheet) monthSheet.classList.remove("open");
  });

  const progressButtons = document.querySelectorAll("[data-progress]");
  const progressPanels = document.querySelectorAll(".progress-panel");
  progressButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.progress;
      progressButtons.forEach((item) => item.classList.toggle("active", item === button));
      progressPanels.forEach((panel) => panel.classList.toggle("active", panel.id === "progress-" + mode));
    });
  });
});
