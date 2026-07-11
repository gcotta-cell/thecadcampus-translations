(function () {
  const BASE_URL = "https://raw.githubusercontent.com/gcotta-cell/thecadcampus-translations/main/languages";
  const DEFAULT_LANG = "en";
  const STORAGE_KEY = "tcc_language";

  function getValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
  }

  async function loadFile(lang, file) {
    const url = `${BASE_URL}/${lang}/${file}.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load: ${url}`);
    return response.json();
  }

  function setText(selector, value, occurrence = 0) {
    if (!value) return;
    const elements = document.querySelectorAll(selector);
    if (!elements.length || !elements[occurrence]) return;
    elements[occurrence].textContent = value;
  }

  function translateNavigation(nav) {
    setText('.header__school-name a', nav.site_name || "The CAD Campus");
    setText('.header__nav a[href="/"]', nav.home);
    setText('.header__nav a[href="/pages/programs"]', nav.programs);
    setText('.header__nav a[href="/pages/courses"]', nav.courses);
    setText('.header__nav a[href="/pages/why-cad-campus"]', nav.why_cad_campus);
    setText('.header__nav a[href="/enrollments"]', nav.dashboard);

    const languageButton = document.querySelector("#cad-language-button");
    if (languageButton && nav.language) {
      languageButton.textContent = `${nav.language} ▼`;
    }
  }

  function translateHero(home) {
    setText('[data-preview-item="banner"] .section__heading, .banner .section__heading', home.hero?.heading);
    setText('[data-preview-item="banner"] .section__subheading, .banner .section__subheading', home.hero?.subheading);
  }

  function translateIconText(home) {
    const items = [
      ["experience", "experience_title", "experience_text"],
      ["focused", "focused_title", "focused_text"],
      ["trusted", "trusted_title", "trusted_text"],
      ["career", "career_title", "career_text"],
      ["applications", "applications_title", "applications_text"]
    ];

    items.forEach((item, index) => {
      const n = index + 1;
      setText(`[data-preview-item="text-icon"] .text-icon__list-item:nth-child(${n}) h3`, home.benefits?.[item[1]]);
      setText(`[data-preview-item="text-icon"] .text-icon__list-item:nth-child(${n}) p`, home.benefits?.[item[2]]);
    });
  }

  function translatePrograms(home) {
    setText('[data-preview-item="course-cards"] .section__heading', home.programs?.title);
    setText('[data-preview-item="course-cards"] .section__subheading', home.programs?.subtitle);
  }
  function translateCards(sectionSelector, translations) {
  if (!Array.isArray(translations)) return;

  const cards = document.querySelectorAll(`${sectionSelector} .card`);

  cards.forEach((card, index) => {
    const translation = translations[index];
    if (!translation) return;

    const title = card.querySelector(".card__name");
    const type = card.querySelector(".card__product-info");
    const description = card.querySelector(".card__description");

    if (title && translation.title) {
      title.textContent = translation.title;
    }

    if (type && translation.type) {
      const icon = type.querySelector("i");
      type.textContent = translation.type;

      if (icon) {
        type.insertBefore(icon, type.firstChild);
      }
    }

    if (description && translation.description) {
      description.textContent = translation.description;
    }
  });
}

function translateProgramCards(home) {
  translateCards(
    '[data-preview-item="products"]',
    home.program_cards
  );
}

function translateCourseCards(home) {
  translateCards(
    '[data-preview-item="course-cards"]',
    home.course_cards
  );
}

function translateClasses(home) {
  setText(
    '[data-preview-item="products"] .section__heading, .products .section__heading',
    home.classes && home.classes.title
  );

  setText(
    '[data-preview-item="products"] .section__subheading, .products .section__subheading',
    home.classes && home.classes.subtitle
  );

  setText(
    '[data-preview-item="products"] .button, .products .button',
    home.classes && home.classes.button
  );
}

function translateFounder(home) {
  const founder = home.founder || {};

    setText('.rich-text__wrapper .section__heading', founder.title);

    const richText = document.querySelector('.rich-text__wrapper .fr-view');
    if (!richText) return;

    const paragraphs = richText.querySelectorAll("p");

    const values = [
      founder.welcome,
      founder.paragraph_1,
      founder.paragraph_2,
      founder.paragraph_3,
      founder.paragraph_4,
      founder.paragraph_5,
      `${founder.signature || ""}<br>${founder.title_signature || ""}`
    ];

    paragraphs.forEach((p, index) => {
      if (!values[index]) return;

      if (index === 0) {
        const image = p.querySelector("img");
        p.textContent = values[index];

        if (image) {
          p.appendChild(image);
        }
      } else if (index === 6) {
        p.innerHTML = values[index];
      } else {
        p.textContent = values[index];
      }
    });
  }

  function translateSocial(home) {
    setText('[data-preview-item="showcase"] .section__heading', home.social?.title);
    setText('[data-preview-item="showcase"] .section__subheading', home.social?.subtitle);
  }

  function connectLanguageMenu() {
    document.querySelectorAll(".cad-language-option[data-lang]").forEach(button => {
      button.addEventListener("click", function () {
        const lang = this.getAttribute("data-lang");
        window.TCCLocalization.setLanguage(lang);

        const menu = document.querySelector("#cad-language-item");
        if (menu) menu.classList.remove("cad-open");
      });
    });
  }

  async function setLanguage(lang) {
    try {
      console.log(`The CAD Campus selected language: ${lang}`);

      const [home, navigation] = await Promise.all([
        loadFile(lang, "home"),
        loadFile(lang, "navigation")
      ]);

      translateNavigation(navigation);
      translateHero(home);
      translateIconText(home);
      translatePrograms(home);
      translateProgramCards(home);
      translateClasses(home);
      translateCourseCards(home);
      translateFounder(home);
      translateSocial(home);
      

      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;

      console.log(`The CAD Campus language active: ${lang}`);
    } catch (error) {
      console.error("The CAD Campus localization error:", error);
    }
  }

  window.TCCLocalization = {
    setLanguage
  };

  document.addEventListener("DOMContentLoaded", function () {
    connectLanguageMenu();

    const savedLanguage = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    setLanguage(savedLanguage);
  });
})();
