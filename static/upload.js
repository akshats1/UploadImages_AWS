function uploadFiles() {
    const files = document.getElementById('file-input').files;
    const progressContainer = document.getElementById('progress-container');
    progressContainer.innerHTML = ''; // Clear previous progress bars

    Array.from(files).forEach(file => {
        const formData = new FormData();
        formData.append('files', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/', true);

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `<div class="progress-bar-inner">0%</div>`;
        progressContainer.appendChild(progressBar);

        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                const innerBar = progressBar.querySelector('.progress-bar-inner');
                innerBar.style.width = percentComplete + '%';
                innerBar.innerText = Math.round(percentComplete) + '%';
            }
        };

        xhr.onload = function () {
            if (xhr.status === 200) {
                alert('Upload complete!');
            } else {
                alert('Upload failed!');
            }
        };

        xhr.send(formData);
    });
}

