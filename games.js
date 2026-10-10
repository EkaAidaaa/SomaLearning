// Buat jendela game otomatis kalau belum ada di index.html
if (!document.getElementById("game")) {
  document.body.insertAdjacentHTML("beforeend",
    '<dialog id="game"><div class="game-head"><h2 id="game-title"></h2><button class="x" id="game-close" aria-label="Tutup">&times;</button></div><div id="game-box"></div></dialog>');
}
const dlg = document.getElementById("game");
const box = document.getElementById("game-box");
const ttl = document.getElementById("game-title");

const acak = (a) => [...a].sort(() => Math.random() - 0.5);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };
const tombol = (txt, fn, cls = "btn") => { const b = el("button", cls, txt); b.onclick = fn; return b; };

function selesai(skor, total, ulang) {
  box.innerHTML = "";
  box.append(
    el("h3", "", `Skor kamu ${skor} dari ${total}`),
    el("p", "", skor === total ? "Sempurna! Kamu hebat." : "Bagus! Main lagi supaya makin lancar."),
    tombol("Main lagi", ulang)
  );
}

/* S - Sensing: lihat gambar, pilih kalimat yang cocok */
const GAMBAR = [
  { e: "🐱💤", o: ["The cat is sleeping.", "The cat is eating.", "The cat is running."] },
  { e: "👧📖", o: ["She is reading a book.", "She is drawing a book.", "She is buying a book."] },
  { e: "🌧️☂️", o: ["It is raining.", "It is sunny.", "It is snowing."] },
  { e: "👨‍🍳🍳", o: ["He is cooking.", "He is swimming.", "He is singing."] },
  { e: "🧒⚽", o: ["He is playing football.", "He is playing guitar.", "He is washing a car."] },
  { e: "🚌🏫", o: ["The bus goes to school.", "The bus goes to the beach.", "The bus goes to the market."] }
];
function sensing() {
  const soal = acak(GAMBAR).slice(0, 5); let i = 0, skor = 0;
  (function tampil() {
    if (i === soal.length) return selesai(skor, soal.length, sensing);
    const s = soal[i]; box.innerHTML = "";
    const fb = el("p", "fb"), wrap = el("div", "opts");
    acak(s.o).forEach((t) => {
      wrap.append(tombol(t, function () {
        [...wrap.children].forEach((x) => { x.disabled = true; if (x.textContent === s.o[0]) x.classList.add("ok"); });
        if (t === s.o[0]) { skor++; fb.textContent = "Benar!"; }
        else { this.classList.add("no"); fb.textContent = "Jawaban yang tepat: " + s.o[0]; }
        box.append(tombol(i === soal.length - 1 ? "Lihat skor" : "Lanjut", () => { i++; tampil(); }));
      }, "opt"));
    });
    box.append(el("p", "muted", `Soal ${i + 1} dari ${soal.length}. Perhatikan gambarnya, lalu pilih kalimat yang cocok.`), el("div", "big", s.e), wrap, fb);
  })();
}

/* O - Organizing: susun kata jadi kalimat */
const KALIMAT = ["She goes to school every day.", "They are playing football now.", "My brother likes reading books.", "I drink milk every morning.", "We are learning English today."];
function organizing() {
  const soal = acak(KALIMAT).slice(0, 4); let i = 0, skor = 0;
  (function tampil() {
    if (i === soal.length) return selesai(skor, soal.length, organizing);
    const k = soal[i]; box.innerHTML = "";
    const slot = el("div", "slots"), bank = el("div", "bank"), fb = el("p", "fb");
    acak(k.split(" ")).forEach((w) => {
      const c = el("button", "chip", w);
      c.onclick = () => (c.parentNode === bank ? slot : bank).append(c);
      bank.append(c);
    });
    const cek = tombol("Cek jawaban", () => {
      const j = [...slot.children].map((c) => c.textContent).join(" ");
      if (j === k) { skor++; fb.textContent = "Benar! Urutan katanya sudah tepat."; }
      else fb.textContent = "Belum tepat. Urutan yang benar: " + k;
      cek.remove();
      box.append(tombol(i === soal.length - 1 ? "Lihat skor" : "Lanjut", () => { i++; tampil(); }));
    });
    box.append(el("p", "muted", `Kalimat ${i + 1} dari ${soal.length}. Klik kata untuk memindahkannya ke kotak jawaban.`), slot, bank, cek, fb);
  })();
}

