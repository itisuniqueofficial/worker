const correctPassword = "secure123"; // For production, do not hardcode passwords; use server-side validation.

// Utility to get the file name from the URL
function getFileNameFromUrl() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedFileName = urlParams.get('file');
        return encodedFileName ? atob(encodedFileName) : null; // Decode base64
    } catch (e) {
        console.error("Error decoding file name:", e);
        return null;
    }
}

// Fetch file with progress tracking
function fetchFileDataWithProgress(fileName, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/zip/${fileName}`, true);
        xhr.responseType = 'blob';

        xhr.onprogress = event => {
            if (event.lengthComputable && onProgress) {
                onProgress((event.loaded / event.total) * 100);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(new Error(`Failed to fetch file. Status: ${xhr.status}`));
            }
        };

        xhr.onerror = () => reject(new Error("Network error during file fetch"));
        xhr.send();
    });
}

// Handle file download process
async function handleFileDownload() {
    const passwordInput = document.getElementById('passwordInput').value;
    const statusMessage = document.getElementById('statusMessage');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('downloadProgress');
    const progressPercentage = document.getElementById('progressPercentage');

    if (passwordInput !== correctPassword) {
        statusMessage.textContent = "Incorrect password. Please try again.";
        statusMessage.style.color = "red";
        return;
    }

    const fileName = getFileNameFromUrl();
    if (!fileName) {
        statusMessage.textContent = "Invalid file name parameter in the URL.";
        statusMessage.style.color = "red";
        return;
    }

    statusMessage.textContent = `Password accepted. Preparing download for ${fileName}...`;
    statusMessage.style.color = "#00ff00";

    progressContainer.style.display = "block";
    try {
        const blob = await fetchFileDataWithProgress(fileName, progress => {
            progressBar.value = progress;
            progressPercentage.textContent = `${Math.round(progress)}%`;
        });

        progressContainer.style.display = "none";

        // Create and trigger a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);

        statusMessage.textContent = "Download complete.";
        statusMessage.style.color = "#00ff00";
    } catch (error) {
        progressContainer.style.display = "none";
        statusMessage.textContent = "Error downloading the file. Please try again.";
        statusMessage.style.color = "red";
        console.error(error);
    }
}

// Initialize event listeners
function init() {
    const passwordInput = document.getElementById('passwordInput');
    const downloadButton = document.getElementById('downloadButton');

    passwordInput.addEventListener('input', () => {
        const isPasswordCorrect = passwordInput.value === correctPassword;
        downloadButton.disabled = !isPasswordCorrect;
        downloadButton.classList.toggle('enabled', isPasswordCorrect);
    });

    downloadButton.addEventListener('click', handleFileDownload);
}

// Run initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);
