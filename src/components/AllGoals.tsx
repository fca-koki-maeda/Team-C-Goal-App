import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Goal } from '../types';
import '../styles/all-goals.css';

interface AllGoalsProps {
  goals: Goal[];
  onDeleteGoal: (id: string) => void;
}

const AllGoals: React.FC<AllGoalsProps> = ({ goals, onDeleteGoal }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'active') return goal.status === 'active';
    if (filter === 'completed') return goal.status === 'completed';
    return true;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('この目標を削除してもよろしいですか？')) {
      onDeleteGoal(id);
    }
  };

  return (
    <div className="all-goals-container">
      {/* ヘッダー */}
      <header className="all-goals-header">
        <button
          className="back-btn"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={24} />
          <span>戻る</span>
        </button>
        <h1>すべての目標</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="all-goals-main">
        {/* フィルタータブ */}
        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            すべて ({goals.length})
          </button>
          <button
            className={`tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            進行中 ({goals.filter((g) => g.status === 'active').length})
          </button>
          <button
            className={`tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            完了 ({goals.filter((g) => g.status === 'completed').length})
          </button>
        </div>

        {/* 目標一覧 */}
        {filteredGoals.length === 0 ? (
          <div className="empty-state">
            <p>目標がありません</p>
          </div>
        ) : (
          <div className="goals-grid">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className="goal-card card">
                {/* ステータスバッジ */}
                <div className="goal-header">
                  <div className="status-badge">
                    {goal.status === 'completed' ? (
                      <>
                        <CheckCircle size={16} />
                        完了
                      </>
                    ) : (
                      <>
                        <Clock size={16} />
                        進行中
                      </>
                    )}
                  </div>
                  <div className="priority-badge" data-priority={goal.priority}>
                    {goal.priority === 'high' && '高'}
                    {goal.priority === 'medium' && '中'}
                    {goal.priority === 'low' && '低'}
                  </div>
                </div>

                {/* 目標情報 */}
                <h3 className="goal-title">{goal.title}</h3>
                <p className="goal-description">{goal.description}</p>

                {/* カテゴリと進捗 */}
                <div className="goal-meta">
                  <span className="category">{goal.category}</span>
                  <span className="progress-badge">{goal.progress}%</span>
                </div>

                {/* プログレスバー */}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>

                {/* 日付情報 */}
                <div className="date-info">
                  <span className="date-label">開始:</span>
                  <span className="date-value">
                    {new Date(goal.startDate).toLocaleDateString('ja-JP')}
                  </span>
                  <span className="date-label">目標:</span>
                  <span className="date-value">
                    {new Date(goal.targetDate).toLocaleDateString('ja-JP')}
                  </span>
                </div>

                {/* アクション */}
                <div className="goal-actions">
                  <Link
                    to={`/edit-goal/${goal.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    <Edit2 size={16} />
                    編集
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(goal.id)}
                  >
                    <Trash2 size={16} />
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllGoals;