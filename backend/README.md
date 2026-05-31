# PeerWork Backend Server

This is the backend API server for the PeerWork Student Bid-Portal, built using Node.js, Express, and MongoDB.

---

## Core Technologies

- **Node.js & Express:** Lightweight, scalable server-side execution environment and framework.
- **MongoDB Atlas & Mongoose:** NoSQL database hosting and object data modeling.
- **JSONWebToken (JWT):** Token-based stateless authentication.
- **Cookie-Parser:** Decodes cookie headers to extract session credentials from secure cookie payloads.
- **Bcryptjs:** Secure password hashing.

---

## Directory Architecture

Within `backend/`:

```text
├── config/
│   └── db.js            # MongoDB database connection configuration
├── middleware/
│   └── auth.js          # Authentication protection middleware verifying JWT cookies
├── models/
│   ├── User.js          # User profile model (handles password hashing & role validations)
│   ├── Task.js          # Task model representing posted freelance project opportunities
│   └── Bid.js           # Bid model representing freelancer proposals & nested negotiation comments
├── routes/
│   ├── auth.js          # Authentication & user profile endpoints
│   ├── tasks.js         # Task retrieval and posting endpoints
│   └── bids.js          # Bid creation, updates, and proposal comments endpoints
├── .env.example         # Template for environment configuration
├── .gitignore           # Ignores local environment settings and dependency folders
└── server.js            # Express application setup, middlewares, and server listener
```

---

## Database Schemas

### User Schema
- **name:** User's display name.
- **email:** Unique, lowercased, and trimmed user email.
- **password:** Hashed password.
- **role:** Enum representing user capability (`freelancer`, `client`, or `both`).
- **rating:** Defaults to `5.0`.
- **isNewUser:** Boolean flag tracking if a user needs to complete the setup onboarding wizard.
- *Rule:* Automatically cleans role-specific fields (e.g., clears freelancer skills if role is updated to client) on save.

### Task Schema
- **title & description:** Main project details.
- **budget:** Budget allocated for the task.
- **deadline:** Date requirement.
- **postedBy:** Reference link pointing to the `User` who posted the task.
- **status:** Current status (`open`, `in-progress`, `completed`).

### Bid Schema
- **taskId:** Reference to the targeted `Task`.
- **freelancerId:** Reference to the bidding `User`.
- **amount & deliveryTime:** Bid pricing proposal and days required.
- **status:** Current state of bid (`pending`, `accepted`, `rejected`).
- **comments:** Nested message board array allowing clients and freelancers to negotiate.
- *Rule:* Accepting a bid automatically sets task status to `in-progress` and rejects all other pending bids.

---

## Environment Configuration

Create a `.env` file in the `backend` folder containing:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_jwt_signing_key_here
```

---

## Available Scripts

In the `backend` directory, you can run:

### `npm install`
Installs all dependencies.

### `npm start`
Starts the Express server in production mode (`node server.js`).

### `npm run dev`
Starts the server in development mode using `nodemon` to auto-restart on file changes.
