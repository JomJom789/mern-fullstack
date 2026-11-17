/**
 * Hand-written types matching backend/supabase/migrations. Keep in sync with the SQL
 * (or regenerate with `supabase gen types typescript` and keep the same export names).
 */
export type ProjectStatusDb = 'draft' | 'published';

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string;
  category: string;
  tech_stack: string[];
  live_url: string | null;
  repo_url: string | null;
  image_path: string | null;
  featured: boolean;
  status: ProjectStatusDb;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectInsertRow = {
  id?: string;
  slug: string;
  title: string;
  tagline?: string | null;
  description: string;
  category: string;
  tech_stack?: string[];
  live_url?: string | null;
  repo_url?: string | null;
  image_path?: string | null;
  featured?: boolean;
  status?: ProjectStatusDb;
  sort_order?: number;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
};

export type ContactMessageInsertRow = {
  name: string;
  email: string;
  message: string;
  ip_hash?: string | null;
  user_agent?: string | null;
};

export type Database = {
  __InternalSupabase: { PostgrestVersion: '13' };
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsertRow;
        Update: Partial<ProjectInsertRow>;
        Relationships: [];
      };
      admins: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string };
        Update: { user_id?: string };
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: ContactMessageInsertRow;
        Update: Partial<ContactMessageInsertRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
      reorder_projects: {
        Args: { items: { id: string; sort_order: number }[] };
        Returns: undefined;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
