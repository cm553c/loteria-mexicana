// Lógica principal de "El Gritón" — Optimizada para Celulares (Android / iPhone) y Escritorio
// Incluye Motor de Voz Híbrido (Web Speech Nativo corregido para móvil + Respaldo de Voz Online)

(() => {
  const INTRO_SHOUTS = [
    "¡Se va y se corre con la vieja del pozole!",
    "¡Corre y se va corriendo con!",
    "¡Abran bien las orejas y preparen sus frijolitos, que arrancamos con!",
    "¡Juego limpio y tablas listas, que empieza la corrida con!"
  ];

  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");

  const state = {
    deck: [],                  // Cartas barajadas pendientes por salir
    drawn: [],                 // Cartas cantadas en orden de salida
    drawnMap: new Map(),       // id -> número de turno en que salió (1..54)
    chosenDichoMap: new Map(), // id -> dicho elegido en esta partida
    lastDichoIdxMap: new Map(),// id -> índice del último dicho usado (para alternar entre corridas)
    currentCard: null,
    currentDicho: "",
    isAutoPlaying: false,
    intervalMs: 4500,
    callStyle: "both",         // 'both' | 'name' | 'riddle'
    sortMode: "recent",        // 'recent' | 'number' | 'all54'
    searchQuery: "",
    mobileView: "griton",      // 'griton' | 'mesa'
    // Audio y Voz
    voiceEnabled: true,
    sfxEnabled: true,
    introShout: true,
    ttsEngine: "auto",         // 'auto' | 'online' | 'native'
    selectedVoiceURI: "default_es_mx",
    voiceRate: 1.0,
    voicePitch: 1.0,
    isSpeaking: false
  };

  // Referencias del DOM
  const el = {
    sectionGriton: document.getElementById("sectionGriton"),
    sectionMesa: document.getElementById("sectionMesa"),
    tabMobileGriton: document.getElementById("tabMobileGriton"),
    tabMobileMesa: document.getElementById("tabMobileMesa"),
    mobileTabCalledCount: document.getElementById("mobileTabCalledCount"),
    btnSeeAllMobile: document.getElementById("btnSeeAllMobile"),
    recentMiniStrip: document.getElementById("recentMiniStrip"),
    drawnCount: document.getElementById("drawnCount"),
    remainingCount: document.getElementById("remainingCount"),
    deckProgressBar: document.getElementById("deckProgressBar"),
    activeCard: document.getElementById("activeCard"),
    cardFront: document.getElementById("cardFront"),
    cardTurnBadge: document.getElementById("cardTurnBadge"),
    cardImage: document.getElementById("cardImage"),
    riddleOverlay: document.getElementById("riddleOverlay"),
    dichoVariantTag: document.getElementById("dichoVariantTag"),
    cardDicho: document.getElementById("cardDicho"),
    currentCardLabel: document.getElementById("currentCardLabel"),
    btnAnotherDicho: document.getElementById("btnAnotherDicho"),
    speakingIndicator: document.getElementById("speakingIndicator"),
    autoTimerWrap: document.getElementById("autoTimerWrap"),
    autoTimerBar: document.getElementById("autoTimerBar"),
    btnNextCard: document.getElementById("btnNextCard"),
    btnNextText: document.getElementById("btnNextText"),
    btnAutoPlay: document.getElementById("btnAutoPlay"),
    autoPlayIcon: document.getElementById("autoPlayIcon"),
    autoPlayText: document.getElementById("autoPlayText"),
    btnRepeat: document.getElementById("btnRepeat"),
    btnNewGame: document.getElementById("btnNewGame"),
    btnNewGameHeader: document.getElementById("btnNewGameHeader"),
    // Barra inferior móvil
    btnMobileAuto: document.getElementById("btnMobileAuto"),
    mobileAutoIcon: document.getElementById("mobileAutoIcon"),
    mobileAutoText: document.getElementById("mobileAutoText"),
    btnMobileNext: document.getElementById("btnMobileNext"),
    mobileNextText: document.getElementById("mobileNextText"),
    btnMobileRepeat: document.getElementById("btnMobileRepeat"),
    speedSelect: document.getElementById("speedSelect"),
    callStyleSelect: document.getElementById("callStyleSelect"),
    // Mesa de Cartas Cantadas
    calledHeaderCount: document.getElementById("calledHeaderCount"),
    searchCardInput: document.getElementById("searchCardInput"),
    sortTabs: document.querySelectorAll(".sort-tab"),
    searchCheckAlert: document.getElementById("searchCheckAlert"),
    emptyCalledState: document.getElementById("emptyCalledState"),
    calledCardsGrid: document.getElementById("calledCardsGrid"),
    // Header botones
    btnLoteriaWin: document.getElementById("btnLoteriaWin"),
    btnAudioSettings: document.getElementById("btnAudioSettings"),
    btnFullscreen: document.getElementById("btnFullscreen"),
    // Modal Lotería Pausa
    loteriaBannerModal: document.getElementById("loteriaBannerModal"),
    btnCloseLoteriaModal: document.getElementById("btnCloseLoteriaModal"),
    modalCalledTotal: document.getElementById("modalCalledTotal"),
    modalCalledMiniList: document.getElementById("modalCalledMiniList"),
    btnConfirmWinner: document.getElementById("btnConfirmWinner"),
    btnContinuePlaying: document.getElementById("btnContinuePlaying"),
    // Modal Audio
    audioModal: document.getElementById("audioModal"),
    btnCloseAudioModal: document.getElementById("btnCloseAudioModal"),
    btnSaveAudioModal: document.getElementById("btnSaveAudioModal"),
    chkVoiceEnabled: document.getElementById("chkVoiceEnabled"),
    chkSfxEnabled: document.getElementById("chkSfxEnabled"),
    chkIntroShout: document.getElementById("chkIntroShout"),
    ttsEngineSelect: document.getElementById("ttsEngineSelect"),
    voiceSelect: document.getElementById("voiceSelect"),
    voiceRate: document.getElementById("voiceRate"),
    voiceRateVal: document.getElementById("voiceRateVal"),
    voicePitch: document.getElementById("voicePitch"),
    voicePitchVal: document.getElementById("voicePitchVal"),
    btnTestVoice: document.getElementById("btnTestVoice"),
    // Confetti
    confettiCanvas: document.getElementById("confettiCanvas")
  };

  // ==========================================
  // NAVEGACIÓN DE PESTAÑAS EN CELULAR
  // ==========================================
  function setMobileView(view) {
    state.mobileView = view;
    const isMobile = window.innerWidth <= 960;
    if (!isMobile) {
      el.sectionGriton.classList.remove("mobile-hidden-panel");
      el.sectionMesa.classList.remove("mobile-hidden-panel");
      return;
    }
    if (view === "griton") {
      el.sectionGriton.classList.remove("mobile-hidden-panel");
      el.sectionMesa.classList.add("mobile-hidden-panel");
      el.tabMobileGriton.classList.add("active");
      el.tabMobileMesa.classList.remove("active");
    } else {
      el.sectionGriton.classList.add("mobile-hidden-panel");
      el.sectionMesa.classList.remove("mobile-hidden-panel");
      el.tabMobileGriton.classList.remove("active");
      el.tabMobileMesa.classList.add("active");
    }
  }

  window.addEventListener("resize", () => setMobileView(state.mobileView));

  // Contexto Web Audio API para sonidos
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const sfx = {
    cardFlip() {
      if (!state.sfxEnabled) return;
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    },
    shuffle() {
      if (!state.sfxEnabled) return;
      const ctx = getAudioCtx();
      if (!ctx) return;
      for (let i = 0; i < 6; i++) {
        setTimeout(() => sfx.cardFlip(), i * 55);
      }
    },
    fanfare() {
      if (!state.sfxEnabled) return;
      const ctx = getAudioCtx();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
      const times = [0, 0.13, 0.26, 0.4, 0.58, 0.72];
      const durations = [0.11, 0.11, 0.11, 0.16, 0.11, 0.4];

      notes.forEach((freq, idx) => {
        const start = ctx.currentTime + times[idx];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + durations[idx]);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + durations[idx]);
      });
    }
  };

  // ==========================================
  // SELECCIÓN ALEATORIA DE DICHOS
  // ==========================================
  function pickRandomDicho(card) {
    const list = Array.isArray(card.dichos) && card.dichos.length > 0
      ? card.dichos
      : [card.dicho || card.name];

    if (list.length === 1) {
      return { text: list[0], index: 0, total: 1 };
    }

    const lastIdx = state.lastDichoIdxMap.get(card.id);
    const candidateIndices = [];
    for (let i = 0; i < list.length; i++) {
      if (i !== lastIdx) candidateIndices.push(i);
    }

    const chosenIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
    state.lastDichoIdxMap.set(card.id, chosenIndex);
    state.chosenDichoMap.set(card.id, list[chosenIndex]);

    return {
      text: list[chosenIndex],
      index: chosenIndex,
      total: list.length
    };
  }

  // ==========================================
  // MOTOR DE VOZ HÍBRIDO (NATIVO + ONLINE PARA CELULAR)
  // ==========================================
  let availableVoices = [];
  let currentAudioEl = null;
  let speechTimeoutId = null;

  function normalizeLang(lang) {
    return String(lang || "").replace("_", "-").toLowerCase();
  }

  function loadVoices() {
    el.voiceSelect.innerHTML = "";

    // Opción predeterminada que usa directamente el idioma es-MX del sistema (la más compatible en Android/iOS)
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "default_es_mx";
    defaultOpt.textContent = "🇲🇽 Español México (Automática del Sistema)";
    el.voiceSelect.appendChild(defaultOpt);

    if (!("speechSynthesis" in window)) return;
    const allVoices = window.speechSynthesis.getVoices() || [];
    if (!allVoices.length) return;

    const spanishVoices = allVoices.filter((v) => {
      const l = normalizeLang(v.lang);
      const n = (v.name || "").toLowerCase();
      return l.startsWith("es") || l.startsWith("spa") || n.includes("spanish") || n.includes("español");
    });

    spanishVoices.sort((a, b) => {
      const score = (v) => {
        const lang = normalizeLang(v.lang);
        if (lang.includes("es-mx") || lang.includes("mex")) return 4;
        if (lang.includes("es-us") || lang.includes("es-419")) return 3;
        if (lang.startsWith("es")) return 2;
        return 1;
      };
      return score(b) - score(a);
    });

    availableVoices = spanishVoices.length > 0 ? spanishVoices : allVoices;

    availableVoices.forEach((voice) => {
      const opt = document.createElement("option");
      opt.value = voice.voiceURI;
      opt.textContent = `${voice.name} (${voice.lang})`;
      el.voiceSelect.appendChild(opt);
    });

    // En PC, seleccionar la primera voz en español; en móvil dejar default_es_mx a menos que el usuario elija otra
    if (!isMobileDevice && state.selectedVoiceURI === "default_es_mx" && availableVoices.length > 0) {
      state.selectedVoiceURI = availableVoices[0].voiceURI;
    }

    el.voiceSelect.value = state.selectedVoiceURI;
  }

  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    // Algunos navegadores móviles tardan en poblar getVoices()
    setTimeout(loadVoices, 250);
    setTimeout(loadVoices, 1000);
  } else {
    loadVoices();
  }

  function stopAllSpeech() {
    clearTimeout(speechTimeoutId);
    if (currentAudioEl) {
      try {
        currentAudioEl.pause();
        currentAudioEl.src = "";
      } catch (_) {}
      currentAudioEl = null;
    }
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    state.isSpeaking = false;
    el.speakingIndicator.classList.add("hidden");
  }

  // Respaldo de voz online por streaming HTML5 Audio (funciona en cualquier celular aunque no tenga TTS instalado)
  function speakWithOnlineAudio(text, onDone) {
    stopAllSpeech();
    const cleanText = text.replace(/\.\.\./g, ",").slice(0, 200);
    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=es-MX&q=${encodeURIComponent(cleanText)}`;

    const audio = new Audio();
    audio.referrerPolicy = "no-referrer";
    audio.src = url;
    audio.playbackRate = Math.max(0.75, Math.min(1.35, state.voiceRate));
    currentAudioEl = audio;

    state.isSpeaking = true;
    el.speakingIndicator.classList.remove("hidden");

    const finish = () => {
      if (currentAudioEl === audio) {
        currentAudioEl = null;
      }
      state.isSpeaking = false;
      el.speakingIndicator.classList.add("hidden");
      if (onDone) onDone();
    };

    audio.onended = finish;
    audio.onerror = finish;

    audio.play().catch(() => {
      finish();
    });
  }

  function speakText(text, onDone) {
    if (!state.voiceEnabled) {
      stopAllSpeech();
      if (onDone) onDone();
      return;
    }

    // Si el usuario eligió explícitamente Voz Online o el navegador no soporta speechSynthesis
    if (state.ttsEngine === "online" || !("speechSynthesis" in window)) {
      speakWithOnlineAudio(text, onDone);
      return;
    }

    // Cancelar cualquier audio previo
    clearTimeout(speechTimeoutId);
    if (currentAudioEl) {
      try { currentAudioEl.pause(); } catch (_) {}
      currentAudioEl = null;
    }

    const wasBusy = window.speechSynthesis.speaking || window.speechSynthesis.pending;
    if (wasBusy) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }

    // En Android/iOS, hay que esperar ~50ms después de cancel() para que no cancele la nueva frase
    const delayMs = wasBusy ? 60 : 0;

    speechTimeoutId = setTimeout(() => {
      try {
        window.speechSynthesis.resume();
      } catch (_) {}

      const utterance = new SpeechSynthesisUtterance(text);
      // Guardar referencia global para evitar que el recolector de basura de Safari/Android la elimine
      window.__activeLoteriaUtterance = utterance;

      const chosen = state.selectedVoiceURI !== "default_es_mx"
        ? availableVoices.find(v => v.voiceURI === state.selectedVoiceURI)
        : null;

      if (chosen) {
        // En Android, asignar el objeto voice solo si su idioma está bien formado
        if (!isMobileDevice || state.selectedVoiceURI !== "default_es_mx") {
          utterance.voice = chosen;
        }
        utterance.lang = (chosen.lang || "es-MX").replace("_", "-");
      } else {
        utterance.lang = "es-MX";
      }

      utterance.rate = state.voiceRate;
      utterance.pitch = state.voicePitch;

      let started = false;
      let finished = false;

      const finishOnce = () => {
        if (finished) return;
        finished = true;
        clearTimeout(fallbackTimer);
        state.isSpeaking = false;
        el.speakingIndicator.classList.add("hidden");
        if (onDone) onDone();
      };

      utterance.onstart = () => {
        started = true;
        state.isSpeaking = true;
        el.speakingIndicator.classList.remove("hidden");
      };

      utterance.onend = finishOnce;

      utterance.onerror = () => {
        if (!started && state.ttsEngine === "auto") {
          finished = true;
          clearTimeout(fallbackTimer);
          speakWithOnlineAudio(text, onDone);
          return;
        }
        finishOnce();
      };

      // Si en un celular con modo "auto" la voz nativa no arranca en 700ms, activar respaldo Online automáticamente
      const fallbackTimer = setTimeout(() => {
        if (!started && !finished && state.ttsEngine === "auto" && isMobileDevice) {
          finished = true;
          try { window.speechSynthesis.cancel(); } catch (_) {}
          speakWithOnlineAudio(text, onDone);
        }
      }, 700);

      state.isSpeaking = true;
      el.speakingIndicator.classList.remove("hidden");
      window.speechSynthesis.speak(utterance);
    }, delayMs);
  }

  function buildCardCallPhrase(card, dichoText, isFirstCard = false) {
    const randomIntro = INTRO_SHOUTS[Math.floor(Math.random() * INTRO_SHOUTS.length)];
    const intro = isFirstCard && state.introShout ? `${randomIntro} ` : "";

    if (state.callStyle === "name") {
      return `${intro}¡${card.name}!`;
    }
    if (state.callStyle === "riddle") {
      return `${intro}${dichoText}`;
    }
    return `${intro}${dichoText} ... ¡${card.name}!`;
  }

  // ==========================================
  // BARAJEO Y CONTROL DE PARTIDA
  // ==========================================
  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  let riddleRevealTimeout = null;

  function initNewGame(announceShuffle = false) {
    stopAutoPlay();
    stopAllSpeech();
    clearTimeout(riddleRevealTimeout);

    state.deck = shuffleArray(LOTERIA_CARDS);
    state.drawn = [];
    state.drawnMap.clear();
    state.chosenDichoMap.clear();
    state.currentCard = null;
    state.currentDicho = "";
    state.searchQuery = "";
    el.searchCardInput.value = "";

    el.activeCard.classList.add("is-waiting");
    el.activeCard.classList.remove("riddle-masked", "flip-anim");
    el.riddleOverlay.classList.add("hidden");
    el.dichoVariantTag.textContent = "🎙️ VERSO CANTADO";
    el.cardDicho.textContent =
      '"¡Se va y se corre con la vieja del pozole! Toca la carta o el botón de abajo para comenzar."';
    el.currentCardLabel.textContent = "Esperando primera carta...";
    el.btnNextText.textContent = "¡Corre y se va! (Sacar 1ª Carta)";
    el.mobileNextText.textContent = "¡Sacar 1ª Carta!";
    el.btnNextCard.disabled = false;
    el.btnMobileNext.disabled = false;
    el.btnRepeat.disabled = true;
    el.btnMobileRepeat.disabled = true;
    el.btnAnotherDicho.disabled = true;

    if (announceShuffle) {
      sfx.shuffle();
      setMobileView("griton");
    }

    updateStatsAndCalledCards();
  }

  function drawNextCard() {
    requestWakeLock();
    if (state.deck.length === 0) {
      stopAutoPlay();
      speakText("¡Se terminaron las cincuenta y cuatro cartas de la lotería!");
      return;
    }

    clearTimeout(riddleRevealTimeout);
    const isFirst = state.drawn.length === 0;
    const card = state.deck.pop();
    const turnNumber = state.drawn.length + 1;

    const picked = pickRandomDicho(card);

    state.currentCard = card;
    state.currentDicho = picked.text;
    state.drawn.push(card);
    state.drawnMap.set(card.id, turnNumber);

    sfx.cardFlip();
    renderActiveCard(card, turnNumber, picked);
    updateStatsAndCalledCards();

    el.btnRepeat.disabled = false;
    el.btnMobileRepeat.disabled = false;
    el.btnAnotherDicho.disabled = false;

    if (state.deck.length === 0) {
      el.btnNextText.textContent = "Mazo terminado (54/54)";
      el.mobileNextText.textContent = "Terminado (54/54)";
      el.btnNextCard.disabled = true;
      el.btnMobileNext.disabled = true;
    } else {
      el.btnNextText.textContent = `Cantar Siguiente Carta (${state.deck.length} por salir)`;
      el.mobileNextText.textContent = `Siguiente (${state.deck.length})`;
    }

    const phrase = buildCardCallPhrase(card, picked.text, isFirst);
    resetAutoTimerProgress();
    speakText(phrase, () => {
      if (state.isAutoPlaying && state.deck.length > 0) {
        startAutoCountdown();
      }
    });
  }

  function renderActiveCard(card, turnNumber, pickedDicho) {
    el.activeCard.classList.remove("is-waiting", "flip-anim", "riddle-masked");
    el.riddleOverlay.classList.add("hidden");
    void el.activeCard.offsetWidth;
    el.activeCard.classList.add("flip-anim");

    el.cardImage.src = card.image;
    el.cardImage.alt = `#${card.id} ${card.name}`;
    el.cardTurnBadge.textContent = `Turno #${turnNumber}`;

    el.dichoVariantTag.textContent = `🎙️ DICHO ${pickedDicho.index + 1} DE ${pickedDicho.total}`;
    el.cardDicho.textContent = `"${pickedDicho.text}"`;

    if (state.callStyle === "riddle") {
      el.activeCard.classList.add("riddle-masked");
      el.riddleOverlay.classList.remove("hidden");
      el.currentCardLabel.textContent = "❓ ¿Qué carta es? (Toca para revelar)";
      riddleRevealTimeout = setTimeout(() => {
        el.activeCard.classList.remove("riddle-masked");
        el.riddleOverlay.classList.add("hidden");
        el.currentCardLabel.textContent = `Carta #${card.id} — ${card.name}`;
      }, 3400);
    } else {
      el.currentCardLabel.textContent = `Carta #${card.id} — ${card.name}`;
    }
  }

  function repeatCurrentCard() {
    if (!state.currentCard) return;
    const phrase = buildCardCallPhrase(state.currentCard, state.currentDicho, false);
    speakText(phrase);
  }

  function cycleAnotherDichoForCurrentCard() {
    if (!state.currentCard) return;
    const picked = pickRandomDicho(state.currentCard);
    state.currentDicho = picked.text;
    el.dichoVariantTag.textContent = `🎙️ DICHO ${picked.index + 1} DE ${pickedDicho.total}`;
    el.cardDicho.textContent = `"${picked.text}"`;
    const phrase = buildCardCallPhrase(state.currentCard, picked.text, false);
    speakText(phrase);
  }

  // ==========================================
  // TEMPORIZADOR AUTOMÁTICO
  // ==========================================
  let autoTimerId = null;
  let autoStartTimestamp = 0;

  function resetAutoTimerProgress() {
    cancelAnimationFrame(autoTimerId);
    el.autoTimerBar.style.width = "0%";
  }

  function startAutoCountdown() {
    cancelAnimationFrame(autoTimerId);
    autoStartTimestamp = performance.now();
    const duration = state.intervalMs;

    function tick(now) {
      if (!state.isAutoPlaying) return;
      const elapsed = now - autoStartTimestamp;
      const pct = Math.min(100, (elapsed / duration) * 100);
      el.autoTimerBar.style.width = `${pct}%`;

      if (elapsed >= duration) {
        el.autoTimerBar.style.width = "0%";
        drawNextCard();
      } else {
        autoTimerId = requestAnimationFrame(tick);
      }
    }

    autoTimerId = requestAnimationFrame(tick);
  }

  function toggleAutoPlay() {
    if (state.isAutoPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  function startAutoPlay() {
    requestWakeLock();
    if (state.deck.length === 0) {
      initNewGame(true);
    }
    state.isAutoPlaying = true;
    el.btnAutoPlay.classList.add("is-active");
    el.btnMobileAuto.classList.add("is-active");
    el.autoPlayIcon.textContent = "⏸️";
    el.autoPlayText.textContent = "Pausar";
    el.mobileAutoIcon.textContent = "⏸️";
    el.mobileAutoText.textContent = "Pausa";
    el.autoTimerWrap.classList.remove("hidden");

    if (!state.currentCard || !state.isSpeaking) {
      drawNextCard();
    }
  }

  function stopAutoPlay() {
    state.isAutoPlaying = false;
    cancelAnimationFrame(autoTimerId);
    el.btnAutoPlay.classList.remove("is-active");
    el.btnMobileAuto.classList.remove("is-active");
    el.autoPlayIcon.textContent = "▶️";
    el.autoPlayText.textContent = "Automático";
    el.mobileAutoIcon.textContent = "▶️";
    el.mobileAutoText.textContent = "Auto";
    el.autoTimerWrap.classList.add("hidden");
    el.autoTimerBar.style.width = "0%";
  }

  // ==========================================
  // MESA DE CARTAS CANTADAS Y TIRA MÓVIL
  // ==========================================
  function updateStatsAndCalledCards() {
    const drawnTotal = state.drawn.length;
    const remainingTotal = state.deck.length;

    el.drawnCount.textContent = drawnTotal;
    el.calledHeaderCount.textContent = drawnTotal;
    el.mobileTabCalledCount.textContent = drawnTotal;
    el.remainingCount.textContent = remainingTotal;

    const progressPct = (drawnTotal / LOTERIA_CARDS.length) * 100;
    el.deckProgressBar.style.width = `${progressPct}%`;

    renderMobileRecentStrip();
    renderCalledCardsMesa();
  }

  function renderMobileRecentStrip() {
    el.recentMiniStrip.innerHTML = "";
    if (state.drawn.length === 0) {
      el.recentMiniStrip.innerHTML = `<span class="empty-mini-text">Aquí irán saliendo las cartas cantadas...</span>`;
      return;
    }

    const recent = [...state.drawn].reverse().slice(0, 15);
    recent.forEach((card) => {
      const turn = state.drawnMap.get(card.id);
      const item = document.createElement("div");
      item.className = "mini-strip-card";
      item.title = `#${card.id} ${card.name} (Turno #${turn})`;
      item.innerHTML = `<img src="${card.image}" alt="${card.name}" loading="lazy" />`;
      item.addEventListener("click", () => {
        speakText(`${card.name}, salió en el turno ${turn}.`);
      });
      el.recentMiniStrip.appendChild(item);
    });
  }

  function renderCalledCardsMesa() {
    const q = state.searchQuery.trim().toLowerCase();
    el.calledCardsGrid.innerHTML = "";

    if (q) {
      const exactOrPartial = LOTERIA_CARDS.find(
        c => String(c.id) === q || c.name.toLowerCase().includes(q)
      );
      if (exactOrPartial) {
        const isDrawn = state.drawnMap.has(exactOrPartial.id);
        const turn = state.drawnMap.get(exactOrPartial.id);
        el.searchCheckAlert.classList.remove("hidden", "found", "not-found");
        if (isDrawn) {
          el.searchCheckAlert.classList.add("found");
          el.searchCheckAlert.textContent = `✅ SÍ SALIÓ: #${exactOrPartial.id} ${exactOrPartial.name} (Turno #${turn})`;
        } else {
          el.searchCheckAlert.classList.add("not-found");
          el.searchCheckAlert.textContent = `❌ AÚN NO SALE: #${exactOrPartial.id} ${exactOrPartial.name} sigue en el mazo.`;
        }
      } else {
        el.searchCheckAlert.classList.add("hidden");
      }
    } else {
      el.searchCheckAlert.classList.add("hidden");
    }

    if (state.drawn.length === 0 && state.sortMode !== "all54" && !q) {
      el.emptyCalledState.classList.remove("hidden");
      el.calledCardsGrid.classList.add("hidden");
      return;
    }

    el.emptyCalledState.classList.add("hidden");
    el.calledCardsGrid.classList.remove("hidden");

    let listToDisplay = [];
    if (state.sortMode === "recent") {
      listToDisplay = [...state.drawn].reverse();
    } else if (state.sortMode === "number") {
      listToDisplay = [...state.drawn].sort((a, b) => a.id - b.id);
    } else {
      listToDisplay = [...LOTERIA_CARDS];
    }

    if (q) {
      listToDisplay = listToDisplay.filter(
        c => c.name.toLowerCase().includes(q) || String(c.id) === q
      );
    }

    listToDisplay.forEach((card) => {
      const isDrawn = state.drawnMap.has(card.id);
      const turn = state.drawnMap.get(card.id);
      const isLatest = state.currentCard && state.currentCard.id === card.id;

      const cardEl = document.createElement("div");
      cardEl.className = "called-loteria-card";
      if (isLatest) cardEl.classList.add("is-latest");
      if (!isDrawn) cardEl.classList.add("not-drawn-yet");

      const usedDicho = state.chosenDichoMap.get(card.id) || card.dichos[0];
      cardEl.title = isDrawn
        ? `#${card.id} ${card.name} — Salió en el turno #${turn}\nDicho: "${usedDicho}"`
        : `#${card.id} ${card.name} — Aún no ha salido`;

      cardEl.innerHTML = `
        <div class="called-card-img-wrap">
          <span class="called-card-turn-pill ${isDrawn ? "" : "pending"}">
            ${isDrawn ? `#${turn}` : "Falta"}
          </span>
          <img src="${card.image}" alt="#${card.id} ${card.name}" class="called-card-img" loading="lazy" />
        </div>
      `;

      cardEl.addEventListener("click", () => {
        if (isDrawn) {
          speakText(`${card.name}. Salió en el turno ${turn}. ${usedDicho}`);
        } else {
          speakText(`La carta ${card.name} todavía no ha salido.`);
        }
      });

      el.calledCardsGrid.appendChild(cardEl);
    });
  }

  // ==========================================
  // PAUSA DE "¡LOTERÍA!" Y CONFETI
  // ==========================================
  function openLoteriaModal() {
    stopAutoPlay();
    sfx.fanfare();
    speakText("¡Lotería! Juego en pausa para revisar la tabla ganadora.");

    el.modalCalledTotal.textContent = state.drawn.length;
    el.modalCalledMiniList.innerHTML = "";

    const sortedDrawn = [...state.drawn].sort((a, b) => a.id - b.id);
    if (sortedDrawn.length === 0) {
      el.modalCalledMiniList.innerHTML = `<p style="color: var(--text-muted)">Aún no se ha cantado ninguna carta.</p>`;
    } else {
      sortedDrawn.forEach((card) => {
        const turn = state.drawnMap.get(card.id);
        const mini = document.createElement("div");
        mini.className = "modal-mini-card";
        mini.title = `#${card.id} ${card.name} (Salió en el turno #${turn})`;
        mini.innerHTML = `<img src="${card.image}" alt="${card.name}" />`;
        el.modalCalledMiniList.appendChild(mini);
      });
    }

    el.loteriaBannerModal.classList.remove("hidden");
  }

  function closeLoteriaModal() {
    el.loteriaBannerModal.classList.add("hidden");
  }

  function launchConfetti() {
    const canvas = el.confettiCanvas;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#ec4899", "#fbbf24", "#22c55e", "#ef4444", "#06b6d4", "#a855f7"];
    const pieces = Array.from({ length: 130 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 4 + 2.5,
      vx: (Math.random() - 0.5) * 3,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15
    }));

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 220) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(draw);
  }

  // ==========================================
  // EVENTOS E INTERACCIÓN
  // ==========================================
  const handleManualNext = () => {
    if (state.isAutoPlaying) stopAutoPlay();
    setMobileView("griton");
    drawNextCard();
  };

  el.btnNextCard.addEventListener("click", handleManualNext);
  el.btnMobileNext.addEventListener("click", handleManualNext);

  el.btnAutoPlay.addEventListener("click", toggleAutoPlay);
  el.btnMobileAuto.addEventListener("click", toggleAutoPlay);

  el.btnRepeat.addEventListener("click", repeatCurrentCard);
  el.btnMobileRepeat.addEventListener("click", repeatCurrentCard);

  el.btnAnotherDicho.addEventListener("click", cycleAnotherDichoForCurrentCard);

  const confirmAndReset = () => {
    if (state.drawn.length > 0 && state.drawn.length < 54) {
      const ok = window.confirm("¿Deseas barajar todas las cartas y comenzar una corrida nueva?");
      if (!ok) return;
    }
    initNewGame(true);
  };

  el.btnNewGame.addEventListener("click", confirmAndReset);
  el.btnNewGameHeader.addEventListener("click", confirmAndReset);

  // Pestañas móviles
  el.tabMobileGriton.addEventListener("click", () => setMobileView("griton"));
  el.tabMobileMesa.addEventListener("click", () => setMobileView("mesa"));
  el.btnSeeAllMobile.addEventListener("click", () => setMobileView("mesa"));

  // Tocar la carta directamente en el celular revela (en adivinanza) o saca la siguiente carta
  el.activeCard.addEventListener("click", () => {
    if (state.currentCard && el.activeCard.classList.contains("riddle-masked")) {
      clearTimeout(riddleRevealTimeout);
      el.activeCard.classList.remove("riddle-masked");
      el.riddleOverlay.classList.add("hidden");
      el.currentCardLabel.textContent = `Carta #${state.currentCard.id} — ${state.currentCard.name}`;
      speakText(`¡${state.currentCard.name}!`);
      return;
    }
    handleManualNext();
  });

  el.speedSelect.addEventListener("change", (e) => {
    state.intervalMs = Number(e.target.value);
  });

  el.callStyleSelect.addEventListener("change", (e) => {
    state.callStyle = e.target.value;
  });

  el.searchCardInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderCalledCardsMesa();
  });

  el.sortTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      el.sortTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.sortMode = tab.dataset.sort;
      renderCalledCardsMesa();
    });
  });

  // Botones de ¡LOTERÍA!
  el.btnLoteriaWin.addEventListener("click", openLoteriaModal);
  el.btnCloseLoteriaModal.addEventListener("click", closeLoteriaModal);
  el.btnConfirmWinner.addEventListener("click", () => {
    closeLoteriaModal();
    sfx.fanfare();
    launchConfetti();
    speakText("¡Tenemos ganador de la Lotería! ¡Muchas felicidades!");
  });
  el.btnContinuePlaying.addEventListener("click", () => {
    closeLoteriaModal();
    speakText("¡Seguimos jugando! Corre y se va corriendo.");
  });

  // Modal de Audio
  el.btnAudioSettings.addEventListener("click", () => {
    loadVoices();
    el.audioModal.classList.remove("hidden");
  });

  const closeAudio = () => el.audioModal.classList.add("hidden");
  el.btnCloseAudioModal.addEventListener("click", closeAudio);
  el.btnSaveAudioModal.addEventListener("click", closeAudio);

  el.chkVoiceEnabled.addEventListener("change", (e) => {
    state.voiceEnabled = e.target.checked;
    if (!state.voiceEnabled) {
      stopAllSpeech();
    }
  });

  el.chkSfxEnabled.addEventListener("change", (e) => {
    state.sfxEnabled = e.target.checked;
  });

  el.chkIntroShout.addEventListener("change", (e) => {
    state.introShout = e.target.checked;
  });

  el.ttsEngineSelect.addEventListener("change", (e) => {
    state.ttsEngine = e.target.value;
  });

  el.voiceSelect.addEventListener("change", (e) => {
    state.selectedVoiceURI = e.target.value;
  });

  el.voiceRate.addEventListener("input", (e) => {
    state.voiceRate = parseFloat(e.target.value);
    el.voiceRateVal.textContent = `${state.voiceRate.toFixed(2)}x`;
  });

  el.voicePitch.addEventListener("input", (e) => {
    state.voicePitch = parseFloat(e.target.value);
    el.voicePitchVal.textContent = state.voicePitch.toFixed(2);
  });

  el.btnTestVoice.addEventListener("click", () => {
    speakText("¡El que le cantó a San Pedro no le volverá a cantar! ... ¡El Gallo!");
  });

  // Pantalla Completa
  el.btnFullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Atajos de teclado
  window.addEventListener("keydown", (e) => {
    const activeTag = document.activeElement ? document.activeElement.tagName : "";
    if (activeTag === "INPUT" || activeTag === "SELECT" || activeTag === "TEXTAREA") return;

    if (e.code === "Space" || e.code === "ArrowRight") {
      e.preventDefault();
      if (!el.loteriaBannerModal.classList.contains("hidden")) return;
      handleManualNext();
    } else if (e.key.toLowerCase() === "p") {
      e.preventDefault();
      toggleAutoPlay();
    } else if (e.key.toLowerCase() === "r") {
      e.preventDefault();
      repeatCurrentCard();
    } else if (e.key.toLowerCase() === "l") {
      e.preventDefault();
      openLoteriaModal();
    }
  });

  // Evitar que la pantalla del celular se apague mientras juegan (Screen Wake Lock API)
  let wakeLockSentinel = null;
  async function requestWakeLock() {
    if ("wakeLock" in navigator) {
      try {
        wakeLockSentinel = await navigator.wakeLock.request("screen");
      } catch (_) {}
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && state.drawn.length > 0) {
      requestWakeLock();
    }
  });

  // Registrar Service Worker para que funcione como App instalable en celular (PWA)
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  setMobileView("griton");
  initNewGame(false);
})();
