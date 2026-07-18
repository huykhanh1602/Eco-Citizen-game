from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# API Key Configuration
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Configure Gemini
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY environment variable is not set. The API will not function correctly.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()


# Configure CORS for Next.js local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Data Models (Pydantic)
class CurrentMetrics(BaseModel):
    energy: int
    environment: int
    budget: int
    trust: int

class GameRequest(BaseModel):
    event_context: str
    scientific_rules: str
    user_input: str
    language: str = "en"
    current_metrics: CurrentMetrics

class ResourceChanges(BaseModel):
    energy: int
    environment: int
    budget: int
    trust: int

class GameResponse(BaseModel):
    analysis: str
    consequence: str
    changes: ResourceChanges
    suggestion: str
    hint: str  # <--- Tribbie đã thêm trường hint mới vào đây!
    game_over_story: str = ""

# The Endpoint
@app.post("/api/evaluate", response_model=GameResponse)
async def evaluate_decision(request: GameRequest):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        lang_str = "English" if request.language == 'en' else "Vietnamese (Tiếng Việt)"
        
        prompt = f"""
You are a Climate Simulation Engine for the text-based game "Eco-Citizen AI".
Evaluate the player's decision based on the following context and scientific rules.

Event Context:
{request.event_context}

Scientific Rules:
{request.scientific_rules}

Player's Decision (Mayor's Action):
{request.user_input}

Current City Metrics:
Energy: {request.current_metrics.energy}/100
Environment: {request.current_metrics.environment}/100
Budget: {request.current_metrics.budget}/100
Trust: {request.current_metrics.trust}/100

CRITICAL INSTRUCTIONS:
1. All text responses (analysis, consequence, suggestion, hint) MUST be written entirely in {lang_str}.
2. In the "consequence" section, write a brief narrative of what happens. ONLY list the names of the metrics that actually changed (increased or decreased) as a result of this decision. Do not mention metrics that remain unchanged. Keep this entire section strictly between 50 and 60 words.
3. The "suggestion" section MUST act as a helpful Hint (gợi ý/mẹo nhỏ) for the player to make better choices next time. This Hint MUST be strictly between 30 and 40 words in length.
4. The "hint" section MUST be exactly ONE short, insightful sentence. It should provide a strategic, science-based clue or warning related to the event context and rules to guide the Mayor's thinking before making decisions.
5. IMPORTANT: The consequences can both increase and decrease multiple metrics simultaneously. Do not limit the changes to just one or two metrics if the decision broadly impacts the city. A good decision might increase several metrics, while a poor one might decrease several.
6. GAME OVER LOGIC: Calculate the new metrics after applying your point changes. If ANY of the new metrics drop to 0 or below, the player loses the game. In that case, you MUST write a short, tragic narrative (2-3 sentences) in the "game_over_story" field, describing the city's downfall and how the citizens suffer due to the Mayor's failure in {lang_str}. If all new metrics remain strictly above 0, leave "game_over_story" empty ("").

Respond STRICTLY with a valid JSON object matching this exact schema:
{{
  "analysis": "Detailed analysis of how the decision impacts the situation based on the rules, in {lang_str}.",
  "consequence": "The direct, narrative consequence of the action in {lang_str}, mentioning ONLY the metrics that changed. (Strict length: 50-60 words)",
  "changes": {{
    "energy": <integer representing change, e.g., -10, 0, 15>,
    "environment": <integer representing change>,
    "budget": <integer representing change>,
    "trust": <integer representing change>
  }},
  "suggestion": "A helpful Hint (gợi ý) for the Mayor in {lang_str} to handle similar crises. (Strict length: 30-40 words)",
  "hint": "Exactly ONE short, strategic, science-based clue or warning sentence in {lang_str} to guide the player.",
  "game_over_story": "The tragic ending narrative if any metric drops to <= 0, otherwise empty string."
}}
"""
        
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        result_data = json.loads(response.text)
        
        print("\n=== log from ai ===")
        print(json.dumps(result_data, indent=2, ensure_ascii=False))
        print("=========================\n")
        
        return result_data
    except Exception as e:
        print(f"Error during Gemini API call or JSON parsing: {e}")
        
        # Fallback JSON response to prevent the game UI from crashing
        fallback_response = {
            "analysis": "The AI simulation system is experiencing connection issues or analysis errors.",
            "consequence": "Your decision has been temporarily delayed. The ecosystem remains unchanged.",
            "changes": {
                "energy": 0,
                "environment": 0,
                "budget": 0,
                "trust": 0
            },
            "suggestion": "Please check the GEMINI_API_KEY in the environment variables or try again later.",
            "hint": "Ensure you balance the city's budget while prioritizing clean energy.",
            "game_over_story": ""
        }
        
        raise HTTPException(status_code=500, detail=fallback_response)
    
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "ECO_CITIZEN"
COLLECTION_NAME = "eventBanks"

# 3. THÊM API LẤY SỰ KIỆN NGẪU NHIÊN NÀY VÀO FILE:
@app.get("/api/random-event")
async def get_random_event():
    print("=== [Python Backend] Đang có yêu cầu lấy sự kiện ngẫu nhiên ===")
    client = None
    try:
        # Khởi tạo kết nối tới MongoDB Atlas
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # Bốc ngẫu nhiên 1 sự kiện từ Collection bằng Aggregation Pipeline
        pipeline = [{"$sample": {"size": 1}}]
        random_events = list(collection.aggregate(pipeline))
        
        if not random_events:
            print("❌ Không tìm thấy sự kiện nào trong Collection!")
            raise HTTPException(status_code=404, detail="Không có sự kiện nào trong Database")
            
        event = random_events[0]
        
        # Chuyển đổi trường _id từ dạng ObjectId của MongoDB sang String để tránh lỗi parse JSON ở Frontend
        event["_id"] = str(event["_id"])
        
        print(f"👉 Đã lấy thành công sự kiện: {event.get('title', 'Không có tiêu đề')}")
        return event

    except Exception as e:
        print(f"❌ Lỗi xử lý MongoDB phía Python: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi hệ thống backend: {str(e)}")
        
    finally:
        # Đóng kết nối để tránh rò rỉ bộ nhớ
        if client:
            client.close()