function clicked_img(img) {
    console.log(img.src);

    var top = document.getElementById('top');
    top.src = img.src;
    top.hidden = false;

    if (img.naturalWidth < screen.width * 0.6 && img.naturalHeight < screen.height * 0.6) {
        top.width = img.naturalWidth;
        top.height = img.naturalHeight;
    } else {
        top.width = screen.width * 0.6;
        top.height = img.naturalHeight / img.naturalWidth * top.width;
    }

    document.getElementById('close').hidden = false;
}

function do_close() {
    document.getElementById('top').hidden = true;
    document.getElementById('close').hidden = true;
}

function uploadSelectedFiles() {
    const form = document.getElementById('gallery-form');
    const formData = new FormData(form);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const results = JSON.parse(xhr.responseText);
            const resultContainer = document.getElementById('upload-results');
            resultContainer.innerHTML = results.join('<br>');
        } else {
            alert('Upload failed!');
        }
    };

    xhr.send(formData);
}

