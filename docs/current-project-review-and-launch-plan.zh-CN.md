# MyTherapy 当前项目审查与上架计划

更新日期：2026-04-24

## 1. 当前项目状态

当前仓库还不是可上架 App 工程，主要由产品文档和 `docs/prototype-v2` HTML 原型组成。

已完成：

- PRD、MVP 路线图、技术方案、信息架构、页面结构、核心流程和数据流 PRD 已覆盖主产品方向。
- 原型已覆盖关键页面：今日、AI、OCR 确认、任务详情、我的疗程、进展导出、我的。
- 数据模型方向已明确：`Rule -> Task -> Record -> Progress/Export`，并补充 `Inventory`、`Risk Alert`、`OCR Draft`、`AI Suggestion`。
- 本次已在原型中补上本地业务闭环：OCR/AI 保存为规则、规则生成今日任务、任务动作写入记录、药物完成扣减库存、风险提醒、记录聚合和报告生成。

尚未完成：

- 没有真实 iOS/uni-app 工程。
- 没有 TypeScript 领域层、持久化层、通知调度层、OCR 服务接口、导出文件生成器。
- 没有真实表单校验、权限申请、错误处理、隐私政策、医疗免责声明、App Store 元数据。
- 现有 HTML 文件中的部分静态中文内容存在编码显示问题；本次原型主要通过 `app.js` 动态渲染新中文内容绕过，但后续应统一修复文件编码。

## 2. 已补齐的业务闭环

当前原型可跑通以下业务闭环：

1. OCR 草稿确认：`OCR Draft -> Rule`
2. AI 建议保存：`AI Suggestion -> Rule / One-off Task / Record`
3. 今日任务生成：`Rule -> Task`
4. 执行任务：`Task -> Record`
5. 库存联动：药物任务完成后扣减 `Inventory`
6. 风险提醒：库存不足和通知异常聚合为今日风险
7. 进展聚合：`Record -> completion rate / history`
8. 复诊导出：`Record + Rule snapshot -> Export Report`

对应文件：

- `docs/prototype-v2/app.js`

## 3. 现阶段产品判断

MVP 的核心假设仍然成立：用户愿意把医嘱/处方转成可执行计划，并持续完成提醒和记录。

但上架前必须控制医疗风险边界：

- 产品应定位为“用药记录和提醒工具”，不是诊断、处方、治疗或剂量建议工具。
- AI 只能做 OCR/结构化提取和用户输入整理，不能自动生成医疗判断。
- 所有药品、剂量、频次和疗程必须由用户确认后生效。
- App 内必须持续提醒用户遵医嘱，并在做医疗决定前咨询医生。

Apple App Review Guidelines 1.4.1 明确指出，可能提供不准确医疗信息、用于诊断或治疗的医疗 App 会被更严格审查；若准确性或方法无法验证可能被拒；医疗 App 也应提醒用户咨询医生。1.4.2 对药物剂量计算器还有更高门槛，因此 MyTherapy MVP 不应做“剂量计算器”。参考：Apple App Review Guidelines https://developer.apple.com/appstore/resources/approval/guidelines.html

## 4. 从现在到上架的工作拆分

### M0. 原型冻结

目标：锁定 MVP 业务闭环和页面范围。

交付物：

- 修复原型静态文件编码。
- 明确每个页面的输入、输出、异常和结束状态。
- 将本次 `localStorage` 原型闭环整理为领域模型测试用例。

退出标准：

- 团队能用原型完整演示：导入医嘱、确认计划、生成任务、完成记录、库存预警、导出复诊资料。

### M1. 可开发规格

目标：把原型转成工程规格。

交付物：

- TypeScript domain model：`Rule`、`Task`、`Record`、`Inventory`、`OcrDraft`、`ExportReport`。
- 状态机定义：草稿状态、任务状态、规则启停、导出状态。
- 本地数据库 schema。
- OCR 服务接口 contract。
- 错误码和用户可见错误文案。

退出标准：

