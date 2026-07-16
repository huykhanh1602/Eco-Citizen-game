export interface LocalizedText {
  vi: string;
  en: string;
}

export interface GameEvent {
  _id: string; // Đồng nhất với MongoDB khóa chính
  title: LocalizedText;
  persona: LocalizedText;
  avatarUrl: string;
  description: LocalizedText;
  event_context: LocalizedText;
  scientific_rules: LocalizedText;
  severity: number;
}