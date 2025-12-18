import { useState, useEffect } from 'react';
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

  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics[]>([]);

  // recent journals are read from localStorage so they reflect user-created journals
  const [recentJournals, setRecentJournals] = useState<Journal[]>(() => {
    try {
      const raw = localStorage.getItem('journals_v1');
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Array<any>;
      return parsed.map((p) => ({ ...p, date: new Date(p.date) }));
    } catch {
      return [];
    }
  });

  // update when other parts of the app change journals
  useEffect(() => {
    const h = () => {
      try {
        const raw = localStorage.getItem('journals_v1');
        if (!raw) { setRecentJournals([]); return; }
        const parsed = JSON.parse(raw) as Array<any>;
        setRecentJournals(parsed.map((p) => ({ ...p, date: new Date(p.date) })));
      } catch {
        setRecentJournals([]);
      }
    };
    window.addEventListener('journals-updated', h);
    return () => window.removeEventListener('journals-updated', h);
  }, []);

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

  const handleUpdateMetric = (id: string, m: Omit<HealthMetrics, 'id'>) => {
    setHealthMetrics((prev) =>
      prev.map((x) => (x.id === id ? { ...m, id } : x))
    );
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
                recentJournals={recentJournals}
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
                onUpdateMetric={handleUpdateMetric}
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
