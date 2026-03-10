const particlesRoot = document.getElementById("particles");
const particleCount = window.innerWidth < 768 ? 24 : 44;

if (particlesRoot) {
  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";

    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const driftX = `${(Math.random() - 0.5) * 220}px`;
    const driftY = `${(Math.random() - 0.5) * 240}px`;
    const duration = 6 + Math.random() * 10;
    const delay = Math.random() * -12;
    const size = 1 + Math.random() * 2.4;

    particle.style.left = `${startX}%`;
    particle.style.top = `${startY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.color =
      Math.random() > 0.5 ? "rgba(51,247,255,0.95)" : "rgba(255,60,172,0.95)";
    particle.style.setProperty("--drift-x", driftX);
    particle.style.setProperty("--drift-y", driftY);
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particlesRoot.appendChild(particle);
  }
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

function toast(message) {
  if (!message) return;
  let root = document.querySelector("[data-toast]");
  if (!root) {
    root = document.createElement("div");
    root.className = "toast";
    root.setAttribute("data-toast", "");
    document.body.appendChild(root);
  }
  root.textContent = message;
  root.classList.add("show");
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => {
    root.classList.remove("show");
  }, 1400);
}

const STORAGE_KEYS = {
  scene: "pp_scene",
  identity: "pp_identity"
};

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function safeText(el, text) {
  if (!el) return;
  el.textContent = text;
}

function setScene(scene) {
  document.body.dataset.scene = scene;
  try {
    localStorage.setItem(STORAGE_KEYS.scene, scene);
  } catch {
    // ignore
  }
}

function getSavedScene() {
  try {
    return localStorage.getItem(STORAGE_KEYS.scene);
  } catch {
    return null;
  }
}

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");

let projectFilter = "all";
let projectQuery = "";

function projectText(card) {
  return [
    card.dataset.previewTitle || "",
    card.dataset.previewType || "",
    card.dataset.previewDescription || "",
    card.textContent || ""
  ]
    .join(" ")
    .toLowerCase();
}

function applyProjectFilters() {
  if (!projectCards.length) return;

  const q = projectQuery.trim().toLowerCase();
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const matchFilter = projectFilter === "all" || card.dataset.category === projectFilter;
    const matchQuery = !q || projectText(card).includes(q);
    const show = matchFilter && matchQuery;
    card.classList.toggle("hidden", !show);
    if (show) visibleCount += 1;
  });

  const counter = document.querySelector("[data-project-count]");
  if (counter) {
    counter.textContent = String(visibleCount);
  }

  const active = document.querySelector("[data-project-card].active");
  const activeHidden = active && active.classList.contains("hidden");
  if (!active || activeHidden) {
    const firstVisible = Array.from(document.querySelectorAll("[data-project-card]")).find(
      (el) => !el.classList.contains("hidden")
    );
    if (firstVisible) {
      firstVisible.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    }
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    projectFilter = button.dataset.filter || "all";
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyProjectFilters();
  });
});

document.querySelectorAll("[data-magnetic]").forEach((element) => {
  element.classList.add("magnetic");
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });
  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
});

const sceneButtons = document.querySelectorAll("[data-scene-button]");
const savedScene = getSavedScene();
if (savedScene && document.body.classList.contains("page-home")) {
  setScene(savedScene);
  sceneButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.sceneButton === savedScene);
  });
}

sceneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setScene(button.dataset.sceneButton);
    sceneButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    toast(`主题已切换：${button.textContent.trim()}`);
  });
});

document.querySelectorAll("[data-accordion]").forEach((root) => {
  root.querySelectorAll(".accordion-item").forEach((item, index) => {
    if (index === 0) {
      item.classList.add("open");
    }
  });

  root.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      const alreadyOpen = item.classList.contains("open");
      root.querySelectorAll(".accordion-item").forEach((panel) => panel.classList.remove("open"));
      if (!alreadyOpen) {
        item.classList.add("open");
      }
    });
  });
});

const preview = {
  badge: document.querySelector("[data-preview-badge]"),
  title: document.querySelector("[data-preview-title]"),
  description: document.querySelector("[data-preview-description]"),
  vibe: document.querySelector("[data-meter-vibe]"),
  motion: document.querySelector("[data-meter-motion]"),
  impact: document.querySelector("[data-meter-impact]")
};

document.querySelectorAll("[data-project-card]").forEach((card, index) => {
  if (index === 0) {
    card.classList.add("active");
  }

  const activateCard = () => {
    document.querySelectorAll("[data-project-card]").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");

    safeText(preview.badge, card.dataset.previewType || "");
    safeText(preview.title, card.dataset.previewTitle || "");
    safeText(preview.description, card.dataset.previewDescription || "");
    if (preview.vibe) preview.vibe.style.width = `${clamp(Number(card.dataset.previewVibe || 80), 0, 100)}%`;
    if (preview.motion) preview.motion.style.width = `${clamp(Number(card.dataset.previewMotion || 80), 0, 100)}%`;
    if (preview.impact) preview.impact.style.width = `${clamp(Number(card.dataset.previewImpact || 80), 0, 100)}%`;
  };

  card.addEventListener("mouseenter", activateCard);
  card.addEventListener("click", activateCard);
});

const projectSearch = document.querySelector("[data-project-search]");
if (projectSearch) {
  projectSearch.addEventListener("input", () => {
    projectQuery = projectSearch.value || "";
    applyProjectFilters();
  });
}

const projectRandom = document.querySelector("[data-project-random]");
if (projectRandom) {
  projectRandom.addEventListener("click", () => {
    const visible = Array.from(document.querySelectorAll("[data-project-card]")).filter(
      (el) => !el.classList.contains("hidden")
    );
    if (!visible.length) return;
    const pick = visible[Math.floor(Math.random() * visible.length)];
    pick.scrollIntoView({ behavior: "smooth", block: "center" });
    pick.click();
    toast("已聚焦一个随机项目");
  });
}

if (document.body.classList.contains("page-projects")) {
  // Initialize state from the active filter button.
  const activeFilter = document.querySelector("[data-filter].active");
  if (activeFilter) projectFilter = activeFilter.dataset.filter || "all";
  applyProjectFilters();

  window.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Enter") return;
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;

    const cards = Array.from(document.querySelectorAll("[data-project-card]")).filter(
      (el) => !el.classList.contains("hidden")
    );
    if (!cards.length) return;

    const active = document.querySelector("[data-project-card].active");
    const idx = Math.max(0, cards.indexOf(active));

    if (e.key === "Enter") {
      (active || cards[0]).click();
      return;
    }

    e.preventDefault();
    const next = e.key === "ArrowDown" ? cards[Math.min(cards.length - 1, idx + 1)] : cards[Math.max(0, idx - 1)];
    next.scrollIntoView({ behavior: "smooth", block: "center" });
    next.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
  });
}

const servicePanel = {
  title: document.querySelector("[data-service-title]"),
  description: document.querySelector("[data-service-description]"),
  stats: document.querySelector("[data-service-stats]")
};

document.querySelectorAll("[data-service-button]").forEach((button, index) => {
  if (index === 0) {
    button.classList.add("active");
  }

  button.addEventListener("click", () => {
    document.querySelectorAll("[data-service-button]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    if (servicePanel.title) {
      servicePanel.title.textContent = button.dataset.serviceTitle || "";
      servicePanel.description.textContent = button.dataset.serviceDescription || "";
      servicePanel.stats.innerHTML = "";

      const stats = (button.dataset.serviceStats || "").split("|").filter(Boolean);
      stats.forEach((item) => {
        const chip = document.createElement("span");
        chip.textContent = item;
        servicePanel.stats.appendChild(chip);
      });
    }
  });
});

const briefInput = document.querySelector("#message");
document.querySelectorAll("[data-fill-message]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!briefInput) {
      return;
    }

    const prefix = briefInput.value.trim() ? `${briefInput.value.trim()}\n` : "";
    briefInput.value = `${prefix}${button.dataset.fillMessage}`;
    briefInput.focus();
  });
});

const contactForm = document.querySelector("[data-contact-form]");
const submitNote = document.querySelector("[data-submit-note]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitNote) {
      submitNote.textContent = "signal sent // demo mode only";
    }
    toast("已发送（演示模式）");
  });

  const meterBar = document.querySelector("[data-signal-meter-bar]");
  const meterLabel = document.querySelector("[data-signal-meter-label]");
  const fields = Array.from(contactForm.querySelectorAll("input, textarea, select"));

  const updateMeter = () => {
    const filled = fields.reduce((acc, el) => {
      if (el.tagName === "SELECT") return acc + 1;
      const v = (el.value || "").trim();
      if (!v) return acc;
      if (el.id === "message") return acc + clamp(Math.floor(v.length / 40), 0, 3);
      return acc + 1;
    }, 0);

    const max = 1 + 1 + 1 + 3; // name + email + select + message
    const pct = clamp(Math.round((filled / max) * 100), 0, 100);

    if (meterBar) meterBar.style.width = `${pct}%`;
    if (meterLabel) meterLabel.textContent = `信号强度：${pct}%`;
  };

  fields.forEach((el) => {
    el.addEventListener("input", updateMeter);
    el.addEventListener("change", updateMeter);
  });
  updateMeter();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function todaySeed() {
  const now = new Date();
  // Deterministic per local day.
  return Number(`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`);
}

function seededRand(seed) {
  // Mulberry32
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function burstParticles(count = 12) {
  if (!particlesRoot) return;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle particle-burst";

    const startX = 50 + (Math.random() - 0.5) * 18;
    const startY = 50 + (Math.random() - 0.5) * 18;
    const driftX = `${(Math.random() - 0.5) * 520}px`;
    const driftY = `${(Math.random() - 0.5) * 520}px`;
    const duration = 0.9 + Math.random() * 0.6;
    const size = 1.2 + Math.random() * 2.8;

    particle.style.left = `${startX}%`;
    particle.style.top = `${startY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.color =
      Math.random() > 0.5 ? "rgba(51,247,255,0.95)" : "rgba(255,60,172,0.95)";
    particle.style.setProperty("--drift-x", driftX);
    particle.style.setProperty("--drift-y", driftY);
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = "0s";
    particlesRoot.appendChild(particle);

    window.setTimeout(() => {
      particle.remove();
    }, Math.ceil(duration * 1000) + 50);
  }
}

