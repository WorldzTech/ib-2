import { useState, type CSSProperties, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { checkPassword, crackIn } from '../strength';
import { PASSWORD_ANSWER, PASSWORD_FACTS, PASSWORD_HINTS } from '../data/password';

const ATTEMPTS = 4;
const ANSWERS = ['motya2016', 'мотя2016'];

const norm = (s: string) => s.toLowerCase().replace(/[^a-zа-я0-9]/g, '');

const Password: React.FC = () => {
  const [guess, setGuess] = useState('');
  const [wrong, setWrong] = useState(0);
  const [status, setStatus] = useState<'playing' | 'cracked' | 'failed'>('playing');

  const restart = () => {
    setGuess('');
    setWrong(0);
    setStatus('playing');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!norm(guess)) return;
    if (ANSWERS.includes(norm(guess))) {
      setStatus('cracked');
    } else if (wrong + 1 >= ATTEMPTS) {
      setStatus('failed');
    } else {
      setWrong((w) => w + 1);
      setGuess('');
    }
  };

  const crack = crackIn(checkPassword(PASSWORD_ANSWER).crackTime);

  return (
    <div className="page">
      <Link to="/" className="back enter"><ArrowLeft /> Назад</Link>

      <h2 className="enter" style={{ fontSize: '2rem', '--i': 1 } as CSSProperties}>Угадай пароль 🔑</h2>
      <p className="muted enter" style={{ '--i': 1 } as CSSProperties}>
        Это карточка Геккома, собранная из его же постов. Угадай пароль, который стоял у него на аккаунте.
      </p>

      <div className="panel password-panel enter" style={{ '--i': 2 } as CSSProperties}>
        <div className="facts">
          {PASSWORD_FACTS.map((fact) => <span key={fact} className="fact">{fact}</span>)}
        </div>

        {status === 'playing' && (
          <>
            <form className="hack-form" onSubmit={submit}>
              <input
                className="field"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Твоя догадка..."
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                autoFocus
                aria-label="Пароль Геккома"
              />
              <button className="btn btn-blue" type="submit">Проверить</button>
              <small className="muted">
                Попыток осталось: {ATTEMPTS - wrong} · латинские буквы и цифры, без пробелов
              </small>
            </form>

            {wrong > 0 && (
              <ul className="tips">
                {PASSWORD_HINTS.slice(0, wrong).map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {status === 'cracked' && (
          <div className="result">
            <img src="/visuals/badges/УРА_green.svg" alt="" />
            <h3 className="ok">Пароль угадан! 🔓</h3>
            <p>
              Пароль: <code>{PASSWORD_ANSWER}</code>. <b>Мотя</b> — кличка улитки из поста, где он хвастался питомцем.
              <b> 2016</b> — год рождения из поста с тортом.
            </p>
            <p className="muted small">
              Оба кусочка лежали в открытых публикациях. Программа-взломщик подобрала бы такой пароль {crack}.
            </p>
            <div className="choices">
              <button className="btn btn-blue" onClick={restart}>Ещё раз</button>
              <Link to="/footprint" className="btn btn-green">Дальше →</Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="result">
            <img src="/visuals/badges/warning_badge.svg" alt="" />
            <h3 className="fail">Не получилось 🔒</h3>
            <p>
              Пароль был <code>{PASSWORD_ANSWER}</code>: кличка улитки <b>Мотя</b> плюс год рождения <b>2016</b>.
            </p>
            <p className="muted small">
              Хакеру не нужно взламывать то, что ты сам выложил. Программа подобрала бы такой пароль {crack}.
            </p>
            <div className="choices">
              <button className="btn btn-blue" onClick={restart}>Ещё раз</button>
              <Link to="/footprint" className="btn btn-green">Дальше →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Password;
