from fastapi import FastAPI

app = FastAPI()

@app.get("/api/py/status")
def get_status():
    return {
        "status": "Running",
        "message": "API is up and running"
    }