async function typeLines(root, lines, opts = {}) {
  if (!root) return;
  const speed = opts.speed ?? 18;
  const lineDelay = opts.lineDelay ?? 280;

  root.innerHTML = "";

  for (const line of lines) {
    const p = document.createElement("p");
    p.className = "terminal-line";
    root.appendChild(p);

    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "█";
    p.appendChild(cursor);

    const textNode = document.createTextNode("");
    p.insertBefore(textNode, cursor);

    for (let i = 0; i < line.length; i += 1) {
      textNode.nodeValue += line[i];
      // Slight randomness prevents robotic feel.
      // eslint-disable-next-line no-await-in-loop
      await wait(speed + Math.random() * 22);
    }

    cursor.remove();
    // eslint-disable-next-line no-await-in-loop
    await wait(lineDelay);
  }
}

async function initHomeTerminal() {
  const terminal = document.querySelector("[data-home-terminal]");
  if (!terminal) return;

  const typingRoot = terminal.querySelector("[data-typing-root]");
  const foot = terminal.querySelector("[data-terminal-foot]");
  const status = terminal.querySelector("[data-terminal-status]");

  const lines = [
    "> boot: personal-signal",
    "> mode: visual-first + practical",
    "> stack: HTML / CSS Motion / JS",
    "> signal: online"
  ];

  await typeLines(typingRoot, lines, { speed: 14, lineDelay: 220 });
  safeText(status, "ready");
  safeText(foot, "提示：生成今日信号，或启动扫描");

  const params = new URLSearchParams(window.location.search);
  const run = params.get("run");
  if (run === "daily") {
    const b = document.querySelector("[data-daily-signal]");
    if (b) b.click();
  }
  if (run === "scan") {
    const b = document.querySelector("[data-scan]");
    if (b) b.click();
  }
}