- 可以在不依赖 UI 的情况下用单元测试跑通主业务链路。

### M2. iOS MVP 工程

目标：做出可 TestFlight 的真实 App。

建议技术路线仍按现有技术方案：`uni-app + Vue 3 + TypeScript`，但要优先验证 iOS 本地通知可靠性。

交付物：

- 首页/今日任务
- OCR 导入与确认
- 我的疗程
- 任务详情与执行动作
- 库存和风险提醒
- 进展历史
- 导出
- 本地持久化
- 本地通知

退出标准：

- 真机冷启动、离线、杀进程后提醒、跨天任务生成均能通过测试。

### M3. 安全、隐私和合规

目标：降低 App Review 和用户信任风险。

交付物：

- 隐私政策 URL。
- App Store privacy details / Privacy Nutrition Label 填写清单。
- 医疗免责声明和 AI 边界说明。
- OCR 图片处理策略：本地、临时上传、保留周期、删除能力。
- 健康数据权限策略。
- 敏感数据最小化清单。

Apple 要求提交 App 和更新时在 App Store Connect 中提供 App 隐私实践信息，并覆盖第三方 SDK 的数据收集；开发者需要保持信息准确和最新。参考：App privacy details on the App Store https://developer.apple.com/app-store/app-privacy-details/

如果后续接入 Apple Health，Apple HIG 要求只在需要时请求健康数据权限，提供清晰隐私政策，并说明数据用途。参考：HealthKit HIG https://developer.apple.com/design/human-interface-guidelines/healthkit

退出标准：

- App 内无“替代医生”“推荐剂量”“诊断病情”等高风险表达。
- 任何健康数据、图片、OCR 文本、记录导出都有明确保存和删除策略。

### M4. Beta 验证

目标：验证用户是否能持续使用闭环。

交付物：

- TestFlight build
- 10-30 名种子用户测试
- 事件埋点：导入、确认、任务生成、完成、跳过、延后、低库存、导出
- 崩溃和性能监控
- 反馈入口

退出标准：

- OCR 到确认转化率、确认后任务生成成功率、7 日留存、服药记录完成率达到可继续投入标准。

### M5. App Store 上架

目标：提交首个公开版本。

交付物：

- App Store Connect 元数据
- 截图和预览
- 年龄分级
- 隐私政策链接
- Support URL
- Review Notes：说明 AI 只做结构化提取、用户确认后生效、无剂量计算、无诊断治疗建议
- Demo data 或 demo mode

Apple Guideline 2.1 要求提交版本完整、URL 可用、经过真机测试，不能是占位或崩溃明显的版本。参考：App Review Guidelines https://developer.apple.com/appstore/resources/approval/guidelines.html

## 5. 建议优先级

P0：

- 建真实工程。
- 领域层和状态机先行。
- 本地持久化和本地通知。
- OCR 确认前不得生效。
- 医疗免责声明、隐私政策、数据删除能力。

P1：

- PDF/HTML 导出。
- 库存阈值和补货提醒。
- 副作用与指标记录。
- TestFlight 埋点。

P2：

- 云同步。
- 微信小程序裁剪版。
- 广告变现。
- Apple Health 集成。

## 6. 当前最大风险

- 医疗合规风险：如果文案或 AI 输出像“治疗建议/剂量建议”，上架风险高。
- 提醒可靠性风险：用药提醒比视觉功能更关键，必须真机验证。
- OCR 错误风险：必须强制用户确认，低置信字段必须突出。
- 隐私风险：处方图片和健康记录属于敏感数据，不能随意上传、长期保留或用于广告。
- 工程风险：现在还没有真实 App 工程，距离上架仍是“原型完成，工程未开始”的状态。

## 7. 下一步建议

下一步不要继续堆页面，先把本次原型闭环下沉为真实工程的领域层：

1. 初始化 `uni-app + Vue 3 + TypeScript` 工程。
2. 写领域模型和单元测试。
3. 实现本地数据库 repository。
4. 实现今日任务生成和任务执行。
5. 再接页面。