/* M - Moving: Simon Says */
const AKSI = ["touch your head", "clap your hands", "stand up", "jump", "touch your nose", "turn around", "sit down", "wave your hand"];
function moving() {
  let r = 0, skor = 0; const total = 8;
  (function tampil() {
    if (r === total) return selesai(skor, total, moving);
    const a = AKSI[Math.floor(Math.random() * AKSI.length)], pakai = Math.random() < 0.6;
    const teks = pakai ? "Simon says " + a + "." : a[0].toUpperCase() + a.slice(1) + ".";
    box.innerHTML = "";
    const fb = el("p", "fb"), row = el("div", "row");
    const jawab = (lakukan) => {
      [...row.children].forEach((b) => (b.disabled = true));
      const benar = lakukan === pakai;
      if (benar) skor++;
      fb.textContent = benar ? "Tepat!" : pakai ? "Harusnya lakukan, karena ada 'Simon says'." : "Harusnya diam, karena tidak ada 'Simon says'.";
      r++; setTimeout(tampil, 1400);
    };
    row.append(tombol("Lakukan!", () => jawab(true), "opt ok-btn"), tombol("Diam!", () => jawab(false), "opt no-btn"));
    box.append(el("p", "muted", `Ronde ${r + 1} dari ${total}. Gerakkan badanmu hanya kalau ada "Simon says".`), el("div", "cmd", teks), row, fb);
  })();
}

/* A - Articulating: bicara dan menulis dengan kata sendiri */
const TOPIK = ["Describe your morning.", "Tell us about your family.", "What do you do on weekends?", "Describe your best friend.", "What is your favorite food?"];
const AWAL = ["Every day, I", "I like", "Then, I", "My favorite is", "Because"];
function articulating() {
  const t = TOPIK[Math.floor(Math.random() * TOPIK.length)]; box.innerHTML = "";
  const area = el("textarea"); area.rows = 5; area.placeholder = "Tulis 3 kalimat bahasa Inggris di sini...";
  const awal = el("div", "bank");
  AWAL.forEach((w) => awal.append(tombol(w, () => { area.value += (area.value && !area.value.endsWith(" ") ? " " : "") + w + " "; area.focus(); }, "chip")));
  const row = el("div", "row");
  if ("speechSynthesis" in window) {
    row.append(tombol("Dengarkan tulisanku", () => {
      if (!area.value.trim()) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(area.value); u.lang = "en-US"; speechSynthesis.speak(u);
    }));
  }
  row.append(tombol("Topik baru", articulating, "btn alt"));
  box.append(el("p", "muted", "Ceritakan dengan kata-katamu sendiri, lalu bacakan keras-keras."), el("div", "cmd", t), el("p", "muted", "Mulai dengan kalimat pembuka ini:"), awal, area, row,
    el("p", "muted", "Tantangan: pakai minimal satu kata kerja dan satu kata penghubung (and, but, because)."));
}

const GAME = {
  sensing: ["Sensing: Look & Pick", sensing],
  organizing: ["Organizing: Susun Kalimat", organizing],
  moving: ["Moving: Simon Says", moving],
  articulating: ["Articulating: Ceritakan", articulating]
};

document.querySelectorAll(".cloud").forEach((c) => {
  c.addEventListener("click", (e) => {
    e.preventDefault();
    const kunci = c.dataset.game || c.getAttribute("href").replace("#", "");
    const [judul, mulai] = GAME[kunci];
    ttl.textContent = judul;
    dlg.dataset.game = kunci;
    dlg.showModal();
    mulai();
  });
});
document.getElementById("game-close").onclick = () => dlg.close();
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener("close", () => { box.innerHTML = ""; if ("speechSynthesis" in window) speechSynthesis.cancel(); });