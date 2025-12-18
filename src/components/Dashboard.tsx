import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  Heart,
  Apple,
  BookOpen,
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  Plus,
} from 'lucide-react';
import { Goal, HealthMetrics, Journal } from '../types';
import '../styles/dashboard.css';

interface DashboardProps {
  goals: Goal[];
  healthMetrics: HealthMetrics[];
  recentJournals: Journal[];
  userName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  goals,
  healthMetrics,
  recentJournals,
  userName,
}) => {
  // 統計情報を計算
  const stats = calculateStats(goals, healthMetrics);

  // 並び替え状態（localStorage に永続化）
  type PanelId = 'goals' | 'health' | 'journals' | 'quick';
  const STORAGE_KEY = 'dashboard_order_v1';

  const [leftOrder, setLeftOrder] = useState<PanelId[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { left: PanelId[]; right: PanelId[] };
        if (Array.isArray(parsed?.left)) {
          // 'perf'が含まれている場合は除外
          return parsed.left.filter(id => id !== 'perf' as any);
        }
      }
    } catch {}
    return ['goals']; // 既定: 左カラム
  });

  const [rightOrder, setRightOrder] = useState<PanelId[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { left: PanelId[]; right: PanelId[] };
        if (Array.isArray(parsed?.right)) {
          // 'perf'が含まれている場合は除外
          return parsed.right.filter(id => id !== 'perf' as any);
        }
      }
    } catch {}
    return ['health', 'journals', 'quick']; // 既定: 右カラム
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ left: leftOrder, right: rightOrder })
      );
    } catch {}
  }, [leftOrder, rightOrder]);

  // ドラッグ中カードの視覚状態
  const [draggingId, setDraggingId] = useState<PanelId | null>(null);

  const moveInArray = (arr: PanelId[], fromId: PanelId, toId: PanelId) => {
    if (fromId === toId) return arr;
    const next = arr.filter((x) => x !== fromId);
    const idx = next.indexOf(toId);
    next.splice(Math.max(0, idx), 0, fromId); // 「toId」の前に挿入
    return next;
  };

  const removeFromArray = (arr: PanelId[], id: PanelId) => arr.filter((x) => x !== id);

  // ドラッグ開始ペイロード
  const onDragStart = (e: React.DragEvent, id: PanelId, from: 'left' | 'right') => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, from }));
    e.dataTransfer.effectAllowed = 'move';
    // 掴んだカードをドラッグイメージとして使用
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 10, 10);
    }
    setDraggingId(id);
  };

  const onDragEnd = () => {
    setDraggingId(null);
  };

  const onDropOnCard = (
    e: React.DragEvent,
    dropId: PanelId,
    dropCol: 'left' | 'right'
  ) => {
    e.preventDefault();
    const payload = JSON.parse(e.dataTransfer.getData('text/plain')) as {
      id: PanelId;
      from: 'left' | 'right';
    };
    const { id, from } = payload;
    if (!id) return;

    // 同一カラム内の並べ替え or 別カラムへの移動＋挿入
    if (dropCol === 'left') {
      if (from === 'left') {
        setLeftOrder((prev) => moveInArray(prev, id, dropId));
      } else {
        setRightOrder((prev) => removeFromArray(prev, id));
        setLeftOrder((prev) => moveInArray(prev, id, dropId));
      }
    } else {
      if (from === 'right') {
        setRightOrder((prev) => moveInArray(prev, id, dropId));
      } else {
        setLeftOrder((prev) => removeFromArray(prev, id));
        setRightOrder((prev) => moveInArray(prev, id, dropId));
      }
    }
  };

  const onDropOnColumnEnd = (e: React.DragEvent, dropCol: 'left' | 'right') => {
    e.preventDefault();
    const payload = JSON.parse(e.dataTransfer.getData('text/plain')) as {
      id: PanelId;
      from: 'left' | 'right';
    };
    const { id, from } = payload;
    if (!id) return;

    if (dropCol === 'left') {
      if (from === 'left') {
        setLeftOrder((prev) => [...removeFromArray(prev, id), id]);
      } else {
        setRightOrder((prev) => removeFromArray(prev, id));
        setLeftOrder((prev) => [...prev, id]);
      }
    } else {
      if (from === 'right') {
        setRightOrder((prev) => [...removeFromArray(prev, id), id]);
      } else {
        setLeftOrder((prev) => removeFromArray(prev, id));
        setRightOrder((prev) => [...prev, id]);
      }
    }
  };

  const renderPanel = (id: PanelId, col: 'left' | 'right') => {
    switch (id) {
      case 'goals':
        return (
          <section
            className={`card ${draggingId === 'goals' ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, 'goals', col)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDropOnCard(e, 'goals', col)}
          >
            <div className="card-header">
              <h2>目標進捗</h2>
              <Link to="/goals" className="link">すべて見る</Link>
            </div>
            <GoalsProgress goals={goals} />
          </section>
        );
      case 'health':
        return (
          <section
            className={`card ${draggingId === 'health' ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, 'health', col)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDropOnCard(e, 'health', col)}
          >
            <div className="card-header">
              <h2>今日の体調管理</h2>
            </div>
            <HealthStatus metrics={healthMetrics} />
          </section>
        );
      case 'journals':
        return (
          <section
            className={`card ${draggingId === 'journals' ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, 'journals', col)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDropOnCard(e, 'journals', col)}
          >
            <div className="card-header">
              <h2>最近の日誌</h2>
              <Link to="/journals" className="link">すべて見る</Link>
            </div>
            <RecentJournals journals={recentJournals} />
          </section>
        );
      case 'quick':
        return (
          <section
            className={`card quick-actions-section ${draggingId === 'quick' ? 'dragging' : ''}`}
            id="quick-actions-section"
            draggable
            onDragStart={(e) => onDragStart(e, 'quick', col)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDropOnCard(e, 'quick', col)}
          >
            <div className="card-header">
              <h2>クイックアクション</h2>
            </div>
            <QuickActions />
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {/* ヘッダー */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>ダッシュボード</h1>
          <p className="greeting">{userName}さんへようこそ</p>
        </div>
        <div className="header-actions">
          <Link to="/social" className="btn btn-secondary" title="コミュニティ">
            <Users size={18} />
            <span>コミュニティ</span>
          </Link>
          <Link to="/add-goal" className="btn btn-secondary" title="目標を追加">
            <Plus size={16} />
            <span>目標を追加</span>
          </Link>
          {/* レイアウトを初期化 */}
          <button
            className="btn btn-secondary"
            title="レイアウトをリセット"
            onClick={() => {
              setLeftOrder(['goals']);
              setRightOrder(['health', 'journals', 'quick']);
            }}
          >
            リセット
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="dashboard-main">
        {/* 統計情報カード（固定） */}
        <section className="stats-section">
          <div className="stats-grid">
            <StatCard icon={<Target size={24} />} label="進行中の目標" value={stats.activeGoals} color="blue" />
            <StatCard icon={<CheckCircle size={24} />} label="完了した目標" value={stats.completedGoals} color="green" />
            <StatCard icon={<TrendingUp size={24} />} label="平均進捗率" value={`${stats.averageProgress}%`} color="purple" />
            <StatCard icon={<Heart size={24} />} label="現在の気分スコア" value={stats.currentMoodScore} color="red" />
          </div>
        </section>

        {/* 並べ替え可能グリッド */}
        <div className="content-grid">
          {/* 左カラム */}
          <div
            className="left-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDropOnColumnEnd(e, 'left')}
          >
            {(() => {
              const seen = new Set<PanelId>();
              const leftSanitized = leftOrder.filter((id) => {
                if (seen.has(id)) return false;
                seen.add(id);
                return true;
              });
              return leftSanitized.map((id) => renderPanel(id, 'left'));
            })()}
          </div>

          {/* 右カラム */}
          <div
            className="right-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDropOnColumnEnd(e, 'right')}
          >
            {(() => {
              const leftSeen = new Set(leftOrder);
              const rightSanitized = rightOrder.filter((id) => !leftSeen.has(id)).filter((id, idx, arr) => arr.indexOf(id) === idx);
              return rightSanitized.map((id) => renderPanel(id, 'right'));
            })()}
          </div>
        </div>
      </main>
    </div>
  );
};

// 統計カード
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  // color -> stat-icon クラスマッピング
  const colorClass =
    color === 'blue'
      ? 'emoji-inprogress'
      : color === 'green'
      ? 'emoji-completed'
      : color === 'purple'
      ? 'emoji-average'
      : color === 'red'
      ? 'emoji-mood'
      : '';

  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className={`stat-icon ${colorClass}`}>{icon}</div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
};

// 目標進捗コンポーネント
interface GoalsProgressProps {
  goals: Goal[];
}

const GoalsProgress: React.FC<GoalsProgressProps> = ({ goals }) => {
  // 表示条件:
  // - ステータス: 進行中のみ
  // - 進捗: 100%未満
  // 並び順: 優先度 高 -> 中 -> 低
  const priorityOrder: Record<Goal['priority'], number> = { high: 0, medium: 1, low: 2 };
  const visibleGoals = goals
    .filter((g) => g.status === 'active' && g.progress < 100)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 5);

  if (visibleGoals.length === 0) {
    return <p className="empty-state">目標がありません</p>;
  }

  return (
    <div className="goals-list">
      {visibleGoals.map((goal) => (
        <div key={goal.id} className="goal-item">
          <div className="goal-info">
            <h3>{goal.title}</h3>
            <div className="goal-meta-row">
              <span className="goal-category-pill">{goal.category}</span>
              <span className={`priority-pill priority-${goal.priority}`}>
                {goal.priority === 'high' ? '高' : goal.priority === 'medium' ? '中' : '低'}
              </span>
            </div>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{goal.progress}%</span>
        </div>
      ))}
    </div>
  );
};

// 体調管理
interface HealthStatusProps {
  metrics: HealthMetrics[];
}

const HealthStatus: React.FC<HealthStatusProps> = ({ metrics }) => {
  // 最新3日分のデータを取得（降順）
  const last3Days = metrics.slice(-3).reverse();
  const today = metrics.find(
    (m) => new Date(m.date).toDateString() === new Date().toDateString()
  );

  if (!today && metrics.length === 0) {
    return (
      <div className="health-status-empty">
        <p>体調情報をまだ入力していません</p>
        <Link to="/health" className="btn btn-primary">
          体調を記録する
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 今日の体調 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', color: '#666', marginBottom: '0.75rem', fontWeight: 600 }}>
          今日の体調
        </h3>
        {today ? (
          <div className="health-status">
            <div className="health-item">
              <Heart size={20} />
              <div>
                <span className="health-label">気分</span>
                <div className="mood-stars">
                  {Array.from({ length: today.mood }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="health-item">
              <TrendingUp size={20} />
              <div>
                <span className="health-label">エネルギー</span>
                <span className="health-value">{today.energyLevel}/5</span>
              </div>
            </div>
            <div className="health-item">
              <Clock size={20} />
              <div>
                <span className="health-label">睡眠時間</span>
                <span className="health-value">{today.sleepHours}時間</span>
              </div>
            </div>
            <div className="health-item">
              <Apple size={20} />
              <div>
                <span className="health-label">睡眠の質</span>
                <span className="health-value">{today.sleepQuality}/5</span>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ color: '#999', fontSize: '0.9rem' }}>本日はまだ記録されていません</p>
        )}
      </div>

      {/* 過去3日間のプレビュー */}
      <div>
        <h3 style={{ fontSize: '0.95rem', color: '#666', marginBottom: '0.75rem', fontWeight: 600 }}>
          過去3日間の記録
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          {last3Days.map((metric) => (
            <div
              key={metric.id}
              style={{
                padding: '0.75rem',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' }}>
                {new Date(metric.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
              </div>
              <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <div style={{ color: '#666', fontWeight: 500 }}>
                  {'⭐'.repeat(metric.mood)}
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                <div>体: {metric.energyLevel}/5</div>
                <div>眠: {metric.sleepHours}h</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/health" className="btn btn-primary">
            体調を記録する
          </Link>
        </div>
      </div>
    </div>
  );
};

// 最近の日誌
interface RecentJournalsProps {
  journals: Journal[];
}

const RecentJournals: React.FC<RecentJournalsProps> = ({ journals }) => {
  const today = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayStart = startOfDay(today).getTime();
  const recent = journals
    .filter((j) => {
      const jd = new Date(j.date);
      const jStart = startOfDay(jd).getTime();
      const diffDays = Math.round((todayStart - jStart) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 2; // within last 3 calendar days
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (recent.length === 0) {
    return <p className="empty-state">日誌がありません</p>;
  }

  return (
    <div className="journals-list">
      {recent.map((journal) => (
        <div key={journal.id} className="journal-item">
          <div className="journal-header">
            <h4>{journal.title}</h4>
            <span className="journal-date">
              {new Date(journal.date).toLocaleDateString('ja-JP')}
            </span>
          </div>
          <p className="journal-excerpt">
            {journal.content.substring(0, 100)}...
          </p>
          <div className="journal-tags">
            {journal.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// クイックアクション
const QuickActions: React.FC = () => {
  const actions = [
    { icon: <BookOpen size={20} />, label: '日誌を書く', href: '/journals' },
    { icon: <Heart size={20} />, label: '体調を記録', href: '/health' },
    { icon: <BarChart3 size={20} />, label: '進捗を更新', href: '/goals' },
    { icon: <Users size={20} />, label: 'コミュニティ', href: '/social' },
  ];

  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <Link key={index} to={action.href} className="quick-action-btn">
          <div className="action-icon">{action.icon}</div>
          <span>{action.label}</span>
        </Link>
      ))}
    </div>
  );
};

// 統計情報の計算
function calculateStats(goals: Goal[], healthMetrics: HealthMetrics[]) {
  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  // 全ての目標の進捗平均を表示するよう変更（追加された目標も反映されます）
  const averageProgress =
    goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
      : 0;

  const latestHealth = healthMetrics[healthMetrics.length - 1];
  const currentMoodScore = latestHealth ? latestHealth.mood : 0;

  return {
    activeGoals: activeGoals.length,
    completedGoals: completedGoals.length,
    averageProgress,
    currentMoodScore,
  };
}
export default Dashboard;
