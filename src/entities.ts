export type Profile = {
  display_name?: string;
  name?: string;
  picture?: string;
  about?: string;
};

export type EventPublishData = {
  kind: string;
  content: string;
  pubkey: string;
  tags: string[][];
  created_at: number;
  relay_server: string;
};

export type EventGetData = {
  id: string;
  kind: string;
  content: string;
  pubkey: string;
  tags: string[][];
  created_at: number;
};

export type EventGetRequestData = {
  kind: string;
  author: string;
  relay_server: string;
};
