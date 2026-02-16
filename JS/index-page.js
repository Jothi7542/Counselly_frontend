// JS Logic for index.html (Home Page)
document.addEventListener("DOMContentLoaded", async () => {
    const teamContainer = document.getElementById("expertTeam");
    if (!teamContainer) return;

    try {
        const counsellors = await API.counsellors.getAll();
        // Get top 3
        const top3 = counsellors.slice(0, 3);

        if (top3.length === 0) {
            teamContainer.innerHTML = "<p>No experts found.</p>";
            return;
        }

        teamContainer.innerHTML = top3.map((c, index) => {
            const fallbacks = [
                './Assets/wire5.webp',
                './Assets/wire6.webp',
                './Assets/wire7.webp',
                './Assets/wire8.webp',
                './Assets/wire9.webp',
                './Assets/wire10.webp'
            ];
            let imgSrc = c.profile_image || fallbacks[index % fallbacks.length];

            if (imgSrc.startsWith('../')) {
                imgSrc = imgSrc.replace('..', '.');
            }

            return `
      <article class="card">
        <div class="profile">
          <div class="photo">
            <img src="${imgSrc}" alt="${c.name}">
          </div>
          <div class="details">
            <p class="name">${c.name}</p>
            <p class="meta">${c.specialization || 'Counselling Psychologist'}</p>
          </div>
        </div>
        <div style="margin: 20px 0; padding: 15px 0; border-top: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9;">
          <p class="meta"><span class="label">Experience:</span> ${c.experience || '3.5'}+ years</p>
          <p class="meta"><span class="label">Languages:</span> ${Array.isArray(c.speaks) ? c.speaks.join(", ") : (c.speaks || "Tamil, English")}</p>
            <p class="meta"><span class="label">Location:</span> ${c.address || 'Chennai'}</p>
            <div class="rating-section" style="margin-top: 10px; display: flex; align-items: center; gap: 8px;">
              <span style="color: #FFD700; font-size: 1.1em;">${'★'.repeat(Math.round(c.rating || 0))}${'☆'.repeat(5 - Math.round(c.rating || 0))}</span>
              <span style="color: var(--text-muted); font-size: 0.85rem;">${c.rating || 0} (${c.reviews_count || 0} reviews)</span>
            </div>
          </div>
        <div class="cta">
          <a class="btn secondary" href="./HTML/Counsellor_profile.html?id=${c.counsellors_id}">View profile</a>
        </div>
      </article>
    `}).join('');
    } catch (err) {
        console.error("Home page load failed:", err);
        teamContainer.innerHTML = `<p style="padding: 20px; color: #ef4444;">Error loading experts. Please try again later.</p>`;
    }
});
