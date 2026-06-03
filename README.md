# Withstand Voltage Test Portal (Secondary Windings)

Web UI portal for **withstand voltage test in secondary windings**. All operator-facing text is in **English**. This release is **UI only** — test timing and pass/fail are **simulated**; there is no machine/PLC integration yet.

## Features

- **Home queue**: serial numbers with selection, winding count, and status
- **Test duration** per winding: presets **2 s**, **5 s**, **60 s** only
- **Add serial manually** or **scan barcode** (webcam via `@zxing/browser`)
- **START**: mixed winding counts allowed — batch runs winding 1 on all units, then 2, etc.; from winding 4 onward only serials with enough secondaries are energized
- **High voltage warning**: fullscreen yellow/red flashing border and `ATTENTION — HIGH VOLTAGE` banner during the test
- **Voltage & current gauges** (mock): 0–5 kV and 0–100 mA; ramp to 3 kV in 1/6 of selected duration, then oscillate 3.0–3.1 kV; countdown starts only at 3 kV plateau; current = 20 mA × energized serials
- **Hipot communication LED** on home: click to configure IP and/or RS-485 (saved locally; simulated OK by default)
- **TEST APPROVED**: fullscreen green success screen when the batch completes (mock pass)

## Requirements

- Node.js 20+ (22+ recommended for latest Vite)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages (live demo)

After push to `main`, GitHub Actions deploys to:

**https://SEU-USUARIO.github.io/3kv/**

First-time publish from this machine:

```powershell
.\scripts\publish-github.ps1
```

Or manually:

```powershell
gh auth login
gh repo create 3kv --public --source=. --remote=origin --push
```

Then in the repo: **Settings → Pages → Build and deployment → GitHub Actions**.

## Project structure

| Path | Purpose |
|------|---------|
| `src/pages/` | Home, test run, approved screens |
| `src/components/` | Queue list, modals, HV overlay |
| `src/store/useTestStore.ts` | In-memory queue and settings |
| `src/services/testRunner.mock.ts` | Simulated test runner (replace for real equipment) |
| `src/services/hipotReadings.mock.ts` | Simulated kV / mA (replace with instrument driver) |
| `src/store/useHipotStore.ts` | Hipot IP / RS-485 settings (browser storage) |
| `src/theme/companyTheme.ts` | Design tokens — update when brand guidelines arrive |

## Company design system

Colors and spacing are centralized in [`src/theme/companyTheme.ts`](src/theme/companyTheme.ts). When your company design guide is available, update that file only (and shared button/card styles if added later).

## Machine integration (future)

Plug hardware into `src/services/testRunner.mock.ts` and `src/services/hipotReadings.mock.ts`. UI events: `windingStarted`, `holdStarted`, `tick`, `windingPassed`, `batchComplete`.

---

## Portal de ensaio (PT)

Portal web para **ensaio de tensão suportável em enrolamentos secundários**. Interface em **inglês**; versão atual **somente telas**, sem integração com o equipamento.

### Executar

```bash
npm install
npm run dev
```

### Fluxo

1. Na tela inicial, selecione séries (podem ter quantidades diferentes de enrolamentos) e a duração (2, 5 ou 60 s).
2. Adicione séries manualmente ou por código de barras (câmera).
3. **START** — enrolamentos 1, 2, 3 em todos; a partir do 4º só nas séries que têm esse secundário (ex.: 3 e 5 enrolamentos no mesmo batch).
4. Ao concluir — tela verde **TEST APPROVED**.

### Integração futura

Substituir o mock em `src/services/testRunner.mock.ts` pela comunicação real com a máquina.
