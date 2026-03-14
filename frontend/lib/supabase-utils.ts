import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Diagram,
  DiagramMessage,
  CreateDiagramRequest,
  UpdateDiagramRequest,
  CreateMessageRequest
} from './database-types';

// Diagrams API
export const createDiagramsApi = (supabase: SupabaseClient) => ({
  // Get all diagrams for current user
  async getAll(): Promise<Diagram[]> {
    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.log(error);
      throw error;
    }
    return data || [];
  },
  // Get diagram by ID
  async getById(id: string): Promise<Diagram | null> {
    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  // Create new diagram
  async create(diagram: CreateDiagramRequest): Promise<Diagram> {
    const { data, error } = await supabase
      .from('diagrams')
      .insert([diagram])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update diagram
  async update(id: string, updates: UpdateDiagramRequest): Promise<Diagram> {

    const { data, error } = await supabase
      .from('diagrams')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete diagram
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('diagrams')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
});

// Messages API
export const createMessagesApi = (supabase: SupabaseClient) => ({
  // Get messages for a diagram
  async getByDiagramId(diagramId: string): Promise<DiagramMessage[]> {
    const { data, error } = await supabase
      .from('diagram_messages')
      .select('*')
      .eq('diagram_id', diagramId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Create new message
  async create(message: CreateMessageRequest): Promise<DiagramMessage> {
    const { data, error } = await supabase
      .from('diagram_messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Subscribe to new messages for a diagram
  subscribeToMessages(diagramId: string, callback: (message: DiagramMessage) => void) {
    return supabase
      .channel(`diagram_messages:${diagramId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'diagram_messages',
          filter: `diagram_id=eq.${diagramId}`
        },
        (payload) => {
          callback(payload.new as DiagramMessage);
        }
      )
      .subscribe();
  }
});