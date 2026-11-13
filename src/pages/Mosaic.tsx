import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MOSAIC_FINALE, MOSAIC_ROUNDS } from '../data/mosaic';

const Mosaic: React.FC = () => {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const reset = () => {
    setRound(0);
    setPicked(null);
  };

  if (round >= MOSAIC_ROUNDS.length) {
    return (
      <div className="page">
        <Link to="/" className="back enter"><ArrowLeft /> Назад</Link>
        <div className="panel mosaic-final enter" style={{ '--i': 1 } as CSSProperties}>
          <img className="mosaic-img" src="/visuals/gekkoms/gekkom_attention.svg" alt="Гекком задумался" />
          <h2 style={{ fontSize: '2rem', color: 'var(--color-ozon-blue)' }}>Опасна сборка 🧩</h2>
          {MOSAIC_FINALE.map((line) => <p key={line} className="muted">{line}</p>)}
          <div className="choices">
            <button className="btn btn-blue" onClick={reset}>Ещё раз</button>
            <Link to="/" className="btn btn-green">На главную</Link>
          </div>
        </div>
      </div>
    );
  }

  const data = MOSAIC_ROUNDS[round];
  const isRight = picked === data.answer;

  const pick = (i: number) => {
    if (picked === null) setPicked(i);
  };

  const next = () => {
    setPicked(null);
    setRound((r) => r + 1);
  };

  return (
    <div className="page">
      <Link to="/" className="back enter"><ArrowLeft /> Назад</Link>

      <h2 className="enter" style={{ fontSize: '2rem', '--i': 1 } as CSSProperties}>Мозаика: кто это? 🧩</h2>
      <p className="muted enter" style={{ '--i': 1 } as CSSProperties}>
        Раунд {round + 1} из {MOSAIC_ROUNDS.length}. Вот четыре факта из открытых постов. Кому они принадлежат?
      </p>

      <div className="facts enter" style={{ '--i': 2 } as CSSProperties}>
        {data.facts.map((fact) => <span key={fact} className="fact">{fact}</span>)}
      </div>

      <div className="profiles">
        {data.profiles.map((profile, i) => {
          const state = picked === null ? '' : i === data.answer ? 'right' : picked === i ? 'wrong' : '';
          return (
            <button
              key={profile.name}
              className={`profile enter ${state}`}
              style={{ '--i': 3 } as CSSProperties}
              disabled={picked !== null}
              onClick={() => pick(i)}
            >
              <h3>{profile.name}</h3>
              <span className="nick">{profile.nick}</span>
              <ul>
                {profile.lines.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="panel result">
          <img src={isRight ? '/visuals/badges/УРА_green.svg' : '/visuals/badges/warning_badge.svg'} alt="" />
          <h3 className={isRight ? 'ok' : 'fail'}>{isRight ? 'Верно!' : 'Не совсем...'}</h3>
          <p>{data.why}</p>
          <button className="btn btn-blue" onClick={next} autoFocus>Дальше</button>
        </div>
      )}
    </div>
  );
};

export default Mosaic;
