export type User = {
  id?: string;
  nickname: string;
  role?: 'CREATOR' | 'EDITOR' | 'VIEWER';
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
  creatorName: string;
};

export const DIALOGTYPE = {
  NEW: 0,
  EXIST: 1,
} as const;

export type DIALOGTYPE = (typeof DIALOGTYPE)[keyof typeof DIALOGTYPE];

export interface PresentationDialog {
  isOpen: boolean;
  type: DIALOGTYPE;
  presentationId?: String;
}

export interface PresentationData {
  user: User;
  title: string;
}