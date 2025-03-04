document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("resumeUpload");
  const saveButton = document.getElementById("saveButton");
  const statusMessage = document.getElementById("statusMessage");
  const loadingIndicator = document.getElementById("loadingIndicator");

  saveButton.addEventListener("click", () => {
    if (!fileInput.files.length) {
      statusMessage.innerText = "Please select a resume to upload.";
      statusMessage.style.color = "red";
      return;
    }

    const file = fileInput.files[0];
    const validExtensions = ["pdf", "doc", "docx", "json"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      statusMessage.innerText =
        "Invalid file type. Only PDF, DOC, DOCX, and JSON formats are accepted.";
      statusMessage.style.color = "red";
      return;
    }

    const reader = new FileReader();
    loadingIndicator.style.display = "block"; // Show loading indicator

    reader.onload = function () {
      const resumeContent = reader.result;

      // Log the resume content for debugging
      console.log("Resume content:", resumeContent);

      // Save the resume content to Chrome's local storage
      chrome.storage.local.set({ resume: resumeContent }, () => {
        statusMessage.innerText = "Resume saved successfully!";
        statusMessage.style.color = "green";
        fileInput.value = ""; // Reset file input
        loadingIndicator.style.display = "none"; // Hide loading indicator
      });
    };

    reader.onerror = function () {
      console.error("Error reading file:", reader.error);
      statusMessage.innerText = "Error reading file.";
      statusMessage.style.color = "red";
      loadingIndicator.style.display = "none"; // Hide loading indicator
    };

    // Read the file as text
    reader.readAsText(file);
  });
});
