# MyTherapy

Patient-side AI medication management product.

## MVP App

This repository now serves the mobile-app static prototype from `public/`. The Node backend and domain tests remain available for API/business-logic validation, but the primary browser entry is intentionally the phone-frame APP prototype, not a desktop web console.

Run:

```powershell
npm.cmd start
```

Use real Zhipu AI models instead of local mock:

```powershell
$env:ZHIPUAI_API_KEY="your-api-key"
$env:ZHIPU_TEXT_MODEL="glm-5"
$env:ZHIPU_VISION_MODEL="glm-4.5v"
$env:ZHIPU_TIMEOUT_MS="20000"
npm.cmd start
```

Do not commit API keys. `BIGMODEL_API_KEY` is also accepted as an alias. If no key is set, the app falls back to the local mock AI/OCR service. `ZHIPU_BASE_URL` can override the OpenAI-compatible endpoint for local proxy testing.

The backend OCR endpoint accepts either an `imageUrl` or pasted prescription text. If both are empty, it intentionally returns the mock draft so the demo remains usable offline. The current `public/` APP prototype is static; wiring those screens to the backend should be done as a separate mobile-app integration step.

Open:

```text
http://127.0.0.1:4173
```

Validate:

```powershell
npm.cmd run check
node test\domain.test.js
```

Notes:

- `public/` is the restored static mobile APP prototype.
- AI and OCR fall back to `server/aiMock.js` when no Zhipu API key is configured.
- Backend APIs are implemented with Node's built-in HTTP server.
- Local state is persisted to `data/app-state.json` at runtime.
- The app is a product MVP scaffold, not yet an App Store-ready iOS build.

## Project Docs

- [PRD](./docs/PRD.md)
- [PRD 中文版](./docs/PRD.zh-CN.md)
- [MVP Roadmap](./docs/MVP-roadmap.md)
- [MVP 路线图中文版](./docs/MVP-roadmap.zh-CN.md)
- [Technical Approach](./docs/tech-approach.md)
- [技术方案中文版](./docs/tech-approach.zh-CN.md)
- [竞品截图参考分析](./docs/competitor-reference-analysis.zh-CN.md)
- [Information Architecture](./docs/information-architecture.md)
- [信息架构中文版](./docs/information-architecture.zh-CN.md)
- [Page Structure](./docs/page-structure.md)
- [页面结构方案中文版](./docs/page-structure.zh-CN.md)
- [Home and OCR Core Flow](./docs/core-flow-home-ocr.md)
- [首页与 OCR 核心流程中文版](./docs/core-flow-home-ocr.zh-CN.md)
- [business-flow-page-design.md](./docs/business-flow-page-design.md)
- [business-flow-page-design.zh-CN.md](./docs/business-flow-page-design.zh-CN.md)
- [business-flow-page-design-v2.md](./docs/business-flow-page-design-v2.md)
- [business-flow-page-design-v2.zh-CN.md](./docs/business-flow-page-design-v2.zh-CN.md)
- [core-page-specs.md](./docs/core-page-specs.md)
- [core-page-specs.zh-CN.md](./docs/core-page-specs.zh-CN.md)
- [当前项目审查与上架计划](./docs/current-project-review-and-launch-plan.zh-CN.md)


- [decision-log.zh-CN.md](D:/MyTherapy/docs/decision-log.zh-CN.md)
