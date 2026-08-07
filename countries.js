/* =====================================================================
   Shared country list for the "КРАЇНА" autocomplete field —
   used by index.html, kryla.html, k2.html, gstation.html
   ===================================================================== */
(function () {
  'use strict';

  var COUNTRIES_UK = [
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

  // same order as COUNTRIES_UK above — index N in one list is index N in the other
  var COUNTRIES_EN = [
    'Australia', 'Austria', 'Azerbaijan', 'Albania', 'Algeria', 'Angola', 'Andorra',
    'Antigua and Barbuda', 'Argentina', 'Afghanistan', 'Bahamas', 'Bangladesh',
    'Barbados', 'Bahrain', 'Belize', 'Belgium', 'Benin', 'Belarus', 'Bulgaria', 'Bolivia',
    'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Burkina Faso', 'Burundi',
    'Bhutan', 'Vanuatu', 'Vatican City', 'United Kingdom', 'Venezuela', 'Vietnam', 'Armenia',
    'Gabon', 'Haiti', 'Guyana', 'Gambia', 'Ghana', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Honduras', 'Grenada', 'Greece', 'Georgia', 'Denmark', 'Djibouti', 'Dominica',
    'Dominican Republic', 'Ecuador', 'Equatorial Guinea', 'Eritrea', 'Eswatini',
    'Estonia', 'Ethiopia', 'Egypt', 'Yemen', 'Zambia', 'Zimbabwe', 'Israel', 'India',
    'Indonesia', 'Iraq', 'Iran', 'Ireland', 'Iceland', 'Spain', 'Italy', 'Jordan',
    'Cabo Verde', 'Kazakhstan', 'Cambodia', 'Cameroon', 'Canada', 'Qatar', 'Kenya',
    'Kyrgyzstan', 'China', 'Cyprus', 'Kiribati', 'Colombia', 'Comoros',
    'Democratic Republic of the Congo', 'Republic of the Congo', 'Costa Rica', 'Côte d’Ivoire',
    'Cuba', 'Kuwait', 'Laos', 'Latvia', 'Lesotho', 'Lithuania', 'Liberia', 'Lebanon', 'Libya',
    'Liechtenstein', 'Luxembourg', 'Mauritius', 'Mauritania', 'Madagascar', 'Malawi',
    'Malaysia', 'Mali', 'Maldives', 'Malta', 'Morocco', 'Marshall Islands', 'Mexico',
    'Mozambique', 'Moldova', 'Monaco', 'Mongolia', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
    'Niger', 'Nigeria', 'Netherlands', 'Nicaragua', 'Germany', 'New Zealand', 'Norway',
    'United Arab Emirates', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
    'Papua New Guinea', 'Paraguay', 'Peru', 'South Korea', 'South Africa',
    'South Sudan', 'North Korea', 'North Macedonia', 'Poland', 'Portugal', 'Russia',
    'Rwanda', 'Romania', 'El Salvador', 'Samoa', 'San Marino', 'São Tomé and Príncipe',
    'Saudi Arabia', 'Seychelles', 'Senegal', 'Saint Vincent and the Grenadines', 'Saint Kitts and Nevis',
    'Saint Lucia', 'Serbia', 'Singapore', 'Syria', 'Slovakia', 'Slovenia', 'Solomon Islands',
    'Somalia', 'Sudan', 'Suriname', 'United States', 'Sierra Leone', 'Tajikistan', 'Thailand', 'Taiwan',
    'Tanzania', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
    'Tuvalu', 'Uganda', 'Hungary', 'Uzbekistan', 'Ukraine', 'Uruguay', 'Fiji', 'Philippines',
    'Finland', 'France', 'Croatia', 'Central African Republic', 'Chad', 'Czechia',
    'Chile', 'Montenegro', 'Switzerland', 'Sweden', 'Sri Lanka', 'Jamaica', 'Japan'
  ];

  window.SPEXTR_COUNTRIES = COUNTRIES_UK;
  window.SPEXTR_COUNTRIES_EN = COUNTRIES_EN;

  function currentLang() {
    return (window.SPEXTR_getLang ? window.SPEXTR_getLang() : 'uk');
  }

  function activeCountries() {
    return currentLang() === 'en' ? COUNTRIES_EN : COUNTRIES_UK;
  }

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
      var matches = activeCountries().filter(function (c) {
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
     [required] field must be non-empty; some fields additionally have
     to match a format. Messages are {uk, en} pairs so the visible error
     text always matches whichever language the toggle is on. */
  var COUNTRIES_UK_LOWER = COUNTRIES_UK.map(function (c) { return c.toLowerCase(); });
  var COUNTRIES_EN_LOWER = COUNTRIES_EN.map(function (c) { return c.toLowerCase(); });
  var errorIdSeq = 0;

  var REQUIRED_MSG = { uk: 'Заповніть це поле', en: 'Fill in this field' };

  var RULES = {
    name: {
      re: /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ'-]+(?:\s+[A-Za-zА-Яа-яЁёІіЇїЄєҐґ'-]+)+$/,
      msg: { uk: 'Вкажіть прізвище та ім’я', en: 'Enter your first and last name' }
    },
    email: {
      re: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
      msg: { uk: 'Некоректний email', en: 'Invalid email address' }
    },
    message: {
      validate: function (v) { return v.replace(/\s+/g, '').length >= 8; },
      msg: { uk: 'Опишіть задачу детальніше (мінімум 8 символів)', en: 'Please describe your task in more detail (minimum 8 characters)' }
    },
    country: {
      validate: function (v) {
        var q = v.toLowerCase();
        return COUNTRIES_UK_LOWER.indexOf(q) !== -1 || COUNTRIES_EN_LOWER.indexOf(q) !== -1;
      },
      msg: { uk: 'Оберіть країну зі списку', en: 'Choose a country from the list' }
    }
  };

  function fieldError(field) {
    var group = field.closest('.field-group, .pc-field-group') || field.parentElement;
    return group && group.querySelector('.field-error, .pc-field-error');
  }

  /* Validates one field and updates its error UI + aria attributes.
     Returns true if the field is valid. */
  window.SPEXTR_validateField = function (field) {
    var lang = currentLang();
    var value = field.value.trim();
    var rule = RULES[field.name];
    var errorEl = fieldError(field);
    var valid = true;
    var msg = '';

    if (!value) {
      valid = false;
      msg = REQUIRED_MSG[lang];
    } else if (rule) {
      if (rule.re && !rule.re.test(value)) { valid = false; msg = rule.msg[lang]; }
      else if (rule.validate && !rule.validate(value)) { valid = false; msg = rule.msg[lang]; }
    }

    field.classList.toggle('is-error', !valid);
    field.setAttribute('aria-invalid', valid ? 'false' : 'true');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.toggle('is-show', !valid);
      if (!errorEl.id) errorEl.id = 'spextr-error-' + (++errorIdSeq);
      field.setAttribute('aria-describedby', errorEl.id);
    }
    return valid;
  };

  /* Validates every required field, focuses + scrolls to the first
     invalid one so the visitor isn't left hunting for what's wrong. */
  window.SPEXTR_validateForm = function (form) {
    var ok = true;
    var firstInvalid = null;
    form.querySelectorAll('[required]').forEach(function (field) {
      var valid = window.SPEXTR_validateField(field);
      if (!valid) {
        ok = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
  };

  /* Re-runs validation on any field currently showing an error, so a
     language switch mid-form updates visible messages immediately
     instead of waiting for the next blur/input. */
  window.SPEXTR_relocalizeErrors = function () {
    document.querySelectorAll('.field.is-error, .pc-field.is-error').forEach(function (field) {
      window.SPEXTR_validateField(field);
    });
  };
})();
