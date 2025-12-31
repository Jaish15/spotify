const clientId = "YOUR_CLIENT_ID_HERE";
const redirectUri = window.location.href.split("?")[0];

const scopes = "user-read-private";

function login() {
  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    `client_id=${clientId}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scopes}`;

  window.location.href = authUrl;
}

// Extract token
const hash = window.location.hash;
let token = null;

if (hash) {
  const params = new URLSearchParams(hash.substring(1));
  token = params.get("access_token");
}

// Mood → Spotify query
function getMoodQuery(mood) {
  if (mood === "happy") return "happy pop";
  if (mood === "sad") return "sad acoustic";
  if (mood === "calm") return "lofi chill";
}

async function getSongs(mood) {
  if (!token) {
    alert("Please login with Spotify first!");
    return;
  }

  const query = getMoodQuery(mood);

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=6`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();
  const container = document.getElementById("songs");
  container.innerHTML = "";

  data.tracks.items.forEach(track => {
    container.innerHTML += `
      <div class="song">
        <strong>${track.name}</strong><br>
        ${track.artists[0].name}<br>
        ${
          track.preview_url
            ? `<audio controls src="${track.preview_url}"></audio>`
            : "<p>No preview available</p>"
        }
      </div>
    `;
  });
}
