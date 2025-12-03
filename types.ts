export interface ScriptSegment {
  id: number;
  section: 'intro' | 'development' | 'summary';
  visualType: 'scene' | 'ui-chat' | 'comparison' | 'quiz' | 'summary';
  narration: string;
  visualText?: string; // Text to display on screen
  subText?: string;
  highlight?: string; // Text to highlight in red
  duration: number; // Estimated duration in seconds for progress bar
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  isCorrect?: boolean;
}

export enum TabState {
  OVERVIEW = 'overview',
  COMMENTS = 'comments',
  RESOURCES = 'resources'
}