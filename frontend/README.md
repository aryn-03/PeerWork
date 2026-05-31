# PeerWork Frontend Client

This is the frontend client for the PeerWork Student Bid-Portal, built using React, Vite, TailwindCSS, and Framer Motion. It features a premium, responsive dark-themed user interface tailored for students.

---

## Core Technologies

- **React 19:** Modern component-driven UI library.
- **Vite:** High-performance, lightning-fast frontend tooling and dev server.
- **TailwindCSS:** Utility-first CSS framework for clean, fully custom dark layouts.
- **Framer Motion:** Declarative animations for page transitions, interactive hover states, and smooth UI/UX micro-interactions.
- **Lucide React:** Sleek, lightweight icon library matching the modern UI theme.
- **React Router Dom (v6):** Client-side routing and protected route management.

---

## Directory Architecture

Within `frontend/src/`:

```text
├── components/
│   ├── cards/
│   │   ├── BidCard.jsx       # Renders individual bids and status updates
│   │   ├── ProposalCard.jsx  # Renders submitted freelancer bids
│   │   └── TaskCard.jsx      # Card for browsing and viewing open tasks
│   ├── layout/
│   │   ├── Footer.jsx        # Footer layout with linked Policies
│   │   └── Navbar.jsx        # Main navigation bar with scroll-to-top auto-scrolling
│   └── ui/                   # Shared UI primitives (buttons, inputs)
├── context/
│   └── AuthContext.jsx       # Manages global auth state, JWT, and session persistence
├── pages/
│   ├── auth/
│   │   ├── Login.jsx         # User login form
│   │   └── Register.jsx      # User signup form with links to ToS & PP
│   ├── dashboard/
│   │   ├── ClientDashboard.jsx     # Client dashboard to post tasks and view proposals
│   │   └── FreelancerDashboard.jsx # Freelancer dashboard tracking active bids
│   ├── Home.jsx              # Landing page featuring student stories
│   ├── Profile.jsx           # User profile manager
│   ├── Setup.jsx             # New user onboarding wizard
│   ├── PrivacyPolicy.jsx     # Interactive privacy policy page (starts at top, collapsible lists)
│   ├── TermsOfService.jsx    # Interactive terms of service page (starts at top, collapsible lists)
│   └── BrowseTasks.jsx       # Task marketplace browser
├── App.jsx                   # Route definition & layout setup
└── main.jsx                  # Application bootstrapper
```

---

## Environment Configuration

Create a `.env` file in the `frontend` folder containing:

```env
VITE_API_URL=http://localhost:5000/api
```

- **VITE_API_URL:** Points to the backend Express server instance.

---

## Available Scripts

In the `frontend` directory, you can run:

### `npm install`
Installs all project dependencies.

### `npm run dev`
Runs the app in development mode at `http://localhost:5173`.

### `npm run build`
Builds the app for production to the `dist` folder.

### `npm run preview`
Locally previews the production build.
