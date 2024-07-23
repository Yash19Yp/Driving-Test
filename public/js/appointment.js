document.addEventListener("DOMContentLoaded", () => {
  // Get elements from the DOM tree
  const dateInput = document.getElementById("date");
  const timeSlotsContainer = document.getElementById("timeSlotsContainer");
  const timeSlotButtons = timeSlotsContainer.querySelectorAll(".time-slot");
  const appointmentForm = document.getElementById("appointmentForm");
  const messageDiv = document.getElementById("msg");

  //  Helper function to toggele the classes
  const toggleButtonClass = (button, add, remove) => {
    button.classList.remove(remove);
    button.classList.add(add);
  };

  // Helper function to change the css of the buttons
  const resetTimeSlotButtons = () => {
    timeSlotButtons.forEach((button) => {
      button.classList.remove("selected", "btn-secondary");
      button.classList.add("btn-outline-primary");
      button.disabled = false;
    });
  };

  // To get the already booked timeslots
  dateInput.addEventListener("change", async (e) => {
    const date = e.target.value;
    const response = await fetch(`/appointments?date=${date}`).then((res) =>
      res.json()
    );

    if (response.success) {
      resetTimeSlotButtons();

      response.appointments.forEach((appointment) => {
        const button = [...timeSlotButtons].find(
          (btn) => btn.textContent === appointment.time
        );
        if (button) {
          toggleButtonClass(button, "btn-secondary", "btn-outline-primary");
          button.disabled = true;
        }
      });
    }
  });

  // To change the css of the button
  timeSlotButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("selected");
      if (button.classList.contains("selected")) {
        toggleButtonClass(button, "btn-primary", "btn-outline-primary");
      } else {
        toggleButtonClass(button, "btn-outline-primary", "btn-primary");
      }
    });
  });

  // Call API to book the appointment
  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const date = dateInput.value;
    const selectedTimeSlots = document.querySelectorAll(".time-slot.selected");
    const selectedSlots = [...selectedTimeSlots].map(
      (button) => button.textContent
    );

    const response = await fetch("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, slots: selectedSlots }),
    }).then((res) => res.json());

    if (response.success) {
      selectedTimeSlots.forEach((button) => {
        button.classList.remove("selected", "btn-outline-primary");
        button.classList.add("btn-secondary");
        button.disabled = true;
      });
      messageDiv.classList.remove("alert-danger");
      messageDiv.classList.add("alert", "alert-success");
    } else {
      messageDiv.classList.remove("alert-success");
      messageDiv.classList.add("alert", "alert-danger");
    }
    messageDiv.textContent = response.message;
  });
});
