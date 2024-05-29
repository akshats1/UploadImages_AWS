from flask import Flask, render_template, request, jsonify, send_from_directory
import boto3
import os
from werkzeug.utils import secure_filename
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from gallery import Gallery  # Ensure you have this class in a file named gallery.py

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# AWS S3 Configuration
S3_BUCKET = 'images-demo1'

def get_s3_client():
    return boto3.client('s3')

def multipart_upload(file_path, bucket, key):
    s3 = get_s3_client()
    try:
        transfer = boto3.s3.transfer.S3Transfer(s3)
        transfer.upload_file(file_path, bucket, key)
    except boto3.exceptions.S3UploadFailedError as e:
        return str(e)

@app.route('/', methods=['GET', 'POST'])
def index():
    gallery = Gallery()
    image_paths = gallery.get_image_paths()
    
    if request.method == 'POST':
        files = request.form.getlist('files')
        if not files:
            return jsonify({'error': 'No files selected'}), 400

        results = []
        for encoded_path in files:
            filepath = Gallery.decode(encoded_path)
            filename = secure_filename(os.path.basename(filepath))
            
            # Upload to S3 using multipart upload
            upload_result = multipart_upload(filepath, S3_BUCKET, filename)

            if upload_result is None:
                results.append(f'File {filename} uploaded successfully to S3!')
            else:
                results.append(f'Failed to upload file {filename}: {upload_result}')
        
        return jsonify(results)

    # Handle GET request
    return render_template('index.html', paths=image_paths)

@app.route('/cdn/<path:filepath>')
def download_file(filepath):
    dir, filename = os.path.split(Gallery.decode(filepath))
    return send_from_directory(dir, filename, as_attachment=False)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

