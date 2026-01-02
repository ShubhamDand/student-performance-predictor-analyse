import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, Download, Loader2, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BatchPrediction = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResults(null);
      toast.success('CSV file selected');
    } else {
      toast.error('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API}/predict-batch`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data);
      toast.success('Batch prediction completed!');
    } catch (error) {
      console.error('Batch prediction error:', error);
      toast.error(error.response?.data?.detail || 'Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `Hours Studied,Previous Scores,Extracurricular Activities,Sleep Hours,Sample Question Papers Practiced
7,99,Yes,9,1
4,82,No,4,2
8,51,Yes,7,2
5,75,No,8,5`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_student_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Sample CSV downloaded');
  };

  const downloadResults = () => {
    if (!results) return;

    const headers = 'Hours Studied,Previous Scores,Extracurricular Activities,Sleep Hours,Sample Papers,Predicted Score,Category\n';
    const rows = results.predictions.map(p => 
      `${p.input.hours_studied},${p.input.previous_scores},${p.input.extracurricular_activities},${p.input.sleep_hours},${p.input.sample_question_papers_practiced},${p.predicted_score.toFixed(2)},${p.category}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prediction_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Results downloaded');
  };

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-outfit text-slate-900 mb-4">
            Batch Prediction
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Upload a CSV file with student data to get predictions for multiple students at once
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-200">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  data-testid="file-input"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-2">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-slate-500">CSV files only</p>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUpload}
                  data-testid="upload-button"
                  disabled={!file || loading}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-hover transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload & Predict</span>
                    </>
                  )}
                </button>
                <button
                  onClick={downloadSampleCSV}
                  data-testid="download-sample-button"
                  className="px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-semibold hover:border-teal-500 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Sample</span>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">CSV Format Requirements:</p>
                  <p>Include columns: Hours Studied, Previous Scores, Extracurricular Activities, Sleep Hours, Sample Question Papers Practiced</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            data-testid="batch-results"
            className="space-y-8"
          >
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-card border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-slate-900">{results.summary.total_students}</p>
                  </div>
                  <FileText className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-card border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Average Score</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {results.summary.average_predicted_score.toFixed(1)}
                    </p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-secondary" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-card border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Highest Score</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {results.summary.max_score.toFixed(1)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                    🏆
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-card border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Lowest Score</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {results.summary.min_score.toFixed(1)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                    📊
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-outfit text-slate-900">
                  Performance Distribution
                </h3>
                <button
                  onClick={downloadResults}
                  data-testid="download-results-button"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-hover transition-shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Results</span>
                </button>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {Object.entries(results.summary.category_distribution).map(([category, count]) => {
                  const colors = {
                    Excellent: 'from-green-500 to-emerald-600',
                    Good: 'from-blue-500 to-indigo-600',
                    Average: 'from-yellow-500 to-orange-600',
                    Poor: 'from-red-500 to-pink-600',
                  };
                  return (
                    <div key={category} className={`bg-gradient-to-br ${colors[category]} rounded-xl p-6 text-white`}>
                      <p className="text-3xl font-bold mb-2">{count}</p>
                      <p className="text-sm opacity-90">{category}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Predictions Table */}
            <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-200 overflow-hidden">
              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-6">
                Detailed Predictions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">#</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Hours Studied</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Prev. Score</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Sleep</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Predicted</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.predictions.slice(0, 10).map((pred, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-slate-600">{index + 1}</td>
                        <td className="py-3 px-4 text-sm text-slate-900">{pred.input.hours_studied}</td>
                        <td className="py-3 px-4 text-sm text-slate-900">{pred.input.previous_scores}%</td>
                        <td className="py-3 px-4 text-sm text-slate-900">{pred.input.sleep_hours}h</td>
                        <td className="py-3 px-4 text-sm font-semibold text-slate-900">
                          {pred.predicted_score.toFixed(1)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: pred.color }}
                          >
                            {pred.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {results.predictions.length > 10 && (
                  <p className="text-center text-sm text-slate-500 mt-4">
                    Showing 10 of {results.predictions.length} predictions. Download for full results.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BatchPrediction;
