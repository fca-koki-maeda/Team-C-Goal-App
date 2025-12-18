import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { HealthMetrics } from '../types';
import '../styles/dashboard.css';
import '../styles/add-goal.css';

interface HealthPageProps {
  metrics: HealthMetrics[];
  onAddMetric: (m: Omit<HealthMetrics, 'id'>) => void;
  onDeleteMetric: (id: string) => void;
  onUpdateMetric: (id: string, m: Omit<HealthMetrics, 'id'>) => void;
}

export default function HealthPage({ metrics, onAddMetric, onDeleteMetric, onUpdateMetric }: HealthPageProps) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(today);
  const [mood, setMood] = useState<number>(3);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [notes, setNotes] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // 選択された日付に既存の記録があるかチェック
  const getExistingRecordForDate = (targetDate: string) => {
    return metrics.find(
      (m) => new Date(m.date).toISOString().split('T')[0] === targetDate
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const metric: Omit<HealthMetrics, 'id'> = {
      date: new Date(date),
      mood,
      energyLevel: mood,
      sleepHours,
      sleepQuality: Math.min(5, Math.max(1, Math.round((sleepHours / 12) * 5))),
      notes,
    };

    // その日付に既存の記録があるか確認
    const existingRecord = getExistingRecordForDate(date);

    if (existingRecord) {
      // 既存の記録を上書き(更新)
      onUpdateMetric(existingRecord.id, metric);
    } else {
      // 新規追加
      onAddMetric(metric);
    }

    // フォームリセット
    setMood(3);
    setSleepHours(7);
    setNotes('');
    setDate(today);
    setEditingId(null);
  };

  const handleEdit = (m: HealthMetrics) => {
    setDate(new Date(m.date).toISOString().split('T')[0]);
    setMood(m.mood);
    setSleepHours(m.sleepHours);
    setNotes(m.notes);
    setEditingId(m.id);
    // フォームにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMood(3);
    setSleepHours(7);
    setNotes('');
    setDate(today);
  };

  // 選択中の日付に既存の記録があるかチェック
  const existingRecord = getExistingRecordForDate(date);
  const isUpdating = existingRecord !== undefined;

  return (
    <div className="dashboard">
      <header className="dashboard-header" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => navigate('/')} aria-label="戻る" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={20} />
            <span>戻る</span>
          </button>
          <div className="header-content" style={{ margin: 0 }}>
            <h1 style={{ margin: 0 }}>体調を記録する</h1>
            <p className="greeting" style={{ marginTop: 4 }}>1日につき1つの記録のみ保存できます</p>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="card" style={{ marginBottom: 16 }}>
          {editingId && (
            <div style={{ padding: '12px', background: '#fef3c7', borderRadius: 6, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#92400e' }}>編集モード: {date} の記録を編集中</span>
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d97706', background: '#fff', cursor: 'pointer' }}
              >
                キャンセル
              </button>
            </div>
          )}

          {isUpdating && !editingId && (
            <div style={{ padding: '12px', background: '#dbeafe', borderRadius: 6, marginBottom: 12 }}>
              <span style={{ fontWeight: 600, color: '#1e40af' }}>
                {date} にはすでに記録が存在します。保存すると上書きされます。
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <div className="form-group">
              <label>日付</label>
              <input
                type="date"
                value={date}
                max={today}
                onChange={(e) => {
                  setDate(e.target.value);
                  // 日付変更時に編集モードをクリア
                  if (editingId) {
                    setEditingId(null);
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label>体調(1〜5)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1,2,3,4,5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setMood(v)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: mood === v ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                      background: mood === v ? '#eef2ff' : '#fff',
                      cursor: 'pointer'
                    }}
                    aria-pressed={mood === v}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>睡眠時間(時間)</label>
              <select value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))}>
                {Array.from({ length: 13 }).map((_, i) => (
                  <option key={i} value={i}>{i} 時間</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>メモ</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  キャンセル
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                {isUpdating ? '上書き保存' : '保存'}
              </button>
            </div>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>過去の記録</h2>
          </div>
          {metrics.length === 0 ? (
            <p className="empty-state">記録がありません</p>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {metrics.slice().reverse().map((m) => (
                <div key={m.id} style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{new Date(m.date).toLocaleDateString('ja-JP')}</div>
                    <div style={{ color: '#666', fontSize: 14 }}>
                      体調: {m.mood} / 睡眠: {m.sleepHours}h
                    </div>
                    {m.notes && <div style={{ color: '#444', marginTop: 6 }}>{m.notes}</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(m)}
                    >
                      編集
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (confirm('この記録を削除しますか?')) {
                          onDeleteMetric(m.id);
                          // 編集中の記録を削除した場合は編集モードを解除
                          if (editingId === m.id) {
                            handleCancelEdit();
                          }
                        }
                      }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}