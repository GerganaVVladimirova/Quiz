
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(this); // Get form data
  const response = await fetch('/upload', { // Send form data to server
      method: 'POST',
      body: formData
  });
  window.location.href = "quiz.html";
});
