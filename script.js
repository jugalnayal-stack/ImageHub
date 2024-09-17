const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const imageContainer = document.getElementById('image-container');
const imageCountElement = document.getElementById('image-count');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeLightbox = document.getElementById('close-lightbox');
const uploadProgressPopup = document.getElementById('upload-progress-popup');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

let imageCount = 0;

function updateImageCount() {
    imageCountElement.textContent = `Total Images: ${imageCount}`;
}

function handleFiles(files) {
    showUploadProgress();
    let processed = 0;
    let totalSize = 0;
    let loadedSize = 0;
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    validFiles.forEach(file => totalSize += file.size);

    validFiles.forEach((file, index) => {
        const reader = new FileReader();

        reader.onprogress = function(e) {
            if (e.lengthComputable) {
                loadedSize += e.loaded - (loadedSize / validFiles.length * index);
                updateProgress(loadedSize, totalSize);
            }
        }

        reader.onload = function(e) {
            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');
            imageItem.style.opacity = '0';
            imageItem.style.transform = 'scale(0.8)';

            const img = document.createElement('img');
            img.src = e.target.result;
            imageItem.appendChild(img);

            const overlay = document.createElement('div');
            overlay.classList.add('image-overlay');
            overlay.innerHTML = `
                <p>File: ${file.name}</p>
                <p>Size: ${(file.size / 1024).toFixed(2)} KB</p>
            `;
            imageItem.appendChild(overlay);

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-btn');
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                imageItem.style.opacity = '0';
                imageItem.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    imageContainer.removeChild(imageItem);
                    imageCount--;
                    updateImageCount();
                }, 300);
            });
            imageItem.appendChild(removeBtn);

            imageItem.addEventListener('click', function() {
                lightboxImage.src = e.target.result;
                lightbox.style.display = 'flex';
                setTimeout(() => {
                    lightbox.style.opacity = '1';
                }, 10);
            });

            imageContainer.appendChild(imageItem);
            setTimeout(() => {
                imageItem.style.opacity = '1';
                imageItem.style.transform = 'scale(1)';
            }, 10);

            imageCount++;
            updateImageCount();

            processed++;
            if (processed === validFiles.length) {
                hideUploadProgress();
            }
        }

        reader.readAsDataURL(file);
    });
}

function showUploadProgress() {
    uploadProgressPopup.style.display = 'block';
    progressBar.style.width = '0%';
    progressText.textContent = '0% Complete';
}

function hideUploadProgress() {
    setTimeout(() => {
        uploadProgressPopup.style.display = 'none';
    }, 1000);
}

function updateProgress(loaded, total) {
    const percentage = Math.round((loaded / total) * 100);
    progressBar.style.width = percentage + '%';
    progressText.textContent = percentage + '% Complete';
}

uploadArea.addEventListener('click', function() {
    fileInput.click();
});

fileInput.addEventListener('change', function(e) {
    handleFiles(e.target.files);
});

uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

closeLightbox.addEventListener('click', function() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
        lightbox.style.display = 'none';
    }, 300);
});

lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    }
});