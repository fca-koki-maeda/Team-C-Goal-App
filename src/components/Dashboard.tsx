import React from 'react';
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

  return (
    <div className="dashboard">
      {/* ヘッダー */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>ダッシュボード</h1>
          <p className="greeting">{userName}さんへようこそ</p>
        </div>
        <div className="header-actions">
          <Link to="/social" className="btn btn-ghost sns-btn" title="コミュニティ">
            <Users size={18} />
            <span>コミュニティ</span>
          </Link>
          <button className="btn btn-primary">+ 目標を追加</button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="dashboard-main">
        {/* 統計情報カード */}
        <section className="stats-section">
          <div className="stats-grid">
            <StatCard
              icon={<Target size={24} />}
              label="進行中の目標"
              value={stats.activeGoals}
              color="blue"
            />
            <StatCard
              icon={<CheckCircle size={24} />}
              label="完了した目標"
              value={stats.completedGoals}
              color="green"
            />
            <StatCard
              icon={<TrendingUp size={24} />}
              label="平均進捗率"
              value={`${stats.averageProgress}%`}
              color="purple"
            />
            <StatCard
              icon={<Heart size={24} />}
              label="現在の気分スコア"
              value={stats.currentMoodScore}
              color="red"
            />
          </div>
        </section>

        {/* メインコンテンツグリッド */}
        <div className="content-grid">
          {/* 左カラム */}
          <div className="left-column">
            {/* 目標進捗 */}
            <section className="card">
              <div className="card-header">
                <h2>目標進捗</h2>
                <Link to="/goals" className="link">すべて見る</Link>
              </div>
              <GoalsProgress goals={goals} />
            </section>

            {/* パフォーマンス分析 */}
            <section className="card">
              <div className="card-header">
                <h2>パフォーマンス分析</h2>
                <Link to="/performance" className="link">詳細を見る</Link>
              </div>
              <PerformanceChart metrics={healthMetrics} />
            </section>
          </div>

          {/* 右カラム */}
          <div className="right-column">
            {/* 今日の体調管理 */}
            <section className="card">
              <div className="card-header">
                <h2>今日の体調管理</h2>
              </div>
              <HealthStatus metrics={healthMetrics} />
            </section>

            {/* 最近の日誌 */}
            <section className="card">
              <div className="card-header">
                <h2>最近の日誌</h2>
                <Link to="/journals" className="link">すべて見る</Link>
              </div>
              <RecentJournals journals={recentJournals} />
            </section>

            {/* クイックアクション */}
            <section className="card">
              <div className="card-header">
                <h2>クイックアクション</h2>
              </div>
              <QuickActions />
            </section>
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
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">{icon}</div>
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
  const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 5);

  if (activeGoals.length === 0) {
    return <p className="empty-state">目標がありません</p>;
  }

  return (
    <div className="goals-list">
      {activeGoals.map((goal) => (
        <div key={goal.id} className="goal-item">
          <div className="goal-info">
            <h3>{goal.title}</h3>
            <p className="goal-category">{goal.category}</p>
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

// パフォーマンスチャート
interface PerformanceChartProps {
  metrics: HealthMetrics[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ metrics }) => {
  if (metrics.length === 0) {
    return <p className="empty-state">データがありません</p>;
  }

  const lastWeek = metrics.slice(-7);
  const avgMood = (
    lastWeek.reduce((sum, m) => sum + m.mood, 0) / lastWeek.length
  ).toFixed(1);
  const avgEnergy = (
    lastWeek.reduce((sum, m) => sum + m.energyLevel, 0) / lastWeek.length
  ).toFixed(1);
  const avgSleep = (
    lastWeek.reduce((sum, m) => sum + m.sleepHours, 0) / lastWeek.length
  ).toFixed(1);

  return (
    <div className="performance-metrics">
      <div className="metric-item">
        <Heart size={20} />
        <div className="metric-info">
          <span className="metric-label">平均気分スコア</span>
          <span className="metric-value">{avgMood}/5</span>
        </div>
      </div>
      <div className="metric-item">
        <TrendingUp size={20} />
        <div className="metric-info">
          <span className="metric-label">平均エネルギーレベル</span>
          <span className="metric-value">{avgEnergy}/5</span>
        </div>
      </div>
      <div className="metric-item">
        <Clock size={20} />
        <div className="metric-info">
          <span className="metric-label">平均睡眠時間</span>
          <span className="metric-value">{avgSleep}時間</span>
        </div>
      </div>
    </div>
  );
};

// 体調管理
interface HealthStatusProps {
  metrics: HealthMetrics[];
}

const HealthStatus: React.FC<HealthStatusProps> = ({ metrics }) => {
  const today = metrics.find(
    (m) => new Date(m.date).toDateString() === new Date().toDateString()
  );

  if (!today) {
    return (
      <div className="health-status-empty">
        <p>今日の体調情報をまだ入力していません</p>
        <button className="btn btn-secondary">体調を記録する</button>
      </div>
    );
  }

  return (
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
          <span className="health-label">エネルギーレベル</span>
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
  );
};

// 最近の日誌
interface RecentJournalsProps {
  journals: Journal[];
}

const RecentJournals: React.FC<RecentJournalsProps> = ({ journals }) => {
  const recent = journals.slice(0, 3);

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
    { icon: <Apple size={20} />, label: '食事を記録', href: '/meals' },
    { icon: <Heart size={20} />, label: '体調を記録', href: '/health' },
    { icon: <BarChart3 size={20} />, label: '進捗を更新', href: '/progress' },
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
  const averageProgress =
    activeGoals.length > 0
      ? Math.round(
          activeGoals.reduce((sum, g) => sum + g.progress, 0) /
            activeGoals.length
        )
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
