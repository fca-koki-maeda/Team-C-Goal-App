import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/journals.css';

type JournalItem = {
	id: string;
	date: string; // ISO
	title: string;
	content: string;
	tags: string[];
};

const STORAGE_KEY = 'journals_v1';

function shuffle<T>(arr: T[]) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

const styles = {
	container: { padding: 16, maxWidth: 900, margin: '0 auto' },
	form: { marginBottom: 18, padding: 12, border: '1px solid #e6e6e6', borderRadius: 8, background: '#fff' },
	input: { width: '100%', padding: '8px 10px', marginBottom: 8, borderRadius: 6, border: '1px solid #d0d0d0' },
	tagPill: (active = false) => ({ padding: '6px 10px', borderRadius: 16, background: active ? '#0078d4' : '#f3f5f7', color: active ? '#fff' : '#222', cursor: 'pointer', border: active ? '1px solid #005a9e' : '1px solid rgba(0,0,0,0.06)' }),
} as const;

export default function Journal(): JSX.Element {
	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const editId = params.get('edit');

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [tagInput, setTagInput] = useState('');
	const [dateValue, setDateValue] = useState(() => new Date().toISOString().slice(0, 10));
	const [isEditing, setIsEditing] = useState(false);
	const [recent, setRecent] = useState<JournalItem[]>([]);

	// load recent 6 on mount and prefill edit if editId provided
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			const list: JournalItem[] = raw ? (JSON.parse(raw) as JournalItem[]) : [];
			setRecent(list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6));
			if (editId) {
				const found = list.find((l) => l.id === editId);
				if (found) {
					setTitle(found.title);
					setContent(found.content);
					setTagInput(found.tags.join(', '));
					try { setDateValue(new Date(found.date).toISOString().slice(0, 10)); } catch (e) {}
					setIsEditing(true);
				}
			}
		} catch (e) {
			setRecent([]);
		}
	}, [editId]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
		if (!title.trim() || !content.trim()) return;
		const newItem: JournalItem = {
			id: isEditing && editId ? editId : `${Date.now()}`,
			date: new Date(dateValue + 'T00:00:00').toISOString(),
			title: title.trim(),
			content: content.trim(),
			tags,
		};

		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			const list: JournalItem[] = raw ? (JSON.parse(raw) as JournalItem[]) : [];
			if (isEditing && editId) {
				const idx = list.findIndex((l) => l.id === editId);
				if (idx !== -1) list[idx] = newItem;
			} else {
				list.unshift(newItem);
			}
			localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
			window.dispatchEvent(new Event('journals-updated'));
			setRecent(list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6));
		} catch (e) {
			// ignore
		}

		navigate('/');
	};

	const handleDelete = () => {
		if (!isEditing || !editId) return;
		if (!window.confirm('この日誌を削除してよいですか？')) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			const list: JournalItem[] = raw ? (JSON.parse(raw) as JournalItem[]) : [];
			const next = list.filter((l) => l.id !== editId);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			window.dispatchEvent(new Event('journals-updated'));
		} catch (e) {}
		navigate('/journals/archive');
	};

	return (
		<div style={styles.container}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
				<h2 style={{ margin: 0 }}>日誌</h2>
				<div style={{ display: 'flex', gap: 8 }}>
					<button type="button" onClick={() => { const el = document.getElementById('journal-form'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d0d0', background: '#fff' }}>日誌を書く欄へ</button>
					<button type="button" onClick={() => navigate('/journals/archive')} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d0d0', background: '#fff' }}>過去の日誌を見る</button>
				</div>
			</div>

			<form id="journal-form" onSubmit={handleSubmit} style={styles.form} aria-label="日誌フォーム">
				<div>
					<label style={{ fontWeight: 700 }}>日付</label>
					<input type="date" style={styles.input} value={dateValue} onChange={(e) => setDateValue(e.target.value)} />
				</div>

				<div>
					<label style={{ fontWeight: 700 }}>タイトル</label>
					<input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
				</div>

				<div>
					<label style={{ fontWeight: 700 }}>内容</label>
					<textarea style={{ ...styles.input, minHeight: 120 }} value={content} onChange={(e) => setContent(e.target.value)} />
				</div>

				<div>
					<label style={{ fontWeight: 700 }}>タグ（カンマ区切り）</label>
					<input style={styles.input} value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="例: 日常, 仕事" />
				</div>

				<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
					{isEditing && <button type="button" onClick={handleDelete} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d0d0', background: '#fff' }}>削除</button>}
					<button type="button" onClick={() => { setTitle(''); setContent(''); setTagInput(''); setDateValue(new Date().toISOString().slice(0,10)); }} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d0d0', background: '#fff' }}>リセット</button>
					<button type="submit" style={{ padding: '8px 12px', borderRadius: 6, background: '#0078d4', color: '#fff', border: 'none' }}>{isEditing ? '更新して戻る' : '保存して戻る'}</button>
				</div>
			</form>

			<section style={{ marginTop: 20 }}>
				<h3 style={{ marginBottom: 10 }}>最近の投稿（6件）</h3>
				{recent.length === 0 ? (
					<div className="empty">投稿がありません</div>
				) : (
					<div style={{ display: 'grid', gap: 12 }}>
						{recent.map((r) => (
							<div key={r.id} style={{ border: '1px solid #eaeaea', padding: 12, borderRadius: 8, background: '#fff' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div style={{ fontWeight: 700 }}>{r.title}</div>
									<div style={{ fontSize: 12, color: '#666' }}>{new Date(r.date).toLocaleString('ja-JP')}</div>
								</div>
								<div style={{ marginTop: 8, color: '#444' }}>{r.content.substring(0, 140)}{r.content.length > 140 ? '...' : ''}</div>
								<div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
									{r.tags.map((t) => <span key={t} style={{ padding: '6px 10px', borderRadius: 16, background: '#f3f5f7' }}>{t}</span>)}
								</div>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	);
}

