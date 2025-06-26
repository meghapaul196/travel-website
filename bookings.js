document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city');
    document.getElementById("cityTitle").innerText = `Booking for ${city}`;

    document.getElementById("bookingForm").addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent page refresh after form submission

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            date: document.getElementById("date").value,
            message: document.getElementById("message").value,
            city: city
        };

        try {
            const response = await fetch("http://localhost:5500/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                // Show success message
                document.getElementById("successMessage").classList.remove("d-none");

                
                // Reset the form without refreshing the page
                document.getElementById("bookingForm").reset();
            } else {
                alert(result.error || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Could not submit booking. Try again later.");
        }
    });
});