function initDailySignal() {
  const btn = document.querySelector("[data-daily-signal]");
  const terminal = document.querySelector("[data-home-terminal]");
  if (!btn || !terminal) return;

  const foot = terminal.querySelector("[data-terminal-foot]");

  btn.addEventListener("click", () => {
    const rng = seededRand(todaySeed());
    const moods = [
      "高能霓虹",
      "冷静冰蓝",
      "脉冲加速",
      "安静构建",
      "灵感爆发",
      "专注打磨"
    ];
    const focus = [
      "信息层级",
      "动效节奏",
      "组件复用",
      "移动端体验",
      "细节质感"
    ];
    const mood = moods[Math.floor(rng() * moods.length)];
    const f = focus[Math.floor(rng() * focus.length)];
    const score = 72 + Math.floor(rng() * 28);

    safeText(foot, `今日信号：${mood} · Focus=${f} · Power=${score}%`);
    burstParticles(10);
  });
}

function initScanEasterEgg() {
  const btn = document.querySelector("[data-scan]");
  const terminal = document.querySelector("[data-home-terminal]");
  if (!btn || !terminal) return;

  const foot = terminal.querySelector("[data-terminal-foot]");
  let running = false;

  btn.addEventListener("click", async () => {
    if (running) return;
    running = true;
    btn.disabled = true;

    safeText(foot, "扫描中：正在匹配你的气质与节奏...");
    terminal.classList.add("is-scanning");

    const steps = 10;
    for (let i = 1; i <= steps; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await wait(120 + Math.random() * 80);
      terminal.style.setProperty("--scan", `${Math.round((i / steps) * 100)}%`);
    }

    burstParticles(18);
    safeText(foot, "扫描完成：你适合一个更有记忆点的第一屏。");

    await wait(520);
    terminal.classList.remove("is-scanning");
    terminal.style.removeProperty("--scan");
    btn.disabled = false;
    running = false;
  });
}

