import React, { useState } from 'react';
import { HealthMetrics } from '../types';
import '../styles/dashboard.css';

interface HealthPageProps {
  metrics: HealthMetrics[];
  onAddMetric: (m: Omit<HealthMetrics, 'id'>) => void;
  onDeleteMetric: (id: string) => void;
}

export default function HealthPage({ metrics, onAddMetric, onDeleteMetric }: HealthPageProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<number>(3);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metric: Omit<HealthMetrics, 'id'> = {
      date: new Date(date),
      mood,
      energyLevel: mood, // 簡易に mood と同等
      sleepHours,
      sleepQuality: Math.min(5, Math.max(1, Math.round((sleepHours / 12) * 5))), // 簡易推定
      notes,
    };
    onAddMetric(metric);
    // フォームリセット
    setMood(3);
    setSleepHours(7);
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>体調を記録する</h1>
          <p className="greeting">過去の記録の閲覧・削除ができます</p>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="card" style={{ marginBottom: 16 }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
            <div className="form-group">
              <label>日付</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label>体調（1〜5）</label>
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
              <label>睡眠時間（時間）</label>
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
              <button type="submit" className="btn btn-primary">保存</button>
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
                    <button className="btn btn-secondary" onClick={() => navigator.clipboard?.writeText(JSON.stringify(m))}>共有</button>
                    <button className="btn btn-danger" onClick={() => { if (confirm('この記録を削除しますか？')) onDeleteMetric(m.id); }}>削除</button>
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