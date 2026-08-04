/* =====================================================================
   Shared country list for the "КРАЇНА" autocomplete field —
   used by index.html, kryla.html, k2.html, gstation.html
   ===================================================================== */
(function () {
  'use strict';

  var COUNTRIES = [
    'Австралія', 'Австрія', 'Азербайджан', 'Албанія', 'Алжир', 'Ангола', 'Андорра',
    'Антигуа і Барбуда', 'Аргентина', 'Афганістан', 'Багамські Острови', 'Бангладеш',
    'Барбадос', 'Бахрейн', 'Беліз', 'Бельгія', 'Бенін', 'Білорусь', 'Болгарія', 'Болівія',
    'Боснія і Герцеговина', 'Ботсвана', 'Бразилія', 'Бруней', 'Буркіна-Фасо', 'Бурунді',
    'Бутан', 'Вануату', 'Ватикан', 'Велика Британія', 'Венесуела', 'В’єтнам', 'Вірменія',
    'Габон', 'Гаїті', 'Гайана', 'Гамбія', 'Гана', 'Гватемала', 'Гвінея', 'Гвінея-Бісау',
    'Гондурас', 'Гренада', 'Греція', 'Грузія', 'Данія', 'Джибуті', 'Домініка',
    'Домініканська Республіка', 'Еквадор', 'Екваторіальна Гвінея', 'Еритрея', 'Есватіні',
    'Естонія', 'Ефіопія', 'Єгипет', 'Ємен', 'Замбія', 'Зімбабве', 'Ізраїль', 'Індія',
    'Індонезія', 'Ірак', 'Іран', 'Ірландія', 'Ісландія', 'Іспанія', 'Італія', 'Йорданія',
    'Кабо-Верде', 'Казахстан', 'Камбоджа', 'Камерун', 'Канада', 'Катар', 'Кенія',
    'Киргизстан', 'Китай', 'Кіпр', 'Кірибаті', 'Колумбія', 'Коморські Острови',
    'Демократична Республіка Конго', 'Республіка Конго', 'Коста-Рика', 'Кот-д’Івуар',
    'Куба', 'Кувейт', 'Лаос', 'Латвія', 'Лесото', 'Литва', 'Ліберія', 'Ліван', 'Лівія',
    'Ліхтенштейн', 'Люксембург', 'Маврикій', 'Мавританія', 'Мадагаскар', 'Малаві',
    'Малайзія', 'Малі', 'Мальдіви', 'Мальта', 'Марокко', 'Маршаллові Острови', 'Мексика',
    'Мозамбік', 'Молдова', 'Монако', 'Монголія', 'М’янма', 'Намібія', 'Науру', 'Непал',
    'Нігер', 'Нігерія', 'Нідерланди', 'Нікарагуа', 'Німеччина', 'Нова Зеландія', 'Норвегія',
    'Об’єднані Арабські Емірати', 'Оман', 'Пакистан', 'Палау', 'Палестина', 'Панама',
    'Папуа Нова Гвінея', 'Парагвай', 'Перу', 'Південна Корея', 'Південно-Африканська Республіка',
    'Південний Судан', 'Північна Корея', 'Північна Македонія', 'Польща', 'Португалія', 'Росія',
    'Руанда', 'Румунія', 'Сальвадор', 'Самоа', 'Сан-Марино', 'Сан-Томе і Принсіпі',
    'Саудівська Аравія', 'Сейшели', 'Сенегал', 'Сент-Вінсент і Гренадини', 'Сент-Кіттс і Невіс',
    'Сент-Люсія', 'Сербія', 'Сингапур', 'Сирія', 'Словаччина', 'Словенія', 'Соломонові Острови',
    'Сомалі', 'Судан', 'Суринам', 'США', 'Сьєрра-Леоне', 'Таджикистан', 'Таїланд', 'Тайвань',
    'Танзанія', 'Того', 'Тонга', 'Тринідад і Тобаго', 'Туніс', 'Туреччина', 'Туркменістан',
    'Тувалу', 'Уганда', 'Угорщина', 'Узбекистан', 'Україна', 'Уругвай', 'Фіджі', 'Філіппіни',
    'Фінляндія', 'Франція', 'Хорватія', 'Центральноафриканська Республіка', 'Чад', 'Чехія',
    'Чилі', 'Чорногорія', 'Швейцарія', 'Швеція', 'Шрі-Ланка', 'Ямайка', 'Японія'
  ];

  window.SPEXTR_COUNTRIES = COUNTRIES;

  /* ---- custom country autocomplete ------------------------------------
     Native <datalist> dropdowns render inconsistently across browsers
     (Safari in particular often shows nothing at all), so the suggestion
     list is a plain absolutely-positioned <ul> built and filtered here. */
  function setupCountryAutocomplete(root) {
    var input = root.querySelector('input');
    var list = root.querySelector('.country-auto__list');
    if (!input || !list) return;

    var activeIndex = -1;
    var current = [];
    var suppressSearch = false;

    function close() {
      root.classList.remove('is-open');
      input.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
    }

    function highlight() {
      Array.prototype.forEach.call(list.children, function (li, i) {
        li.classList.toggle('is-active', i === activeIndex);
      });
    }

    function choose(name) {
      input.value = name;
      close();
      // this dispatch exists so the form's own "clear error on input"
      // listener still fires; our own search() below would otherwise
      // immediately reopen the list since the input is now non-empty
      // and matches itself.
      suppressSearch = true;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function open(matches) {
      current = matches;
      activeIndex = -1;
      list.innerHTML = '';
      matches.forEach(function (name) {
        var li = document.createElement('li');
        li.className = 'country-auto__option';
        li.setAttribute('role', 'option');
        li.textContent = name;
        li.addEventListener('mousedown', function (e) {
          e.preventDefault();
          choose(name);
        });
        list.appendChild(li);
      });
      var show = matches.length > 0;
      root.classList.toggle('is-open', show);
      input.setAttribute('aria-expanded', show ? 'true' : 'false');
    }

    function search() {
      if (suppressSearch) { suppressSearch = false; return; }
      var q = input.value.trim().toLowerCase();
      if (!q) { close(); return; }
      var matches = COUNTRIES.filter(function (c) {
        return c.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 8);
      open(matches);
    }

    input.addEventListener('input', search);
    input.addEventListener('focus', function () { if (input.value.trim()) search(); });
    input.addEventListener('blur', function () { setTimeout(close, 120); });
    input.addEventListener('keydown', function (e) {
      if (!root.classList.contains('is-open')) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, current.length - 1);
        highlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        highlight();
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        choose(current[activeIndex]);
      } else if (e.key === 'Escape') {
        close();
      }
    });
  }

  document.querySelectorAll('.country-auto').forEach(setupCountryAutocomplete);

  /* ---- shared "заявка" form validation --------------------------------
     Used by both asymmetrica.js (index.html) and contact-form.js
     (kryla/k2/gstation) so the rules only live in one place. Every
     [required] field must be non-empty ("Заповніть це поле"); some
     fields additionally have to match a format. */
  var RULES = {
    name: { re: /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ' -]{2,}$/, msg: 'Некоректне ім’я' },
    email: { re: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Некоректний email' },
    message: { re: /\S{3,}/, msg: 'Занадто короткий опис' },
    country: {
      validate: function (v) { return COUNTRIES.indexOf(v) !== -1; },
      msg: 'Оберіть країну зі списку'
    }
  };

  window.SPEXTR_validateForm = function (form) {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      var value = field.value.trim();
      var rule = RULES[field.name];
      var group = field.closest('.field-group, .pc-field-group') || field.parentElement;
      var errorEl = group && group.querySelector('.field-error, .pc-field-error');
      var valid = true;
      var msg = '';

      if (!value) {
        valid = false;
        msg = 'Заповніть це поле';
      } else if (rule) {
        if (rule.re && !rule.re.test(value)) { valid = false; msg = rule.msg; }
        else if (rule.validate && !rule.validate(value)) { valid = false; msg = rule.msg; }
      }

      field.classList.toggle('is-error', !valid);
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.toggle('is-show', !valid);
      }
      if (!valid) ok = false;
    });
    return ok;
  };
})();