function initAvatarToggle() {
  const btn = document.querySelector("[data-avatar-toggle]");
  if (!btn) return;

  const saved = (() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.identity);
    } catch {
      return null;
    }
  })();

  if (saved === "alt") {
    btn.textContent = "NK";
    document.body.classList.add("identity-alt");
  }

  btn.addEventListener("click", () => {
    const isAlt = document.body.classList.toggle("identity-alt");
    btn.textContent = isAlt ? "NK" : "NS";
    burstParticles(8);
    try {
      localStorage.setItem(STORAGE_KEYS.identity, isAlt ? "alt" : "base");
    } catch {
      // ignore
    }
  });
}

function initCopyButtons() {
  const buttons = document.querySelectorAll("[data-copy-button]");
  if (!buttons.length) return;

  const doCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older browsers.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
      return ok;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copyValue || "";
      if (!value) return;
      const ok = await doCopy(value);
      button.classList.add("copied");
      button.textContent = ok ? "已复制" : "复制失败";
      if (ok) toast("已复制到剪贴板");
      window.setTimeout(() => {
        button.classList.remove("copied");
        button.textContent = "复制";
      }, 1100);
    });
  });
}

function initAboutMicroInteractions() {
  const shuffle = document.querySelector("[data-tag-shuffle]");
  if (shuffle) {
    shuffle.addEventListener("click", () => {
      const row = document.querySelector(".page-about .tag-row");
      if (!row) return;
      const tags = Array.from(row.querySelectorAll(".tag"));
      for (let i = tags.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        row.insertBefore(tags[j], tags[i]);
      }
      toast("标签已洗牌");
      burstParticles(10);
    });
  }

  const randomBtn = document.querySelector("[data-accordion-random]");
  const accordion = document.querySelector("[data-accordion]");
  if (randomBtn && accordion) {
    randomBtn.addEventListener("click", () => {
      const items = Array.from(accordion.querySelectorAll(".accordion-item"));
      if (!items.length) return;
      const pick = items[Math.floor(Math.random() * items.length)];
      accordion.querySelectorAll(".accordion-item").forEach((panel) => panel.classList.remove("open"));
      pick.classList.add("open");
      pick.scrollIntoView({ behavior: "smooth", block: "center" });
      toast("抽取完成");
      burstParticles(8);
    });
  }
}

