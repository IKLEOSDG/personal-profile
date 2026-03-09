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

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !match);
    });
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
sceneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.dataset.scene = button.dataset.sceneButton;
    sceneButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
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
    if (preview.badge) {
      preview.badge.textContent = card.dataset.previewType || "";
      preview.title.textContent = card.dataset.previewTitle || "";
      preview.description.textContent = card.dataset.previewDescription || "";
      preview.vibe.style.width = `${card.dataset.previewVibe || 80}%`;
      preview.motion.style.width = `${card.dataset.previewMotion || 80}%`;
      preview.impact.style.width = `${card.dataset.previewImpact || 80}%`;
    }
  };

  card.addEventListener("mouseenter", activateCard);
  card.addEventListener("click", activateCard);
});

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
  });
}
