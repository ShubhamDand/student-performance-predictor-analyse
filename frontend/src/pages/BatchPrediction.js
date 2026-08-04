import { useState, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, Download, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";
const API = `${BACKEND_URL}/api`;

const COLORS = {
  Excellent: '#22c55e',
  Good: '#3b82f6',
  Average: '#f59e0b',
  Poor: '#ef4444'
};

const BatchPrediction = () => {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 20;

  // ==========================
  // FILE SELECT
  // ==========================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResults(null);
      toast.success("CSV file selected");
    } else {
      toast.error("Please select a CSV file");
      setFile(null);
    }
  };

  // ==========================
  // UPLOAD
  // ==========================
  const handleUpload = async () => {

    if (!file) {
      toast.error("Select CSV first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API}/predict-batch`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResults(response.data);
      setCurrentPage(1);

      toast.success("Batch prediction completed");

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.detail ||
        "Prediction failed"
      );

    } finally {
      setLoading(false);
    }

  };

  // ==========================
  // PAGINATION
  // ==========================
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = results
    ? results.predictions.slice(indexOfFirstRow, indexOfLastRow)
    : [];

  const totalPages = results
    ? Math.ceil(results.predictions.length / rowsPerPage)
    : 1;

  // ==========================
  // CHART DATA
  // ==========================
  const pieData = results
    ? Object.entries(results.summary.category_distribution).map(([k, v]) => ({
        name: k,
        value: v
      }))
    : [];

  const barData = currentRows.map((row, index) => ({
    name: `#${indexOfFirstRow + index + 1}`,
    score: row.predicted_score
  }));

  const lineData = results
    ? results.predictions.map((row, index) => ({
        name: index + 1,
        score: row.predicted_score
      }))
    : [];

  // ==========================
  // EXPORT CSV
  // ==========================
  const downloadCSV = () => {

    if (!results) return;

    const headers = "Index,Previous Score,Predicted Score,Category\n";

    const rows = results.predictions.map((p, i) =>
      `${i+1},${p.previous_score},${p.predicted_score.toFixed(2)},${p.category}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type:"text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "batch_predictions.csv";

    a.click();

    window.URL.revokeObjectURL(url);

    toast.success("CSV downloaded");

  };

  // ==========================
  // EXPORT EXCEL
  // ==========================
  const downloadExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(
      results.predictions.map((p,i)=>({
        Index:i+1,
        PreviousScore:p.previous_score,
        Predicted:p.predicted_score,
        Category:p.category
      }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Predictions");

    XLSX.writeFile(workbook, "predictions.xlsx");

    toast.success("Excel downloaded");

  };

  // ==========================
  // EXPORT PDF
  // ==========================
  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.text("Student Performance Report",14,10);

    const tableData = results.predictions.map((p,i)=>[
      i+1,
      p.previous_score,
      p.predicted_score.toFixed(1),
      p.category
    ]);

    autoTable(doc,{
      head:[["#","Previous Score","Predicted","Category"]],
      body:tableData,
      startY:20
    });

    doc.save("predictions.pdf");

    toast.success("PDF downloaded");

  };

  return (
    <div className="min-h-screen py-12">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-8">
          Batch Prediction
        </h1>

        {/* Upload */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="ml-4 bg-teal-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Upload & Predict"}
          </button>

        </div>

        {results && (

          <>

          {/* Charts */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" label>
                  {pieData.map((entry,index)=>(
                    <Cell key={index} fill={COLORS[entry.name]}/>
                  ))}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="score" fill="#0d9488"/>
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="score" stroke="#6366f1"/>
              </LineChart>
            </ResponsiveContainer>

          </div>

          {/* Export */}
          <div className="flex gap-3 mb-6">

            <button onClick={downloadCSV} className="bg-teal-600 text-white px-4 py-2 rounded">
              CSV
            </button>

            <button onClick={downloadExcel} className="bg-green-600 text-white px-4 py-2 rounded">
              Excel
            </button>

            <button onClick={downloadPDF} className="bg-red-600 text-white px-4 py-2 rounded">
              PDF
            </button>

          </div>

          {/* Table */}
          <table className="w-full border">

            <thead>
              <tr>
                <th>#</th>
                <th>Previous Score</th>
                <th>Predicted</th>
                <th>Category</th>
              </tr>
            </thead>

            <tbody>

              {currentRows.map((p,i)=>(
                <tr key={i}>
                  <td>{indexOfFirstRow+i+1}</td>
                  <td>{p.previous_score}</td>
                  <td>{p.predicted_score.toFixed(1)}</td>
                  <td>{p.category}</td>
                </tr>
              ))}

            </tbody>

          </table>

          </>

        )}

      </div>

    </div>
  );

};

export default BatchPrediction;