function initEstimator() {
  const root = document.querySelector("[data-estimator]");
  if (!root) return;

  const pages = root.querySelector("[data-est-pages]");
  const pagesLabel = root.querySelector("[data-est-pages-label]");
  const urgency = root.querySelector("[data-est-urgency]");
  const urgencyLabel = root.querySelector("[data-est-urgency-label]");
  const complexityButtons = Array.from(root.querySelectorAll("[data-est-complexity]"));

  const outDays = root.querySelector("[data-est-days]");
  const outPrice = root.querySelector("[data-est-price]");
  const outNote = root.querySelector("[data-est-note]");

  let complexity = 2;

  const urgencyText = (v) => {
    if (v <= 1) return "不急";
    if (v === 2) return "正常";
    return "加急";
  };

  const compute = () => {
    const p = clamp(Number(pages?.value || 3), 1, 6);
    const u = clamp(Number(urgency?.value || 2), 1, 3);

    if (pagesLabel) pagesLabel.textContent = String(p);
    if (urgencyLabel) urgencyLabel.textContent = urgencyText(u);

    const baseDays = 3 + p * 2;
    const cMul = 0.85 + complexity * 0.25; // 1..3 => ~1.1..1.6
    const uMul = u === 3 ? 0.85 : u === 1 ? 1.15 : 1;

    const minDays = Math.max(3, Math.round(baseDays * cMul * uMul));
    const maxDays = Math.max(minDays + 2, Math.round((baseDays + 4) * cMul * (uMul + 0.08)));

    const basePrice = 1800 + p * 1600;
    const minPrice = Math.round((basePrice * cMul) / 100) * 100;
    const maxPrice = Math.round((basePrice * (cMul + 0.55)) / 100) * 100;

    if (outDays) outDays.textContent = `${minDays}-${maxDays} 天`;
    if (outPrice) outPrice.textContent = `¥${Math.round(minPrice / 1000)}k - ¥${Math.round(maxPrice / 1000)}k`;
    if (outNote) {
      outNote.textContent =
        complexity >= 3 ? "建议先出风格与组件库，再进入页面填充。" : "建议先做首屏与信息结构，再补齐互动。";
    }
  };

  complexityButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      complexityButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      complexity = clamp(Number(btn.dataset.estComplexity || 2), 1, 3);
      compute();
      burstParticles(8);
    });
  });

  if (pages) pages.addEventListener("input", compute);
  if (urgency) urgency.addEventListener("input", compute);
  compute();
}

function initCommandPalette() {
  const existing = document.querySelector("[data-cmd-overlay]");
  if (existing) return;

  const fab = document.createElement("button");
  fab.type = "button";
  fab.className = "cmd-fab";
  fab.textContent = "Ctrl K";
  fab.setAttribute("aria-label", "Command palette");
  document.body.appendChild(fab);

  const overlay = document.createElement("div");
  overlay.className = "cmd-overlay";
  overlay.setAttribute("data-cmd-overlay", "");
  overlay.setAttribute("hidden", "");

  overlay.innerHTML = `
    <div class="cmd-panel" role="dialog" aria-modal="true" aria-label="Command Palette">
      <div class="cmd-title">
        <span>Command Palette</span>
        <span class="cmd-kbd">Esc</span>
      </div>
      <input class="cmd-input" type="text" placeholder="输入关键词：projects / theme / copy ..." data-cmd-input>
      <div class="cmd-list" data-cmd-list></div>
      <div class="cmd-foot">Tip: ↑↓ 选择，Enter 执行</div>
    </div>
  `;

  document.body.appendChild(overlay);

  const input = overlay.querySelector("[data-cmd-input]");
  const list = overlay.querySelector("[data-cmd-list]");

  const email = (() => {
    const el = document.querySelector("[data-copy]");
    if (el) return el.getAttribute("data-copy") || "hello@your-domain.com";
    return "hello@your-domain.com";
  })();

  const go = (href) => {
    window.location.href = href;
  };

  const commands = [
    { label: "Go: Home", keywords: "home index", run: () => go("index.html") },
    { label: "Go: About", keywords: "about archive", run: () => go("about.html") },
    { label: "Go: Projects", keywords: "projects work", run: () => go("projects.html") },
    { label: "Go: Services", keywords: "services build", run: () => go("services.html") },
    { label: "Go: Contact", keywords: "contact channel", run: () => go("contact.html") },
    { label: "Go: Twin", keywords: "twin ai chat", run: () => go("twin.html") },
    { label: "Theme: Neon", keywords: "theme neon", run: () => setScene("neon") },
    { label: "Theme: Pulse", keywords: "theme pulse", run: () => setScene("pulse") },
    { label: "Theme: Ice", keywords: "theme ice", run: () => setScene("ice") },
    { label: "Copy: Email", keywords: "copy email", run: async () => {
      try {
        await navigator.clipboard.writeText(email);
        toast("已复制到剪贴板");
      } catch {
        toast("复制失败");
      }
    }},
    { label: "Run: 今日信号", keywords: "daily signal", run: () => {
      if (document.body.classList.contains("page-home")) {
        const b = document.querySelector("[data-daily-signal]");
        if (b) b.click();
        return;
      }
      go("index.html?run=daily");
    }},
    { label: "Run: 扫描彩蛋", keywords: "scan easter", run: () => {
      if (document.body.classList.contains("page-home")) {
        const b = document.querySelector("[data-scan]");
        if (b) b.click();
        return;
      }
      go("index.html?run=scan");
    }}
  ];

  let activeIndex = 0;
  let filtered = commands.slice();

  const render = () => {
    if (!list) return;
    list.innerHTML = "";
    filtered.forEach((cmd, idx) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = `cmd-item${idx === activeIndex ? " active" : ""}`;
      item.textContent = cmd.label;
      item.addEventListener("click", () => {
        cmd.run();
        close();
      });
      list.appendChild(item);
    });
  };

  const refilter = () => {
    const q = (input.value || "").trim().toLowerCase();
    filtered = !q
      ? commands.slice()
      : commands.filter((c) => `${c.label} ${c.keywords}`.toLowerCase().includes(q));
    activeIndex = 0;
    render();
  };

  const open = () => {
    overlay.removeAttribute("hidden");
    document.body.classList.add("cmd-open");
    input.value = "";
    refilter();
    input.focus();
  };

  const close = () => {
    overlay.setAttribute("hidden", "");
    document.body.classList.remove("cmd-open");
  };

  fab.addEventListener("click", open);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  input.addEventListener("input", refilter);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(filtered.length - 1, activeIndex + 1);
      render();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(0, activeIndex - 1);
      render();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) cmd.run();
      close();
    }
  });

  window.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open();
    }
    if (e.key === "Escape" && document.body.classList.contains("cmd-open")) {
      e.preventDefault();
      close();
    }
  });
}

