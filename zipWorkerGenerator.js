// Generate and display the download URL
function generateDownloadUrl() {
    const fileNameInput = document.getElementById('fileNameInput');
    const downloadUrlInput = document.getElementById('downloadUrlInput');
    
    const fileName = fileNameInput.value.trim();
    if (fileName && isValidFileName(fileName)) {
        // Base64 encode the file name
        const encodedFileName = btoa(fileName);
        // Create the download URL
        const downloadUrl = `https://itisuniqueofficial.github.io/worker/zipWorker.html?file=${encodedFileName}`;
        
        // Set the generated URL to the input field
        downloadUrlInput.value = downloadUrl;
    } else {
        alert("Please enter a valid file name without special characters.");
    }
}

// Copy the download URL to the clipboard
function copyDownloadUrl() {
    const downloadUrlInput = document.getElementById('downloadUrlInput');
    const downloadUrl = downloadUrlInput.value;

    if (downloadUrl) {
        navigator.clipboard.writeText(downloadUrl)
            .then(() => alert("URL copied to clipboard!"))
            .catch(() => alert("Failed to copy URL. Please try again."));
    } else {
        alert("No URL to copy. Please generate one first.");
    }
}

// Validate file name to exclude special characters
function isValidFileName(fileName) {
    // Allow alphanumeric characters, underscores, hyphens, and periods
    const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
    return fileNameRegex.test(fileName);
}
