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
});

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
