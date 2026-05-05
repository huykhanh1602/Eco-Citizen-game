# Eco-Citizen AI — Kiến trúc & Luồng hoạt động

> **Mô tả:** Game mô phỏng quản lý thành phố (City Management Simulator) với AI.  
> **Công nghệ:** Next.js 16 (React 19) + FastAPI (Python) + Google Gemini AI.

---

## 1. Tổng quan kiến trúc

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Home   │  │  Story   │  │  Game    │  │  Result  │ │
│  │  Screen  │→│  Screen  │→│  Screen  │→│  Screen  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│         ↑               ↑               ↑                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │   App    │  │  Hooks   │  │  Context  │               │
│  │ Layout   │  │ (useState│  │ (Settings)│               │
│  │          │  │ ,useEffect)│  │          │               │
│  └──────────┘  └──────────┘  └──────────┘               │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTP POST /api/evaluate
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                       │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │  CORS    │  │  Pydantic│  │  Google Gemini AI      │ │
│  │  Middle- │→│  Models  │→│  (gemini-2.5-flash)     │ │
│  │  ware    │  │ (Request/│  │  + Prompt Engineering  │ │
│  │          │  │ Response)│  │  + JSON Mode           │ │
│  └──────────┘  └──────────┘  └────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Danh sách file & Chức năng chi tiết

### 2.1. Cấu hình gốc (Root Config)

| File                                          | Vai trò                  | Chức năng chính                                                                                                                                 |
| --------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [`package.json`](../package.json)             | **Quản lý dự án**        | Khai báo metadata, scripts (`dev`, `build`, `start`, `lint`), dependencies (Next.js 16.2.4, React 19.2.4, lucide-react, motion, tw-animate-css) |
| [`next.config.ts`](../next.config.ts)         | **Cấu hình Next.js**     | Cho phép remote images từ `images.unsplash.com`, bật React Compiler                                                                             |
| [`tsconfig.json`](../tsconfig.json)           | **Cấu hình TypeScript**  | Target ES2017, strict mode, path alias `@/*` → `./src/*`                                                                                        |
| [`postcss.config.mjs`](../postcss.config.mjs) | **Cấu hình PostCSS**     | Tích hợp `@tailwindcss/postcss` plugin                                                                                                          |
| [`eslint.config.mjs`](../eslint.config.mjs)   | **Cấu hình ESLint**      | Dùng `eslint-config-next` core-web-vitals + typescript rules                                                                                    |
| [`vercel.json`](../vercel.json)               | **Cấu hình Vercel**      | Rewrite `/api/*` → `/api/index.py` (serverless Python backend)                                                                                  |
| [`.gitignore`](../.gitignore)                 | **Git ignore**           | Loại trừ `node_modules/`, `.next/`, `venv/`, `.env`, `__pycache__/`, v.v.                                                                       |
| [`AGENTS.md`](../AGENTS.md)                   | **Hướng dẫn AI Agent**   | Cảnh báo Next.js phiên bản này có breaking changes, yêu cầu đọc docs trong `node_modules/next/dist/docs/`                                       |
| [`CLAUDE.md`](../CLAUDE.md)                   | **Hướng dẫn Claude AI**  | Tham chiếu đến `AGENTS.md`                                                                                                                      |
| [`README.md`](../README.md)                   | **Hướng dẫn chạy dự án** | Hướng dẫn chi tiết start backend Python + frontend Next.js                                                                                      |

### 2.2. Backend — Python FastAPI

| File                                              | Vai trò          | Chức năng chính                                                                                                     |
| ------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| [`api/index.py`](../api/index.py)                 | **API Server**   | Xử lý request từ game, gọi Gemini AI để đánh giá quyết định của người chơi, trả về JSON phân tích + thay đổi chỉ số |
| [`api/requirements.txt`](../api/requirements.txt) | **Dependencies** | `fastapi`, `uvicorn`, `google-generativeai`, `python-dotenv`, `pydantic`                                            |

#### Chi tiết [`api/index.py`](../api/index.py:1)

