export interface Dienstgrad {
  id: number;
  rang_name: string;
  rang_kategorie: string;
  rang_code: string;
  vorgesetzter_id: number | null;
  beschreibung: string | null;
}

export interface Statistik {
  rang_kategorie: string;
  anzahl: number;
}
