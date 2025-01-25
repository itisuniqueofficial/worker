const correctPassword = "secure123"; // Secure your password on the server in production

function getFileNameFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedFileName = urlParams.get('file');
    if (encodedFileName) {
        try {
            return atob(encodedFileName); // Decode base64
        } catch (e) {
            console.error("Error decoding file name:", e);
        }
    }
    return null;
}

function fetchFileDataWithProgress(fileName, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `zip/${fileName}`, true);
        xhr.responseType = 'blob';

        xhr.onprogress = function (event) {
            if (event.lengthComputable) {
                onProgress((event.loaded / event.total) * 100);
            }
        };

        xhr.onload = function () {
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

function revealDownloadLink() {
    const passwordInput = document.getElementById('passwordInput').value;
    const statusMessage = document.getElementById('statusMessage');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('downloadProgress');
    const progressPercentage = document.getElementById('progressPercentage');

    if (passwordInput === correctPassword) {
        const fileName = getFileNameFromUrl();
        if (fileName) {
            statusMessage.textContent = `Password accepted. Preparing download for ${fileName}...`;
            statusMessage.style.color = "#00ff00";

            progressContainer.style.display = "block";

            fetchFileDataWithProgress(fileName, progress => {
                progressBar.value = progress;
                progressPercentage.textContent = `${Math.round(progress)}%`;
            })
                .then(blob => {
                    progressContainer.style.display = "none";
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;
                    link.click();
                    URL.revokeObjectURL(url);
                })
                .catch(() => {
                    statusMessage.textContent = "Error downloading the file. Please try again.";
                    statusMessage.style.color = "red";
                });
        } else {
            statusMessage.textContent = "Invalid file name parameter in the URL.";
            statusMessage.style.color = "red";
        }
    } else {
        statusMessage.textContent = "Incorrect password. Please try again.";
        statusMessage.style.color = "red";
    }
}

document.getElementById('passwordInput').addEventListener('input', function () {
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.disabled = this.value !== correctPassword;
    downloadButton.classList.toggle('enabled', this.value === correctPassword);
});
