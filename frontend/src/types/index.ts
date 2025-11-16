export interface Dienstgrad {
  id: number;
  rang_name: string;
  rang_kategorie: string;
  rang_code: string;
  vorgesetzter_id: number | null;
  beschreibung: string | null;
  level: number;
}

export interface Statistik {
  rang_kategorie: string;
  anzahl: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}