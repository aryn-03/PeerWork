# PeerWork — Student Bid-Portal

> An interactive, high-vibe student freelance bid portal designed to connect student freelancers with student clients. Build projects, manage bids, review proposals, and chat in real-time.

---

## Features

### Role-Based Portals (Freelancer, Client, or Both)
- **Freelancers:** Browse open tasks, submit custom proposals with pricing & delivery time, manage bids, and communicate with clients.
- **Clients:** Post freelance opportunities with budgets and deadlines, review proposals, manage bids, and hire.
- **Coexistence Mode:** Users can configure their profile to be both client and freelancer.

### Bidding & Proposal Pipeline
- Custom proposal submissions with estimated delivery time and budget bids.
- Proposal status lifecycle (Pending -> Accepted / Rejected).
- Automatic rejection of other pending bids once one bid is accepted.

### Real-Time Chat & Collaboration
- Dynamic, interactive comments/chat directly within specific proposals/bids for negotiation and coordination.

### Premium Dark Mode UI
- Responsive layout built with **React**, **Vite**, **TailwindCSS**, and **Framer Motion** for micro-animations and smooth transitions.
- Enhanced navigation with logo-to-top auto-scrolling.

### Secure Auth System
- JWT authentication securely stored in secure `httpOnly` cookies.
- Comprehensive profile setup / onboarding wizard.

---

## Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite, TailwindCSS, Framer Motion, Lucide React, React Router Dom |
| **Backend** | Node.js, Express, Mongoose (MongoDB Atlas), JSONWebToken, Cookie-Parser, Bcryptjs |
| **Database** | MongoDB Atlas |

---

## Project Structure

```text
Student Bid-Portal/
├── backend/
│   ├── config/          # DB connections (db.js)
│   ├── middleware/      # Auth & protect middlewares (auth.js)
│   ├── models/          # MongoDB Mongoose models (User, Task, Bid)
│   ├── routes/          # Express API route endpoints (auth.js, tasks.js, bids.js)
│   ├── .env.example     # Template for backend env variables
│   ├── .gitignore       # Git ignore settings for backend
│   └── server.js        # Main Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Layouts, UI buttons, cards, etc.
│   │   ├── context/     # Auth Context provider (AuthContext.jsx)
│   │   ├── pages/       # Login, Register, Profile, Dashboard, etc.
│   │   ├── App.jsx      # React router & core setup
│   │   └── main.jsx     # Frontend entry point
│   ├── .env.example     # Template for frontend env variables
│   ├── .gitignore       # Git ignore settings for frontend
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md            # You are here!
```

---

## Installation & Setup

### Prerequisites
- Node.js installed (v16+)
- MongoDB Atlas cluster or local MongoDB instance running

### 1. Backend Configuration
Navigate to the `backend` folder and create a `.env` file from the example:
```bash
cd backend
cp .env.example .env
```
Fill in the environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_signing_key_here
```
Install dependencies and run:
```bash
npm install
npm run dev
```

### 2. Frontend Configuration
Navigate to the `frontend` folder and create a `.env` file:
```bash
cd ../frontend
cp .env.example .env
```
Ensure the API URL is set:
```env
VITE_API_URL=http://localhost:5000/api
```
Install dependencies and run:
```bash
npm install
npm run dev
```

---

## API Endpoints

### Auth Routes (/api/auth)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout & clear cookies
- `GET /me` - Get logged-in user profile
- `PUT /profile` - Update user onboarding profile details

### Task Routes (/api/tasks)
- `GET /` - Fetch all open tasks
- `POST /` - Post a new freelance project (Clients/Both only)
- `GET /my-posted` - Fetch tasks posted by current client
- `GET /my-bids` - Fetch tasks bidded on by current freelancer

### Bid Routes (/api/bids)
- `POST /` - Submit a new proposal on a task (Freelancers/Both only)
- `GET /task/:taskId` - Get all proposals for a specific task
- `GET /my-submitted` - Get all proposals submitted by the user
- `PATCH /:id/status` - Accept or reject a proposal (Client only)
- `GET /all` - Fetch all proposals matching user context
- `POST /:id/comment` - Add chat message/comment inside proposal
- `GET /:id` - Get details of a single proposal

---

Deployment Link : https://peer-work-ycq7.vercel.app/
