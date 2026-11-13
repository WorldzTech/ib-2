import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DOSSIER_CARD, DOSSIER_POSTS } from '../data/dossier';

const sameSet = (a: Set<number>, b: number[]) => a.size === b.length && b.every((i) => a.has(i));

const Dossier: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  const [facts, setFacts] = useState<string[]>([]);
  const [exact, setExact] = useState(0);

  const reset = () => {
    setIndex(0);
    setPicked(new Set());
    setChecked(false);
    setFacts([]);
    setExact(0);
  };

  if (index >= DOSSIER_POSTS.length) {
    return (
      <div className="page">
        <Link to="/" className="back enter"><ArrowLeft /> Назад</Link>
        <div className="panel dossier-final enter" style={{ '--i': 1 } as CSSProperties}>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-ozon-blue)' }}>Досье собрано 🗂️</h2>
          <p className="muted">
            Вот карточка, которую можно составить по открытым постам. Ничего не взламывая.
          </p>
          <dl className="dossier-card">
            {DOSSIER_CARD.map((field) => (
              <div key={field.label}>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
          <p className="muted small">Точно разобрано постов: {exact} из {DOSSIER_POSTS.length}.</p>
          <div className="choices">
            <button className="btn btn-blue" onClick={reset}>Ещё раз</button>
            <Link to="/password" className="btn btn-green">Угадать пароль →</Link>
          </div>
        </div>
      </div>
    );
  }

  const post = DOSSIER_POSTS[index];
  const correct = post.options.flatMap((o, i) => (o.correct ? [i] : []));

  const toggle = (i: number) => {
    if (checked) return;
    setPicked((p) => {
      const next = new Set(p);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const check = () => {
    setChecked(true);
    if (sameSet(picked, correct)) setExact((n) => n + 1);
    setFacts((f) => [...f, ...post.facts.filter((x) => !f.includes(x))]);
  };

  const next = () => {
    setPicked(new Set());
    setChecked(false);
    setIndex((i) => i + 1);
  };

  return (
    <div className="page">
      <Link to="/" className="back enter"><ArrowLeft /> Назад</Link>

      <h2 className="enter" style={{ fontSize: '2rem', '--i': 1 } as CSSProperties}>Собери досье 🗂️</h2>
      <p className="muted enter" style={{ '--i': 1 } as CSSProperties}>
        Пост {index + 1} из {DOSSIER_POSTS.length}. Отметь, что посторонний узнаёт из этой публикации.
      </p>

      <div key={index} className="post-card enter" style={{ '--i': 2 } as CSSProperties}>
        <span className="post-meta">{post.meta}</span>
        <p className="post-text">{post.text}</p>

        <div className="options">
          {post.options.map((option, i) => {
            const state = !checked
              ? (picked.has(i) ? 'on' : '')
              : option.correct ? 'right' : picked.has(i) ? 'wrong' : '';
            const mark = !checked ? (picked.has(i) ? '◉' : '○') : option.correct ? '✓' : picked.has(i) ? '✕' : '·';
            return (
              <button key={option.text} className={`option ${state}`} onClick={() => toggle(i)} disabled={checked}>
                <span className="mark" aria-hidden>{mark}</span>
                <span>
                  {option.text}
                  {checked && <span className="option-note">{option.note}</span>}
                </span>
              </button>
            );
          })}
        </div>

        {checked ? (
          <button className="btn btn-green" onClick={next} autoFocus>Дальше</button>
        ) : (
          <button className="btn btn-blue" onClick={check} disabled={picked.size === 0}>Проверить</button>
        )}
      </div>

      {facts.length > 0 && (
        <div className="facts-block enter">
          <span className="facts-label">Что уже в досье:</span>
          <div className="facts">
            {facts.map((fact) => <span key={fact} className="fact">{fact}</span>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dossier;