**Các thành phần:**

- **Pydantic Models:**
    - [`CurrentMetrics`](../api/index.py:32) — 4 chỉ số thành phố: `energy`, `environment`, `budget`, `trust`
    - [`GameRequest`](../api/index.py:38) — Request body: event context, scientific rules, user input, language, current metrics
    - [`ResourceChanges`](../api/index.py:45) — Thay đổi 4 chỉ số (số nguyên)
    - [`GameResponse`](../api/index.py:51) — Response: analysis, consequence, changes, suggestion, game_over_story

- **Endpoint chính:** [`POST /api/evaluate`](../api/index.py:59)
    - Nhận request → xây dựng prompt cho Gemini → model `gemini-2.5-flash` với `response_mime_type: application/json`
    - Parse JSON response → trả về `GameResponse`
    - Có fallback khi API lỗi (HTTPException 500 với dữ liệu mặc định)

**Prompt Engineering (critical logic):**

- Yêu cầu AI phân tích dựa trên `event_context` + `scientific_rules`
- Tính điểm cộng/trừ cho 4 metrics
- Nếu bất kỳ metric nào ≤ 0 → `game_over_story` được sinh ra
- Hỗ trợ song ngữ (tiếng Việt / tiếng Anh)

### 2.3. Frontend — Next.js (React)

#### 2.3.1. Entry Points & Layout

| File                                          | Vai trò         | Chức năng chính                                                               |
| --------------------------------------------- | --------------- | ----------------------------------------------------------------------------- |
| [`src/app/layout.tsx`](../src/app/layout.tsx) | **Root Layout** | Cấu hình metadata, import CSS global, bọc `SettingsProvider` cho toàn app     |
| [`src/app/page.tsx`](../src/app/page.tsx)     | **Trang chính** | Điều khiển toàn bộ luồng game (Home → Story → Game → Result/Victory/GameOver) |

#### Chi tiết [`src/app/page.tsx`](../src/app/page.tsx:13)

**State Machine (4 trạng thái):**

| State        | Component hiển thị | Mô tả                                                                      |
| ------------ | ------------------ | -------------------------------------------------------------------------- |
| `'home'`     | Home Screen        | Màn hình chào, nút "Start Game", particles nền, Settings Modal             |
| `'story'`    | Story Screen       | Cinematic intro với letterbox bars, story paragraphs fade-in, nền town.png |
| `'game'`     | Game Screen        | `Dashboard` + `GameStage` + `ActionBar` (input + submit)                   |
| `turnResult` | Result Screen      | Hiển thị phân tích từ AI, stat changes badges, nút "Next Month"            |
| `gameOver`   | Game Over Screen   | Tragic ending với debris particles, story từ AI                            |
| `isVictory`  | Victory Screen     | Celebration với confetti, trophy, "Completed 1 Year Term"                  |

**Game State (useState hooks):**

- [`metrics`](../src/app/page.tsx:22) — `{ energy, environment, budget, trust }` khởi tạo 50/100
- [`currentEvent`](../src/app/page.tsx:23) — Sự kiện hiện tại từ `eventBank`
- [`month`](../src/app/page.tsx:29) — Tháng hiện tại (1-12)
- [`turnResult`](../src/app/page.tsx:26) — Kết quả lượt chơi từ AI
- [`gameOver`](../src/app/page.tsx:27) / [`isVictory`](../src/app/page.tsx:28) — Trạng thái kết thúc

**Luồng chính:**

1. [`useEffect`](../src/app/page.tsx:32) — Khởi tạo: load game state từ `localStorage`, hoặc random event mới
2. [`useEffect`](../src/app/page.tsx:66) — Auto-save game state vào `localStorage` mỗi khi state thay đổi
3. [`handleSubmit`](../src/app/page.tsx:82) — Gửi quyết định → gọi API → cập nhật metrics → kiểm tra game over
4. [`handleNextTurn`](../src/app/page.tsx:141) — Qua tháng mới: random event mới, reset input, tăng month

