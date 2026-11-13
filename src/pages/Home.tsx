import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
  <div className="page">
    <div className="panel hero enter">
      <img src="/visuals/gekkoms/hello_world.svg" alt="Гекком приветствует" />
      <div>
        <span className="eyebrow">Route Kids × ИБ Ozon</span>
        <h1>Продолжаем расследование 🕵️</h1>
        <p className="muted">
          Мы выяснили, откуда хакер узнал о Геккоме. Теперь потренируйся видеть свой след так, как его видит посторонний.
        </p>
        <p className="hero-note">
          Это тренажёры после второй встречи курса по информационной безопасности. Всё здесь — про себя и про выдуманных
          героев, не про других людей.
        </p>
      </div>
    </div>

    <div className="cards">
      <Link to="/dossier" className="card card-green enter" style={{ '--i': 2 } as CSSProperties}>
        <h2>Собери досье 🗂️</h2>
        <p>Прочитай посты Геккома и вытащи то, что увидит любой посторонний.</p>
        <img src="/visuals/gekkoms/explaining.svg" alt="" />
      </Link>

      <Link to="/password" className="card card-blue enter" style={{ '--i': 3 } as CSSProperties}>
        <h2>Угадай пароль 🔑</h2>
        <p>Хакер собрал пароль из карточки. Сможешь так же?</p>
        <img src="/visuals/gekkoms/devil.svg" alt="" />
      </Link>

      <Link to="/footprint" className="card card-dark enter" style={{ '--i': 4 } as CSSProperties}>
        <h2>Намеренный или случайный 👣</h2>
        <p>Разложи цифровой след на две колонки и проверь себя.</p>
        <img src="/visuals/gekkoms/gaming.svg" alt="" />
      </Link>

      <Link to="/mosaic" className="card card-cerulean enter" style={{ '--i': 5 } as CSSProperties}>
        <h2>Мозаика: кто это? 🧩</h2>
        <p>Четыре безобидных факта — и один конкретный ребёнок.</p>
        <img src="/visuals/gekkoms/confuised.svg" alt="" />
      </Link>
    </div>
  </div>
);

export default Home;
