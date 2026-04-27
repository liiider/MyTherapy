# MyTherapy Mobile

This is the iOS-ready mobile app track for MyTherapy.

## Architecture

- Client first: medication plans, tasks, records, reports, and most interactions are stored locally with `uni.setStorageSync`.
- Small backend: the server is only for AI/OCR API mediation now, and can later add account, subscription, and entitlement checks.
- Simple database path: MVP can stay local-only. The next backend step should store only user account, subscription status, device sync metadata, and explicit user exports.
- Privacy gate: AI persistence requires a user privacy acknowledgement before saving generated rules or records.

## iOS Readiness Scope

- `src/manifest.json` contains camera and photo library privacy descriptions.
- Core flows exist as native app pages: today, import, OCR review, task detail, therapy, progress, and profile.
- The current build target is uni-app. Install mobile dependencies inside `mobile/` before building iOS packages.

```powershell
cd mobile
npm install
npm run build:ios
```

The root project can run a dependency-free mobile structure gate:

```powershell
npm run mobile:verify
```
