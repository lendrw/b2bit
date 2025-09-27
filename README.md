# 🚀 Frontend Project – Selection Process

This project was built with **React + Vite** as part of the selection process.  
It includes:

- ⚛️ **React + Vite** for building the application
- 🧪 **React Testing Library** for unit and component testing
- 🌲 **Cypress** for end-to-end (E2E) testing

---

## 📦 Prerequisites

- Node.js **>= 18**
- npm or yarn

---

## ▶️ Running the Application

Clone the repository and install dependencies:

```bash
git clone https://github.com/lendrw/b2bit.git
cd b2bit
npm install
```

Start the development server:

```bash
npm run dev
```

The app will be available at:
👉 [http://localhost:5173](http://localhost:5173)
And you can also access the deployed version at:
👉 [https://b2bit-pi.vercel.app](https://b2bit-pi.vercel.app)

---

## 🧪 Running Unit Tests (React Testing Library)

To run unit and component tests:

```bash
npm test
```

This will execute the test suite with **Vitest + React Testing Library**.

---

## 🌲 Running E2E Tests (Cypress)

Run Cypress in interactive mode:

```bash
npm run cypress:open
```

Run Cypress in headless mode (for CI/CD):

```bash
npm run cypress:run
```

---

## ✅ Features Covered by Tests

- Login and Logout flows
- Login form validation (required fields, invalid email)
- Rendering of main components

---
