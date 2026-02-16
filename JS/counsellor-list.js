// JS Logic for Counsellor.html
document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("counsellorGrid");
  const searchInput = document.getElementById("searchInput");

  if (!grid) return;

  async function loadCounsellors(filter = "") {
    try {
      console.log("Fetching counsellors...");
      const counsellors = await API.counsellors.getAll();

      // Deduplicate by ID
      const uniqueCounsellors = Array.from(new Map(counsellors.map(c => [c.counsellors_id, c])).values());

      console.log(`Counsellors received: ${uniqueCounsellors.length}`);

      const term = filter.toLowerCase();
      const filtered = uniqueCounsellors.filter(c =>
        !filter ||
        (c.name && c.name.toLowerCase().includes(term)) ||
        (c.expertise && Array.isArray(c.expertise) && c.expertise.some(e => e.toLowerCase().includes(term))) ||
        (c.specialization && c.specialization.toLowerCase().includes(term)) ||
        (c.address && c.address.toLowerCase().includes(term)) ||
        (c.speaks && (Array.isArray(c.speaks) ? c.speaks.some(s => s.toLowerCase().includes(term)) : c.speaks.toLowerCase().includes(term)))
      );

      renderCounsellors(filtered);
    } catch (err) {
      console.error("Load failed:", err);
      grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <p style="color: #ef4444; font-weight: 600;">Connection Error: ${err.message}</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">Retry Connection</button>
                </div>
            `;
    }
  }

  function renderCounsellors(list) {
    if (list.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No experts found matching your search.</p>`;
      return;
    }

    grid.innerHTML = list.map((c, index) => {
      const fallbacks = [
        '../Assets/wire5.webp',
        '../Assets/wire6.webp',
        '../Assets/wire7.webp',
        '../Assets/wire8.webp',
        '../Assets/wire9.webp',
        '../Assets/wire10.webp'
      ];
      const fallbackImg = fallbacks[index % fallbacks.length];

      // Generate Star Rating
      const stars = '★'.repeat(Math.round(c.rating || 0)) + '☆'.repeat(5 - Math.round(c.rating || 0));

      return `
            <div class="counsellor-card">
                <p class="role">${c.specialization || 'Counselling Psychologist'}</p>
                <div class="top-section">
                    <h2 class="name">${c.name}</h2>
                    <img src="${c.profile_image || fallbackImg}" alt="${c.name}" class="profile-img">
                </div>
                <div class="rating-section" style="text-align: center; margin-bottom: 10px;">
                <span style="color: #FFD700; font-size: 1.2em; letter-spacing: 2px;">${stars}</span>
                <span style="color: #666; font-size: 0.9em; margin-left: 5px;">${c.rating || 0} (${c.reviews_count || 0} reviews)</span>
            </div>

            <p class="experience">${c.experience || '3.5'} years of experience</p>
            <p class="heading">Speaks</p>
            <p class="text">${Array.isArray(c.speaks) ? c.speaks.join(", ") : (c.speaks || "English, Tamil")}</p>
            <p class="heading">Expertise</p>
            <div class="tags">
                ${(Array.isArray(c.expertise) ? c.expertise : ['Anxiety', 'Depression']).map(tag =>
        `<span>${tag}</span>`).join('')}
            </div>
            <a href="./Counsellor_profile.html?id=${c.counsellors_id}" class="book-btn">BOOK NOW</a>
            </div>
            `}).join('');
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      loadCounsellors(e.target.value);
    });
  }

  // Initial load
  loadCounsellors();
});