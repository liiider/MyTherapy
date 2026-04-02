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
        <symbol id="i-bell" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M6.5 16.5h11l-1.2-1.7a5.8 5.8 0 0 1-1-3.3V10a4.3 4.3 0 1 0-8.6 0v1.5a5.8 5.8 0 0 1-1 3.3Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M10.3 18.8a1.9 1.9 0 0 0 3.4 0"/></symbol>
        <symbol id="i-note" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v12A1.5 1.5 0 0 1 17 19.5H7A1.5 1.5 0 0 1 5.5 18V6A1.5 1.5 0 0 1 7 4.5Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M8.5 9h7M8.5 12h7M8.5 15h4"/></symbol>
      </svg>
    `
  );

  const currentPage = document.body.dataset.page;
  document.querySelectorAll("[data-nav-page]").forEach((item) => {
    item.classList.toggle("active", item.dataset.navPage === currentPage);
  });

  const bindSheet = ({ triggerSelector, sheetId, closeId, onOpen, onClose }) => {
    const sheet = document.getElementById(sheetId);
    const close = closeId ? document.getElementById(closeId) : null;

    const openSheet = () => {
      if (!sheet) return;
      sheet.classList.add("open");
      if (typeof onOpen === "function") onOpen();
    };

    const closeSheet = () => {
      if (!sheet) return;
      sheet.classList.remove("open");
      if (typeof onClose === "function") onClose();
    };

    document.querySelectorAll(triggerSelector).forEach((trigger) => {
      trigger.addEventListener("click", openSheet);
    });

    close?.addEventListener("click", closeSheet);

    sheet?.querySelectorAll(".sheet-handle").forEach((handle) => {
      handle.addEventListener("click", closeSheet);
    });

    sheet?.addEventListener("click", (event) => {
      if (event.target === sheet) closeSheet();
    });
  };

  bindSheet({ triggerSelector: ".js-open-month", sheetId: "monthSheet", closeId: "closeMonthSheet" });
  bindSheet({ triggerSelector: ".js-open-message", sheetId: "messageSheet", closeId: "closeMessageSheet" });

  const quickAddModeStep = document.getElementById("quickAddModeStep");
  const quickAddCategoryStep = document.getElementById("quickAddCategoryStep");
  const quickAddModeChip = document.getElementById("quickAddModeChip");
  const quickAddBackBtn = document.getElementById("quickAddBackBtn");
  const quickAddModeButtons = document.querySelectorAll("[data-add-mode]");
  const quickAddCategoryButtons = document.querySelectorAll("[data-add-category]");
  let quickAddMode = "once";

  const quickAddRoutes = {
    long: {
      medication: "./medication-long-form.html",
      measure: "./therapy-rules.html?mode=long&category=measure",
      activity: "./therapy-rules.html?mode=long&category=activity",
      "mood-symptom": "./therapy-rules.html?mode=long&category=mood-symptom",
    },
  };

  const updateQuickAddModeChip = () => {
    if (!quickAddModeChip) return;
    quickAddModeChip.textContent = quickAddMode === "once" ? "单次记录" : "长期规划";
  };

  const showQuickAddModeStep = () => {
    quickAddModeStep?.classList.add("active");
    quickAddCategoryStep?.classList.remove("active");
    updateQuickAddModeChip();
  };

  const showQuickAddCategoryStep = () => {
    quickAddModeStep?.classList.remove("active");
    quickAddCategoryStep?.classList.add("active");
    updateQuickAddModeChip();
  };

  quickAddModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      quickAddMode = button.dataset.addMode === "long" ? "long" : "once";

      if (quickAddMode === "once") {
        window.location.assign("./medication-once-record.html?source=quick-add");
        return;
      }

      showQuickAddCategoryStep();
    });
  });

  quickAddBackBtn?.addEventListener("click", showQuickAddModeStep);

  quickAddCategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.addCategory;
      const target = quickAddRoutes[quickAddMode]?.[category];
      if (target) window.location.assign(target);
    });
  });

  bindSheet({
    triggerSelector: ".js-open-quick-add",
    sheetId: "quickAddSheet",
    onOpen: showQuickAddModeStep,
  });

  if (document.body.dataset.page === "today") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") === "med-once") {
      const name = (params.get("name") || "药物记录").trim();
      const time = (params.get("time") || "--:--").trim();
      const todayContent = document.querySelector(".today-content");
      const completedCard = document.querySelector(".today-completed-card");
      const completedList = document.querySelector(".today-completed-list");

      if (todayContent) {
        const notice = document.createElement("article");
        notice.className = "outline-note today-inline-notice";
        notice.textContent = `已保存：${name}（${time}），已加入对应时间的已完成记录。`;
        todayContent.insertBefore(notice, todayContent.firstElementChild || null);
      }

      if (completedCard instanceof HTMLDetailsElement) {
        completedCard.open = true;
        const summaryLabel = completedCard.querySelector("summary span");
        if (summaryLabel) summaryLabel.textContent = "已完成 2 项";
      }

      if (completedList) {
        const row = document.createElement("a");
        row.className = "task-row task-row-link today-line-card is-completed";
        row.href = "./task-detail.html";

        const icon = document.createElement("span");
        icon.className = "ico-badge";
        icon.innerHTML = '<svg class="ico"><use href="#i-pill"></use></svg>';

        const copy = document.createElement("div");
        copy.className = "task-copy";
        const strong = document.createElement("strong");
        strong.textContent = name;
        const meta = document.createElement("div");
        meta.className = "task-meta";
        const chip = document.createElement("span");
        chip.className = "mini-chip";
        chip.textContent = "单次记录";
        meta.appendChild(chip);
        copy.appendChild(strong);
        copy.appendChild(meta);

        const side = document.createElement("div");
        side.className = "today-line-side";
        const status = document.createElement("span");
        status.className = "today-line-status is-completed";
        status.textContent = "已完成";
        const timeNode = document.createElement("span");
        timeNode.className = "today-line-time";
        timeNode.textContent = time;
        side.appendChild(status);
        side.appendChild(timeNode);

        row.appendChild(icon);
        row.appendChild(copy);
        row.appendChild(side);
        completedList.insertBefore(row, completedList.firstElementChild || null);
      }

      const cleanURL = `${window.location.pathname}${window.location.hash || ""}`;
      window.history.replaceState({}, "", cleanURL);
    }
  }

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

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-result]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.result);
      if (!target) return;
      target.hidden = false;
      button.hidden = true;
    });
  });
});
