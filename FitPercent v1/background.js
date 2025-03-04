// Create a context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "job-fit-evaluator",
    title: "Evaluate Job Fit",
    contexts: ["selection"], // Show the context menu only when text is selected
  });
});

// Listen for context menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "job-fit-evaluator" && info.selectionText) {
    console.log("Context menu item clicked:", info);
    console.log("Selected text:", info.selectionText);

    const jobDescription = info.selectionText;

    // Retrieve the saved resume from local storage
    chrome.storage.local.get("resume", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving resume:", chrome.runtime.lastError);
        sendNotification("Error", "Could not retrieve resume from storage.");
        return;
      }

      const resume = data.resume;

      if (resume) {
        console.log("Resume found:", resume);

        // Calculate the job fit score
        const score = evaluateJobFit(resume, jobDescription);

        console.log("Job fit score:", score);

        // Display the job fit score in a notification
        sendNotification("Job Fit Evaluation", `Match Score: ${score}%`);
      } else {
        console.warn("No resume found in local storage.");
        sendNotification("Job Fit Evaluation", "Please upload your resume first!");
      }
    });
  } else {
    console.warn("Invalid context menu item or no text selected.");
  }
});

/**
 * Function to calculate the job fit score using simple keyword matching.
 * @param {string} resume - The user's resume.
 * @param {string} jobDescription - The selected job description text.
 * @returns {number} - The match percentage.
 */
function evaluateJobFit(resume, jobDescription) {
  console.log("Evaluating job fit for resume:", resume, "and job description:", jobDescription);

  if (!resume || !jobDescription) {
    console.error("Invalid input: resume or job description is empty.");
    return 0;
  }

  const resumeWords = resume.toLowerCase().split(/\W+/);
  const jobWords = jobDescription.toLowerCase().split(/\W+/);

  const matchingWords = jobWords.filter((word) => resumeWords.includes(word));
  const matchPercentage = (matchingWords.length / jobWords.length) * 100;

  console.log("Matching words:", matchingWords);
  console.log("Match percentage:", matchPercentage);

  return Math.round(matchPercentage);
}

/**
 * Helper function to send notifications to the user.
 * @param {string} title - The notification title.
 * @param {string} message - The notification message.
 */
function sendNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "assets/icon-128.png",
    title: title,
    message: message,
  });
}
