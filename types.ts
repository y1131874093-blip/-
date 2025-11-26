export interface NovelHook {
  id: string;
  content: string;
  tags: string[];
}

export interface GenerationResponse {
  hooks: {
    content: string;
    tags: string[];
  }[];
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
