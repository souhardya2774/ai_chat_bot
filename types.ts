
export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
}

export interface Message {
  id: string;
  created_at: string;
  content: string;
  role: Role;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  messages: Message[];
}
