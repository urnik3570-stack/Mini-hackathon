(() => {
  "use strict";

  /* -----------------------------------------------------------
     CONFIG — paste your n8n "Support Desk" webhook URL here.
     Leave blank to run in local demo mode (no network calls).
  ----------------------------------------------------------- */
  const WEBHOOK_URL = "";

  /* -----------------------------------------------------------
     i18n strings
  ----------------------------------------------------------- */
  const STRINGS = {
    en: {
      brand_title: "Digital Saathi",
      brand_subtitle: "Kurukshetra Smart India Mini-Hackathon — Help Desk",
      now_serving: "NOW SERVING",
      today: "TODAY",
      ask_heading: "Ask your question",
      ask_sub: "Type freely or pick a common question below — we'll route it to the right desk.",
      label_name: "Your name",
      label_contact: "Email or mobile",
      ph_name: "e.g. Aarav Sharma",
      ph_contact: "you@example.com",
      ph_query: "Type your question here…",
      send: "Send",
      faq_heading: "Or pick a common question",
      log_heading: "Your queries this session",
      footer_updated: "Last updated",
      mic_listening: "Listening… speak now",
      mic_unsupported: "Voice input isn't supported in this browser",
      mic_error: "Couldn't hear that — try again",
      toast_sent: "Question sent — token",
      toast_answered: "Answered instantly — token",
      toast_need_query: "Please type or select a question first",
      status_answered: "Answered instantly",
      status_pending: "Sent to help desk",
      status_critical: "Marked urgent",
    },
    hi: {
      brand_title: "डिजिटल साथी",
      brand_subtitle: "कुरुक्षेत्र स्मार्ट इंडिया मिनी-हैकाथॉन — हेल्प डेस्क",
      now_serving: "अभी सेवा में",
      today: "आज",
      ask_heading: "अपना सवाल पूछें",
      ask_sub: "खुद टाइप करें या नीचे दिए गए सामान्य सवालों में से चुनें — हम इसे सही डेस्क तक भेज देंगे।",
      label_name: "आपका नाम",
      label_contact: "ईमेल या मोबाइल",
      ph_name: "जैसे आरव शर्मा",
      ph_contact: "you@example.com",
      ph_query: "यहाँ अपना सवाल लिखें…",
      send: "भेजें",
      faq_heading: "या एक सामान्य सवाल चुनें",
      log_heading: "इस सत्र के आपके सवाल",
      footer_updated: "आख़िरी बार अपडेट",
      mic_listening: "सुन रहे हैं… अभी बोलिए",
      mic_unsupported: "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है",
      mic_error: "सुनाई नहीं दिया — दोबारा कोशिश करें",
      toast_sent: "सवाल भेज दिया गया — टोकन",
      toast_answered: "तुरंत जवाब मिला — टोकन",
      toast_need_query: "कृपया पहले सवाल लिखें या चुनें",
      status_answered: "तुरंत जवाब मिला",
      status_pending: "हेल्प डेस्क को भेजा गया",
      status_critical: "अत्यावश्यक चिह्नित",
    },
  };

  /* -----------------------------------------------------------
     FAQ bank — bilingual, with canned answers for instant demo
  ----------------------------------------------------------- */
  const FAQS = [
    { id: "wifi", en: "What is the WiFi password?", hi: "वाई-फाई का पासवर्ड क्या है?",
      answer_en: 'Network "SIH-Kurukshetra", password: hackathon2026',
      answer_hi: 'नेटवर्क "SIH-Kurukshetra", पासवर्ड: hackathon2026' },
    { id: "parking", en: "Where can I park my vehicle?", hi: "गाड़ी कहाँ पार्क करें?",
      answer_en: "Two-wheeler and car parking is available at Gate 2, opposite the main venue.",
      answer_hi: "दोपहिया और कार पार्किंग गेट 2 पर, मुख्य स्थल के सामने उपलब्ध है।" },
    { id: "charging", en: "Where are the laptop charging points?", hi: "लैपटॉप चार्जिंग पॉइंट कहाँ हैं?",
      answer_en: "Charging strips run along every table row and near the entrance help desk.",
      answer_hi: "हर टेबल की कतार के साथ और प्रवेश द्वार वाले हेल्प डेस्क के पास चार्जिंग स्ट्रिप्स लगी हैं।" },
    { id: "team_size", en: "What is the allowed team size?", hi: "टीम में कितने सदस्य हो सकते हैं?",
      answer_en: "Teams can have 2 to 4 members, including the team lead.",
      answer_hi: "टीम में लीड सहित 2 से 4 सदस्य हो सकते हैं।" },
    { id: "deadline", en: "When is the submission deadline?", hi: "सबमिशन की आख़िरी तारीख़ क्या है?",
      answer_en: "Final submissions close at 6:00 PM on 19 July 2026 via the portal.",
      answer_hi: "अंतिम सबमिशन 19 जुलाई 2026 शाम 6:00 बजे पोर्टल पर बंद हो जाएगा।" },
    { id: "food", en: "What are the meal timings?", hi: "खाने का समय क्या है?",
      answer_en: "Breakfast 8–9 AM, lunch 1–2 PM, dinner 8–9 PM at the cafeteria.",
      answer_hi: "नाश्ता सुबह 8–9 बजे, लंच दोपहर 1–2 बजे, डिनर रात 8–9 बजे कैफेटेरिया में।" },
    { id: "mentor", en: "How do I get mentor support?", hi: "मेंटर से मदद कैसे लूँ?",
      answer_en: "Raise a request at the mentor kiosk near Track A — a mentor reaches your table within 15 minutes.",
      answer_hi: "ट्रैक A के पास मेंटर किओस्क पर अनुरोध करें — एक मेंटर 15 मिनट में आपकी टेबल पर आएगा।" },
    { id: "certificate", en: "When will I get my certificate?", hi: "सर्टिफिकेट कब मिलेगा?",
      answer_en: "E-certificates are emailed within 7 days of the closing ceremony.",
      answer_hi: "समापन समारोह के 7 दिनों के भीतर ई-सर्टिफिकेट ईमेल कर दिए जाएँगे।" },
    { id: "washroom", en: "Where is the nearest washroom?", hi: "सबसे नज़दीकी वॉशरूम कहाँ है?",
      answer_en: "Washrooms are at the end of each hall, near the fire-exit signs.",
      answer_hi: "हर हॉल के आख़िर में, फायर एग्ज़िट के पास वॉशरूम हैं।" },
    { id: "emergency", en: "My teammate is unwell, who do I contact?", hi: "मेरा टीममेट बीमार है, मैं किससे संपर्क करूँ?",
      answer_en: "Marked urgent — a volunteer and the on-site medic are being alerted now.",
      answer_hi: "इसे अत्यावश्यक माना गया है — एक वॉलंटियर और ऑन-साइट मेडिक को अभी सूचित किया जा रहा है।",
      critical: true },
    { id: "laptop_broken", en: "My laptop stopped working, what do I do?", hi: "मेरा लैपटॉप काम नहीं कर रहा, क्या करूँ?",
      answer_en: "Marked urgent — the tech-support desk near Track B has spare machines.",
      answer_hi: "इसे अत्यावश्यक माना गया है — ट्रैक B के पास टेक-सपोर्ट डेस्क पर अतिरिक्त लैपटॉप उपलब्ध हैं।",
      critical: true },
  ];

  /* -----------------------------------------------------------
     State
  ----------------------------------------------------------- */
  let lang = "en";
  let tokenNumber = 13; // will show as 014 on first increment
  let activeSuggestion = -1;

  /* -----------------------------------------------------------
     Element refs
  ----------------------------------------------------------- */
  const el = {
    html: document.documentElement,
    langSwitch: document.getElementById("langSwitch"),
    tokenNumber: document.getElementById("tokenNumber"),
    liveClock: document.getElementById("liveClock"),
    queryInput: document.getElementById("queryInput"),
    suggestList: document.getElementById("suggestList"),
    sendBtn: document.getElementById("sendBtn"),
    micBtn: document.getElementById("micBtn"),
    micStatus: document.getElementById("micStatus"),
    faqGrid: document.getElementById("faqGrid"),
    logSection: document.getElementById("logSection"),
    logList: document.getElementById("logList"),
    lastUpdated: document.getElementById("lastUpdated"),
    toast: document.getElementById("toast"),
    studentName: document.getElementById("studentName"),
    studentContact: document.getElementById("studentContact"),
  };

  const t = (key) => STRINGS[lang][key] || key;

  /* -----------------------------------------------------------
     i18n rendering
  ----------------------------------------------------------- */
  function applyI18n() {
    el.html.lang = lang;
    el.html.dataset.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
    });
    el.langSwitch.setAttribute("aria-checked", lang === "hi" ? "true" : "false");
    renderFaqGrid();
    hideSuggestions();
  }

  el.langSwitch.addEventListener("click", () => {
    lang = lang === "en" ? "hi" : "en";
    applyI18n();
  });

  /* -----------------------------------------------------------
     Token counter + clock
  ----------------------------------------------------------- */
  function paintToken() {
    el.tokenNumber.textContent = String(tokenNumber).padStart(3, "0");
    el.tokenNumber.classList.remove("flash");
    // restart animation
    void el.tokenNumber.offsetWidth;
    el.tokenNumber.classList.add("flash");
  }

  function bumpToken() {
    tokenNumber += 1;
    paintToken();
    return tokenNumber;
  }

  function tick() {
    const now = new Date();
    const locale = lang === "hi" ? "hi-IN" : "en-IN";
    el.liveClock.textContent = now.toLocaleTimeString(locale, { hour12: true });
  }
  paintToken();
  tick();
  setInterval(tick, 1000);

  function stampLastUpdated() {
    const now = new Date();
    const locale = lang === "hi" ? "hi-IN" : "en-IN";
    el.lastUpdated.textContent = `${now.toLocaleDateString(locale)}, ${now.toLocaleTimeString(locale, { hour12: true })}`;
  }
  stampLastUpdated();
  setInterval(stampLastUpdated, 30000);

  /* -----------------------------------------------------------
     Toast
  ----------------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2600);
  }

  /* -----------------------------------------------------------
     FAQ grid
  ----------------------------------------------------------- */
  function renderFaqGrid() {
    el.faqGrid.innerHTML = "";
    FAQS.forEach((faq) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "faq__chip" + (faq.critical ? " is-critical" : "");
      btn.innerHTML = `<span class="dot"></span><span>${faq[lang]}</span>`;
      btn.addEventListener("click", () => answerFaqInstantly(faq));
      el.faqGrid.appendChild(btn);
    });
  }

  function answerFaqInstantly(faq) {
    const token = bumpToken();
    addLogEntry({
      question: faq[lang],
      status: faq.critical ? t("status_critical") : t("status_answered"),
      critical: !!faq.critical,
      token,
      answer: faq[`answer_${lang}`],
    });
    showToast(`${t("toast_answered")} #${String(token).padStart(3, "0")}`);
    stampLastUpdated();
    sendToWebhook({
      student_name: el.studentName.value.trim(),
      contact: el.studentContact.value.trim(),
      message: faq[lang],
      lang,
      matched_faq: faq.id,
      critical: !!faq.critical,
      resolved_instantly: true,
      token,
    });
  }

  /* -----------------------------------------------------------
     Autosuggest — filters FAQ bank as the candidate types
  ----------------------------------------------------------- */
  function renderSuggestions(matches) {
    el.suggestList.innerHTML = "";
    activeSuggestion = -1;
    if (!matches.length) {
      hideSuggestions();
      return;
    }
    matches.forEach((faq) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.className = faq.critical ? "is-critical" : "";
      li.innerHTML = `<span>${faq[lang]}</span><span class="tag">${faq.critical ? t("status_critical") : t("status_answered")}</span>`;
      li.addEventListener("click", () => {
        el.queryInput.value = faq[lang];
        hideSuggestions();
        el.queryInput.focus();
      });
      el.suggestList.appendChild(li);
    });
    el.suggestList.hidden = false;
    el.queryInput.setAttribute("aria-expanded", "true");
  }

  function hideSuggestions() {
    el.suggestList.hidden = true;
    el.suggestList.innerHTML = "";
    el.queryInput.setAttribute("aria-expanded", "false");
  }

  el.queryInput.addEventListener("input", () => {
    autosizeTextarea();
    const query = el.queryInput.value.trim().toLowerCase();
    if (query.length < 2) {
      hideSuggestions();
      return;
    }
    const matches = FAQS.filter(
      (faq) => faq.en.toLowerCase().includes(query) || faq.hi.includes(el.queryInput.value.trim())
    ).slice(0, 5);
    renderSuggestions(matches);
  });

  el.queryInput.addEventListener("keydown", (e) => {
    const items = Array.from(el.suggestList.children);
    if (el.suggestList.hidden || !items.length) {
      if (e.key === "Enter") {
        e.preventDefault();
        submitQuery();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeSuggestion = Math.min(activeSuggestion + 1, items.length - 1);
      items.forEach((it, i) => it.classList.toggle("active", i === activeSuggestion));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeSuggestion = Math.max(activeSuggestion - 1, 0);
      items.forEach((it, i) => it.classList.toggle("active", i === activeSuggestion));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        items[activeSuggestion].click();
      } else {
        submitQuery();
      }
    } else if (e.key === "Escape") {
      hideSuggestions();
    }
  });

  document.addEventListener("click", (e) => {
    if (!el.suggestList.contains(e.target) && e.target !== el.queryInput) {
      hideSuggestions();
    }
  });

  function autosizeTextarea() {
    el.queryInput.style.height = "auto";
    el.queryInput.style.height = Math.min(el.queryInput.scrollHeight, 140) + "px";
  }

  /* -----------------------------------------------------------
     Submitting a free-typed / spoken question
  ----------------------------------------------------------- */
  function findExactFaqMatch(text) {
    const normalized = text.trim().toLowerCase();
    return FAQS.find(
      (faq) => faq.en.toLowerCase() === normalized || faq.hi === text.trim()
    );
  }

  function submitQuery() {
    const text = el.queryInput.value.trim();
    if (!text) {
      showToast(t("toast_need_query"));
      return;
    }
    hideSuggestions();
    const matched = findExactFaqMatch(text);
    const token = bumpToken();

    if (matched) {
      addLogEntry({
        question: matched[lang],
        status: matched.critical ? t("status_critical") : t("status_answered"),
        critical: !!matched.critical,
        token,
        answer: matched[`answer_${lang}`],
      });
      showToast(`${t("toast_answered")} #${String(token).padStart(3, "0")}`);
    } else {
      addLogEntry({
        question: text,
        status: t("status_pending"),
        critical: false,
        token,
      });
      showToast(`${t("toast_sent")} #${String(token).padStart(3, "0")}`);
    }

    sendToWebhook({
      student_name: el.studentName.value.trim(),
      contact: el.studentContact.value.trim(),
      message: text,
      lang,
      matched_faq: matched ? matched.id : null,
      critical: matched ? !!matched.critical : null,
      resolved_instantly: !!matched,
      token,
    });

    stampLastUpdated();
    el.queryInput.value = "";
    autosizeTextarea();
  }

  el.sendBtn.addEventListener("click", submitQuery);

  /* -----------------------------------------------------------
     Session log
  ----------------------------------------------------------- */
  function addLogEntry({ question, status, critical, token, answer }) {
    el.logSection.hidden = false;
    const li = document.createElement("li");
    li.className = "log__item" + (critical ? " is-critical" : "");
    const now = new Date();
    const locale = lang === "hi" ? "hi-IN" : "en-IN";
    li.innerHTML = `
      <div>
        <div class="q">#${String(token).padStart(3, "0")} — ${question}</div>
        <div class="meta">${now.toLocaleTimeString(locale, { hour12: true })}${answer ? " · " + answer : ""}</div>
      </div>
      <span class="status">${status}</span>
    `;
    el.logList.prepend(li);
  }

  /* -----------------------------------------------------------
     Webhook (n8n) — no-op unless WEBHOOK_URL is set
  ----------------------------------------------------------- */
  function sendToWebhook(payload) {
    if (!WEBHOOK_URL) return;
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* silent fail — student still sees local confirmation */
    });
  }

  /* -----------------------------------------------------------
     Mic input (Web Speech API)
  ----------------------------------------------------------- */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let listening = false;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.addEventListener("result", (e) => {
      const transcript = e.results[0][0].transcript;
      el.queryInput.value = el.queryInput.value
        ? el.queryInput.value.trim() + " " + transcript
        : transcript;
      autosizeTextarea();
      el.micStatus.textContent = "";
    });

    recognition.addEventListener("error", () => {
      el.micStatus.textContent = t("mic_error");
    });

    recognition.addEventListener("end", () => {
      listening = false;
      el.micBtn.classList.remove("listening");
    });
  }

  el.micBtn.addEventListener("click", () => {
    if (!recognition) {
      el.micStatus.textContent = t("mic_unsupported");
      return;
    }
    if (listening) {
      recognition.stop();
      return;
    }
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    try {
      recognition.start();
      listening = true;
      el.micBtn.classList.add("listening");
      el.micStatus.textContent = t("mic_listening");
    } catch (err) {
      el.micStatus.textContent = t("mic_error");
    }
  });

  /* -----------------------------------------------------------
     Init
  ----------------------------------------------------------- */
  applyI18n();
})();