#### 2.3.2. Components

| File                                                           | Vai trò                   | Props                                                                              |
| -------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| [`Dashboard.tsx`](../src/app/components/Dashboard.tsx)         | **Thanh chỉ số + Header** | `month`, `metrics`, `onSettingsClick`                                              |
| [`GameStage.tsx`](../src/app/components/GameStage.tsx)         | **Hiển thị sự kiện**      | `currentEvent: GameEvent`                                                          |
| [`ActionBar.tsx`](../src/app/components/ActionBar.tsx)         | **Input + Submit**        | `userInput`, `setUserInput`, `isAnalyzing`, `onSubmit`                             |
| [`SettingsModal.tsx`](../src/app/components/SettingsModal.tsx) | **Modal cài đặt**         | `isOpen`, `onClose`, `allowLanguageChange`, `onRestart`, `onGoHome`, `onWinAlways` |

##### [`Dashboard.tsx`](../src/app/components/Dashboard.tsx:15)

- **Vai trò:** Header bar hiển thị tháng + 4 thanh chỉ số (Energy, Environment, Budget, Trust)
- **Chi tiết:**
    - Mỗi chỉ số có icon riêng (Zap, Leaf, Coins, Heart) và màu sắc phân biệt
    - Thanh progress bar có hiệu ứng transition 1s
    - Nút Settings (⚙️) mở SettingsModal
    - Layout: sticky, backdrop-blur, responsive flex-wrap

##### [`GameStage.tsx`](../src/app/components/GameStage.tsx:76)

- **Vai trò:** Hiển thị sự kiện hiện tại với hiệu ứng động
- **Chi tiết:**
    - **Severity system** (3 cấp độ):
        - Level 1 (Warning — Amber): `ShieldAlert` icon
        - Level 2 (Urgent — Orange): `AlertCircle` icon
        - Level 3 (Critical — Rose): `Flame` icon
    - **Hiệu ứng:**
        - Alarm banner trượt từ trên xuống (4.5s)
        - Screen flash với màu tương ứng severity
        - Border nhấp nháy đỏ/cam/vàng
        - Floating particles bay lên
    - **Nội dung:**
        - Avatar người dân (từ `public/avatars/`) với glowing ring
        - Speech bubble có tail (desktop: trái, mobile: trên)
        - Persona name badge, severity badge
        - Title + Description song ngữ

##### [`ActionBar.tsx`](../src/app/components/ActionBar.tsx:14)

- **Vai trò:** Input textarea + nút gửi quyết định
- **Chi tiết:**
    - Textarea hỗ trợ `Cmd/Ctrl + Enter` để submit
    - Nút có 2 trạng thái: "Execute" (mặc định) / "AI analyzing..." (loading)
    - Hiệu ứng 3D button với border-bottom

##### [`SettingsModal.tsx`](../src/app/components/SettingsModal.tsx:16)

- **Vai trờ:** Modal cài đặt âm thanh + ngôn ngữ + game controls
- **Chi tiết:**
    - **Audio Settings:** 3 slider (Master Volume, Music, SFX) — dùng `SettingsContext`
    - **Language:** 2 nút chọn Tiếng Việt / English
    - **Game Controls:** Restart (chơi lại), Home (về trang chủ), Win Always (debug)

#### 2.3.3. Context

| File                                                             | Vai trò          | Chức năng chính                                                                             |
| ---------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| [`SettingsContext.tsx`](../src/app/contexts/SettingsContext.tsx) | **Global State** | Quản lý `masterVolume`, `musicVolume`, `sfxVolume`, `language` — persist vào `localStorage` |

#### Chi tiết [`SettingsContext.tsx`](../src/app/contexts/SettingsContext.tsx:30)

- **`SettingsProvider`** — Wrap toàn bộ app trong `layout.tsx`
- **State:** 4 giá trị settings với default: `{ masterVolume: 100, musicVolume: 100, sfxVolume: 100, language: 'en' }`
- **Persist:** Load từ `localStorage('ecoCitizenSettings')` khi mount, save mỗi khi update
- **`useSettings()`** — Hook để đọc/ghi settings từ bất kỳ component nào

