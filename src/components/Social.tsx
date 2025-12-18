import { useEffect, useMemo, useState, FormEvent } from 'react';

type Community = {
	id: string;
	name: string;
	description: string;
	tags: string[];
	author: string;
};

const STORAGE_KEY = 'social_communities_v1';

const DEFAULT_COMMUNITIES: Community[] = [
	{
		id: 'c1',
		name: 'React 勉強会',
		description: 'React の知識交換・ハンズオンをするコミュニティ',
		tags: ['開発', 'フロントエンド', '勉強会'],
		author: '山田太郎',
	},
	{
		id: 'c2',
		name: 'ランニング仲間',
		description: '週末に一緒に走るグループ',
		tags: ['フィットネス', 'アウトドア'],
		author: '佐藤花子',
	},
	{
		id: 'c3',
		name: '英語学習コミュニティ',
		description: '英語学習の情報共有と会話練習',
		tags: ['学習', '言語'],
		author: '鈴木一郎',
	},
];

export default function Social(): JSX.Element {
	// localStorage から読み込み（初期化関数で行う）
	const [communities, setCommunities] = useState<Community[]>(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as Community[];
				if (Array.isArray(parsed)) return parsed;
			}
		} catch {
			// 読み込み失敗時はデフォルトを使う
		}
		return DEFAULT_COMMUNITIES;
	});

	// localStorage に保存（communities が変わる度）
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(communities));
		} catch {
			// 保存失敗は無視
		}
	}, [communities]);

	// --- 投稿フォームの状態（投稿者名フィールドを追加） ---
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [tagInput, setTagInput] = useState(''); // カンマ区切りで入力
	const [author, setAuthor] = useState(''); // 追加: 投稿者名入力

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const tags = tagInput
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
		if (!name.trim()) return;
		const newC: Community = {
			id: `c${Date.now()}`,
			name: name.trim(),
			description: description.trim(),
			tags,
			author: author.trim() || '匿名', // 投稿者未入力時は '匿名'
		};
		setCommunities((prev) => [newC, ...prev]);
		setName('');
		setDescription('');
		setTagInput('');
		setAuthor(''); // リセット
	};

	// 全タグをユニークに抽出してソート
	const allTags = useMemo(() => {
		const s = new Set<string>();
		communities.forEach((c) => c.tags.forEach((t) => s.add(t)));
		return Array.from(s).sort();
	}, [communities]);

	// 選択タグ
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const toggleTag = (tag: string) =>
		setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

	const clearTags = () => setSelectedTags([]);

	// フィルタ（選択タグが空なら全件、そうでなければ any マッチ）
	const filtered = useMemo(() => {
		if (selectedTags.length === 0) return communities;
		return communities.filter((c) => c.tags.some((t) => selectedTags.includes(t)));
	}, [communities, selectedTags]);

	// スタイル（簡潔にインラインで）
	const styles = {
		container: { padding: 16, maxWidth: 900, margin: '0 auto' },
		form: { marginBottom: 18, padding: 12, border: '1px solid #e6e6e6', borderRadius: 8, background: '#fff' },
		input: { width: '100%', padding: '8px 10px', marginBottom: 8, borderRadius: 6, border: '1px solid #d0d0d0' },
		tagCloud: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
		tagPill: (active = false) => ({
			padding: '8px 12px',
			borderRadius: 20,
			background: active ? '#0078d4' : '#f3f5f7',
			color: active ? '#fff' : '#222',
			border: active ? '1px solid #005a9e' : '1px solid rgba(0,0,0,0.06)',
			cursor: 'pointer',
			fontWeight: active ? 700 : 500,
			boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : undefined,
		}),
		chip: { display: 'inline-flex', gap: 6, alignItems: 'center', padding: '6px 8px', borderRadius: 999, background: '#eef6ff', color: '#005a9e', fontWeight: 600 },
		communityCard: { border: '1px solid #eaeaea', padding: 12, borderRadius: 8, background: '#fff' },
		authorText: { fontSize: 12, color: '#666', marginTop: 6 },
	} as const;

	return (
		<div style={styles.container}>
			<h2>コミュニティ</h2>

			{/* 投稿フォーム（投稿者名入力を追加） */}
			<form onSubmit={handleSubmit} style={styles.form} aria-label="新規コミュニティ投稿フォーム">
				<div style={{ marginBottom: 8, fontWeight: 700 }}>投稿</div>

				<input
					style={styles.input}
					placeholder="投稿者名（例: 山田 太郎）"
					value={author}
					onChange={(e) => setAuthor(e.target.value)}
				/>

				<input
					style={styles.input}
					placeholder="コミュニティ名"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<textarea
					style={{ ...styles.input, minHeight: 70 }}
					placeholder="説明"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<input
					style={styles.input}
					placeholder="タグ（カンマ区切り - 例: 開発, フロントエンド）"
					value={tagInput}
					onChange={(e) => setTagInput(e.target.value)}
				/>
				<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
					<button type="button" onClick={() => { setName(''); setDescription(''); setTagInput(''); setAuthor(''); }} style={{ padding: '8px 12px', borderRadius: 6 }}>
						リセット
					</button>
					<button type="submit" style={{ padding: '8px 12px', borderRadius: 6, background: '#0078d4', color: '#fff', border: 'none' }}>
						投稿
					</button>
				</div>
			</form>

			{/* タグフィルタ（見やすいタグクラウド） */}
			<section aria-labelledby="tag-filter" style={{ marginBottom: 14 }}>
				<div id="tag-filter" style={{ marginBottom: 8, fontWeight: 700 }}>
					タグで絞り込み
				</div>

				<div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
					<div style={styles.tagCloud}>
						{allTags.length === 0 ? (
							<div style={{ color: '#666' }}>タグがありません</div>
						) : (
							allTags.map((tag) => {
								const active = selectedTags.includes(tag);
								return (
									<button
										key={tag}
										type="button"
										onClick={() => toggleTag(tag)}
										aria-pressed={active}
										style={styles.tagPill(active)}
										title={`タグ: ${tag}`}
									>
										{tag}
									</button>
								);
							})
						)}
					</div>

					<div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
						<button
							type="button"
							onClick={clearTags}
							style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d0d0', background: '#fff' }}
						>
							クリア
						</button>
						<button
							type="button"
							onClick={() => setSelectedTags([])}
							style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d0d0', background: '#fff' }}
						>
							すべて表示
						</button>
					</div>
				</div>

				{selectedTags.length > 0 && (
					<div style={{ marginBottom: 8 }}>
						選択中:
						<span style={{ marginLeft: 8, display: 'inline-flex', gap: 8, flexWrap: 'wrap', verticalAlign: 'middle' }}>
							{selectedTags.map((t) => (
								<span key={t} style={styles.chip}>
									{t}
									<button
										type="button"
										onClick={() => toggleTag(t)}
										aria-label={`タグ ${t} を解除`}
										style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#005a9e' }}
									>
										×
									</button>
								</span>
							))}
						</span>
					</div>
				)}
			</section>

			{/* コミュニティ一覧（投稿者名を表示） */}
			<section aria-labelledby="community-list">
				<div id="community-list" style={{ marginBottom: 8, fontWeight: 700 }}>
					コミュニティ一覧（{filtered.length}件）
				</div>

				<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
					{filtered.map((c) => (
						<li key={c.id} style={styles.communityCard}>
							<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
								<div>
									<div style={{ fontWeight: 700 }}>{c.name}</div>
									<div style={{ color: '#444', marginTop: 6 }}>{c.description}</div>
									<div style={styles.authorText}>投稿者: {c.author}</div> {/* 追加表示 */}
								</div>
								<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
									{c.tags.map((t) => (
										<span
											key={t}
											style={{
												fontSize: 12,
												padding: '6px 10px',
												borderRadius: 999,
												background: '#f3f3f3',
												border: '1px solid #e0e0e0',
												cursor: 'pointer',
											}}
											onClick={() => toggleTag(t)}
											role="button"
											aria-pressed={selectedTags.includes(t)}
											title={`このタグで絞り込む: ${t}`}
										>
											{t}
										</span>
									))}
								</div>
							</div>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
