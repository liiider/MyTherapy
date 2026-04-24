const app = document.getElementById("app");

const routes = {
  today: { label: "今日", title: "今日", subtitle: "处理今天该吃什么、该记录什么，以及当前风险。" },
  import: { label: "导入", title: "AI / OCR 导入", subtitle: "先用 mock AI 结构化医嘱，确认后再生效。" },
  manual: { label: "手动录入", title: "手动录入", subtitle: "不用 AI 也能创建规则、一次性任务和健康记录。" },
  task: { label: "任务", title: "任务详情", subtitle: "完成、延后、跳过和补记都会写入记录。" },
  rules: { label: "疗程", title: "我的疗程", subtitle: "长期规则中心，一次性任务不会进入这里。" },
  ruleEdit: { label: "编辑规则", title: "编辑疗程规则", subtitle: "调整时间、说明、状态和库存阈值。" },
  progress: { label: "进展", title: "进展与导出", subtitle: "基于记录聚合，生成复诊资料。" },
  me: { label: "我的", title: "我的", subtitle: "账户、隐私、通知和数据设置。" },
  account: { label: "账户", title: "账户资料", subtitle: "维护本地用户资料，后续可接账号体系。" },
  notifications: { label: "通知", title: "通知设置", subtitle: "当前是可配置状态页，正式 iOS 版接系统权限。" },
  privacy: { label: "隐私", title: "隐私与免责声明", subtitle: "明确 AI 和医疗边界，提供上架前必需入口。" },
  backup: { label: "备份", title: "备份与同步", subtitle: "本地优先阶段先提供导出和重置，云同步后接入。" },
  help: { label: "帮助", title: "帮助与反馈", subtitle: "低频流程先收口到帮助页，不阻断核心闭环。" },
};

const navItems = ["today", "import", "rules", "progress", "me"];

const uiState = {
  route: "today",
  data: null,
  selectedTaskId: null,
  selectedRuleId: null,
  lastSuggestion: null,
  report: null,
  error: "",
};

init();

async function init() {
  uiState.route = routeFromHash();
  window.addEventListener("hashchange", () => {
    uiState.route = routeFromHash();
    render();
  });
  await refreshState();
}

async function refreshState() {
  try {
    uiState.error = "";
    uiState.data = await api("/api/state");
    render();
  } catch (error) {
    uiState.error = error.message;
    render();
  }
}

