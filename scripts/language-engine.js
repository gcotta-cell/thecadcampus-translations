(function () {
  const BASE_URL = "https://raw.githubusercontent.com/gcotta-cell/thecadcampus-translations/main/languages";
  const DEFAULT_LANG = "en";
  const STORAGE_KEY = "tcc_language";

  const pageMap = {
    home: [
      { selector: '[data-preview-item="banner"] .section__heading, .banner .section__heading', key: "hero.heading" },
      { selector: '[data-preview-item="banner"] .section__subheading, .banner .section__subheading', key: "hero.subheading" },

      { selector: '[data-preview-item="text-icon"] .text-icon__list-item:nth-child(1) h3', key: "benefits.experience_title" },
      { selector: '[data-preview-item="text-icon"] .text-icon__list-item:nth-child(1) p', key: "benefits.experience_text" },
      { selector: '[data-preview-item="text-icon"] .text-icon__list-item:nth-child(2) h3', key: "benefits.focused_title" },
      { selector: '[data-preview-item="text-icon"] .text-icon__list-item:nth-child(2) p', key: "benefits.focused_text" },
      { selector: '[data-preview-item="text-icon"] .text-icon__list-item:nth-child(3) h3', key: "benefits.trusted_title" },
      { selector: '[data-preview-item="text-icon"] .text-icon__list-item:nth-child(3) p', key: "benefits.trusted_text" },
      { selector: '[data-preview-item="text-icon"] .text-icon__list-item:nth-child(4) h3', key: "benefits.career_title" },
      { selector: '[data-preview-item="text-icon"] .text-icon__list-item:nth-child(4) p', key: "benefits.career_text" },
      { selector: '[data-preview-item="text-icon"] .text-icon__list-item:nth-child(5) h3', key: "benefits.applications_title" },
      { selector: '[data-preview-item="text-icon"] .text-icon__list-item:nth-child(5) p', key: "benefits.applications_text" },

      { selector: '[data-preview-item="course-cards"] .section__heading', key: "programs.title", occurrence: 0 },
      { selector: '[data-preview-item="course-cards"] .section__subheading', key: "programs.subtitle", occurrence: 0 },

      { selector: '[data-preview-item="products"] .section__heading, .products .section__heading', key: "classes.title" },
      { selector: '[data-preview-item="products"] .section__subheading, .products .section__subheading', key: "classes.subtitle" },

      { selector: '[data-preview-item="text"] .section__heading, [data-preview-item="text-image"] .section__heading', key: "founder.title" },
      { selector: '[data-preview-item="text"] p:nth-of-type(1), [data-preview-item="text-image"] p:nth-of-type(1)', key: "founder.welcome" },
      { selector: '[data-preview-item="text"] p:nth-of-type(2), [data-preview-item="text-image"] p:nth-of-type(2)', key: "founder.paragraph_1" },
      { selector: '[data-preview-item="text"] p:nth-of-type(3), [data-preview-item="text-image"] p:nth-of-type(3)', key: "founder.paragraph_2" },
      { selector: '[data-preview-item="text"] p:nth-of-type(4), [data-preview-item="text-image"] p:nth-of-type(4)', key: "founder.paragraph_3" },
      { selector: '[data-preview-item="text"] p:nth-of-type(5), [data-preview-item="text-image"] p:nth-of-type(5)', key: "founder.paragraph_4" },
      { selector: '[data-preview-item="text"] p:nth-of-type(6), [data-preview-item="text-image"] p:nth-of-type(6)', key: "founder.paragraph_5" },

      { selector: '[data-preview-item="showcase"] .section__heading', key: "social.title" }
    ],

    navigation: [
      { selector: '.header__school-name a', key: "site_name" },
      { selector: '.header__nav a[href="/"]', key: "home" },
      { selector: '.header__nav a[href="/pages/programs"]', key: "programs" },
      { selector: '.header__nav a[href="/pages/courses"]', key: "courses" },
      { selector: '.header__nav a[href="/pages/why-cad-campus"]', key: "why_cad_campus" },
      { selector: '.header__nav a[href="/enrollments"]', key: "dashboard" },
      { selector: '#cad-language-button', key: "language" }
    ]
  };

  function getValue(obj, path) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  async function loadFile(lang, file) {
    const url = `${BASE_URL}/${lang}/${file}.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not load ${url}`);
    return response.json();
  }

  function applyMap(dictionary, mappings) {
    mappings.forEach(item => {
      const elements = document.querySelectorAll(item.selector);
      if (!elements.length) return;

      const element = elements[item.occurrence || 0];
      if (!element) return;

      const value = getValue(dictionary, item.key);
      if (!value) return;

      element.textContent = value;
    });
  }

  async function setLanguage(lang) {
    try {
      const [home, navigation] = await Promise.all([
        loadFile(lang, "home"),
        loadFile(lang, "navigation")
      ]);

      applyMap(home, pageMap.home);
      applyMap(navigation, pageMap.navigation);

      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;

      const button = document.querySelector("#cad-language-button");
      if (button) {
        button.textContent = `${navigation.language || "Language"} ▼`;
      }

      console.log(`The CAD Campus language active: ${lang}`);
    } catch (error) {
      console.error("The CAD Campus localization error:", error);
    }
  }

  function connectLanguageMenu() {
    document.querySelectorAll(".cad-language-option[data-lang]").forEach(button => {
      button.addEventListener("click", function () {
        const lang = this.getAttribute("data-lang");
        setLanguage(lang);

        const menu = document.querySelector("#cad-language-item");
        if (menu) menu.classList.remove("cad-open");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    connectLanguageMenu();

    const savedLanguage = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    setLanguage(savedLanguage);
  });

  window.TCCLocalization = {
    setLanguage
  };
})();
