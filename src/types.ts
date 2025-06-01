export type User = {
  id: string;
  nickname: string;
  role: 'creator' | 'editor' | 'viewer';
  presentationId: string;
};

export type TextBlock = {
  id: string;
  content: string;
  x: number;
  y: number;
};

export type Slide = {
  id: string;
  title: string;
  blocks: TextBlock[];
};

export type Presentation = {
  id: string;
  title: string;
  slides: Slide[];
  users: User[];
  creatorId: string;
};
