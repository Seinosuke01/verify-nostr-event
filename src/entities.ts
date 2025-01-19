export type Profile = {
  display_name?: string;
  name?: string;
  picture?: string;
  about?: string;
};

export type EventPostData = {
  kind: string;
  content: string;
  pubkey: string;
  tags: string[][];
  created_at: number;
};

export type EventGetData = {
  id: string;
  kind: string;
  content: string;
  pubkey: string;
  tags: string[][];
  created_at: number;
};
