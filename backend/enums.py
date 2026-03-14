from enum import Enum


class DiagramType(Enum):
    """Supported diagram types"""

    FLOWCHART = "flowchart"
    SEQUENCE = "sequence"
    CLASS = "class"
    STATE = "state"
    ENTITY_RELATIONSHIP = "erd"
    USER_JOURNEY = "user_journey"
    GANTT = "gantt"
    PIE = "pie"
    QUADRANT_CHART = "quadrant_chart"
    REQUIREMENT = "requirement"
    GITGRAPH = "gitgraph"
    C4 = "c4"
    MINDMAP = "mindmap"
    TIMELINE = "timeline"
    ZENUML = "zenuml"
    SANKEY = "sankey"
    XY_CHART = "xy_chart"
    BLOCK = "block"
    PACKET = "packet"
    KANBAN = "kanban"
    ARCHITECTURE = "architecture"
    RADAR = "radar"