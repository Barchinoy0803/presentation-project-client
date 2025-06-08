export type User = {
  id?: string;
  nickname: string;
  role?: 'CREATOR' | 'EDITOR' | 'VIEWER';
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

export interface TextBlockStyles {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: number;
}

export interface TextBlock {
  id: string;
  type: 'text';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  styles: TextBlockStyles;
}

export interface Slide {
  id: string;
  title: string;
  blocks: TextBlock[];
}