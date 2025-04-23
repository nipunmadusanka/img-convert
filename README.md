Image Conversion API
This project is a simple Flask-based API that allows users to upload an image, convert it to a desired format, and download the converted image. The supported formats include PNG, JPG, JPEG, GIF, BMP, WebP, and TIFF. The app uses Flask, Pillow (PIL), and Flask-CORS to handle image uploads and conversions.

Features
Upload an image and convert it to different formats (PNG, JPG, JPEG, GIF, BMP, WebP, TIFF).

Clean and easy-to-use REST API.

Support for RGBA to RGB conversion for JPEG formats.

Temporary file handling and clean-up after processing.

Return converted images as downloadable files.

Technologies Used
Backend:
Flask - Lightweight web framework for Python.

Flask-CORS - Handle Cross-Origin Resource Sharing.

Pillow (PIL) - Image processing library.

Werkzeug - Utilities for handling file uploads.

UUID - Unique identifier generation for file names.

OS - File system interaction (creating directories, removing files).

Time - Handling time-related tasks for unique file naming.

Deployment:
Local deployment for testing.

Can be deployed to cloud platforms like Heroku, Render, or AWS.

Installation and Setup
To run this project locally, follow these steps:

1. Clone the Repository
Clone the repository to your local machine:

bash
Copy
Edit
git clone https://github.com/yourusername/image-conversion-api.git
cd image-conversion-api
2. Set Up a Virtual Environment (Optional)
It's recommended to use a virtual environment to manage your Python dependencies.

For Linux/macOS:
bash
Copy
Edit
python3 -m venv venv
source venv/bin/activate
For Windows:
bash
Copy
Edit
python -m venv venv
.\venv\Scripts\activate
3. Install Dependencies
Install the required Python packages:

bash
Copy
Edit
pip install -r requirements.txt
4. Run the Flask App
Start the Flask application:

bash
Copy
Edit
python app.py
The app will run locally at http://localhost:5000.

API Endpoints
/api/convert [POST]
Description: This endpoint accepts an image file and converts it to a specified format.

Request:

Body: multipart/form-data

Fields:

image: The image file to be uploaded.

format (optional): The target format for the conversion (e.g., 'jpeg', 'png'). Defaults to png.

Response:

Content-Type: image/{target_format}

Returns the converted image as a downloadable file.

Example Request:

bash
Copy
Edit
curl -X POST -F "image=@path_to_image.png" -F "format=jpeg" http://localhost:5000/api/convert
Example Response: The converted image is returned as a downloadable file in the specified format.

/api/formats [GET]
Description: Returns a list of supported image formats for conversion.

Response:

json
Copy
Edit
{
    "formats": ["png", "jpg", "jpeg", "gif", "bmp", "webp", "tiff"]
}
File Upload Handling
Uploaded images are temporarily saved in the uploads/ folder. After conversion, the images are removed from the server to prevent storage overflow.

File Conversion Process
Check if an image file is present: The image file is checked for validity (if it exists and has an allowed extension).

Convert Image: The image is processed using Pillow (PIL) to convert it to the requested format.

Send Converted Image: The converted image is sent back as a response and made available for download.

Deployment
To deploy the app, follow these steps for your preferred cloud platform.

Deploying to Render (Example):
Go to Render and sign up/login.

Create a new Web Service.

Link your GitHub repository to Render.

Set the Root Directory to backend (where your app.py file is located).

Set the Build Command to pip install -r requirements.txt.

Set the Start Command to gunicorn app:app (if using Gunicorn as a server for production).

Render will automatically deploy your app, and the API will be live.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Contributing
Feel free to fork this repository, make changes, and create pull requests for enhancements or bug fixes. Contributions are welcome!