function render() {
  const route = routes[uiState.route] ? uiState.route : "today";
  const meta = routes[route];

  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <strong>MyTherapy</strong>
          <span>AI 用药管理 MVP</span>
        </div>
        <nav class="nav">${navItems.map((item) => navButton(item)).join("")}</nav>
        <div class="sidebar-footer">
          <p class="nav-note">AI 仅做结构化整理，不替代医生，也不自动决定剂量。</p>
          <button class="btn-ghost" data-action="reset">重置演示数据</button>
        </div>
      </aside>
      <main class="content-shell">
        <header class="topbar">
          <div class="title-block">
            <h1>${meta.title}</h1>
            <p class="muted">${meta.subtitle}</p>
          </div>
          <div class="button-row">
            <button class="btn-ghost" data-route="privacy">隐私与免责声明</button>
            <button class="btn-ghost" data-route="manual">手动录入</button>
            <button class="btn" data-route="import">新增医嘱</button>
          </div>
        </header>
        ${uiState.error ? `<div class="error">${escapeHtml(uiState.error)}</div>` : ""}
        ${uiState.data ? renderRoute(route) : `<div class="loading">正在加载数据...</div>`}
      </main>
      <nav class="mobile-tabs">${navItems.map((item) => navButton(item)).join("")}</nav>
    </div>
  `;

  bindEvents();
}

function navButton(route) {
  return `<button class="${uiState.route === route ? "active" : ""}" data-route="${route}">${routes[route].label}</button>`;
}

function renderRoute(route) {
  if (route === "today") return renderToday();
  if (route === "import") return renderImport();
  if (route === "manual") return renderManual();
  if (route === "task") return renderTask();
  if (route === "rules") return renderRules();
  if (route === "ruleEdit") return renderRuleEdit();
  if (route === "progress") return renderProgress();
  if (route === "me") return renderMe();
  if (route === "account") return renderAccount();
  if (route === "notifications") return renderNotifications();
  if (route === "privacy") return renderPrivacy();
  if (route === "backup") return renderBackup();
  return renderHelp();
}

function renderToday() {
  const data = uiState.data;
  const todayTasks = data.tasks
    .filter((task) => task.scheduledAt.startsWith(data.today))
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const pending = todayTasks.filter((task) => task.status === "pending" || task.status === "delayed");
  const done = todayTasks.filter((task) => task.status !== "pending" && task.status !== "delayed");
  const next = pending[0];

  return `
    <section class="grid three">
      ${metric("今日任务", todayTasks.length)}
      ${metric("完成率", `${data.summary.completionRate}%`)}
      ${metric("风险", data.risks.length)}
    </section>
    <section class="grid two">
      <article class="card">
        <div class="row">
          <div class="stack">
            <span class="tag brand">下一项</span>
            ${next ? `<h2>${escapeHtml(next.title)}</h2><p class="muted">${time(next.scheduledAt)} · ${escapeHtml(next.instruction)}</p>` : `<h2>今日清空</h2><p class="muted">没有待完成任务。</p>`}
          </div>
          ${next ? statusTag(next.status) : `<span class="tag success">已完成</span>`}
        </div>
        <div class="button-row">
          ${next ? `<button class="btn" data-route="task" data-task-id="${next.id}">处理任务</button>` : ""}
          <button class="btn-ghost" data-route="import">AI/OCR 导入</button>
          <button class="btn-ghost" data-route="manual">手动录入</button>
        </div>
      </article>
      <article class="card">
        <div class="row">
          <h2>风险提醒</h2>
          <span class="tag ${data.risks.length ? "danger" : "success"}">${data.risks.length} 项</span>
        </div>
        <div class="list">
          ${data.risks.map(renderRisk).join("") || `<p class="muted">当前没有需要处理的风险。</p>`}
        </div>
      </article>
    </section>
    <section class="grid two">
      <article class="card">
        <div class="row"><h2>待完成</h2><span class="pill">${pending.length} 条</span></div>
        <div class="list">${pending.map(renderTaskItem).join("") || `<p class="muted">暂无待完成任务。</p>`}</div>
      </article>
      <article class="card">
        <div class="row"><h2>已处理</h2><span class="pill">${done.length} 条</span></div>
        <div class="list">${done.map(renderTaskItem).join("") || `<p class="muted">完成后会形成记录。</p>`}</div>
      </article>
    </section>
  `;
}

function renderImport() {
  const draft = uiState.data.ocrDraft;
  const suggestion = uiState.lastSuggestion ?? uiState.data.aiSuggestions[0];

  return `
    <section class="grid two">
      <article class="card">
        <div class="row"><h2>自然语言 / 图片 mock</h2><span class="tag brand">Mock AI</span></div>
        <div class="field">
          <label for="aiText">输入医嘱或自己的描述</label>
          <textarea id="aiText">医生说这个补剂每天早上饭后吃一片。我最近晚上有点恶心。另外提醒我今晚 9 点补水。</textarea>
        </div>
        <div class="button-row">
          <button class="btn" data-action="analyze-ai">生成 AI 建议</button>
          <button class="btn-ghost" data-action="mock-ocr">模拟 OCR 图片识别</button>
        </div>
        <p class="muted">真实 API 接入后替换 /api/ai/analyze 和 /api/ocr/mock 即可。</p>
      </article>
      <article class="card">
        <div class="row"><h2>OCR 草稿确认</h2><span class="tag ${draft.status === "saved" ? "success" : "warn"}">${draft.status}</span></div>
        <form class="field-grid" data-form="ocr">
          ${input("title", "药名", draft.title)}
          ${input("dose", "剂量", draft.dose)}
          ${input("frequency", "频次", draft.frequency)}
          ${input("time", "时间", draft.time, "time")}
          ${input("instruction", "说明", draft.instruction)}
          ${input("notes", "备注", draft.notes)}
          <div class="field full">
            <div class="alert warn">低置信字段必须人工确认。保存后才会生成长期规则和今日任务。</div>
          </div>
          <div class="button-row field full">
            <button class="btn" type="submit">确认并保存为疗程规则</button>
            <button class="btn-ghost" type="button" data-action="defer-ocr">稍后处理</button>
          </div>
        </form>
      </article>
    </section>
    <section class="card">
      <div class="row"><h2>AI 建议结果</h2><span class="tag brand">${suggestion ? "可确认" : "待生成"}</span></div>
      ${suggestion ? renderSuggestion(suggestion) : `<p class="muted">点击“生成 AI 建议”后会出现规则、一次性任务和记录建议。</p>`}
    </section>
  `;
}

function renderManual() {
  return `
    <section class="grid three">
      <article class="card">
        <div class="row"><h2>长期规则</h2><span class="tag brand">进入疗程</span></div>
        <form class="field-grid" data-form="manual-rule">
          <div class="field full">
            <label for="manualRuleType">类型</label>
            <select id="manualRuleType" name="type">
              <option value="medication">药物</option>
              <option value="metric">指标</option>
              <option value="symptom">症状</option>
              <option value="mood">情绪</option>
              <option value="activity">活动</option>
            </select>
          </div>
          ${input("title", "名称", "晨间血压")}
          ${input("time", "每日时间", "07:30", "time")}
          ${input("instruction", "执行说明", "记录收缩压和舒张压")}
          ${input("notes", "备注", "复诊前重点关注")}
          <div class="field full">
            <div class="alert">如果类型选择药物，会默认创建库存对象；保存后参与今日任务生成。</div>
          </div>
          <button class="btn field full" type="submit">保存长期规则</button>
        </form>
      </article>
      <article class="card">
        <div class="row"><h2>一次性任务</h2><span class="tag warn">仅今天</span></div>
        <form class="field-grid" data-form="manual-task">
          <div class="field full">
            <label for="manualTaskType">类型</label>
            <select id="manualTaskType" name="type">
              <option value="reminder">提醒</option>
              <option value="activity">活动</option>
              <option value="symptom">症状</option>
              <option value="metric">指标</option>
            </select>
          </div>
          ${input("title", "任务名", "今晚整理病历")}
          ${input("scheduledAt", "计划时间", `${uiState.data.today}T21:20`)}
          ${input("instruction", "执行说明", "准备复诊资料")}
          <div class="field full">
            <div class="alert warn">一次性任务不会进入我的疗程，也不会生成未来任务。</div>
          </div>
          <button class="btn-secondary field full" type="submit">加入今日</button>
        </form>
      </article>
      <article class="card">
        <div class="row"><h2>直接记录</h2><span class="tag success">进入进展</span></div>
        <form class="field-grid" data-form="manual-record">
          <div class="field full">
            <label for="manualRecordType">类型</label>
            <select id="manualRecordType" name="type">
              <option value="metric">指标</option>
              <option value="symptom">症状</option>
              <option value="mood">情绪</option>
              <option value="activity">活动</option>
            </select>
          </div>
          ${input("actualAt", "记录时间", localNow())}
          ${input("value", "数值/结果", "128/82")}
          ${input("note", "备注", "晨起测量")}
          <div class="field full">
            <div class="alert">直接记录不生成提醒任务，但会进入历史和导出报告。</div>
          </div>
          <button class="btn-ghost field full" type="submit">写入记录</button>
        </form>
      </article>
    </section>
  `;
}

function renderSuggestion(suggestion) {
  return `
    <div class="grid three">
      <div class="item">
        <div class="row"><h3>长期规则</h3><span class="tag brand">${suggestion.ruleSuggestions.length} 条</span></div>
        <div class="list">${suggestion.ruleSuggestions.map((item) => `<p>${escapeHtml(item.title)} · ${item.time} · ${escapeHtml(item.instruction)}</p>`).join("")}</div>
        <button class="btn" data-action="save-ai-rules">保存规则</button>
      </div>
      <div class="item">
        <div class="row"><h3>一次性任务</h3><span class="tag warn">${suggestion.oneOffTasks.length} 条</span></div>
        <div class="list">${suggestion.oneOffTasks.map((item) => `<p>${escapeHtml(item.title)} · ${time(item.scheduledAt)}</p>`).join("")}</div>
        <button class="btn-secondary" data-action="add-one-off">仅今天</button>
      </div>
      <div class="item">
        <div class="row"><h3>直接记录</h3><span class="tag success">${suggestion.recordSuggestions.length} 条</span></div>
        <div class="list">${suggestion.recordSuggestions.map((item) => `<p>${escapeHtml(item.note)}</p>`).join("")}</div>
        <button class="btn-ghost" data-action="add-symptom-record">转成记录</button>
      </div>
    </div>
    <div class="alert warn">${escapeHtml(suggestion.disclaimer)}</div>
  `;
}

function renderTask() {
  const task = selectedTask();
  if (!task) {
    return `<section class="card"><h2>暂无任务</h2><p class="muted">请先在今日页或导入页创建任务。</p></section>`;
  }

  const rule = uiState.data.rules.find((item) => item.id === task.ruleId);
  return `
    <section class="grid two">
      <article class="card">
        <div class="row"><h2>${escapeHtml(task.title)}</h2>${statusTag(task.status)}</div>
        <p class="muted">${time(task.scheduledAt)} · ${escapeHtml(task.instruction)}</p>
        <div class="grid two">
          ${metric("task_id", task.id)}
          ${metric("rule_id", task.ruleId ?? "一次性")}
        </div>
        <form class="field-grid" data-form="task-action">
          <input type="hidden" name="taskId" value="${escapeAttribute(task.id)}" />
          <div class="field">
            <label for="actualAt">实际时间</label>
            <input id="actualAt" name="actualAt" value="${localNow()}" />
          </div>
          <div class="field">
            <label for="note">备注</label>
            <input id="note" name="note" value="" placeholder="可选" />
          </div>
          <div class="button-row field full">
            <button class="btn" name="action" value="done">已完成</button>
            <button class="btn-secondary" name="action" value="delayed">延后 30 分钟</button>
            <button class="btn-ghost" name="action" value="skipped">跳过</button>
            <button class="btn-ghost" name="action" value="backfilled">补记</button>
          </div>
        </form>
      </article>
      <article class="card">
        <h2>业务影响</h2>
        <div class="list">
          <div class="item compact"><strong>记录</strong><p class="muted">所有动作都会写入 Record，供进展和导出使用。</p></div>
          <div class="item compact"><strong>库存</strong><p class="muted">${rule?.inventory ? `完成后扣减 1 ${rule.inventory.unit}。当前 ${rule.inventory.amount} ${rule.inventory.unit}` : "此任务不影响库存。"}</p></div>
          <div class="item compact"><strong>提醒</strong><p class="muted">延后会移动当前 Task 时间，不会重复生成同一规则任务。</p></div>
        </div>
      </article>
    </section>
  `;
}

function renderRules() {
  const groups = groupBy(uiState.data.rules, (rule) => rule.type);
  const labels = {
    medication: "药物",
    symptom: "症状",
    mood: "情绪",
    metric: "指标",
    activity: "活动",
  };

  return `
    <section class="grid two">
      ${Object.entries(groups)
        .map(
          ([type, rules]) => `
          <article class="card">
        <div class="row"><h2>${labels[type] ?? type}规则</h2><span class="pill">${rules.length} 条</span></div>
            <div class="list">${rules.map(renderRuleItem).join("")}</div>
          </article>
        `,
        )
        .join("")}
    </section>
    <section class="card">
      <div class="row"><h2>没有医嘱图片？</h2><span class="tag brand">手动补充</span></div>
      <p class="muted">可以直接创建长期规则、一次性提醒或健康记录，后续仍会进入今日、进展和导出闭环。</p>
      <div class="button-row"><button class="btn" data-route="manual">手动录入</button></div>
    </section>
  `;
}

function renderRuleEdit() {
  const rule = selectedRule();
  if (!rule) {
    return `<section class="card"><h2>暂无规则</h2><p class="muted">请先通过导入页保存一条疗程规则。</p></section>`;
  }

  return `
    <section class="grid two">
      <article class="card">
        <div class="row"><h2>${escapeHtml(rule.title)}</h2><span class="tag ${rule.status === "enabled" ? "success" : "warn"}">${rule.status === "enabled" ? "启用中" : "暂停"}</span></div>
        <form class="field-grid" data-form="rule-edit">
          <input type="hidden" name="ruleId" value="${escapeAttribute(rule.id)}" />
          ${input("title", "名称", rule.title)}
          ${input("time", "提醒时间", rule.schedule.time, "time")}
          ${input("instruction", "执行说明", rule.instruction)}
          <div class="field">
            <label for="status">状态</label>
            <select id="status" name="status">
              <option value="enabled" ${rule.status === "enabled" ? "selected" : ""}>启用</option>
              <option value="paused" ${rule.status === "paused" ? "selected" : ""}>暂停</option>
            </select>
          </div>
          <div class="field full">
            <label for="notes">备注</label>
            <textarea id="notes" name="notes">${escapeHtml(rule.notes ?? "")}</textarea>
          </div>
          ${rule.inventory ? renderInventoryFields(rule.inventory) : `<div class="alert field full">此规则没有库存对象。</div>`}
          <div class="button-row field full">
            <button class="btn" type="submit">保存修改</button>
            <button class="btn-ghost" type="button" data-route="rules">返回疗程</button>
          </div>
        </form>
      </article>
      <article class="card">
        <h2>编辑规则</h2>
        <div class="list">
          <div class="alert warn">修改提醒时间后，会影响后续生成的 Task；已产生的 Record 不会被改写。</div>
          <div class="alert">暂停规则后，不再生成未来任务，但保留历史记录和导出内容。</div>
          <div class="alert">库存阈值只用于风险提醒，不等于医疗建议。</div>
        </div>
      </article>
    </section>
  `;
}

function renderInventoryFields(inventory) {
  return `
    <div class="field">
      <label for="inventoryAmount">当前库存</label>
      <input id="inventoryAmount" name="inventoryAmount" type="number" min="0" value="${escapeAttribute(inventory.amount)}" />
    </div>
    <div class="field">
      <label for="inventoryThreshold">低库存阈值</label>
      <input id="inventoryThreshold" name="inventoryThreshold" type="number" min="0" value="${escapeAttribute(inventory.threshold)}" />
    </div>
    <div class="field">
      <label for="inventoryUnit">单位</label>
      <input id="inventoryUnit" name="inventoryUnit" value="${escapeAttribute(inventory.unit)}" />
    </div>
  `;
}

function renderProgress() {
  const report = uiState.report ?? uiState.data.reports[uiState.data.reports.length - 1];
  return `
    <section class="grid three">
      ${metric("完成率", `${uiState.data.summary.completionRate}%`)}
      ${metric("记录数", uiState.data.records.length)}
      ${metric("启用规则", uiState.data.summary.activeRules)}
    </section>
    <section class="grid two">
      <article class="card">
        <div class="row"><h2>历史记录</h2><span class="pill">${uiState.data.records.length} 条</span></div>
        <div class="list">
          ${uiState.data.records
            .slice()
            .sort((a, b) => b.actualAt.localeCompare(a.actualAt))
            .map((record) => `<div class="item compact"><div class="row"><strong>${record.actualAt.replace("T", " ")}</strong><span class="tag">${record.action}</span></div><p class="muted">${escapeHtml(record.note)}</p></div>`)
            .join("")}
        </div>
      </article>
      <article class="card">
        <div class="row"><h2>复诊导出</h2><span class="tag brand">Record + Rule</span></div>
        <p class="muted">MVP 先生成 JSON 摘要，正式移动端再导出 PDF 或分享文件。</p>
        <div class="button-row">
          <button class="btn" data-action="create-report">生成报告</button>
          <button class="btn-ghost" data-route="backup">备份与同步</button>
        </div>
        ${report ? `<pre class="report-box">${escapeHtml(JSON.stringify(report, null, 2))}</pre>` : `<div class="empty">尚未生成报告。</div>`}
      </article>
    </section>
  `;
}

function renderMe() {
  return `
    <section class="grid two">
      <article class="card">
        <div class="row"><h2>${escapeHtml(uiState.data.profile.name)}</h2><span class="tag brand">本地优先</span></div>
        <p class="muted">当前数据存储在本机 JSON 文件。后续可替换为账号和云同步。</p>
        <div class="button-row">
          <button class="btn" data-route="account">账户资料</button>
          <button class="btn-ghost" data-route="backup">备份与同步</button>
        </div>
      </article>
      <article class="card">
        <div class="row"><h2>通知与隐私</h2><span class="tag ${uiState.data.profile.notificationHealthy ? "success" : "warn"}">${uiState.data.profile.notificationHealthy ? "正常" : "待接入"}</span></div>
        <p class="muted">正式 iOS 版需要接入本地通知权限、后台刷新、隐私政策、数据删除入口。</p>
        <div class="button-row">
          <button class="btn" data-route="notifications">通知设置</button>
          <button class="btn-ghost" data-route="privacy">隐私政策</button>
        </div>
      </article>
      <article class="card">
        <h2>上架检查</h2>
        <div class="list">
          <div class="alert warn">不提供诊断、治疗或剂量计算。</div>
          <div class="alert warn">AI 输出必须用户确认后生效。</div>
          <div class="alert warn">处方图片、OCR 文本和健康记录需要删除策略。</div>
        </div>
      </article>
      <article class="card">
        <h2>帮助与反馈</h2>
        <p class="muted">把低频问题收口到帮助页，避免打断今日用药主路径。</p>
        <button class="btn-ghost" data-route="help">打开帮助</button>
      </article>
    </section>
  `;
}

function renderAccount() {
  return `
    <section class="grid two">
      <article class="card">
        <h2>账户资料</h2>
        <form class="field-grid" data-form="profile">
          ${input("name", "显示名称", uiState.data.profile.name)}
          <div class="field full">
            <div class="alert">MVP 暂不做登录，多设备同步会在本地闭环验证后接入。</div>
          </div>
          <div class="button-row field full">
            <button class="btn" type="submit">保存资料</button>
            <button class="btn-ghost" type="button" data-route="me">返回我的</button>
          </div>
        </form>
      </article>
      <article class="card">
        <h2>后续账号能力</h2>
        <div class="list">
          <div class="item compact"><strong>登录</strong><p class="muted">用于云同步和跨设备恢复，不阻断 MVP。</p></div>
          <div class="item compact"><strong>家属协助</strong><p class="muted">暂不做复杂家庭协作，只保留未来入口。</p></div>
        </div>
      </article>
    </section>
  `;
}

function renderNotifications() {
  return `
    <section class="grid two">
      <article class="card">
        <h2>通知健康状态</h2>
        <form class="field-grid" data-form="notifications">
          <div class="field full">
            <label for="notificationHealthy">提醒状态</label>
            <select id="notificationHealthy" name="notificationHealthy">
              <option value="true" ${uiState.data.profile.notificationHealthy ? "selected" : ""}>已确认可触达</option>
              <option value="false" ${!uiState.data.profile.notificationHealthy ? "selected" : ""}>需要检查权限</option>
            </select>
          </div>
          <div class="field full">
            <div class="alert warn">Web MVP 不能检查 iOS 系统权限。正式版需要请求本地通知权限，并在我的页展示失败兜底。</div>
          </div>
          <div class="button-row field full">
            <button class="btn" type="submit">保存通知状态</button>
            <button class="btn-ghost" type="button" data-route="today">回到今日</button>
          </div>
        </form>
      </article>
      <article class="card">
        <h2>通知流程闭环</h2>
        <div class="list">
          <div class="item compact"><strong>规则生成任务</strong><p class="muted">每日任务来自已启用规则。</p></div>
          <div class="item compact"><strong>任务触达</strong><p class="muted">正式版由本地通知承接，不依赖云推送。</p></div>
          <div class="item compact"><strong>失败提示</strong><p class="muted">权限异常会进入今日风险提醒。</p></div>
        </div>
      </article>
    </section>
  `;
}

function renderPrivacy() {
  return `
    <section class="grid two">
      <article class="card">
        <h2>医疗与 AI 边界</h2>
        <div class="list">
          <div class="alert warn">MyTherapy 是记录和提醒工具，不提供诊断、治疗或剂量计算。</div>
          <div class="alert warn">AI 仅做 OCR 和结构化整理，所有药名、剂量、频次必须由用户确认。</div>
          <div class="alert">任何不确定内容都应以医生医嘱、处方或药师建议为准。</div>
        </div>
        <form data-form="privacy">
          <div class="button-row">
            <button class="btn" type="submit">${uiState.data.profile.privacyAcknowledged ? "已确认，重新保存" : "我已了解并确认"}</button>
            <button class="btn-ghost" type="button" data-route="import">继续导入</button>
          </div>
        </form>
      </article>
      <article class="card">
        <h2>数据处理说明</h2>
        <div class="list">
          <div class="item compact"><strong>本地数据</strong><p class="muted">当前演示数据保存在本机 data/app-state.json。</p></div>
          <div class="item compact"><strong>图片与 OCR</strong><p class="muted">当前为 mock，不上传真实处方图片。</p></div>
          <div class="item compact"><strong>删除能力</strong><p class="muted">MVP 以重置演示数据代替，正式版需提供账户级删除。</p></div>
        </div>
      </article>
    </section>
  `;
}

function renderBackup() {
  const snapshot = {
    exportedAt: localNow(),
    rules: uiState.data.rules.length,
    tasks: uiState.data.tasks.length,
    records: uiState.data.records.length,
    reports: uiState.data.reports.length,
  };

  return `
    <section class="grid two">
      <article class="card">
        <h2>本地备份</h2>
        <p class="muted">MVP 阶段先提供可读摘要和报告导出；云同步作为下一阶段。</p>
        <div class="grid two">
          ${metric("规则", snapshot.rules)}
          ${metric("任务", snapshot.tasks)}
          ${metric("记录", snapshot.records)}
          ${metric("报告", snapshot.reports)}
        </div>
        <div class="button-row">
          <button class="btn" data-action="create-report">生成复诊报告</button>
          <button class="btn-secondary" data-action="reset">重置演示数据</button>
        </div>
      </article>
      <article class="card">
        <h2>同步占位</h2>
        <div class="list">
          <div class="item compact"><strong>阶段 1</strong><p class="muted">本地优先，确保提醒和记录可靠。</p></div>
          <div class="item compact"><strong>阶段 2</strong><p class="muted">接入账号、云端数据库、图片存储和跨设备同步。</p></div>
          <div class="item compact"><strong>迁移要求</strong><p class="muted">保持 Rule、Task、Record、Inventory 对象边界稳定。</p></div>
        </div>
      </article>
    </section>
  `;
}

function renderHelp() {
  return `
    <section class="grid two">
      <article class="card">
        <h2>帮助与反馈</h2>
        <div class="list">
          <div class="item compact"><strong>看不懂医嘱</strong><p class="muted">先导入或输入医嘱，AI 只整理字段，保存前必须人工确认。</p></div>
          <div class="item compact"><strong>提醒没响</strong><p class="muted">进入通知设置查看状态；正式 iOS 版会接系统权限检测。</p></div>
          <div class="item compact"><strong>复诊准备</strong><p class="muted">在进展页生成报告，带上用药、症状和规则概览。</p></div>
        </div>
      </article>
      <article class="card">
        <h2>反馈占位</h2>
        <p class="muted">当前先保留入口。后续可以接邮件、表单或应用内反馈接口。</p>
        <div class="button-row">
          <button class="btn" data-route="today">回到今日</button>
          <button class="btn-ghost" data-route="me">返回我的</button>
        </div>
      </article>
    </section>
  `;
}

function renderTaskItem(task) {
  return `
    <div class="item">
      <div class="row">
        <div class="stack">
          <strong>${escapeHtml(task.title)}</strong>
          <p class="muted">${time(task.scheduledAt)} · ${escapeHtml(task.instruction)}</p>
        </div>
        ${statusTag(task.status)}
      </div>
      <div class="row">
        <span class="tag">${task.isOneOff ? "一次性" : "长期规则"}</span>
        <button class="btn-ghost" data-route="task" data-task-id="${task.id}">详情</button>
      </div>
    </div>
  `;
}

function renderRisk(risk) {
  return `
    <div class="item compact">
      <div class="row"><strong>${escapeHtml(risk.title)}</strong><span class="tag ${risk.severity === "high" ? "danger" : "warn"}">${risk.severity}</span></div>
      <p class="muted">${escapeHtml(risk.description)}</p>
    </div>
  `;
}

function renderRuleItem(rule) {
  return `
    <div class="item">
      <div class="row">
        <div class="stack"><strong>${escapeHtml(rule.title)}</strong><p class="muted">${rule.schedule.time} · ${escapeHtml(rule.instruction)}</p></div>
        <span class="tag ${rule.status === "enabled" ? "success" : "warn"}">${rule.status === "enabled" ? "启用中" : "暂停"}</span>
      </div>
      <div class="row">
        <span class="tag">${escapeHtml(rule.source)}</span>
        ${rule.inventory ? `<span class="tag warn">库存 ${rule.inventory.amount}/${rule.inventory.threshold} ${rule.inventory.unit}</span>` : ""}
      </div>
      <div class="button-row">
        <button class="${rule.status === "enabled" ? "btn-secondary" : "btn"}" data-action="toggle-rule" data-rule-id="${rule.id}" data-status="${rule.status === "enabled" ? "paused" : "enabled"}">${rule.status === "enabled" ? "暂停" : "启用"}</button>
        <button class="btn-ghost" data-route="ruleEdit" data-rule-id="${rule.id}">编辑</button>
      </div>
    </div>
  `;
}

function metric(label, value) {
  return `<div class="metric"><span class="muted">${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function input(name, label, value, type = "text") {
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${escapeAttribute(value ?? "")}" /></div>`;
}

function statusTag(status) {
  const labels = { pending: "待完成", done: "已完成", delayed: "已延后", skipped: "已跳过", backfilled: "已补记" };
  const classes = { pending: "brand", done: "success", delayed: "warn", skipped: "warn", backfilled: "success" };
  return `<span class="tag ${classes[status] ?? ""}">${labels[status] ?? status}</span>`;
}

function selectedTask() {
  return (
    uiState.data.tasks.find((task) => task.id === uiState.selectedTaskId) ??
    uiState.data.tasks.find((task) => task.status === "pending") ??
    uiState.data.tasks[0]
  );
}

function selectedRule() {
  return (
    uiState.data.rules.find((rule) => rule.id === uiState.selectedRuleId) ??
    uiState.data.rules.find((rule) => rule.type === "medication") ??
    uiState.data.rules[0]
  );
}

function bindEvents() {
  app.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      const route = button.dataset.route;
      if (button.dataset.taskId) {
        uiState.selectedTaskId = button.dataset.taskId;
      }
      if (button.dataset.ruleId) {
        uiState.selectedRuleId = button.dataset.ruleId;
      }
      location.hash = route;
    });
  });

  app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button));
  });

  bindForm("ocr", async (form) => {
    const body = Object.fromEntries(new FormData(form).entries());
    await mutate("/api/ocr/confirm", body);
    location.hash = "rules";
  });

  bindForm("manual-rule", async (form) => {
    const body = Object.fromEntries(new FormData(form).entries());
    await mutate("/api/rules/manual", body);
    location.hash = "rules";
  });

  bindForm("manual-task", async (form) => {
    const body = Object.fromEntries(new FormData(form).entries());
    await mutate("/api/tasks/manual", body);
    location.hash = "today";
  });

  bindForm("manual-record", async (form) => {
    const body = Object.fromEntries(new FormData(form).entries());
    await mutate("/api/records/manual", body);
    location.hash = "progress";
  });

  bindForm("task-action", async (form, event) => {
    const submitter = event.submitter;
    const body = Object.fromEntries(new FormData(form).entries());
    body.action = submitter?.value ?? "done";
    body.minutes = 30;
    const taskId = body.taskId;
    delete body.taskId;
    await mutate(`/api/tasks/${encodeURIComponent(taskId)}/action`, body);
    location.hash = "today";
  });

  bindForm("rule-edit", async (form) => {
    const body = Object.fromEntries(new FormData(form).entries());
    const ruleId = body.ruleId;
    delete body.ruleId;
    if (body.inventoryAmount !== undefined) {
      body.inventory = {
        amount: Number(body.inventoryAmount),
        threshold: Number(body.inventoryThreshold),
        unit: body.inventoryUnit,
      };
      delete body.inventoryAmount;
      delete body.inventoryThreshold;
      delete body.inventoryUnit;
    }
    await api(`/api/rules/${encodeURIComponent(ruleId)}`, { method: "PATCH", body });
    await refreshState();
    location.hash = "rules";
  });

  bindForm("profile", async (form) => {
    const body = Object.fromEntries(new FormData(form).entries());
    await api("/api/profile", { method: "PATCH", body });
    await refreshState();
    location.hash = "me";
  });

  bindForm("notifications", async (form) => {
    const body = Object.fromEntries(new FormData(form).entries());
    body.notificationHealthy = body.notificationHealthy === "true";
    await api("/api/profile", { method: "PATCH", body });
    await refreshState();
    location.hash = "today";
  });

  bindForm("privacy", async () => {
    await api("/api/profile", { method: "PATCH", body: { privacyAcknowledged: true } });
    await refreshState();
    location.hash = "me";
  });
}

