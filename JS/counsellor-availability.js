// JS Logic for C_availability.html
document.addEventListener("DOMContentLoaded", () => {
    const user = UserManager.get();
    if (!user || user.role !== 'counsellor') {
        window.location.href = "./auth.html";
        return;
    }

    const sidebarImg = document.getElementById("sidebarProfileImage");
    if (sidebarImg && user.profile_image) {
        sidebarImg.src = user.profile_image;
    }

    // Initial load for today's date if selected
    const dateInput = document.getElementById("date");
    if (dateInput) {
        // Set default to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        loadFullSchedule();

        dateInput.addEventListener("change", (e) => {
            loadFullSchedule();
        });
    }
});

async function loadFullSchedule() {
    const user = UserManager.get();
    const container = document.getElementById("fullScheduleList");
    if (!container || !user) return;

    container.innerHTML = "<p>Fetching your 7-day schedule...</p>";

    try {
        const today = new Date();
        let fullHtml = "";
        let hasAnySlots = false;

        // Fetch next 7 days in parallel for speed
        const datePromises = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const displayDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            datePromises.push({
                dateStr,
                displayDate,
                promise: API.availability.getFreeSlots(user.counsellors_id, dateStr)
            });
        }

        const results = await Promise.all(datePromises.map(dp => {
            return dp.promise.catch(e => {
                console.error(`Error fetching slots for ${dp.dateStr}:`, e);
                return { morning: [], afternoon: [], evening: [] };
            });
        }));

        console.log("[Availability] 7-day results:", results);

        results.forEach((slots, index) => {
            const dp = datePromises[index];
            let dateHtml = "";
            let hasSlotsForDate = false;

            const periods = ['morning', 'afternoon', 'evening'];
            periods.forEach(p => {
                if (slots && slots[p] && Array.isArray(slots[p]) && slots[p].length > 0) {
                    hasSlotsForDate = true;
                    hasAnySlots = true;
                    slots[p].forEach(s => {
                        dateHtml += `
                            <div style="background: #f8fafc; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
                                <span style="background: #64748b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase;">${p}</span>
                                <span>${s.time || s.time_slot}</span>
                            </div>
                        `;
                    });
                }
            });

            if (hasSlotsForDate) {
                fullHtml += `
                    <div style="padding-bottom: 15px; border-bottom: 1px solid #f1f5f9; margin-bottom: 15px;">
                        <h4 style="margin-bottom: 10px; color: var(--primary); display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 1.1rem;">📅 ${dp.displayDate}</span>
                            ${dp.dateStr === today.toISOString().split('T')[0] ? '<span style="color: #6366f1; font-size: 0.8rem;">(Today)</span>' : ''}
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px;">
                            ${dateHtml}
                        </div>
                    </div>
                `;
            }
        });

        if (!hasAnySlots) {
            container.innerHTML = "<p style='color: var(--text-muted);'>No availability slots found for the next 7 days. Use the form above to add some!</p>";
        } else {
            container.innerHTML = fullHtml;
        }
    } catch (err) {
        console.error("Critical failure in loadFullSchedule:", err);
        container.innerHTML = `<p style='color: var(--text-muted);'>Error loading schedule: ${err.message}. Please refresh the page.</p>`;
    }
}

async function handleAvailability(event) {
    event.preventDefault();
    const user = UserManager.get();
    if (!user || user.role !== 'counsellor') {
        alert("Please login as a counsellor");
        return;
    }

    const dateStr = document.getElementById("date").value;
    const period = document.getElementById("session_period").value;
    const times = [
        document.getElementById("time1").value,
        document.getElementById("time2").value,
        document.getElementById("time3").value
    ].filter(t => t !== "");

    if (times.length === 0) {
        alert("Please provide at least one time slot");
        return;
    }

    const selectedDate = new Date(dateStr);
    const day = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const month = selectedDate.toLocaleDateString('en-US', { month: 'long' });

    const btn = event.target.querySelector('button');
    btn.disabled = true;
    btn.innerText = "Saving...";

    try {
        // Validation: Ensure times match the period
        const periodConstraints = {
            morning: { start: 8, end: 12, label: "8 AM - 12 PM" },
            afternoon: { start: 12, end: 17, label: "12 PM - 5 PM" },
            evening: { start: 17, end: 21, label: "5 PM - 9 PM" }
        };

        const constraint = periodConstraints[period];

        for (const time of times) {
            const [h] = time.split(':').map(Number);
            if (h < constraint.start || h >= constraint.end) {
                alert(`Invalid time: ${time}. For ${period}, please select time between ${constraint.label}.`);
                btn.disabled = false;
                btn.innerText = "Save Availability";
                return;
            }
        }

        await Promise.all(times.map(time => {
            // Convert 24h to 12h for display consistency
            const [h, m] = time.split(':');
            const hNum = parseInt(h);
            const ampm = hNum >= 12 ? 'PM' : 'AM';
            const displayHour = hNum % 12 || 12;
            const timeSlot = `${displayHour.toString().padStart(2, '0')}:${m} ${ampm}`;

            return API.counsellors.addAvailability({
                counsellors_id: user.counsellors_id,
                date: dateStr,
                day: day,
                month: month,
                time_slot: timeSlot,
                session_period: period
            });
        }));

        alert("Availability added successfully");
        document.getElementById("availabilityForm").reset();

        // Refresh the list
        loadFullSchedule();
    } catch (err) {
        console.error("[Availability] Save failed:", err);
        alert("Failed to save availability: " + (err.message || "Unknown error"));
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Save Availability";
        }
    }
}

window.handleAvailability = handleAvailability;
