document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
      <svg class="sprite-defs" aria-hidden="true" focusable="false">
        <symbol id="i-home" viewBox="0 0 24 24"><path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        <symbol id="i-scan" viewBox="0 0 24 24"><path d="M7 4H5a1 1 0 0 0-1 1v2m0 10v2a1 1 0 0 0 1 1h2m10 0h2a1 1 0 0 0 1-1v-2m0-10V5a1 1 0 0 0-1-1h-2M7 12h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        <symbol id="i-pill" viewBox="0 0 24 24"><path d="M9.2 4.7a4.5 4.5 0 0 1 6.4 0l3.7 3.7a4.5 4.5 0 0 1 0 6.4l-4.5 4.5a4.5 4.5 0 0 1-6.4 0l-3.7-3.7a4.5 4.5 0 0 1 0-6.4zM9 15l6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        <symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 4 3.8 18.2A1.2 1.2 0 0 0 4.8 20h14.4a1.2 1.2 0 0 0 1-1.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9v4.5m0 3h.01" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.4 4.2 4.1L19 6.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.8v4.7l3 1.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        <symbol id="i-trend" viewBox="0 0 24 24"><path d="M4 16.5 9 11l4 4 7-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 7h4v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        <symbol id="i-ai" viewBox="0 0 24 24"><path d="M12 2.8 14 8l5.2 2L14 12l-2 5.2L10 12 4.8 10 10 8zM18.2 15.2l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" fill="currentColor"/></symbol>
        <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 19.2a7.6 7.6 0 0 1 14 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
        <symbol id="i-upload" viewBox="0 0 24 24"><path d="M12 16V6m0 0L8.5 9.5M12 6l3.5 3.5M5 18.5h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        <symbol id="i-save" viewBox="0 0 24 24"><path d="M5 4.5h11l3 3V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 4.5v5h7v-5M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>
        <symbol id="i-edit" viewBox="0 0 24 24"><path d="M4 20h4l9.8-9.8a2.1 2.1 0 1 0-3-3L5 17v3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m13.5 6.5 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
      </svg>
    `
  );

  const page = document.body.dataset.page;
  const iconMap = {
    today: "home",
    progress: "trend",
    ai: "ai",
    me: "user",
    home: "home",
    scan: "scan",
    pill: "pill",
    alert: "alert",
    check: "check",
    clock: "clock",
    trend: "trend",
    user: "user",
    upload: "upload",
    save: "save",
    edit: "edit",
    ai: "ai",
  };

  const makeIcon = (name, small = false) => {
    const id = iconMap[name];
    if (!id) return "";
    return `<svg class="icon${small ? " icon-sm" : ""}" aria-hidden="true"><use href="#i-${id}"></use></svg>`;
  };

  document.querySelectorAll("[data-icon]").forEach((element) => {
    if (element.querySelector("svg")) return;
    element.insertAdjacentHTML("afterbegin", makeIcon(element.dataset.icon, element.classList.contains("eyebrow")));
  });

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    if (link.querySelector("svg")) return;
    link.insertAdjacentHTML("afterbegin", makeIcon(link.dataset.pageLink));
  });

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    if (link.dataset.pageLink === page) {
      link.classList.add("active");
    }
  });

  document.querySelectorAll("[data-switch-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.switchGroup;
      const target = button.dataset.switchTarget;
      document.querySelectorAll(`[data-switch-group="${group}"]`).forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      document.querySelectorAll(`[data-panel-group="${group}"]`).forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panelTarget === target);
      });
    });
  });

  document.querySelectorAll("[data-result]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.result;
      const target = document.getElementById(targetId);
      if (!target) return;
      target.hidden = false;
      const siblings = target.parentElement?.querySelectorAll(".result-banner");
      siblings?.forEach((item) => {
        if (item !== target) item.hidden = true;
      });
    });
  });
});
