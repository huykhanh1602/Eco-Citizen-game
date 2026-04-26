This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

## 🚀 How to Run Locally (Development Mode)

This project uses a Next.js frontend and a Python (FastAPI) backend. To run the project locally, you will need to start both servers using two separate terminals.

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- [Python 3.8+](https://www.python.org/)

---

### Terminal 1: Start the Python Backend
1. Open a terminal and navigate to the `api` folder:
   ```Bash
   cd api
   ```
2. Create a virtual environment (only needed the first time):

```Bash
python -m venv venv
```
3. Activate the virtual environment:

Windows:
```ash
venv\Scripts\activate
```
macOS/Linux:
```Bash
source venv/bin/activate
```
4. Install the required dependencies:

```Bash
pip install -r requirements.txt
```

5. Start the FastAPI server using Uvicorn:

```Bash
uvicorn evaluate:app --reload --port 8000
```

The Python backend is now running at http://127.0.0.1:8000.

---
### Terminal 2: Start the Next.js Frontend
1. Open a new terminal window and ensure you are in the root directory of the project (Eco-Citizen-game).

2. Install the Node.js dependencies (only needed the first time or when dependencies change):

```Bash
npm install
```

3. Start the Next.js development server:

```Bash
npm run dev
```

The frontend is now running at http://localhost:3000.

## Deploy on Vercel

