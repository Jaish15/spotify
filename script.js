const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

const audio = document.getElementById("player");
const analyser = new (window.AudioContext || window.webkitAudioContext)().createAnalyser();
const source = new (window.AudioContext || window.webkitAudioContext)().createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(source.context.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const moodText = document.getElementById("mood");
const analyzing = document.getElementById("analyzing");
const songList = document.getElementById("songList");

const songs = {
  Love: [{ name: "Uyirey", file: "songs/Uyirey.mp3" }],
  Sad: [{ name: "Po Nee Po", file: "songs/Po Nee Po (The Pain of Love).mp3" }],
  Folk: [{ name: "Chikitu", file: "songs/Chikitu.mp3" }]
};

function analyzeMood() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;

  analyzing.style.display = "block";
  moodText.style.display = "none";

  const reader = new FileReader();
  reader.onload = () => {
    const audioCtx = new AudioContext();
    audioCtx.decodeAudioData(reader.result, buffer => {
      const energy = buffer.getChannelData(0).reduce((a, b) => a + Math.abs(b), 0) / buffer.length;
      const mood = energy < 0.1 ? "Sad" : buffer.duration > 180 ? "Folk" : "Love";

      setTimeout(() => showMood(mood), 1200);
    });
  };
  reader.readAsArrayBuffer(file);
}

function showMood(mood) {
  analyzing.style.display = "none";
  moodText.style.display = "block";
  moodText.innerText =
    mood === "Love" ? "❤️ Love" :
    mood === "Sad" ? "😔 Sad" : "🌾 Folk";

  loadSongs(mood);
}

function loadSongs(mood) {
  songList.innerHTML = "";
  songs[mood].forEach(song => {
    const div = document.createElement("div");
    div.className = "song";
    div.innerText = "▶ " + song.name;

    div.onclick = () => {
      document.querySelectorAll(".song").forEach(s => s.classList.remove("active"));
      div.classList.add("active");
      audio.src = song.file;
      audio.play();
      animate();
    };

    songList.appendChild(div);
  });
}

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const bar = dataArray[i];
    ctx.fillStyle = `rgb(${bar + 100},80,255)`;
    ctx.fillRect(x, canvas.height - bar, 4, bar);
    x += 6;
  }
}
