document.getElementById("saveButton").addEventListener("click", () => {
    const fileInput = document.getElementById("resumeUpload");
  
    if (fileInput.files.length === 0) {
      alert("Please select a resume to upload.");
      return;
    }
  
    const file = fileInput.files[0];
    const reader = new FileReader();
  
    reader.onload = function () {
      const resumeContent = reader.result;
  
      // Log the resume content for debugging
      console.log("Resume saved:", resumeContent);
  
      // Save the resume content to local storage
      chrome.storage.local.set({ resume: resumeContent }, () => {
        document.getElementById("statusMessage").innerText = "Resume saved successfully!";
        fileInput.value = ""; // Reset the file input
      });
    };
  
    reader.onerror = function () {
      alert("Failed to read the file. Please try again.");
    };
  
    // Read the file as plain text
    reader.readAsText(file);
  });