const API_URL = "https://counselly-backend.vercel.app/counsellors";


// Always normalize data into array
function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim() !== "") return [value];
  return [];
}

async function loadCounsellors() {
  try {
    const res = await fetch(API_URL);
    const counsellors = await res.json();

    const grid = document.getElementById("counsellorGrid");
    grid.innerHTML = "";

    counsellors.forEach(c => {
      const speaksArr = normalizeArray(c.speaks);
      const modeArr = normalizeArray(c.mode);
      const expertiseArr = normalizeArray(c.expertise);

      // Speaks text (Tamil, English +1 more)
      const speaksText =
        speaksArr.length > 2
          ? `${speaksArr.slice(0, 2).join(", ")} +${speaksArr.length - 2} more`
          : speaksArr.join(", ");

      const card = document.createElement("div");
      card.className = "counsellor-card";

      card.innerHTML = `
        <p class="role">Counselling Psychologist</p>

        <div class="top-section">
          <h2 class="name">${c.name}</h2>
          <img 
            src="${c.profile_image || '/images/default-avatar.png'}" 
            class="profile-img"
            alt="${c.name}"
          />
        </div>

        <p class="experience">
          ${Number(c.experience)} years of experience
        </p>

        <p class="heading">Speaks</p>
        <p class="text">${speaksText || "-"}</p>

        <p class="heading">Mode</p>
        <p class="text">${modeArr.join(", ") || "-"}</p>

        <p class="heading">Expertise</p>
        <div class="tags">
          ${expertiseArr.length
          ? expertiseArr.map(e => `<span>${e}</span>`).join("")
          : "<span>-</span>"
        }
        </div>

        <a href="#" class="book-btn">BOOK NOW</a>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

loadCounsellors();
