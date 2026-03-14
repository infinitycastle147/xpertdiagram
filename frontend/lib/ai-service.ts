import axios from 'axios';
import { DiagramType } from './diagram-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiCall = async (url: string, data: any, authToken?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await axios.post(`${API_BASE_URL}${url}`, data, {
        withCredentials: true,
        headers
    });
    return response.data;
};

// Type definitions based on OpenAPI spec
export interface DetectTypeRequest {
    query: string;
    content: string;
}

export interface DetectTypeResponse {
    diagram_type: DiagramType;
}

export interface DiagramRequest {
    type: DiagramType;
    query: string;
    content: string;
}

export interface DiagramResponse {
    diagram: string;
}

export interface DiagramChatRequest {
    type: DiagramType;
    diagram: string;
    query: string;
    chat_history?: Array<{[key: string]: string}>;
}

export interface DiagramChatResponse {
    updated_diagram: string;
    response: string;
}

// AI Service functions
export const detectDiagramType = async (request: DetectTypeRequest, authToken?: string): Promise<DetectTypeResponse> => {
    return apiCall('/ai/detect-type', request, authToken);
};

export const generateDiagram = async (request: DiagramRequest, authToken?: string): Promise<DiagramResponse> => {
    return apiCall('/ai/diagram', request, authToken);
};

export const chatWithDiagram = async (request: DiagramChatRequest, authToken?: string): Promise<DiagramChatResponse> => {
    return apiCall('/ai/chat', request, authToken);
};
