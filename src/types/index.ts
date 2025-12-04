// ユーザーの目標
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: Date;
  targetDate: Date;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  milestones?: Milestone[];
}

// マイルストーン
export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
}

// 体調管理
export interface HealthMetrics {
  id: string;
  date: Date;
  mood: number; // 1-5 scale
  energyLevel: number; // 1-5 scale
  sleepHours: number;
  sleepQuality: number; // 1-5 scale
  notes: string;
}

// 食事記録
export interface MealRecord {
  id: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// 日誌
export interface Journal {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: number; // 1-5 scale
  tags: string[];
  goals?: string[]; // Goal IDs
}

// パフォーマンス分析
export interface PerformanceMetrics {
  date: Date;
  goalProgressAverage: number;
  moodScore: number;
  energyScore: number;
  sleepScore: number;
  nutritionScore: number;
  overallScore: number;
}

// ユーザープロフィール
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  interests: string[];
  createdAt: Date;
}

// SNS 関連
export interface SocialConnection {
  userId: string;
  commonGoals: string[];
  connectedAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  goalIds: string[];
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}
