# Contact Manager

A full-stack contact management app with React on the frontend and Express/MongoDB on the backend. Users can register, sign in, and manage their own private contact list with create, read, update, and delete flows.

## Tech Stack

- Frontend: React, Redux Toolkit, React Router, Axios, Material UI
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Testing: React Testing Library, Node test runner

## Project Structure

```text
.
|-- backend
|-- frontend
`-- ToDo.md
```

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- A MongoDB database or cluster

## Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

3. Create a backend env file:

```bash
cd ../backend
copy .env.example .env
```

4. Update `backend/.env` with your own values:

```env
PORT=5001
CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
```

5. Optional frontend env:

Create `frontend/.env` only if you want to override the default API base URL or enable avatar generation.

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:5001
REACT_APP_API_KEY=your-multiavatar-api-key
```

If `REACT_APP_API_BASE_URL` is omitted, the frontend uses the existing CRA proxy setup.

## Running the App

Run the backend only:

```bash
cd backend
npm run dev
```

Run the frontend only:

```bash
cd frontend
npm start
```

Run both frontend and backend together:

```bash
cd backend
npm run dev:fullstack
```

Create a production frontend build:

```bash
cd backend
npm run build
```

If you have not installed frontend dependencies yet, this command now installs them first and then runs the frontend production build.

Run the single production service after building:

```bash
cd backend
npm start
```

## Available Scripts

### Backend

- `npm run dev` - start the backend with `nodemon`
- `npm start` - start the backend with Node
- `npm run build` - install frontend deps if needed and build the frontend for production
- `npm run build:frontend` - install frontend deps if needed and build the frontend for production
- `npm test` - run backend API tests
- `npm run start:frontend` - start the frontend from inside the backend folder
- `npm run dev:fullstack` - run backend and frontend together

### Frontend

- `npm start` - start the React development server
- `npm run build` - create a production build
- `npm test -- --watchAll=false` - run the frontend tests once

## Demo and Review Notes

No seeded accounts are committed to the repo.

For a quick review:

1. Start the app.
2. Open `http://localhost:3000`.
3. Register a new account, for example:
   - Email: `demo@example.com`
   - Password: `Password123`
4. Sign in with that account and create a few contacts.

Each account only sees its own contacts.

## Test Commands

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test -- --watchAll=false
```

## Notes

- The backend expects a valid MongoDB connection before it can start.
- JWT auth is stored in browser cookies for session restore in the current implementation.
- Contact avatar fetching is optional and falls back gracefully when no avatar API key is configured.
- The backend now serves the built React app from `frontend/build` in production.
- For Render as a single Web Service from the `backend` folder:
  Build Command: `npm run build`
  Start Command: `npm start`
- If you deploy the frontend separately as a Static Site, use the `frontend` folder's own build command instead.
