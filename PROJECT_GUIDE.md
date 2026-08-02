# Quantum Cyber Fortress - Complete Project Guide (A-Z)

Welcome to the official, final documentation guide for **Quantum Cyber Fortress**—an immersive, high-fidelity web application designed for interactive cybersecurity education and threat simulation. 

This guide details the tech stack, component folder architecture, security configurations, design parameters, and operational sectors of the project.

---

## 1. Introduction & Project Concept

**Quantum Cyber Fortress** is a sci-fi themed, gamified training center. The application is designed to simulate a security operation command station (Sentinel Command). It guides players ("Sentinels") through foundational security training across modular sectors (Gate, Academy, Training Yard, Threat Simulator, and Labs Portal).

### Visual Aesthetic & Style Voice:
- **Obsidian / Slate Theme**: High-contrast, dark cyan/violet layout (`#090D16`, `#0F1420`) mimicking terminal screens.
- **Micro-Interactions**: Glassmorphic panels with subtle glowing borders, pulsing status monitors, and scanning overlays.
- **Typographic System**: Space Grotesk (display headings), Inter (system labels), and JetBrains Mono (terminal consoles and metrics).

---

## 2. Technology Stack (A-Z)

The project leverages a modern, optimized developer stack:

- **Build Tool / Bundler**: **Vite v5.4** — Configured for hot module replacement (HMR), static asset pre-bundling, and environmental variables injection.
- **Frontend Core**: **React v18.3** — Functional, hook-based components with strict component splitting.
- **Routing Engine**: **React Router Dom v6.27** — Setup with a base route path (`/quantum-cyber-fortress/`) for GitHub Pages routing, and protected routes wrappers.
- **Styling**: **Tailwind CSS v3.4 + PostCSS** — Custom utility classes combined with centralized theme tokens in `tokens.js` (colors, shadows, gradients).
- **Animations**: **Framer Motion v11** — Orchestrates particle loops, page-transition fades, drawer panels slide-ins, and honors user `prefers-reduced-motion` settings.
- **Analytics Charts**: **Recharts v2.13** — Drives threat vector radars and operational coordinate sweeping overlays.
- **Authentication Services**: **Firebase SDK v10+** — Powers sign-in, signup, Google OAuth popup logins, and automatic verification email dispatch.

---

## 3. Directory & Folder Architecture

The codebase structure is partitioned into logical directories:

```text
quantum-cyber-fortress/
├── .github/workflows/       # GitHub Actions deploy workflows
│   └── deploy.yml           # Compiles and deploys code to GitHub Pages
├── public/                  # Static assets (favicons, system vectors)
├── src/
│   ├── animations/          # Page transitions, motion hooks, particles
│   ├── app/                 # Root App.jsx and Router configuration
│   ├── assets/              # Component-specific media assets
│   ├── context/             # React Auth & Game Progress state contexts
│   ├── design-system/       # Centralized tokens.js and base UI controls
│   ├── features/            # Operational feature directories (Sectors)
│   │   ├── gate/            # Landing page, Access Terminal, Mission briefs
│   │   ├── academy/         # Modular study decks and syslog validators
│   │   ├── simulator/       # Cyber sandboxes (Hashing, Cipher, Phishing)
│   │   └── labs/            # Forensics, Packets, CLI, and Shell labs
│   ├── hooks/               # useReducedMotion and useScrollProgress hooks
│   ├── layout/              # AppShell wrappers, Navbars, Footers
│   ├── lib/                 # Firebase client SDK initialization
│   └── styles/              # Global CSS, Tailwind configurations, fonts
├── .env.example             # Public template mapping required env keys
├── package.json             # Core dependency manifest
├── tailwind.config.js       # Custom theme rules and shadow extensions
└── vite.config.js           # Base path and resolution alias overrides
```

---

## 4. State & Authentication Infrastructure

### A. Auth State Provider (`AuthContext.jsx`)
Exposes user metrics globally across the app:
- **`user`**: The active Firebase user session details.
- **`isAuthenticated`**: Boolean state based on session validation.
- **`loading`**: Boolean block state while resolving auth state.
- **`signIn(email, password)`**: authenticates user credentials, converting errors (`auth/invalid-credential`, `auth/wrong-password`) to readable error alerts.
- **`signUp(email, password)`**: Registers new users and immediately triggers a verification email.
- **`signInWithGoogle()`**: Launches a popup OAuth handshake, automatically provisioning new accounts.
- **`signOutUser()`**: Terminates the active session and triggers a redirection to `/`.
- **`sendVerificationEmail()`**: Dispatches a new email confirmation link (includes rate-limiting throttle checks).

