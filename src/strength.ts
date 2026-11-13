import { ZxcvbnFactory, type TranslationKeys } from '@zxcvbn-ts/core';
import { dictionary, adjacencyGraphs } from '@zxcvbn-ts/language-common';

const plural = new Intl.PluralRules('ru');
// Accusative forms: "взломают за 1 секунду / 3 секунды / 5 секунд".
const forms = (one: string, few: string, many: string) => (n: number) =>
  `${n} ${{ one, few, many }[plural.select(n) as 'one' | 'few' | 'many'] ?? many}`;

const translations: TranslationKeys = {
  warnings: {
    straightRow: 'Ряды клавиш подряд (как qwerty) хакеры проверяют первыми.',
    keyPattern: 'Короткие узоры на клавиатуре легко угадать.',
    simpleRepeat: 'Повторы вроде «aaa» легко угадать.',
    extendedRepeat: 'Повторы вроде «abcabcabc» легко угадать.',
    sequences: 'Последовательности вроде «abc» или «123» легко угадать.',
    recentYears: 'Недавние годы легко угадать.',
    dates: 'Даты легко угадать.',
    topTen: 'Это один из 10 самых популярных паролей в мире!',
    topHundred: 'Это один из 100 самых популярных паролей в мире!',
    common: 'Это очень популярный пароль.',
    similarToCommon: 'Очень похоже на популярный пароль.',
    wordByItself: 'Одно слово легко угадать.',
    namesByThemselves: 'Имена и фамилии легко угадать.',
    commonNames: 'Популярные имена и фамилии легко угадать.',
    userInputs: 'Не используй в пароле название сайта и личные данные.',
    pwned: 'Этот пароль уже утекал в интернет.',
  },
  suggestions: {
    l33t: 'Замены вроде «@» вместо «a» хакеры тоже знают.',
    reverseWords: 'Слово задом наперёд не спасёт.',
    allUppercase: 'Сделай заглавными только некоторые буквы, а не все.',
    capitalization: 'Добавь заглавные буквы не только в начале.',
    dates: 'Не используй важные для тебя даты.',
    recentYears: 'Не используй недавние годы.',
    associatedYears: 'Не используй годы, связанные с тобой.',
    sequences: 'Избегай последовательностей символов.',
    repeated: 'Избегай повторов слов и символов.',
    longerKeyboardPattern: 'Используй более длинный узор и меняй направление.',
    anotherWord: 'Добавь ещё пару слов, которые сложно угадать.',
    useWords: 'Лучше всего — несколько случайных слов подряд.',
    noNeed: 'Цифры и спецсимволы не обязательны — главное длина.',
    pwned: 'Если он где-то используется — срочно поменяй!',
  },
  timeEstimation: {
    ltSecond: 'мгновенно',
    second: '1 секунду',
    seconds: forms('секунду', 'секунды', 'секунд'),
    minute: '1 минуту',
    minutes: forms('минуту', 'минуты', 'минут'),
    hour: '1 час',
    hours: forms('час', 'часа', 'часов'),
    day: '1 день',
    days: forms('день', 'дня', 'дней'),
    month: '1 месяц',
    months: forms('месяц', 'месяца', 'месяцев'),
    year: '1 год',
    years: forms('год', 'года', 'лет'),
    centuries: 'больше века',
  },
};

// language-common has no Russian words, so add the classics: Cyrillic keyboard rows,
// Russian words typed on the English layout (gfhjkm = "пароль") and common Russian words,
// otherwise "единорог2010" typed into the checker would score as uncrackable.
// ponytail: tiny hand list, swap in a real Russian frequency dictionary if the checker needs to be accurate.
const russian = [
  'пароль', 'gfhjkm', 'привет', 'ghbdtn', 'йцукен', 'фывапролджэ', 'йцукенгшщзхъ', 'любовь', 'солнышко',
  'котик', 'зайка', 'наташа', 'максим', 'машенька', 'ozon', 'озон', 'гекком', 'gekkom',
  'rjnbr', 'cjkyxt', 'vjcrdf', 'kzueirf', 'ntktajy', 'rjirf', 'pfqrf', 'ljv',
  'собака', 'солнце', 'москва', 'малыш', 'пицца', 'лето', 'зима', 'весна', 'кошка', 'мишка', 'ромашка', 'шоколад',
  'футбол', 'дракон', 'ракета', 'звезда', 'радуга', 'маша', 'саша', 'дима', 'лимон', 'апельсин', 'пингвин',
  'черепаха', 'единорог', 'космос', 'облако', 'карандаш', 'велосипед', 'библиотека', 'холодильник', 'кактус',
  'фонарик', 'бегемот', 'жираф', 'матрёшка', 'самовар', 'вертолёт', 'подсолнух', 'кот', 'собакарэкс',
];

// Kid favorites missing from language-common. Real cracking wordlists have them,
// and the Hack game builds passwords from them, so they must score as weak.
const kids = [
  'roblox', 'fortnite', 'terraria', 'tetris', 'minecraft', 'brawlstars', 'pokemon', 'sonic', 'mario', 'among', 'amongus',
  'sushi', 'kiwi', 'karate', 'pancake', 'donut', 'burger', 'pasta', 'simba', 'milo', 'oscar', 'bobby', 'luna', 'rex',
];

const zxcvbn = new ZxcvbnFactory({
  dictionary: { ...dictionary, russian, kids },
  graphs: adjacencyGraphs,
  translations,
});

// "взломают мгновенно" / "взломают за 3 часа"
export const crackIn = (crackTime: string) => (crackTime === 'мгновенно' ? crackTime : `за ${crackTime}`);

export const checkPassword = (password: string) => {
  const r = zxcvbn.check(password);
  return {
    score: r.score, // 0..4
    // Stolen database of properly hashed passwords, 10k guesses per second.
    crackTime: r.crackTimes.offlineSlowHashingXPerSecond.display,
    warning: r.feedback.warning,
    suggestions: r.feedback.suggestions,
  };
};
