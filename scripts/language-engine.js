(function () {
  const BASE_URL = "https://raw.githubusercontent.com/gcotta-cell/thecadcampus-translations/main/languages";
  const DEFAULT_LANG = "en";

  const replacements = {
    home: {
      "Master Industry-Proven CAD & Engineering Skills": "hero.heading",
      "Learn practical NX, CATIA, surfacing, and engineering workflows through real-world training built from aerospace, automotive, and product development experience.": "hero.subheading",
      "Real Engineering Experience": "benefits.experience_title",
      "Industry-Focused Training": "benefits.focused_title",
      "Trusted by Professionals": "benefits.trusted_title",
      "Build Skills, Advance Your Career": "benefits.career_title",
      "Real-World Applications": "benefits.applications_title",
      "End-to-End Training Programs": "programs.title",
      "Available Classes": "classes.title",
      "View All Available Classes": "classes.button",
      "Why The CAD Campus Exists": "founder.title",
      "Trusted By Engineers From": "social.title"
    },
    navigation: {
      "Home": "home",
      "Programs": "programs",
      "Courses": "courses",
      "Why CAD Campus": "why_cad_campus",
      "Sign In": "sign_in",
      "My Dashboard": "dashboard",
      "Language": "language",
      "English": "english",
      "Español": "spanish"
    }
  };

  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
  }

  async function loadJson(lang, file) {
    const url = `${BASE_URL}/${lang}/${file}.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    return response.json();
  }

  function replaceTextInNode(node, dictionary, map) {
    const original = node.nodeValue.trim();
    if (!original || !map[original]) return;

    const translated = getNestedValue(dictionary, map[original]);
    if (translated) {
      node.nodeValue = node.nodeValue.replace(original, translated);
    }
  }

  function walkAndTranslate(dictionary, map) {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const text = node.nodeValue.trim();
          return text && map[text]
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => replaceTextInNode(node, dictionary, map));
  }

  async function setLanguage(lang) {
    try {
      const [home, navigation] = await Promise.all([
        loadJson(lang, "home"),
        loadJson(lang, "navigation")
      ]);

      walkAndTranslate(home, replacements.home);
      walkAndTranslate(navigation, replacements.navigation);

      localStorage.setItem("tcc_language", lang);
      document.documentElement.lang = lang;

      console.log(`The CAD Campus language loaded: ${lang}`);
    } catch (error) {
      console.error("The CAD Campus localization error:", error);
    }
  }

  window.TCCLocalization = {
    setLanguage
  };

  document.addEventListener("DOMContentLoaded", function () {
    const savedLanguage = localStorage.getItem("tcc_language") || DEFAULT_LANG;
    setLanguage(savedLanguage);
  });
})();
