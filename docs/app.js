(() => {
  /* Única fuente de estas dos URLs: cámbialas aquí cuando haga falta. */
  const PORTFOLIO_URL = "https://gatroxm-dev.onrender.com/";
  const EMAIL = "tavoxpau@gmail.com";

  document.querySelectorAll("[data-portfolio-link]").forEach((link) => {
    link.href = PORTFOLIO_URL;
    link.removeAttribute("aria-disabled");
  });

  document.querySelectorAll("[data-email-link]").forEach((link) => {
    link.href = `mailto:${EMAIL}`;
    link.textContent = EMAIL;
  });

  const copyButton = document.querySelector("[data-copy-email]");
  const toast = document.querySelector("[data-toast]");
  let toastTimer = 0;

  const showToast = (message) => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("show"));
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
      window.setTimeout(() => { toast.hidden = true; }, 200);
    }, 2200);
  };

  const copyWithFallback = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  };

  copyButton?.addEventListener("click", async () => {
    try {
      await copyWithFallback(EMAIL);
      showToast("Correo copiado");
    } catch {
      showToast("No se pudo copiar. Usa el enlace de correo.");
    }
  });
})();
