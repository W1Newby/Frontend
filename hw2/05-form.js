// Add your code here
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const modalBody = document.getElementById("modalBody");
  const modal = new bootstrap.Modal(document.getElementById("resultModal"));

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const status = document.getElementById("status").value;

    const courses = [];
    document.querySelectorAll(".form-check-input:checked").forEach((box) => {
      courses.push(box.value);
    });

    const comments = document.getElementById("comments").value.trim();

    // Build modal content
    modalBody.innerHTML = `
        <p><strong>Full Name:</strong> ${name || "(none)"}</p>
        <p><strong>Email:</strong> ${email || "(none)"}</p>
        <p><strong>Registration Status:</strong> ${status || "(none)"}</p>
        <p><strong>Courses Taken:</strong> ${
          courses.length ? courses.join(", ") : "(none)"
        }</p>
        <p><strong>Comments:</strong> ${comments || "(none)"}</p>
      `;

    modal.show();
  });
});
