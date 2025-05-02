// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [targetFormat, setTargetFormat] = useState('png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formats, setFormats] = useState([]);

  useEffect(() => {
    // Fetch available formats from the backend fdfdf
    fetch('http://localhost:5000/api/formats')
      .then(response => response.json())
      .then(data => {
        setFormats(data.formats);
        if (data.formats.length > 0) {
          setTargetFormat(data.formats[0]);
        }
      })
      .catch(err => {
        setError('Failed to fetch supported formats');
        console.error(err);
      });
  }, []);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle format selection
  const handleFormatChange = (event) => {
    setTargetFormat(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('format', targetFormat);
      
      const response = await fetch('http://localhost:5000/api/convert', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert image');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `converted-image.${targetFormat}`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err) {
      setError(err.message || 'An error occurred during conversion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Converter</h1>
        <p>Convert your images to different formats</p>
      </header>
      
      <main className="App-content">
        <form onSubmit={handleSubmit} className="converter-form">
          <div className="file-input-container">
            <label htmlFor="image-upload" className="file-input-label">
              Select Image
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
          
          {preview && (
            <div className="image-preview-container">
              <h3>Preview</h3>
              <img src={preview} alt="Preview" className="image-preview" />
              <p>Original format: {selectedFile?.name.split('.').pop()}</p>
            </div>
          )}
          
          <div className="format-selector">
            <label htmlFor="format-select">Convert to:</label>
            <select
              id="format-select"
              value={targetFormat}
              onChange={handleFormatChange}
              disabled={loading}
            >
              {formats.map(format => (
                <option key={format} value={format}>{format.toUpperCase()}</option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="convert-button"
            disabled={!selectedFile || loading}
          >
            {loading ? 'Converting...' : 'Convert Image'}
          </button>
          
          {error && <p className="error-message">{error}</p>}
        </form>
      </main>
    </div>
  );
}

export default App;