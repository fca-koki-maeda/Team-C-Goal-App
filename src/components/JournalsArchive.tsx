import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/journals.css';

type JournalItem = {
  id: string;
  date: string; // ISO
  title: string;
  content: string;
  tags: string[];
};

const STORAGE_KEY = 'journals_v1';

export default function JournalsArchive(): JSX.Element {
  const navigate = useNavigate();
  const [items, setItems] = useState<JournalItem[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const list: JournalItem[] = raw ? (JSON.parse(raw) as JournalItem[]) : [];
        setItems(list);
      } catch (e) {
        setItems([]);
      }
    };
    load();
    const h = () => load();
    window.addEventListener('journals-updated', h);
    return () => window.removeEventListener('journals-updated', h);
  }, []);

  const filtered = items.filter((it) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      it.title.toLowerCase().includes(q) ||
      it.content.toLowerCase().includes(q) ||
      it.tags.join(' ').toLowerCase().includes(q) ||
      new Date(it.date).toLocaleDateString('ja-JP').includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (id: string) => {
    if (!window.confirm('この日誌を削除してよいですか？')) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: JournalItem[] = raw ? (JSON.parse(raw) as JournalItem[]) : [];
      const next = list.filter((l) => l.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setItems(next);
      window.dispatchEvent(new Event('journals-updated'));
    } catch (e) {}
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 style={{ margin: 0 }}>日誌アーカイブ</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => navigate('/journals')}>新規作成</button>
          <button className="btn" onClick={() => navigate('/')}>ダッシュボードへ</button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="input" placeholder="検索（タイトル・内容・タグ・日付）" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
          <select className="input" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
            <option value={3}>3件/ページ</option>
            <option value={6}>6件/ページ</option>
            <option value={12}>12件/ページ</option>
          </select>
        </div>

        <ul className="journal-list" style={{ marginTop: 12 }}>
          {pageItems.map((it) => (
            <li key={it.id} className="journal-item">
              <div style={{ flex: 1 }}>
                <div className="journal-preview-header">
                  <div className="journal-title">{it.title}</div>
                  <div className="journal-date">{new Date(it.date).toLocaleString('ja-JP')}</div>
                </div>
                <div className="journal-excerpt">{it.content.substring(0, 240)}{it.content.length > 240 ? '...' : ''}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {it.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={() => navigate('/journals?edit=' + it.id)}>編集</button>
                <button className="btn btn-outline" onClick={() => handleDelete(it.id)}>削除</button>
              </div>
            </li>
          ))}
        </ul>

        <div className="pagination" style={{ marginTop: 12 }}>
          <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>前</button>
          <span style={{ alignSelf: 'center' }}>{page} / {totalPages}</span>
          <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>次</button>
        </div>
      </div>
    </div>
  );
}
