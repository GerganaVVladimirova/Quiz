
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(this); // Get form data
  const response = await fetch('/upload', { // Send form data to server
      method: 'POST',
      body: formData,
      // headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  
 
    // window.location.href = "quiz.html";
  
 
});
