// src/components/History.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnalysisReport } from './AnalysisReport';

// Base URL for your FastAPI backend
const API_URL = 'http://127.0.0.1:8000/api/resume';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');
        // CORRECTED: Use the correct API URL
        const res = await axios.get(API_URL);
        setHistory(res.data);
      } catch (err) {
        const errorMessage = err?.response?.data?.detail || err.message || 'An unknown error occurred.';
        setError(`Failed to fetch history: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // CORRECTED: Function to fetch full details for a single resume
  const handleDetailsClick = async (resumeId) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${resumeId}`);
      // The full analysis is inside the 'analysis' property of the response
      setSelectedAnalysis(res.data.analysis);
    } catch (err) {
      // Handle error inside the modal if needed
      console.error("Failed to fetch details", err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnalysis(null);
  };

  if (loading) { /* ... (loading state is fine) ... */ }
  if (error) { /* ... (error state is fine) ... */ }
  if (history.length === 0) { /* ... (empty state is fine) ... */ }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analysis History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 uppercase">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 uppercase">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 uppercase">Filename</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 uppercase">Date Analyzed</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {history.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                {/* CORRECTED: Access data directly from the item, not item.analysis */}
                <td className="py-3 px-4">{item.name || 'N/A'}</td>
                <td className="py-3 px-4">{item.email || 'N/A'}</td>
                <td className="py-3 px-4">{item.filename}</td>
                <td className="py-3 px-4">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <button
                    // CORRECTED: Pass the resume ID to the click handler
                    onClick={() => handleDetailsClick(item.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AnalysisDetailModal
          analysis={selectedAnalysis}
          isLoading={modalLoading}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

// CORRECTED: Updated modal to handle its own loading state
const AnalysisDetailModal = ({ analysis, isLoading, closeModal }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold">&times;</button>
        {isLoading ? (
          <p>Loading details...</p>
        ) : (
          <AnalysisReport analysis={analysis} />
        )}
      </div>
    </div>
  );
};