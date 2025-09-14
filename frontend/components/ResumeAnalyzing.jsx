// src/components/ResumeAnalyzing.js
import React, { useState } from 'react';
import axios from 'axios';
import { AnalysisReport } from './AnalysisReport';


// Base URL for your FastAPI backend
const API_URL = 'http://127.0.0.1:8000/api/resume';

export default function ResumeAnalyzing() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setAnalysis(null);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file) {
      setError('Please choose a PDF file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file); // The FastAPI backend expects the key to be 'file'

    try {
      setLoading(true);
      setError('');
      setAnalysis(null);

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });

      setAnalysis(res.data.analysis);
    } catch (err) {
      const errorMessage = err?.response?.data?.detail || err.message || 'An unknown error occurred.';
      setError(`Analysis failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume Analysis</h1>
      <p className="text-gray-700 mb-6">
        Upload your resume in PDF format to get an in-depth analysis powered by AI.
      </p>

      {/* --- THIS IS THE MISSING UI SECTION --- */}
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
        <input
          id="resume-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
        <label
          htmlFor="resume-upload"
          className={`cursor-pointer font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Choose PDF File
        </label>
        {file && (
          <p className="mt-4 text-sm text-gray-700">
            Selected: <strong>{file.name}</strong>
          </p>
        )}
      </div>

      <button
        onClick={handleAnalyzeClick}
        className={`mt-6 w-full py-3 px-4 text-white font-bold rounded-lg shadow-md transition-all duration-300 ${
          file ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
        } ${loading && 'animate-pulse'}`}
        disabled={!file || loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
      {/* --- END OF MISSING UI SECTION --- */}


      <div className="mt-4 text-center">
        {error && <p className="text-red-600 font-semibold">{error}</p>}
      </div>

      {analysis && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <AnalysisReport analysis={analysis} />
        </div>
      )}
    </div>
  );
}