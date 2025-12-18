import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Social from './components/Social';
import AddGoal from './components/AddGoal';
import AllGoals from './components/AllGoals';
import EditGoal from './components/EditGoal';
import HealthPage from './components/Health';
import JournalPage from './components/Journal';
import JournalsArchive from './components/JournalsArchive';
import { Goal, HealthMetrics, Journal } from './types';
import './styles/dashboard.css';

function App() {
  // サンプルデータ
  const [goals, setGoals] = useState<Goal[]>([
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

  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics[]>([
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

  const handleAddGoal = (newGoal: Omit<Goal, 'id'>) => {
    const goalWithId: Goal = {
      ...newGoal,
      id: `${Date.now()}`,
    };
    setGoals([...goals, goalWithId]);
  };

  const handleUpdateGoal = (id: string, updatedGoal: Omit<Goal, 'id'>) => {
    setGoals(goals.map(g => g.id === id ? { ...updatedGoal, id } : g));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  // ステータス変更（ワンクリック用）
  const handleChangeGoalStatus = (id: string, status: Goal['status']) => {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, status } : g));
  };

  // 追加: 健康データ追加 / 削除ハンドラ
  const handleAddMetric = (m: Omit<HealthMetrics, 'id'>) => {
    const metric: HealthMetrics = { ...m, id: `${Date.now()}` };
    setHealthMetrics((prev) => [...prev, metric]);
  };

  const handleDeleteMetric = (id: string) => {
    setHealthMetrics((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                goals={goals}
                healthMetrics={healthMetrics}
                recentJournals={journals}
                userName="田中太郎"
              />
            }
          />
          <Route
            path="/add-goal"
            element={<AddGoal onAddGoal={handleAddGoal} />}
          />
          <Route
            path="/goals"
            element={
              <AllGoals
                goals={goals}
                onDeleteGoal={handleDeleteGoal}
                onChangeStatus={handleChangeGoalStatus}
              />
            }
          />
          <Route
            path="/edit-goal/:id"
            element={
              <EditGoal
                goals={goals}
                onUpdateGoal={handleUpdateGoal}
              />
            }
          />

          {/* 追加: 体調記録ページ */}
          <Route
            path="/health"
            element={
              <HealthPage
                metrics={healthMetrics}
                onAddMetric={handleAddMetric}
                onDeleteMetric={handleDeleteMetric}
              />
            }
          />

          <Route path="/social" element={<Social />} />
          <Route path="/journals" element={<JournalPage />} />
          <Route path="/journals/archive" element={<JournalsArchive />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