#### 2.3.4. Styles

| File                                             | Vai trò              | Chức năng chính                                                           |
| ------------------------------------------------ | -------------------- | ------------------------------------------------------------------------- |
| [`index.css`](../src/app/styles/index.css)       | **Entry CSS**        | Import `fonts.css`, `tailwind.css`, `theme.css`                           |
| [`fonts.css`](../src/app/styles/fonts.css)       | **Font definitions** | (Đang để trống, sẵn sàng cho custom fonts)                                |
| [`tailwind.css`](../src/app/styles/tailwind.css) | **Tailwind v4**      | Import Tailwind CSS, source pattern cho `src/app/**/*.{js,ts,jsx,tsx}`    |
| [`theme.css`](../src/app/styles/theme.css)       | **Theme variables**  | CSS custom properties cho light/dark mode, colors, border-radius, sidebar |

#### 2.3.5. Utils / Data

| File                                        | Vai trò         | Chức năng chính                                                      |
| ------------------------------------------- | --------------- | -------------------------------------------------------------------- |
| [`eventBank.ts`](../src/utils/eventBank.ts) | **Kho sự kiện** | Định nghĩa 5 sự kiện game với nội dung song ngữ + `getRandomEvent()` |

#### Chi tiết [`eventBank.ts`](../src/utils/eventBank.ts:17)

**Interface `GameEvent`:**

- `id` — Mã sự kiện (EV_001 → EV_005)
- `title`, `persona`, `description`, `event_context`, `scientific_rules` — Đều là `LocalizedText` (`{ vi: string, en: string }`)
- `avatarUrl` — Đường dẫn avatar trong `public/avatars/`
- `severity` — 1 (Warning), 2 (Urgent), 3 (Critical)

**5 sự kiện:**
| ID | Sự kiện | Persona | Severity |
|----|---------|---------|----------|
| EV_001 | Lũ quét & Sạt lở đất | Trưởng bản (Village Chief) | 3 (Critical) |
| EV_002 | Hạn hán kỷ lục | Người nông dân (Farmer) | 2 (Urgent) |
| EV_003 | Mất điện do nắng nóng | Kỹ sư Điện lực (Power Engineer) | 3 (Critical) |
| EV_004 | Ô nhiễm không khí PM2.5 | Bác sĩ Hô hấp (Respiratory Doctor) | 2 (Urgent) |
| EV_005 | Xâm nhập mặn | Kỹ sư Đê điều (Dike Engineer) | 3 (Critical) |

### 2.4. Tài nguyên tĩnh (Public)

| File                                                                      | Vai trò                                                                  |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`public/logo.png`](../public/logo.png)                                   | Logo game (favicon)                                                      |
| [`public/backgrounds/town.png`](../public/backgrounds/town.png)           | Background thành phố (dùng trong Story, Game, Result, GameOver, Victory) |
| [`public/avatars/villagechef.png`](../public/avatars/villagechef.png)     | Avatar Trưởng bản                                                        |
| [`public/avatars/farmer.png`](../public/avatars/farmer.png)               | Avatar Nông dân                                                          |
| [`public/avatars/powerengineer.png`](../public/avatars/powerengineer.png) | Avatar Kỹ sư Điện lực                                                    |
| [`public/avatars/doctor.png`](../public/avatars/doctor.png)               | Avatar Bác sĩ                                                            |
| [`public/avatars/dikeengineer.png`](../public/avatars/dikeengineer.png)   | Avatar Kỹ sư Đê điều                                                     |
| [`public/avatars/meteorologist.png`](../public/avatars/meteorologist.png) | Avatar (dự phòng)                                                        |
| [`public/avatars/police.png`](../public/avatars/police.png)               | Avatar (dự phòng)                                                        |
| [`public/avatars/scientist.png`](../public/avatars/scientist.png)         | Avatar (dự phòng)                                                        |

---

## 3. Luồng hoạt động chi tiết (Game Flow)

