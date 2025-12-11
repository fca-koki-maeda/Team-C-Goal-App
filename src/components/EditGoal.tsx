import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Goal } from '../types';
import '../styles/add-goal.css';

interface EditGoalProps {
  goals: Goal[];
  onUpdateGoal: (id: string, goal: Omit<Goal, 'id'>) => void;
}

const EditGoal: React.FC<EditGoalProps> = ({ goals, onUpdateGoal }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const goal = goals.find((g) => g.id === id);

  if (!goal) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>目標が見つかりません</p>
        <button onClick={() => navigate('/')}>ダッシュボードに戻る</button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: goal.title,
    description: goal.description,
    category: goal.category,
    targetDate: goal.targetDate.toISOString().split('T')[0],
    priority: goal.priority,
    progress: goal.progress,
    status: goal.status,
  });

  const categories = [
    'スキルアップ',
    'ヘルスケア',
    '言語学習',
    '仕事',
    'フィットネス',
    '自己啓発',
    'その他',
  ];

  const priorities = [
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' },
  ];

  const statuses = [
    { value: 'active', label: '進行中' },
    { value: 'completed', label: '完了' },
    { value: 'paused', label: '一時停止' },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.targetDate) {
      alert('目標名と目標日を入力してください');
      return;
    }

    const updatedGoal: Omit<Goal, 'id'> = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      startDate: goal.startDate,
      targetDate: new Date(formData.targetDate),
      progress: formData.progress,
      status: formData.status as Goal['status'],
      priority: formData.priority as Goal['priority'],
    };

    onUpdateGoal(goal.id, updatedGoal);
    navigate('/goals');
  };

  const handleCancel = () => {
    navigate('/goals');
  };

  return (
    <div className="add-goal-container">
      {/* ヘッダー */}
      <header className="add-goal-header">
        <button className="back-btn" onClick={handleCancel}>
          <ArrowLeft size={24} />
          <span>戻る</span>
        </button>
        <h1>目標を編集</h1>
      </header>

      {/* フォーム */}
      <main className="add-goal-main">
        <form onSubmit={handleSubmit} className="goal-form card">
          {/* 目標名 */}
          <div className="form-group">
            <label htmlFor="title">目標名 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="例：プログラミングスキル向上"
              maxLength={100}
            />
            <span className="char-count">
              {formData.title.length}/100
            </span>
          </div>

          {/* 説明 */}
          <div className="form-group">
            <label htmlFor="description">説明</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="目標の詳細説明を入力してください"
              maxLength={500}
              rows={4}
            />
            <span className="char-count">
              {formData.description.length}/500
            </span>
          </div>

          {/* カテゴリ */}
          <div className="form-group">
            <label htmlFor="category">カテゴリ</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 優先度 */}
          <div className="form-group">
            <label htmlFor="priority">優先度</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* ステータス */}
          <div className="form-group">
            <label htmlFor="status">ステータス</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* 目標日 */}
          <div className="form-group">
            <label htmlFor="targetDate">目標日 *</label>
            <input
              type="date"
              id="targetDate"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
            />
          </div>

          {/* 進捗 */}
          <div className="form-group">
            <label htmlFor="progress">
              進捗率: {formData.progress}%
            </label>
            <input
              type="range"
              id="progress"
              name="progress"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={handleChange}
            />
            <div className="range-labels">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* ボタン */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              変更を保存
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

interface GoalsProgressProps {
  goals: Goal[];
}

const GoalsProgress: React.FC<GoalsProgressProps> = ({ goals }) => {
  const activeGoals = goals.filter((g) => g.status === 'active');

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

export default EditGoal;