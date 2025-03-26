const loginForm = document.getElementById('loginForm');
const uploadForm = document.getElementById('uploadForm');
const alertBox = document.getElementById('alert');
const loginDiv = document.getElementById('login-form');
const uploadDiv = document.getElementById('upload-form');
const htmlTemplateInput = document.getElementById('HTML'); // For HTML template input
const previewContainer = document.getElementById('preview-container'); // For preview container
const previewContent = document.getElementById('previewContent'); // For live preview

function showAlert(message, type = 'success') {
    alertBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = document.getElementById('file').files[0];
    const email = document.getElementById('Email').value;
    const passwordEmail = document.getElementById('Password-Email').value;
    const message = document.getElementById('HTML').value;

    if (!file) {
        showAlert('Please select a file to upload', 'danger');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('Email', email);
    formData.append('Password-Email', passwordEmail);
    formData.append('Subject', message);

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            showAlert('File uploaded and emails sent!', 'success');
        } else {
            showAlert(data.error || 'Upload failed', 'danger');
        }
    } catch (error) {
        showAlert(`Error: ${error.message}`, 'danger');
    }
});

htmlTemplateInput.addEventListener('input', () => {
    const template = htmlTemplateInput.value;

    const highlightedTemplate = template.replace(/{{\s*([^}]+)\s*}}/g, `<span style="background-color: yellow;">{{$1}}</span>`);

    previewContent.innerHTML = highlightedTemplate;

    previewContainer.style.display = template.trim() ? 'block' : 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file');
    const fileNameDisplay = document.getElementById('fileName');
    const htmlTemplate = document.getElementById('HTML');
    const previewContainer = document.getElementById('preview-container');
    const previewContent = document.getElementById('previewContent');
    const alertDiv = document.getElementById('alert');

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileNameDisplay.textContent = `Selected file: ${file.name}`;
            fileNameDisplay.classList.add('show');
        } else {
            fileNameDisplay.classList.remove('show');
        }
    });

    // Handle HTML template preview
    htmlTemplate.addEventListener('input', function() {
        if (this.value.trim()) {
            previewContainer.style.display = 'block';
            previewContent.innerHTML = this.value;
        } else {
            previewContainer.style.display = 'none';
        }
    });

    // Handle form submission
    document.getElementById('uploadForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('email', document.getElementById('Email').value);
        formData.append('password', document.getElementById('Password-Email').value);
        formData.append('html', htmlTemplate.value);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            // Show alert
            alertDiv.style.display = 'block';
            if (result.success) {
                alertDiv.className = 'alert alert-success';
                alertDiv.innerHTML = '<i class="fas fa-check-circle me-2"></i>' + result.message;
            } else {
                alertDiv.className = 'alert alert-danger';
                alertDiv.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>' + result.message;
            }
        } catch (error) {
            alertDiv.style.display = 'block';
            alertDiv.className = 'alert alert-danger';
            alertDiv.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>An error occurred while uploading the file.';
        }
    });
});