function initTwinChat() {
  const root = document.querySelector("[data-twin]");
  if (!root) return;

  const log = root.querySelector("[data-twin-log]");
  const form = root.querySelector("[data-twin-form]");
  const input = root.querySelector("[data-twin-input]");
  const exportBtn = root.querySelector("[data-twin-export]");
  const clearBtn = root.querySelector("[data-twin-clear]");
  const suggestButtons = Array.from(root.querySelectorAll("[data-twin-suggest]"));
  const toneButtons = Array.from(root.querySelectorAll("[data-twin-tone]"));

  const HISTORY_KEY = "pp_twin_history";
  const TONE_KEY = "pp_twin_tone";

  const nowTs = () => Date.now();

  const load = () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter((m) => m && (m.role === "user" || m.role === "twin") && typeof m.text === "string");
    } catch {
      return [];
    }
  };

  const save = (messages) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      // ignore
    }
  };

  const getTone = () => {
    try {
      return localStorage.getItem(TONE_KEY) || "sharp";
    } catch {
      return "sharp";
    }
  };

  const setTone = (tone) => {
    try {
      localStorage.setItem(TONE_KEY, tone);
    } catch {
      // ignore
    }
  };

  const scrollToBottom = () => {
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  };

  const addBubble = (msg, opts = {}) => {
    if (!log) return null;
    const bubble = document.createElement("div");
    bubble.className = `bubble ${msg.role}`;
    if (opts.typing) bubble.classList.add("typing");

    const body = document.createElement("div");
    body.className = "bubble-body";
    body.textContent = msg.text;

    const meta = document.createElement("div");
    meta.className = "bubble-meta";
    const t = new Date(msg.ts || nowTs());
    meta.textContent = `${msg.role === "user" ? "you" : "twin"} · ${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;

    bubble.appendChild(body);
    bubble.appendChild(meta);
    log.appendChild(bubble);
    scrollToBottom();
    return bubble;
  };

  const makeReply = (text, ctx) => {
    const tone = ctx.tone;
    const s = text.toLowerCase();

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const pre = () => {
      if (tone === "warm") return pick(["好，我来快速帮你捋一下。", "可以的，我先给你一个清晰版本。", "行，我们用最短路径对齐。"]);
      if (tone === "nerd") return pick(["OK，先把问题拆成可执行的几个点。", "我按信息结构和交互策略回答。", "先定目标函数，再选实现路径。"]);
      return pick(["直接说重点。", "我给你一个可执行的答案。", "用最短路径回答："]);
    };

    const follow = () => {
      if (tone === "warm") return pick(["你更偏哪种风格？", "有参考链接吗？", "上线时间大概是什么时候？"]);
      if (tone === "nerd") return pick(["目标用户是谁？转化动作是什么？", "预算/工期约束是多少？", "你希望动效偏强还是偏稳？"]);
      return pick(["你的上线时间？", "有参考吗？", "预算范围？"]);
    };

    if (s.includes("/glitch") || s.includes("彩蛋") || s.includes("easter")) {
      burstParticles(16);
      return `${pre()}\n已触发彩蛋指令。试试：Ctrl+K 打开命令面板，或去首页点“扫描”。`;
    }

    if (/(报价|预算|多少钱|价格|收费)/.test(text)) {
      return `${pre()}\n如果你只想先拿到范围：去 Build 页的估算器调一下“页数/紧急度/复杂度”，可以秒出一个区间。\n${follow()}`;
    }

    if (/(合作|流程|怎么做|交付|排期)/.test(text)) {
      return `${pre()}\n简版流程：\n1) 对齐目标与参考（15-30 分钟）\n2) 先做首屏与信息结构\n3) 再把组件与动效节奏压进去\n4) 最后补齐移动端与细节反馈\n${follow()}`;
    }

    if (/(擅长|技能|栈|会什么|能做什么)/.test(text)) {
      return `${pre()}\n我更擅长三类：\n- Landing：第一屏记忆点 + 清晰转化\n- 作品集系统：筛选/预览/信息层级\n- 多页品牌站：统一视觉语言 + 可维护组件\n${follow()}`;
    }

    if (/(主页|个人主页|portfolio|作品集)/.test(text)) {
      return `${pre()}\n给你 3 个方向：\n1) “强首屏”路线：字效 + 氛围背景 + 2 个 CTA\n2) “项目优先”路线：上来就筛选+预览，像系统\n3) “故事路线”：少字但有节奏，把经历拆成片段\n你更偏哪一个？`;
    }

    if (/(项目|作品|case|案例)/.test(text)) {
      return `${pre()}\n看项目时我建议你只保留这 3 件事：做了什么、为什么这么做、效果如何。\n如果你愿意，把一个项目一句话丢给我，我帮你改成更“像作品”的描述。`;
    }

    if (/(一句话|brief|需求|整理)/.test(text)) {
      return `${pre()}\n把你的需求按这个模板给我：\n- 目标：\n- 受众：\n- 风格关键词（3 个）：\n- 参考（可选）：\n- 上线时间：\n我可以把它压缩成一句话 brief。`;
    }

    return `${pre()}\n我收到的是：${text.trim() || "（空）"}\n${follow()}`;
  };

  let messages = load();
  if (!messages.length) {
    messages = [
      { role: "twin", text: "你好，我是你的 AI 分身（演示版）。你可以问我：擅长什么、合作流程、主页建议、预算区间。", ts: nowTs() }
    ];
    save(messages);
  }

  const tone = getTone();
  toneButtons.forEach((b) => b.classList.toggle("active", b.dataset.twinTone === tone));

  messages.forEach((m) => addBubble(m));

  const send = async (text) => {
    const trimmed = (text || "").trim();
    if (!trimmed) return;

    const userMsg = { role: "user", text: trimmed, ts: nowTs() };
    messages.push(userMsg);
    addBubble(userMsg);
    save(messages);

    const typingMsg = { role: "twin", text: "…", ts: nowTs() };
    const typingEl = addBubble(typingMsg, { typing: true });

    const delay = 380 + Math.min(900, trimmed.length * 12);
    await wait(delay);

    const replyText = makeReply(trimmed, { tone: getTone(), messages });
    const replyMsg = { role: "twin", text: replyText, ts: nowTs() };
    messages.push(replyMsg);

    if (typingEl) typingEl.remove();
    addBubble(replyMsg);
    save(messages);
    burstParticles(6);
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!input) return;
      const v = input.value;
      input.value = "";
      send(v);
    });
  }

  suggestButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      send(btn.dataset.twinSuggest || btn.textContent || "");
    });
  });

  toneButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toneButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      setTone(btn.dataset.twinTone || "sharp");
      toast("已切换语气");
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      messages = [{ role: "twin", text: "记录已清空。你想从哪里开始？", ts: nowTs() }];
      if (log) log.innerHTML = "";
      messages.forEach((m) => addBubble(m));
      save(messages);
      toast("已清空");
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", async () => {
      const text = messages
        .map((m) => `${m.role === "user" ? "You" : "Twin"}: ${m.text}`)
        .join("\n\n");
      try {
        await navigator.clipboard.writeText(text);
        toast("已复制对话记录");
      } catch {
        toast("导出失败");
      }
    });
  }

  if (input) input.focus();
}

initHomeTerminal();
initDailySignal();
initScanEasterEgg();
initAvatarToggle();
initCopyButtons();
initAboutMicroInteractions();
initEstimator();
initCommandPalette();
initTwinChat();
