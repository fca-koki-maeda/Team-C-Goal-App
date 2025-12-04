import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import { Goal, HealthMetrics, Journal } from './types';
import './styles/dashboard.css';

function App() {
  // サンプルデータ
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'プログラミングスキル向上',
      description: 'React と TypeScript をマスターする',
      category: 'スキルアップ',
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-12-31'),
      progress: 65,
      status: 'active',
      priority: 'high',
    },
    {
      id: '2',
      title: '健康的な生活習慣',
      description: '毎日 8 時間の睡眠と適度な運動',
      category: 'ヘルスケア',
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-12-31'),
      progress: 45,
      status: 'active',
      priority: 'high',
    },
    {
      id: '3',
      title: '英語学習',
      description: 'TOEICで800点以上を目指す',
      category: '言語学習',
      startDate: new Date('2024-03-01'),
      targetDate: new Date('2025-03-01'),
      progress: 35,
      status: 'active',
      priority: 'medium',
    },
    {
      id: '4',
      title: 'プロジェクト完了',
      description: '新しいアプリケーション開発',
      category: '仕事',
      startDate: new Date('2024-06-01'),
      targetDate: new Date('2024-12-31'),
      progress: 85,
      status: 'active',
      priority: 'high',
    },
    {
      id: '5',
      title: 'マラソン完走',
      description: 'フルマラソン 4 時間 30 分以内完走',
      category: 'フィットネス',
      startDate: new Date('2024-09-01'),
      targetDate: new Date('2025-05-01'),
      progress: 20,
      status: 'active',
      priority: 'medium',
    },
    {
      id: '6',
      title: '読書習慣',
      description: '月 4 冊以上の本を読む',
      category: '自己啓発',
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-12-31'),
      progress: 100,
      status: 'completed',
      priority: 'low',
    },
  ]);

  const [healthMetrics] = useState<HealthMetrics[]>([
    {
      id: '1',
      date: new Date('2024-11-28'),
      mood: 4,
      energyLevel: 4,
      sleepHours: 7.5,
      sleepQuality: 4,
      notes: '充実した一日だった',
    },
    {
      id: '2',
      date: new Date('2024-11-29'),
      mood: 3,
      energyLevel: 3,
      sleepHours: 6,
      sleepQuality: 3,
      notes: 'ちょっと疲れ気味',
    },
    {
      id: '3',
      date: new Date('2024-11-30'),
      mood: 5,
      energyLevel: 4,
      sleepHours: 8,
      sleepQuality: 5,
      notes: '十分な睡眠が取れた',
    },
    {
      id: '4',
      date: new Date('2024-12-01'),
      mood: 4,
      energyLevel: 4,
      sleepHours: 7,
      sleepQuality: 4,
      notes: '良い調子',
    },
    {
      id: '5',
      date: new Date('2024-12-02'),
      mood: 4,
      energyLevel: 5,
      sleepHours: 8,
      sleepQuality: 4,
      notes: 'モチベーション高い',
    },
    {
      id: '6',
      date: new Date('2024-12-03'),
      mood: 3,
      energyLevel: 3,
      sleepHours: 6.5,
      sleepQuality: 3,
      notes: '仕事が忙しかった',
    },
    {
      id: '7',
      date: new Date('2024-12-04'),
      mood: 5,
      energyLevel: 5,
      sleepHours: 8.5,
      sleepQuality: 5,
      notes: 'リフレッシュできた',
    },
  ]);

  const [journals] = useState<Journal[]>([
    {
      id: '1',
      date: new Date('2024-12-04'),
      title: '今日の成果',
      content:
        'ダッシュボード画面の実装が完了した。React と TypeScript を使った実装で、コンポーネント設計も良好。明日からバックエンド API の開発に進む予定。',
      mood: 5,
      tags: ['仕事', 'プログラミング', '達成感'],
      goals: ['1', '4'],
    },
    {
      id: '2',
      date: new Date('2024-12-03'),
      title: '朝の走り込み',
      content:
        '久しぶりに 10km のランニングに挑戦した。タイムは 1 時間 10 分。マラソン完走へ向けて着実に進んでいる。',
      mood: 4,
      tags: ['フィットネス', '運動', 'マラソン'],
      goals: ['5'],
    },
    {
      id: '3',
      date: new Date('2024-12-02'),
      title: 'チームとの会議',
      content:
        'プロジェクトの進捗について話し合った。目標達成に向けて、チーム一丸となって取り組むことができている。',
      mood: 4,
      tags: ['仕事', 'チームワーク'],
      goals: ['4'],
    },
  ]);

  return (
    <div className="App">
      <Dashboard
        goals={goals}
        healthMetrics={healthMetrics}
        recentJournals={journals}
        userName="田中太郎"
      />
    </div>
  );
}

export default App;
