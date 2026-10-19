(function () {
  const form = document.getElementById("cardForm");
  const canvas = document.getElementById("card");
  const FIELDS = ["name", "education", "designation", "phone", "email", "companyEmail"];
  const STORAGE_KEY = "decor-card-maker";

  const SAMPLE = {
    name: "Md. Mahinur Rashid",
    education: "B.Sc (EEE)",
    designation: "Assistant Manager\nengineering & business development",
    phone: "01708-801850",
    email: "mahinr.decor@gmail.com",
    companyEmail: "info@decor-bd.com",
  };

  let template = null;

  function readForm() {
    const d = {};
    FIELDS.forEach((f) => (d[f] = form.elements[f].value));
    return d;
  }

  function fillForm(d) {
    FIELDS.forEach((f) => (form.elements[f].value = d[f] ?? ""));
  }

  function save(d) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (e) {}
  }

  function restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /* Allow pre-filled links, e.g. ?name=...&phone=... */
  function fromQuery() {
    const q = new URLSearchParams(location.search);
    if (![...q.keys()].length) return null;
    const d = { ...SAMPLE };
    FIELDS.forEach((f) => { if (q.has(f)) d[f] = q.get(f).replace(/\\n|\|/g, "\n"); });
    return d;
  }

  let pending = false;
  function render() {
    if (!template || pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      const d = readForm();
      drawCard(canvas, template, d);
      save(d);
    });
  }

  function fileName() {
    const n = form.elements.name.value.trim() || "card";
    return "DECOR-card-" + n.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") + ".png";
  }

  function download() {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, "image/png");
  }

  form.addEventListener("input", render);
  document.getElementById("downloadBtn").addEventListener("click", download);
  document.getElementById("sampleBtn").addEventListener("click", () => { fillForm(SAMPLE); render(); });
  document.getElementById("clearBtn").addEventListener("click", () => {
    fillForm({ companyEmail: SAMPLE.companyEmail });
    render();
  });

  fillForm(fromQuery() || restore() || SAMPLE);

  Promise.all([loadImage("assets/card-front-template.png"), loadCardFonts()])
    .then(([img]) => {
      template = img;
      render();
      document.body.classList.add("ready");
    })
    .catch((err) => {
      console.error(err);
      alert("Could not load the card template. Make sure the 'assets' folder was uploaded.");
    });
})();
