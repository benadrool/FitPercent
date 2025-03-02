chrome.runtime.onInstalled.addListener(() => {
    // Create a context menu item
    chrome.contextMenus.create({
      id: "job-fit-evaluator",
      title: "Evaluate Job Fit",
      contexts: ["selection"] // Trigger only when text is selected
    });
  });
  
  // Listen for context menu item clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "FitPercent" && info.selectionText) {
      // Get the selected text
      const jobDescription = info.selectionText;
  
      // Retrieve the user's saved resume from local storage
      chrome.storage.local.get("resume", (data) => {
        const resume = data.resume;
  
        if (resume) {
          // Send data to a content script or directly process the match
          const score = evaluateJobFit(resume, jobDescription);
  
          // Display the result as a notification or other UI
          chrome.notifications.create({
            type: "basic",
            iconUrl: "assets/icon-128.png",
            title: "Job Fit Evaluation",
            message: `Job Fit Score: ${score}%`
          });
        } else {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "assets/icon-128.png",
            title: "Job Fit Evaluation",
            message: "Please upload your resume first!"
          });
        }
      });
    }
  });
  
  // Simple keyword matching function (to be enhanced)
  function evaluateJobFit(resume, jobDescription) {
    if (!resume || !jobDescription) {
      return 0;
    }
  
    const resumeWords = resume.toLowerCase().split(/\W+/);
    const jobWords = jobDescription.toLowerCase().split(/\W+/);
  
    const matchingWords = jobWords.filter((word) => resumeWords.includes(word));
    const score = (matchingWords.length / jobWords.length) * 100;
  
    return Math.round(score);
  }