from typing import Optional

from pydantic import BaseModel
from enums import DiagramType


class DetectTypeRequest(BaseModel):
    query: str
    content: str


class DetectTypeResponse(BaseModel):
    diagram_type: DiagramType


class DiagramRequest(BaseModel):
    type: DiagramType
    query: str
    content: str


class DiagramResponse(BaseModel):
    diagram: str

class DiagramChatRequest(BaseModel):
    type: DiagramType
    diagram: str
    query: str
    chat_history: list[dict[str, str]] = []

class DiagramChatResponse(BaseModel):
    updated_diagram: Optional[str] = None
    response: str