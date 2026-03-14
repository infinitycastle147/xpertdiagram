// Database types matching the actual schema

export interface Diagram {
  id: string;
  name: string;
  user_id: string;
  type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface DiagramMessage {
  id: string;
  diagram_id: string;
  message_type: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// API request/response types
export interface CreateDiagramRequest {
  name: string;
  type: string;
  content: string;
}

export interface UpdateDiagramRequest {
  name?: string;
  type?: string;
  content?: string;
}

export interface CreateMessageRequest {
  diagram_id: string;
  message_type: 'user' | 'assistant';
  content: string;
}