### 3.1. Màn hình Home

```
User mở app
    ↓
layout.tsx render → SettingsProvider bao bọc
    ↓
page.tsx: appState = 'home'
    ↓
Hiển thị: Title "Eco Citizen" + gradient text + particles nền + nút "Start Game"
    ↓
User click "Start Game" → setAppState('story')
```

### 3.2. Màn hình Story (Cinematic Intro)

```
appState = 'story'
    ↓
Hiển thị: town.png nền blur + letterbox bars + story paragraphs (fade-in, blur→clear)
    ↓
5 đoạn hội thoại: (delay 1.6s → 3.2s → 5.0s → 6.8s → 8.4s)
    ↓
User click "Accept Office" hoặc "Skip" → setAppState('game')
```

### 3.3. Vòng Game chính (Game Loop)

```
appState = 'game'
    ↓
Khởi tạo: metrics = {50,50,50,50}, month = 1, currentEvent = getRandomEvent()
    ↓
───────────────── LẶP LẠI CHO MỖI THÁNG ─────────────────
    ↓
Hiển thị:
  [1] Dashboard (month, 4 thanh chỉ số)
  [2] GameStage (avatar + speech bubble + alarm effects)
  [3] ActionBar (textarea + nút Execute)
    ↓
User nhập quyết định → click "Execute" (hoặc Ctrl+Enter)
    ↓
handleSubmit():
  │  fetch POST /api/evaluate
  │  body: { event_context, scientific_rules, user_input, language, current_metrics }
  │
  ▼
Backend (api/index.py):
  │  1. Build prompt từ request data
  │  2. Gọi Gemini AI (gemini-2.5-flash) với JSON mode
  │  3. Parse response → GameResponse { analysis, consequence, changes, suggestion, game_over_story }
  │
  ▼
handleSubmit() (tiếp):
  │  Tính newMetrics = clamp(0-100, metrics + changes)
  │  setTurnResult({ analysis, suggestion, changes })
  │  Kiểm tra game over: nếu newMetrics có giá trị ≤ 0 → setGameOver(story)
  │
  ▼
Hiển thị Result Screen:
  - Summary banner (tốt/xấu)
  - Analysis card (phân tích hậu quả)
  - Stat Changes badges (cộng/trừ từng chỉ số)
  - Suggestions (gợi ý cải thiện)
  - Nút "Next Month"
    ↓
User click "Next Month"
    ↓
handleNextTurn():
  ├─ Nếu month >= 12 → setIsVictory(true) (thắng cuộc)
  └─ Nếu month < 12 → month++, reset input, getRandomEvent() mới
    ↓
Quay lại đầu vòng lặp ──────────────────────────────────
```

### 3.4. Kết thúc Game

#### Chiến thắng (Victory)

```
month >= 12 → isVictory = true
    ↓
Hiển thị: Confetti particles + town.png nền xanh + Card "City of Prosperity!"
    ↓
Trophy icon + "Completed 1 Year Term" badge
    ↓
User chọn: "Home" hoặc "New Term"
```

#### Thua cuộc (Game Over)

```
Bất kỳ metric nào ≤ 0 → gameOver = AI story
    ↓
Hiển thị: Debris particles + town.png nền đỏ + Card "Disaster Strikes!"
    ↓
Months in Office badge + Game over story từ AI
    ↓
User chọn: "Play Again" → reset toàn bộ game state
```

---

## 4. Data Flow & State Management

### 4.1. Local Storage Keys

| Key                   | Dữ liệu                                                                              | Đọc lúc                 | Ghi khi                  |
| --------------------- | ------------------------------------------------------------------------------------ | ----------------------- | ------------------------ |
| `ecoCitizenGameState` | Game state (appState, metrics, currentEvent, turnResult, gameOver, isVictory, month) | `page.tsx` mount        | Mỗi khi state thay đổi   |
| `ecoCitizenSettings`  | Settings (masterVolume, musicVolume, sfxVolume, language)                            | `SettingsContext` mount | Mỗi khi setting thay đổi |

