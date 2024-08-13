document.addEventListener("DOMContentLoaded", () => {
  // Get all the elements from DOM tree
  const dateInput = document.getElementById("date");
  const timeSlotsContainer = document.getElementById("timeSlots");
  const appointmentIdInput = document.getElementById("appointmentId");
  const testTypeInput = document.getElementById("testType");

  const timeSlotButtons = (appointment) => {
    const button = document.createElement("button");

    button.type = "button";
    button.classList.add(
      "btn",
      "btn-outline-primary",
      "time-slot",
      "mx-1",
      "my-1"
    );
    button.textContent = appointment.time;
    button.dataset.id = appointment._id;

    button.addEventListener("click", () => {
      document
        .querySelectorAll(".time-slot")
        .forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");

      appointmentIdInput.value = button.dataset.id;
    });
    return button;
  };

  const messageDivs = (message, isError = false) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    if (isError) {
      messageElement.style.color = "red";
    }
    return messageElement;
  };

  const fetchAppointments = async (date) => {
    try {
      const response = await fetch(`/appointments?date=${date}`).then((res) =>
        res.json()
      );
      return response;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return { success: false };
    }
  };

  dateInput.addEventListener("change", async (e) => {
    const date = e.target.value;
    timeSlotsContainer.innerHTML = "";

    const response = await fetchAppointments(date);

    if (response.success) {
      if (response.appointments.length > 0) {
        response.appointments.forEach((appointment) => {
          if (appointment.isTimeSlotAvailable) {
            timeSlotsContainer.appendChild(timeSlotButtons(appointment));
          }
        });
      } else {
        timeSlotsContainer.appendChild(
          messageDivs("No time slots available for the selected date.")
        );
      }
    } else {
      timeSlotsContainer.appendChild(
        messageDivs(
          "Error fetching available time slots. Please try again later.",
          true
        )
      );
    }
  });
});
