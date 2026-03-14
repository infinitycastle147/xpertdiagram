from fastapi import APIRouter
from langchain_core.output_parsers import JsonOutputParser
from langsmith import traceable

from models import DetectTypeResponse, DetectTypeRequest, DiagramRequest, DiagramResponse, DiagramChatRequest, \
    DiagramChatResponse
from enums import DiagramType
from service import run_ai_call

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "AI Operations API is running"}

@router.get("/health")
async def health():
    return {"status": "healthy"}

@router.post("/ai/detect-type", response_model=DetectTypeResponse)
@traceable(name="detect_type_trace")
async def detect_type(request: DetectTypeRequest):
    """Detect diagram type from user query and content"""
    parser = JsonOutputParser(pydantic_object=DetectTypeResponse)

    response = run_ai_call(
        model_name="llama-3.1-8b-instant",
        prompt_name="diagram_type_detector",
        parser=parser,
        user_input={
            "query": request.query,
            "content": request.content
        }
    )

    return response

@router.post("/ai/diagram", response_model=DiagramResponse)
@traceable(name="diagram_trace")
async def generate_diagram(request: DiagramRequest):
    """Generate diagram based on type and input"""
    diagram_type = DiagramType(request.type)
    parser = JsonOutputParser(pydantic_object=DiagramResponse)

    response = run_ai_call(
        model_name="openai/gpt-oss-20b",
        prompt_name=diagram_type.value,
        parser=parser,
        user_input={
            "diagram_type": request.type,
            "user_query": request.query,
            "information": request.content
        }
    )

    return response

@router.post("/ai/chat", response_model=DiagramChatResponse)
@traceable(name="diagram_chat")
async def diagram_chat(request: DiagramChatRequest):
    """Chat-based diagram update"""
    parser = JsonOutputParser(pydantic_object=DiagramChatResponse)

    response = run_ai_call(
        model_name="openai/gpt-oss-20b",
        prompt_name="update_diagram",
        parser=parser,
        user_input={
            "diagram_type": request.type,
            "query": request.query,
            "diagram": request.diagram,
            "chats": request.chat_history
        }
    )

    return response