### 4.2. Component Tree

```
<SettingsProvider>                  ← src/app/contexts/SettingsContext.tsx
  <RootLayout>                     ← src/app/layout.tsx
    <Page>                         ← src/app/page.tsx
      ├─ <SettingsModal />         ← src/app/components/SettingsModal.tsx
      ├─ <Dashboard />             ← src/app/components/Dashboard.tsx
      │    month, metrics, onSettingsClick
      ├─ <GameStage />             ← src/app/components/GameStage.tsx
      │    currentEvent: GameEvent
      └─ <ActionBar />             ← src/app/components/ActionBar.tsx
           userInput, setUserInput, isAnalyzing, onSubmit
```

---

## 5. API Contract

### `POST /api/evaluate`

**Request:**

```json
{
    "event_context": "string (song ngữ)",
    "scientific_rules": "string (song ngữ)",
    "user_input": "string (quyết định của người chơi)",
    "language": "en | vi",
    "current_metrics": {
        "energy": 50,
        "environment": 50,
        "budget": 50,
        "trust": 50
    }
}
```

**Response (200):**

```json
{
    "analysis": "Phân tích chi tiết bằng ngôn ngữ đã chọn",
    "consequence": "Hậu quả trực tiếp, liệt kê thay đổi điểm số",
    "changes": {
        "energy": -10,
        "environment": 15,
        "budget": 0,
        "trust": 5
    },
    "suggestion": "Gợi ý chiến lược",
    "game_over_story": "Chuỗi rỗng nếu game tiếp tục, hoặc story tragic nếu game over"
}
```

**Error Response (500):**

```json
{
    "detail": {
        "analysis": "The AI simulation system is experiencing connection issues...",
        "changes": { "energy": 0, "environment": 0, "budget": 0, "trust": 0 },
        "game_over_story": ""
    }
}
```

---

## 6. Công nghệ & Dependencies

### Frontend (Next.js)

| Package               | Version  | Mục đích                                           |
| --------------------- | -------- | -------------------------------------------------- |
| `next`                | 16.2.4   | Framework React full-stack                         |
| `react` / `react-dom` | 19.2.4   | UI Library                                         |
| `lucide-react`        | ^1.8.0   | Icon set (Zap, Leaf, Coins, Heart, Settings, etc.) |
| `motion`              | ^12.38.0 | Animation library (Framer Motion)                  |
| `tw-animate-css`      | ^1.4.0   | Tailwind animation utilities                       |
| `tailwindcss`         | ^4       | Utility-first CSS framework                        |
| `typescript`          | ^5       | Type checking                                      |

### Backend (Python)

| Package               | Mục đích                                  |
| --------------------- | ----------------------------------------- |
| `fastapi`             | Web framework cho API                     |
| `uvicorn`             | ASGI server                               |
| `google-generativeai` | Google Gemini AI client                   |
| `python-dotenv`       | Load biến môi trường từ `.env`            |
| `pydantic`            | Data validation (request/response models) |

---

## 7. Cách chạy dự án

### Backend (Terminal 1)

```bash
cd api
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn index:app --reload --port 8000
```

### Frontend (Terminal 2)

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Environment Variables

Tạo file `api/.env`:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 8. Mở rộng (Extensibility)

- **Thêm sự kiện:** Thêm object vào `eventPool` trong [`eventBank.ts`](../src/utils/eventBank.ts:17), tuân theo interface `GameEvent`
- **Thêm severity level:** Mở rộng `SEVERITY` object trong [`GameStage.tsx`](../src/app/components/GameStage.tsx:14)
- **Thêm ngôn ngữ:** Mở rộng type `Language` trong [`SettingsContext.tsx`](../src/app/contexts/SettingsContext.tsx:5) và thêm key mới vào tất cả `LocalizedText`
- **Thêm metrics:** Thêm field mới vào `CurrentMetrics`/`ResourceChanges` trong API + state trong `page.tsx` + UI trong `Dashboard.tsx`