### B. Progression State Provider (`SentinelProgressContext.jsx`)
Manages player scores, rank updates, and completed mission lists, persistently syncing state into local storage:
- **XP Progression**: Tracks XP multipliers awarded for completing exercises.
- **Rank Titles**: Automatically ranks Sentinels from *Recruit* through *Cadet*, *Operator*, *Analyst*, *Guardian*, *Sentinel*, *Elite Sentinel*, up to *Quantum Warden*.
- **Completed Badges**: Awards distinct graphical badges for mastering labs.

### C. Route Protection (`ProtectedRoute.jsx`)
Guards private routes (Academy, Training Yard, Labs, Watchtower). Unauthenticated visits are intercepted and redirected to `/` with a styled warning alert.

---

## 5. Fortress Operational Sectors

### Sector I: The Gate (`/`)
The primary gateway. Displays the **Access Terminal** (`GateAuthPanel.jsx`) supporting Email/Password sign-in/signup alongside Google OAuth. Authenticated operators are presented with a welcome dashboard showing Sentinel metrics, connection status, token parameters, and navigation shortcuts.

### Sector II: Cyber Academy (`/academy`)
Focuses on theoretical training. SENTINELS complete slideshow syllabi on:
1. **Cryptography**: Public/Private keys, block ciphers, SSL handshakes.
2. **Linux Basics**: Kernel spaces, file structure permissions, bash scripting.
3. **OWASP Top 10**: SQL injections, XSS vulnerabilities, broken auth.
4. **Auth Methodologies**: Multi-factor protocols, OAuth handshakes, session cookies.
5. **Malware Analysis**: Trojans, rootkits, sandboxing, and indicator audits.
Sectors are verified by solving mock syslog synchronizers to award XP points.

### Sector III: Training Yard (`/simulator`)
An interactive, sandboxed testing facility hosting 4 modular widgets:
1. **Phishing Payload Parser**: Classifies emails as malicious or safe by auditing headers and embedded URLs.
2. **Caesar Shift Cipher**: Encodes and decodes shift-key cryptosystems.
3. **Password Vault Strength Checker**: Evaluates entropy bits and brute-force complexity thresholds.
4. **Hashing Tool**: Generates MD5, SHA-1, and SHA-256 signatures for plain text.

### Sector IV: Labs Portal (`/labs`)
Features gamified, hands-on labs simulating real security operations:
- **Log Analysis**: Search, filter, and isolate threat signatures inside access logs.
- **Packet Sandbox**: Reconstruct TCP and HTTP packet parameters to extract secret flags.
- **CLI challenges**: Run bash commands inside a mock terminal grid to modify folder permissions and retrieve hidden files.
- **Security Quizzes**: Complete multiple-choice review decks.
- **Terminal Hardening**: Run a virtual shell to secure a compromised Linux configuration (uses a virtual file editor).

### Sector V: Watchtower (`/watchtower`)
*A detached operations sector.* Includes:
- A pulsing threat radar chart (Recharts) mapping CVE coordinates.
- CISA Known Exploited Vulnerabilities (KEV) live catalog scraper.
- Auto-scrolling terminal logs bounded at 50 logs that scroll *only* when the scrollbar is already positioned at the bottom of the list.

---

## 6. Development Lifecycle & Deployment

### Environment Configurations (`.env`)
Variables required by Vite to bundle Firebase credentials:
- `VITE_FIREBASE_API_KEY`: Google API token key.
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth URL.
- `VITE_FIREBASE_PROJECT_ID`: Cloud project ID.
- `VITE_FIREBASE_STORAGE_BUCKET`: Storage bucket URL.
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Message sender ID.
- `VITE_FIREBASE_APP_ID`: Firebase app reference string.

### GitHub Pages Deploy Pipeline (`deploy.yml`)
The workflow is automated via GitHub Actions:
1. **Push Event**: Triggered on pushes to the `main` branch.
2. **Build Stage**: Sets up a Node environment, installs dependencies, loads public Firebase configs as environment variables, and compiles static assets to the `/dist` directory.
3. **Deploy Stage**: Deploys compiled assets to GitHub Pages.

---

## 7. Conclusion

**Quantum Cyber Fortress** is successfully implemented, verified, and deployed. The migration to Firebase Authentication provides a highly responsive, stable, and secure backend that handles sign-ins, signups, Google OAuth, and email verification seamlessly. With robust error-handling, path-conditional banners, responsive grid wrappers, and zero lint warnings, the Digital Fortress is fully locked, secure, and ready for Sentinel recruitment.
