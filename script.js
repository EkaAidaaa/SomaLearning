document.documentElement.classList.add("js");
const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; };
const tombol = (txt, fn, cls = "btn") => { const b = el("button", cls, txt); b.onclick = fn; return b; };

/* ===== Efek langit ===== */
const sparks = document.getElementById("sparks");
for (let i = 0; i < 20; i++) {
  const s = el("i", "spark");
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 70}%;animation-delay:${Math.random() * 4}s;animation-duration:${2 + Math.random() * 3}s`;
  sparks.append(s);
}
addEventListener("scroll", () => document.documentElement.style.setProperty("--sy", scrollY * 0.1 + "px"), { passive: true });

/* Anak tangga muncul saat di-scroll */
const langkahEl = document.querySelectorAll(".step");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
  langkahEl.forEach((s) => io.observe(s));
} else {
  langkahEl.forEach((s) => s.classList.add("in"));
}

/* Bar progres scroll */
const bar = document.getElementById("bar");
addEventListener("scroll", () => {
  const h = document.documentElement;
  const p = Math.min(1, scrollY / Math.max(1, h.scrollHeight - innerHeight));
  bar.style.width = p * 100 + "%";
  h.style.setProperty("--p", p);
}, { passive: true });

/* ===== SOLO ===== */
const SOLO = [
  { nama: "Prestructural", arti: "Siswa belum paham dan belum bisa menjawab dengan benar.", contoh: "Menyebut kata acak yang tidak berhubungan dengan pertanyaan." },
  { nama: "Unistructural", arti: "Siswa paham satu bagian saja dari materi.", contoh: "Bisa menyebut satu kata kerja bentuk lampau." },
  { nama: "Multistructural", arti: "Siswa tahu beberapa bagian, tapi belum menghubungkannya.", contoh: "Bisa menyebut beberapa kata kerja lampau, tapi belum tahu aturan pemakaiannya." },
  { nama: "Relational", arti: "Siswa menghubungkan bagian-bagian menjadi satu pola.", contoh: "Menjelaskan mengapa 'She visited' berubah menjadi 'She didn't visit'." },
  { nama: "Extended Abstract", arti: "Siswa menerapkan pemahaman ke situasi baru.", contoh: "Menceritakan pengalamannya sendiri dengan runtut memakai Simple Past Tense." }
];
const tombolSolo = document.querySelectorAll(".lv"), panelSolo = document.getElementById("solo-panel");
function pilihSolo(i) {
  tombolSolo.forEach((b, n) => { b.classList.toggle("on", n === i); b.setAttribute("aria-selected", n === i); });
  const s = SOLO[i];
  panelSolo.innerHTML = `<h3>${s.nama}</h3><p>${s.arti}</p><p><em>Contoh: ${s.contoh}</em></p>`;
}
tombolSolo.forEach((b) => b.addEventListener("click", () => pilihSolo(Number(b.dataset.i))));
pilihSolo(3);

/* ===== Jendela kartu ===== */
const dlg = document.getElementById("game"), box = document.getElementById("game-box"), ttl = document.getElementById("game-title");

/* M - Moving: kartu Positive / Negative / Question */
const KARTU = [
  { cue: "she · visit · Bali · last year", p: "She visited Bali last year.", n: "She didn't visit Bali last year.", q: "Did she visit Bali last year?" },
  { cue: "they · play · football · yesterday", p: "They played football yesterday.", n: "They didn't play football yesterday.", q: "Did they play football yesterday?" },
  { cue: "he · watch · a movie · last night", p: "He watched a movie last night.", n: "He didn't watch a movie last night.", q: "Did he watch a movie last night?" },
  { cue: "my mother · cook · rice · this morning", p: "My mother cooked rice this morning.", n: "My mother didn't cook rice this morning.", q: "Did my mother cook rice this morning?" },
  { cue: "we · clean · the classroom · yesterday", p: "We cleaned the classroom yesterday.", n: "We didn't clean the classroom yesterday.", q: "Did we clean the classroom yesterday?" },
  { cue: "Dina · buy · a new book · last week", p: "Dina bought a new book last week.", n: "Dina didn't buy a new book last week.", q: "Did Dina buy a new book last week?" }
];
function moving() {
  let last = -1;
  (function tampil() {
    let k; do { k = Math.floor(Math.random() * KARTU.length); } while (k === last); last = k;
    const d = KARTU[k]; box.innerHTML = "";
    const row = el("div", "cards3");
    [["g", "🟢 Positive", d.p], ["r", "🔴 Negative", d.n], ["y", "🟡 Question", d.q]].forEach(([c, label, jawab]) => {
      const b = el("button", "pcard " + c);
      const ans = el("span", "ans", "Klik untuk lihat contoh");
      b.append(el("strong", "", label), ans);
      b.onclick = () => { ans.textContent = jawab; b.classList.add("open"); };
      row.append(b);
    });
    box.append(
      el("p", "muted", "Siswa bergiliran memilih warna dan membuat kalimat. Teman berikutnya mengubah kalimat yang sama sesuai warna pilihannya."),
      el("div", "cue", "Kata kunci: " + d.cue), row,
      tombol("Kalimat baru", tampil),
      el("p", "muted small", "Tujuan: melatih kolaborasi, kecepatan berpikir, dan kemampuan mengubah bentuk kalimat Simple Past Tense.")
    );
  })();
}

/* A - Articulating: Group Storytelling */
const TOPIK = ["My Unforgettable Trip to the Beach", "A Day at the Zoo", "My First Day at a New School", "The Best Day of My Life"];
const LANGKAH = [
  ["First", "Ceritakan kejadian pertama."],
  ["Then", "Ceritakan kejadian berikutnya."],
  ["Before that", "Jelaskan kejadian yang berlangsung sebelumnya."],
  ["After that", "Ceritakan apa yang terjadi sesudahnya."],
  ["Finally", "Ceritakan kejadian terakhir atau akhir pengalaman."]
];
const KRITERIA = ["Cerita disampaikan dengan runtut.", "Kata kerja bentuk lampau dipakai dengan tepat.", "Lima kata penghubung dipakai: first, then, before that, after that, finally.", "Siswa bekerja sama dan percaya diri saat presentasi kelompok."];
function kriteria() { const u = el("ul", "krit"); KRITERIA.forEach((k) => u.append(el("li", "", k))); return u; }
function articulating() {
  const pilihTopik = () => {
    box.innerHTML = "";
    const g = el("div", "topics");
    TOPIK.forEach((t, i) => { const b = el("button", "topic", `${i + 1}. ${t}`); b.onclick = () => langkah(t, 0); g.append(b); });
    box.append(el("p", "muted", "Setiap kelompok memilih satu topik, berdiskusi, menyusun cerita, lalu bercerita bergiliran di depan kelas dengan Simple Past Tense."), g, el("p", "muted", "Kriteria keberhasilan:"), kriteria());
  };
  const langkah = (t, i) => {
    box.innerHTML = "";
    const [w, d] = LANGKAH[i], dots = el("div", "dots");
    LANGKAH.forEach((_, n) => dots.append(el("i", n === i ? "on" : "")));
    const card = el("div", "stepcard"); card.append(el("div", "w", w + "..."), el("p", "", d), dots);
    box.append(el("p", "muted", "Topik: " + t), card);
    box.append(i > 0 ? tombol("Sebelumnya", () => langkah(t, i - 1), "btn alt") : tombol("Ganti topik", pilihTopik, "btn alt"));
    box.append(i < LANGKAH.length - 1 ? tombol("Berikutnya", () => langkah(t, i + 1)) : tombol("Selesai", pilihTopik));
  };
  pilihTopik();
}

const GAME = { moving: ["Moving: Kartu Warna", moving], articulating: ["Articulating: Group Storytelling", articulating] };
document.querySelectorAll("[data-game]").forEach((c) => c.addEventListener("click", () => {
  const [judul, mulai] = GAME[c.dataset.game];
  ttl.textContent = judul; dlg.dataset.game = c.dataset.game; dlg.showModal(); mulai();
}));
document.getElementById("game-close").onclick = () => dlg.close();
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener("close", () => { box.innerHTML = ""; });

/* Efek bintang saat layar disentuh/diklik */
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addEventListener("pointerdown", (e) => {
    for (let i = 0; i < 7; i++) {
      const s = el("span", "pop", ["✨", "⭐", "💫"][i % 3]), a = (Math.PI * 2 * i) / 7, d = 40 + Math.random() * 30;
      s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
      s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d + "px");
      document.body.append(s); setTimeout(() => s.remove(), 800);
    }
  });
}
