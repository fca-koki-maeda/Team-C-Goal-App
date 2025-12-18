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
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [dateFrom, setDateFrom] = useState<string>('');
	const [dateTo, setDateTo] = useState<string>('');

	// applied filters (only when user presses 検索)
	const [appliedTags, setAppliedTags] = useState<string[]>([]);
	const [appliedDateFrom, setAppliedDateFrom] = useState<string>('');
	const [appliedDateTo, setAppliedDateTo] = useState<string>('');

	const toggleTag = (tag: string) => setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

	// load all journals and compute recent when editId or selectedTags change, and listen to updates
useEffect(() => {
	const load = () => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			const list: JournalItem[] = raw ? (JSON.parse(raw) as JournalItem[]) : [];
			// updated list loaded
			const sorted = list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
			setRecent(
				sorted
					.filter((it) => {
						if (selectedTags.length > 0 && !it.tags.some((t) => selectedTags.includes(t))) return false;
						if (dateFrom) {
							const df = new Date(dateFrom + 'T00:00:00');
							if (new Date(it.date) < df) return false;
						}
						if (dateTo) {
							const dt = new Date(dateTo + 'T23:59:59');
							if (new Date(it.date) > dt) return false;
						}
						return true;
					})
					.slice(0, 6)
			);
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
			// on error, nothing to load
			setRecent([]);
		}
	};

	load();
	const h = () => load();
	window.addEventListener('journals-updated', h);
	return () => window.removeEventListener('journals-updated', h);
}, [editId, appliedTags, appliedDateFrom, appliedDateTo]);

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
			const sorted = list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
			setRecent(
				sorted
					.filter((it) => (selectedTags.length === 0 ? true : it.tags.some((t) => selectedTags.includes(t))))
					.slice(0, 6)
			);
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
			{/* タグクラウド */}
			<section style={{ marginBottom: 12 }}>
				<div style={{ marginBottom: 8, fontWeight: 700 }}>タグで絞り込み</div>
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
					{(() => {
						try {
							const raw = localStorage.getItem(STORAGE_KEY) || '[]';
							const list = JSON.parse(raw) as JournalItem[];
							const s = new Set<string>();
							list.forEach((j) => j.tags.forEach((t) => s.add(t)));
							const tags = Array.from(s).sort();
							if (tags.length === 0) return <div style={{ color: '#666' }}>タグがありません</div>;
							return tags.map((tag) => {
								const active = selectedTags.includes(tag);
								return (
									<button key={tag} type="button" onClick={() => toggleTag(tag)} style={{ padding: '6px 10px', borderRadius: 16, background: active ? '#0078d4' : '#f3f5f7', color: active ? '#fff' : '#222', border: active ? '1px solid #005a9e' : '1px solid rgba(0,0,0,0.06)' }}>{tag}</button>
								);
							});
						} catch (e) {
							return <div style={{ color: '#666' }}>タグがありません</div>;
						}
					})()}
				</div>
				<div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
					<button type="button" onClick={() => { setSelectedTags([]); setDateFrom(''); setDateTo(''); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d0d0d0', background: '#fff' }}>クリア</button>
					<span style={{ alignSelf: 'center', color: '#666' }}>{selectedTags.length > 0 ? `${selectedTags.length} 個選択中` : 'すべて'}</span>
					<div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
						<label style={{ fontSize: 12, color: '#666' }}>期間</label>
						<input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d0d0d0' }} />
						<span style={{ color: '#666' }}>〜</span>
						<input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d0d0d0' }} />
						<button type="button" onClick={() => { setAppliedTags(selectedTags); setAppliedDateFrom(dateFrom); setAppliedDateTo(dateTo); }} style={{ padding: '6px 10px', borderRadius: 6, background: '#0078d4', color: '#fff', border: 'none' }}>検索</button>
					</div>
				</div>
			</section>
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

