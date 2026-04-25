from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

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
    language: str = "vi"
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
    game_over_story: str = ""

# The Endpoint
@app.post("/api/evaluate", response_model=GameResponse)
async def evaluate_decision(request: GameRequest):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        lang_str = "Vietnamese (Tiếng Việt)" if request.language == 'vi' else "English"
        
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
1. All text responses (analysis, consequence, suggestion) MUST be written entirely in {lang_str}.
2. In the "consequence" section, you MUST explicitly list the exact point changes for the 4 metrics. 
3. IMPORTANT: The consequences can both increase and decrease multiple metrics simultaneously. Do not limit the changes to just one or two metrics if the decision broadly impacts the city. A good decision might increase several metrics, while a poor one might decrease several.
4. GAME OVER LOGIC: Calculate the new metrics after applying your point changes. If ANY of the new metrics drop to 0 or below, the player loses the game. In that case, you MUST write a short, tragic narrative (2-3 sentences) in the "game_over_story" field, describing the city's downfall and how the citizens suffer due to the Mayor's failure in {lang_str}. If all new metrics remain strictly above 0, leave "game_over_story" empty ("").

Respond STRICTLY with a valid JSON object matching this exact schema:
{{
  "analysis": "Detailed analysis of how the decision impacts the situation based on the rules, in {lang_str}.",
  "consequence": "The direct, narrative consequence of the action in {lang_str}, clearly listing the point changes for each metric.",
  "changes": {{
    "energy": <integer representing change, e.g., -10, 0, 15>,
    "environment": <integer representing change>,
    "budget": <integer representing change>,
    "trust": <integer representing change>
  }},
  "suggestion": "A helpful strategic suggestion for the Mayor in {lang_str}.",
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
            "analysis": "Hệ thống mô phỏng AI đang gặp sự cố kết nối hoặc lỗi phân tích.",
            "consequence": "Quyết định của bạn tạm thời bị trì hoãn. Hệ sinh thái không có thay đổi.",
            "changes": {
                "energy": 0,
                "environment": 0,
                "budget": 0,
                "trust": 0
            },
            "suggestion": "Vui lòng kiểm tra lại GEMINI_API_KEY trong file api/evaluate.py hoặc thử lại sau.",
            "game_over_story": ""
        }
        
        raise HTTPException(status_code=500, detail=fallback_response)