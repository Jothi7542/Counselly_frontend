// JS Logic for Counsellor_profile.html
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const counsellorId = urlParams.get('id');
    let currentCounsellor = null;
    let availabilityData = {};

    if (!counsellorId) {
        alert("Invalid expert selection.");
        window.location.href = "./Counsellor.html";
        return;
    }

    try {
        // Try to get from full list first as it's more reliable given backend 500s
        const all = await API.counsellors.getAll();
        currentCounsellor = all.find(c => String(c.counsellors_id) === String(counsellorId));

        if (!currentCounsellor) {
            // Fallback to specific endpoint
            currentCounsellor = await API.counsellors.getById(counsellorId);
        }

        if (!currentCounsellor) throw new Error("Expert not found");
        renderProfile(currentCounsellor);
    } catch (err) {
        console.error("Profile load failed:", err);
        const nameEl = document.getElementById("counsellorName");
        if (nameEl) nameEl.innerText = "Expert Not Found";
        // Do not alert if we have partial data or just show a small error
        const bioEl = document.getElementById("counsellorBio");
        if (bioEl) bioEl.innerText = "Failed to load expert details. Please try again later.";
    }

    function renderProfile(c) {
        const nameEl = document.getElementById("counsellorName");
        const expEl = document.getElementById("counsellorExp");
        const langsEl = document.getElementById("counsellorLangs");
        const imgEl = document.getElementById("counsellorImage");
        const bioEl = document.getElementById("counsellorBio");
        const locEl = document.getElementById("counsellorDisplayLocation");
        const addrEl = document.getElementById("displayAddress");

        if (nameEl) nameEl.innerText = c.name;
        if (expEl) expEl.innerText = `${c.experience || '3.5'} years of experience`;
        if (langsEl) langsEl.innerText = Array.isArray(c.speaks) ? c.speaks.join(" / ") : (c.speaks || "Tamil / English");
        if (imgEl) imgEl.src = c.profile_image || "../Assets/Wireframep1.webp";
        if (bioEl) bioEl.innerText = c.about || c.biography || c.bio || "Biography details are coming soon. This expert is dedicated to helping you achieve mental wellness.";

        const isInPerson = c.mode && (c.mode.includes("In Person") || c.mode.includes("in person"));
        if (locEl) locEl.innerText = `📍 ${isInPerson ? "Online, In-person" : "Online"} (${c.address || "Chennai"})`;
        if (addrEl) addrEl.innerText = `📍 ${c.address || "49, Thomas Road, Chennai 603 108"}`;

        const modeContainer = document.getElementById("idModeButtons");
        if (modeContainer) {
            const modes = Array.isArray(c.mode) ? c.mode : ["Online", "In Person"];
            modeContainer.innerHTML = modes.map((m, idx) => `
                <button class="mode ${idx === 0 ? 'active' : ''}" onclick="toggleMode(this)">${m}</button>
            `).join('');
        }
    }

    window.toggleMode = function (btn) {
        document.querySelectorAll(".mode").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    };

    // Real-time Availability Sync
    const datePicker = document.getElementById("datePicker");
    if (datePicker) {
        datePicker.addEventListener("change", async function () {
            const date = this.value;
            const container = document.getElementById("timeSlots");
            if (!container) return;

            container.innerHTML = "<p>Fetching expert's schedule...</p>";

            try {
                const res = await API.availability.getFreeSlots(counsellorId, date);
                availabilityData = res;
                const periodSelect = document.getElementById("sessionPeriod");
                const period = periodSelect ? periodSelect.value : "";
                if (period) updateTimeSlots(period);
                else container.innerHTML = "<p>Select a time period to see available slots</p>";
            } catch (err) {
                container.innerHTML = "<p style='color: #ef4444;'>Expert hasn't set slots for this date yet.</p>";
                availabilityData = {};
            }
        });
    }

    function updateTimeSlots(period) {
        const slots = availabilityData[period] || [];
        const container = document.getElementById("timeSlots");
        if (!container) return;
        container.innerHTML = "";

        if (slots.length === 0) {
            container.innerHTML = "<p>No slots released for this period.</p>";
            return;
        }

        slots.forEach(slot => {
            const btn = document.createElement("button");
            btn.className = "time-slot";
            btn.innerText = slot.time;
            btn.onclick = () => {
                document.querySelectorAll(".time-slot").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                localStorage.setItem("selected_time", slot.time);
                localStorage.setItem("selected_slot_id", slot.id);
            };
            container.appendChild(btn);
        });
    }

    const periodSelect = document.getElementById("sessionPeriod");
    if (periodSelect) {
        periodSelect.addEventListener("change", function () {
            updateTimeSlots(this.value);
        });
    }

    window.handleBooking = async function () {
        const user = UserManager.get();
        if (!user || user.role !== 'client') {
            alert("Please login as a client to book a session");
            window.location.href = `./auth.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
            return;
        }

        const datePicker = document.getElementById("datePicker");
        const periodSelect = document.getElementById("sessionPeriod");
        const date = datePicker ? datePicker.value : "";
        const session_period = periodSelect ? periodSelect.value : "";
        const time = localStorage.getItem("selected_time");
        const slotId = localStorage.getItem("selected_slot_id");
        const activeMode = document.querySelector(".mode.active");
        const mode = activeMode ? activeMode.innerText : "Online";

        if (!date || !session_period || !time || !slotId) {
            alert("Please select date, period and an available time slot");
            return;
        }

        BookingManager.saveStep1({
            counsellors_id: counsellorId,
            counsellor_name: currentCounsellor.name,
            counsellor_photo: currentCounsellor.profile_image || "../Assets/Wireframep1.webp",
            date: date,
            time: time,
            availability_id: slotId,
            session_period: session_period,
            mode: mode,
            clients_id: user.clients_id
        });

        window.location.href = `./Theraphy_p.html`;
    };
});
