export type User = {
  id?: string;
  nickname: string;
  role?: 'CREATOR' | 'EDITOR' | 'VIEWER';
};

export interface TextBlock {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content: string;
}

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