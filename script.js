// Backend URL
const API = "http://localhost:3000";

// Redirect user to Spotify login (handled by backend)
function login() {
  window.location.href = `${API}/login`;
}

// Get songs based on mood
async function getSongs(mood) {
  // Get token returned from backend redirect
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    alert("Please login with Spotify first!");
    return;
  }

  try {
    const response = await fetch(
      `${API}/recommend?mood=${mood}&token=${token}`
    );

    const data = await response.json();
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

  } catch (error) {
    console.error(error);
    alert("Something went wrong while fetching songs.");
  }
}
