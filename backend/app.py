from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import os
import io
import uuid
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes dsd

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/convert', methods=['POST'])
def convert_image():
    # Check if image file is present in request
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    # Check if the file is allowed
    if not allowed_file(file.filename):
        return jsonify({'error': f'File type not allowed. Supported types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
    
    # Get target format
    target_format = request.form.get('format', 'png').lower()
    if target_format not in ALLOWED_EXTENSIONS:
        return jsonify({'error': f'Conversion format not supported. Supported formats: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
    
    try:
        # Save original file temporarily
        filename = secure_filename(file.filename)
        temp_filename = f"{uuid.uuid4()}_{int(time.time())}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], temp_filename)
        file.save(filepath)
        
        # Open and convert image
        img = Image.open(filepath)
        
        # Handle RGBA to RGB conversion if target format is JPEG
        if target_format == 'jpg' or target_format == 'jpeg':
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])  # 3 is the alpha channel
                img = background
        
        # Create output filename
        output_filename = f"{os.path.splitext(temp_filename)[0]}.{target_format}"
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
        
        # Save the converted image
        img.save(output_path)
        
        # Prepare image for response
        img_io = io.BytesIO()
        img.save(img_io, format=target_format.upper())
        img_io.seek(0)
        
        # Clean up temporary files
        os.remove(filepath)
        os.remove(output_path)
        
        # Check and remove all files in the upload folder
        for file in os.listdir(app.config['UPLOAD_FOLDER']):
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file)
            if os.path.isfile(file_path):
                os.remove(file_path)
            
        # Return the image
        return send_file(
            img_io, 
            mimetype=f'image/{target_format}',
            as_attachment=True,
            download_name=f"{os.path.splitext(filename)[0]}.{target_format}"
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/formats', methods=['GET'])
def get_formats():
    return jsonify({
        'formats': list(ALLOWED_EXTENSIONS)
    })

if __name__ == '__main__':
    app.run(debug=True)