import React, { useState } from 'react';
import '../styles/social.css';
import { Users } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  content: string;
  date: string;
}

const initialPosts: Post[] = [
  {
    id: 'p1',
    author: '山田花子',
    content: '今日の進捗：React のコンポーネントを整理しました。',
    date: new Date().toLocaleString('ja-JP'),
  },
  {
    id: 'p2',
    author: '佐藤健',
    content: 'ランニング 5km。体調良好！',
    date: new Date().toLocaleString('ja-JP'),
  },
];

const Social: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('あなた');

  const addPost = () => {
    if (!content.trim()) return;
    const newPost: Post = {
      id: `p${Date.now()}`,
      author: author || '匿名',
      content: content.trim(),
      date: new Date().toLocaleString('ja-JP'),
    };
    setPosts([newPost, ...posts]);
    setContent('');
  };

  return (
    <div className="social-page">
      <header className="social-header">
        <div className="social-title">
          <Users size={24} />
          <h1>コミュニティ</h1>
        </div>
        <p className="social-sub">目標の進捗や近況を共有しましょう</p>
      </header>

      <section className="compose card">
        <input
          className="input-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="表示名"
        />
        <textarea
          className="input-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今日の報告・一言を入力..."
        />
        <div className="compose-actions">
          <button className="btn btn-secondary" onClick={() => setContent('')}>キャンセル</button>
          <button className="btn btn-primary" onClick={addPost}>投稿</button>
        </div>
      </section>

      <section className="feed">
        {posts.map((p) => (
          <article key={p.id} className="post card">
            <div className="post-header">
              <strong className="post-author">{p.author}</strong>
              <span className="post-date">{p.date}</span>
            </div>
            <p className="post-content">{p.content}</p>
          </article>
        ))}
        {posts.length === 0 && <p className="empty-state">まだ投稿がありません</p>}
      </section>
    </div>
  );
};

export default Social;
