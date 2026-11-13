import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FOOTPRINT_ITEMS, type FootprintKind } from '../data/footprint';

const Footprint: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, FootprintKind>>({});
  const [checked, setChecked] = useState(false);

  const reset = () => {
    setAnswers({});
    setChecked(false);
  };

  const assigned = Object.keys(answers).length;
  const all = assigned === FOOTPRINT_ITEMS.length;
  const score = FOOTPRINT_ITEMS.filter((item, i) => answers[i] === item.kind).length;

  const assign = (i: number, kind: FootprintKind) => {
    if (checked) return;
    setAnswers((a) => ({ ...a, [i]: kind }));
  };

  return (
    <div className="page">
      <Link to="/" className="back enter"><ArrowLeft /> Назад</Link>

      <h2 className="enter" style={{ fontSize: '2rem', '--i': 1 } as CSSProperties}>Намеренный или случайный 👣</h2>
      <p className="muted enter" style={{ '--i': 1 } as CSSProperties}>
        Разложи всё, что остаётся в интернете, на две колонки. Отмечено {assigned} из {FOOTPRINT_ITEMS.length}.
      </p>

      <div className="sort-list">
        {FOOTPRINT_ITEMS.map((item, i) => {
          const ok = answers[i] === item.kind;
          const rowState = checked ? (ok ? 'right' : 'wrong') : '';
          return (
            <div key={item.text} className={`sort-row enter ${rowState}`} style={{ '--i': 2 } as CSSProperties}>
              <span className="label">{item.text}</span>
              <div className="seg">
                <button
                  data-k="intentional"
                  className={answers[i] === 'intentional' ? 'on' : ''}
                  disabled={checked}
                  onClick={() => assign(i, 'intentional')}
                >
                  Намеренный
                </button>
                <button
                  data-k="random"
                  className={answers[i] === 'random' ? 'on' : ''}
                  disabled={checked}
                  onClick={() => assign(i, 'random')}
                >
                  Случайный
                </button>
              </div>
              {checked && (
                <span className="sort-note">
                  {ok ? 'Верно. ' : 'Ошибка. '}
                  {item.note}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {checked ? (
        <div className="panel result">
          <img src={score === FOOTPRINT_ITEMS.length ? '/visuals/badges/УРА_green.svg' : '/visuals/badges/warning_badge.svg'} alt="" />
          <h3 className={score === FOOTPRINT_ITEMS.length ? 'ok' : 'fail'}>Верно {score} из {FOOTPRINT_ITEMS.length}</h3>
          <p className="muted">
            Самое полезное для злоумышленника обычно оказывается случайным: вывеска, нашивка, время публикации.
            Ты выкладывал одно, а выдал совсем другое.
          </p>
          <div className="choices">
            <button className="btn btn-blue" onClick={reset}>Ещё раз</button>
            <Link to="/mosaic" className="btn btn-green">Дальше →</Link>
          </div>
        </div>
      ) : (
        <button className="btn btn-blue" onClick={() => setChecked(true)} disabled={!all}>
          {all ? 'Проверить' : 'Отметь все карточки'}
        </button>
      )}
    </div>
  );
};

export default Footprint;