function bindForm(name, handler) {
  const form = app.querySelector(`[data-form="${name}"]`);
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await handler(form, event);
    } catch (error) {
      uiState.error = error.message;
      render();
    }
  });
}

async function handleAction(button) {
  const action = button.dataset.action;
  try {
    if (action === "reset") {
      uiState.report = null;
      await mutate("/api/reset", {});
    }
    if (action === "mock-ocr") {
      await mutate("/api/ocr/mock", {});
    }
    if (action === "defer-ocr") {
      await mutate("/api/ocr/defer", {});
    }
    if (action === "analyze-ai") {
      const text = document.getElementById("aiText")?.value ?? "";
      const result = await api("/api/ai/analyze", { method: "POST", body: { text } });
      uiState.lastSuggestion = result.suggestion;
      render();
    }
    if (action === "save-ai-rules" && currentSuggestion()) {
      await mutate("/api/ai/save-rules", { rules: currentSuggestion().ruleSuggestions });
      location.hash = "rules";
    }
    if (action === "add-one-off" && currentSuggestion()) {
      await mutate("/api/tasks/one-off", currentSuggestion().oneOffTasks[0]);
      location.hash = "today";
    }
    if (action === "add-symptom-record" && currentSuggestion()) {
      await mutate("/api/records/symptom", currentSuggestion().recordSuggestions[0]);
      location.hash = "progress";
    }
    if (action === "toggle-rule") {
      await api(`/api/rules/${encodeURIComponent(button.dataset.ruleId)}`, {
        method: "PATCH",
        body: { status: button.dataset.status },
      });
      await refreshState();
    }
    if (action === "create-report") {
      const result = await api("/api/reports", { method: "POST", body: {} });
      uiState.report = result.report;
      uiState.data = result.state;
      render();
    }
  } catch (error) {
    uiState.error = error.message;
    render();
  }
}

async function mutate(url, body) {
  const result = await api(url, { method: "POST", body });
  if (result.state) {
    uiState.data = result.state;
    render();
    return result;
  }
  await refreshState();
  return result;
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message ?? "请求失败");
  }
  return payload;
}

function currentSuggestion() {
  return uiState.lastSuggestion ?? uiState.data.aiSuggestions[0];
}

function routeFromHash() {
  return (location.hash.replace(/^#/, "").split("?")[0] || "today").trim();
}

function groupBy(items, getKey) {
  return items.reduce((groups, item) => {
    const key = getKey(item);
    groups[key] ??= [];
    groups[key].push(item);
    return groups;
  }, {});
}

function time(dateTime) {
  return dateTime.slice(11, 16);
}

function localNow() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
