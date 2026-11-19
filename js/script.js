/* =====================================================================
   Sálvia Studio · comportamento da página
   Links do WhatsApp, abas de serviços, barrinha das áreas, animações,
   menu do celular, barra fixa e conversa simulada.
   Os dados (número, mensagens, conversa) ficam em js/config.js.
   ===================================================================== */
(() => {

  const d = document, h = d.documentElement;
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // links do WhatsApp com o nome do serviço na mensagem
  d.querySelectorAll("[data-zap]").forEach(a => {
    a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(CONFIG.mensagem(a.dataset.servico));
  });

  // abas da carta de serviços (setas, Home/End; #ancora abre a área)
  const abas = [...d.querySelectorAll('[role="tab"]')];
  function desenha(p) { if (reduz || !p) return; p.classList.remove("desenha"); void p.offsetWidth; p.classList.add("desenha"); }
  function abre(aba, foco, quem = true) {
    abas.forEach(b => {
      const sel = b === aba, p = d.getElementById(b.getAttribute("aria-controls"));
      b.setAttribute("aria-selected", sel); b.tabIndex = sel ? 0 : -1;
      p.hidden = !sel; p.classList.toggle("mostra", sel && !reduz); if (sel && quem) desenha(p);
    });
    if (foco) aba.focus();
    aba.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  abas.forEach((b, i) => {
    b.addEventListener("click", () => { abre(b); history.replaceState(null, "", "#" + b.getAttribute("aria-controls")); });
    b.addEventListener("keydown", e => {
      const n = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: abas.length - 1 }[e.key];
      if (n === undefined) return;
      e.preventDefault(); abre(abas[(n + abas.length) % abas.length], true);
    });
  });
  const daAncora = () => { const a = abas.find(b => "#" + b.getAttribute("aria-controls") === location.hash); if (a) { abre(a); d.getElementById("servicos").scrollIntoView(); } };
  daAncora(); addEventListener("hashchange", daAncora);

  // barrinha das áreas: mostra que há mais áreas para deslizar e onde você está
  (() => {
    const lista = d.querySelector(".areas");
    const atualiza = () => {
      const max = lista.scrollWidth - lista.clientWidth;
      lista.classList.toggle("sem-rolagem", max <= 2);
      if (max <= 2) { lista.classList.remove("mais-esq", "mais-dir"); return; }
      lista.style.setProperty("--tam", (lista.clientWidth / lista.scrollWidth).toFixed(3));
      lista.style.setProperty("--pos", (lista.scrollLeft / max).toFixed(3));
      lista.classList.toggle("mais-esq", lista.scrollLeft > 4);
      lista.classList.toggle("mais-dir", lista.scrollLeft < max - 4);
    };
    lista.addEventListener("scroll", atualiza, { passive: true });
    addEventListener("resize", atualiza); addEventListener("load", atualiza); atualiza();
  })();

  // animações: fotos ao rolar e pontilhado da carta
  if (!reduz && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
    d.querySelectorAll(".revela").forEach(el => io.observe(el));
    d.querySelectorAll(".painel").forEach(p => p.querySelectorAll(".item").forEach((li, i) => li.style.setProperty("--i", i)));
    const carta = d.querySelector(".carta");
    const ioCarta = new IntersectionObserver(es => { if (es[0].isIntersecting) { desenha(d.querySelector(".painel:not([hidden])")); ioCarta.disconnect(); } }, { rootMargin: "0px 0px -20% 0px" });
    ioCarta.observe(carta);
  } else d.querySelectorAll(".revela").forEach(el => el.classList.add("vis"));

  // menu do celular
  const topo = d.querySelector(".topo"), btnMenu = d.querySelector(".menu-btn");
  const alterna = abrir => { topo.classList.toggle("aberto", abrir); btnMenu.setAttribute("aria-expanded", abrir); btnMenu.querySelector(".sr").textContent = abrir ? "Fechar menu" : "Abrir menu"; };
  btnMenu.addEventListener("click", () => alterna(!topo.classList.contains("aberto")));
  d.querySelectorAll(".menu a").forEach(a => a.addEventListener("click", () => alterna(false)));
  addEventListener("keydown", e => { if (e.key === "Escape" && topo.classList.contains("aberto")) { alterna(false); btnMenu.focus(); } });

  // barra fixa do celular: aparece depois do hero e some no contato
  const barra = d.getElementById("barra"); let heroVe = true, fimVe = false;
  new IntersectionObserver(es => { es.forEach(e => { if (e.target.id === "inicio") heroVe = e.isIntersecting; else fimVe = e.isIntersecting; }); barra.classList.toggle("on", !heroVe && !fimVe); })
    .observe(d.getElementById("inicio"));
  new IntersectionObserver(es => { es.forEach(e => { fimVe = e.isIntersecting; }); barra.classList.toggle("on", !heroVe && !fimVe); })
    .observe(d.getElementById("contato"));

  // conversa: presa na tela enquanto a página rola; cada trecho (PX) revela uma mensagem
  (() => {
    const caixa = d.querySelector(".conversa"); if (!caixa) return;
    const trilho = caixa.parentElement, fio = caixa.querySelector(".fio"), prog = caixa.querySelector(".trilha b"),
          dica = caixa.querySelector(".chat-dica"), status = caixa.querySelector(".chat-status");
    const L = CONFIG.conversa, INICIO = 2, PX = 120; let vistas = 0;
    function mostra(n) {
      n = Math.max(0, Math.min(L.length, n));
      if (n === vistas && fio.children.length) return;
      if (n < vistas) { fio.replaceChildren(); vistas = 0; }
      const anima = n === vistas + 1;
      for (; vistas < n; vistas++) {
        const [quem, txt] = L[vistas], b = d.createElement("div");
        b.className = "bolha " + quem; b.textContent = txt; if (!anima) b.style.animation = "none"; fio.appendChild(b);
      }
      fio.querySelector(".digitando")?.remove();
      const prox = L[vistas];
      if (prox && prox[0] === "ela") { const t = d.createElement("div"); t.className = "bolha ela digitando"; t.setAttribute("aria-hidden", "true"); t.innerHTML = "<i></i><i></i><i></i>"; fio.appendChild(t); }
      status.textContent = prox && prox[0] === "ela" ? "digitando…" : "Responde pelo WhatsApp";
      prog.style.width = Math.round(vistas / L.length * 100) + "%";
      dica.textContent = vistas >= L.length ? "Pronto: horário confirmado pelo WhatsApp." : "Role a página para acompanhar a conversa";
    }
    if (reduz) { mostra(L.length); return; }
    let cima = 100;
    function mede() {
      cima = topo.offsetHeight + 20;
      const baixo = getComputedStyle(barra).display !== "none" ? barra.offsetHeight : 0;
      fio.style.height = "";
      const resto = caixa.offsetHeight - fio.offsetHeight;
      fio.style.height = Math.max(200, Math.min(400, innerHeight - cima - baixo - 20 - resto)) + "px";
      h.style.setProperty("--cola", cima + "px");
      const texto = d.querySelector(".agenda-texto");   // só gruda se couber inteiro na tela
      texto?.classList.toggle("acompanha", texto.offsetHeight <= innerHeight - cima - baixo - 20);
      trilho.style.height = caixa.offsetHeight + (L.length - INICIO) * PX + "px";
    }
    let pedido = 0;
    const rola = () => { pedido = 0; mostra(INICIO + Math.floor(Math.max(0, cima - trilho.getBoundingClientRect().top) / PX)); };
    const agenda = () => { if (!pedido) pedido = requestAnimationFrame(rola); };
    mede(); mostra(INICIO); rola();
    addEventListener("scroll", agenda, { passive: true });
    addEventListener("resize", () => { mede(); agenda(); });
    addEventListener("load", () => { mede(); agenda(); });
  })();
})();
