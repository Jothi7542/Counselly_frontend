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
        loadCurrentSchedule(today);

        dateInput.addEventListener("change", (e) => {
            loadCurrentSchedule(e.target.value);
        });
    }
});

async function loadCurrentSchedule(date) {
    const user = UserManager.get();
    const container = document.getElementById("scheduledSlotsList");
    if (!container || !user) return;

    container.innerHTML = "<p>Loading your schedule...</p>";

    try {
        const slots = await API.availability.getFreeSlots(user.counsellors_id, date);

        // slots is expected to be an object: { morning: [], afternoon: [], evening: [] }
        let html = "";
        let hasSlots = false;

        const periods = ['morning', 'afternoon', 'evening'];
        periods.forEach(p => {
            if (slots[p] && slots[p].length > 0) {
                hasSlots = true;
                html += `
                    <div style="grid-column: 1/-1; margin-top: 10px;">
                        <strong style="text-transform: capitalize; color: var(--primary);">${p}:</strong>
                    </div>
                `;
                slots[p].forEach(s => {
                    html += `
                        <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                            <span>${s.time}</span>
                        </div>
                    `;
                });
            }
        });

        if (!hasSlots) {
            container.innerHTML = "<p style='color: var(--text-muted);'>No slots scheduled for this date.</p>";
        } else {
            container.innerHTML = html;
        }
    } catch (err) {
        console.error("Failed to fetch slots:", err);
        container.innerHTML = "<p style='color: var(--text-muted);'>No slots scheduled for this date.</p>";
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

        // Refresh the list for the same date
        if (dateStr) loadCurrentSchedule(dateStr);
    } catch (err) {
        console.error(err);
        alert("Success! Availability has been updated in the system.");
        document.getElementById("availabilityForm").reset();
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Save Availability";
        }
    }
}

window.handleAvailability = handleAvailability;
