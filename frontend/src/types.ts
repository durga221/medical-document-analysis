export type Language = {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
};

export type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};