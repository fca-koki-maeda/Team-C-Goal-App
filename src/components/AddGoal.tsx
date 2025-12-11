import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Goal } from '../types';
import '../styles/add-goal.css';

interface AddGoalProps {
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
}

const AddGoal: React.FC<AddGoalProps> = ({ onAddGoal }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'スキルアップ',
    targetDate: '',
    priority: 'medium' as const,
    progress: 0,
    status: 'active' as const,
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

    const newGoal: Omit<Goal, 'id'> = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      startDate: new Date(),
      targetDate: new Date(formData.targetDate),
      progress: formData.progress,
      status: formData.status,
      priority: formData.priority,
    };

    onAddGoal(newGoal);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="add-goal-container">
      {/* ヘッダー */}
      <header className="add-goal-header">
        <button className="back-btn" onClick={handleCancel}>
          <ArrowLeft size={24} />
          <span>戻る</span>
        </button>
        <h1>新しい目標を追加</h1>
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

          {/* 目標日 */}
          <div className="form-group">
            <label htmlFor="targetDate">目標日 *</label>
            <input
              type="date"
              id="targetDate"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* 初期進捗 */}
          <div className="form-group">
            <label htmlFor="progress">
              初期進捗率: {formData.progress}%
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
              <Plus size={18} />
              目標を追加
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddGoal;