# Image Conversion API

This project is a simple Flask-based API that allows users to upload an image, convert it to a desired format, and download the converted image. The supported formats include PNG, JPG, JPEG, GIF, BMP, WebP, and TIFF. The app uses Flask, Pillow (PIL), and Flask-CORS to handle image uploads and conversions.

---

## Features

- Upload an image and convert it to different formats (PNG, JPG, JPEG, GIF, BMP, WebP, TIFF).
- Clean and easy-to-use REST API.
- Support for RGBA to RGB conversion for JPEG formats.
- Temporary file handling and clean-up after processing.
- Return converted images as downloadable files.

---

## Technologies Used

### Backend:
- **Flask** - Lightweight web framework for Python.
- **Flask-CORS** - Handle Cross-Origin Resource Sharing.
- **Pillow (PIL)** - Image processing library.
- **Werkzeug** - Utilities for handling file uploads.
- **UUID** - Unique identifier generation for file names.
- **OS** - File system interaction (creating directories, removing files).
- **Time** - Handling time-related tasks for unique file naming.

### Deployment:
- Local deployment for testing.
- Can be deployed to cloud platforms like Heroku, Render, or AWS.

---

## Installation and Setup

To run this project locally, follow these steps:

### 1. Clone the Repository

Clone the repository to your local machine:
```bash
git clone https://github.com/yourusername/image-conversion-api.git
cd image-conversion-api
