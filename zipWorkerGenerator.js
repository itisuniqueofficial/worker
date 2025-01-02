function generateDownloadUrl() {
    const fileName = document.getElementById('fileNameInput').value.trim();
    if (fileName) {
        // Base64 encode the file name
        const encodedFileName = btoa(fileName);
        // Create the download URL
        const downloadUrl = `https://itisuniqueofficial.github.io/worker/zipWorker.html?file=${encodedFileName}`;
        
        // Set the generated URL to the input field
        document.getElementById('downloadUrlInput').value = downloadUrl;
    } else {
        alert("Please enter a valid file name.");
    }
}

function copyDownloadUrl() {
    const downloadUrlInput = document.getElementById('downloadUrlInput');
    downloadUrlInput.select();
    document.execCommand('copy');
    alert("URL copied to clipboard!");
}
