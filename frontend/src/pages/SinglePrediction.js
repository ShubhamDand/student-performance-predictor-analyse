import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calculator, Clock, Moon, Book, Award, Sliders, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = "https://student-performance-predictor-analyse.onrender.com";
const API = `${BACKEND_URL}/api`;

const SinglePrediction = () => {
  const [formData, setFormData] = useState({
    hours_studied: '',
    previous_scores: '',
    extracurricular_activities: 'No',
    sleep_hours: '',
    sample_question_papers_practiced: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [whatIfData, setWhatIfData] = useState(null);
  const [whatIfLoading, setWhatIfLoading] = useState(false);
  const [whatIfResult, setWhatIfResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ============================
  // 🎯 APPLY YOUR STUDY HOUR LOGIC
  // ============================
  const applyStudyHourLogic = (baseScore, hours) => {
    let adjustedScore = baseScore;

    if (hours === 3) adjustedScore = baseScore * 1.25;
    else if (hours === 4) adjustedScore = baseScore * 1.25;
    else if (hours === 5) adjustedScore = baseScore * 1.35;
    else if (hours === 6) adjustedScore = baseScore * 1.40;
    else if (hours === 7) adjustedScore = baseScore * 1.45;
    else if (hours === 8) adjustedScore = baseScore * 1.50;
    else if (hours === 9) adjustedScore = baseScore * 1.60;
   

    // Clamp 0–100
    adjustedScore = Math.max(0, Math.min(100, adjustedScore));

    // Recalculate category
    let category = "Poor";
    let color = "#ef4444";

    if (adjustedScore >= 85) {
      category = "Excellent";
      color = "#22c55e";
    } else if (adjustedScore >= 70) {
      category = "Good";
      color = "#3b82f6";
    } else if (adjustedScore >= 50) {
      category = "Average";
      color = "#f59e0b";
    }

    return { adjustedScore, category, color };
  };

  // ============================
  // MAIN PREDICTION
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (
      formData.hours_studied === '' ||
      formData.previous_scores === '' ||
      formData.sleep_hours === '' ||
      formData.sample_question_papers_practiced === ''
    ) {
      toast.error('All fields are required');
      return;
    }

    const hours = parseFloat(formData.hours_studied);
    if (isNaN(hours) || hours < 1 || hours > 9) {
      toast.error('Study hours must be between 1 and 9');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API}/predict`,
        {
          hours_studied: hours,
          previous_scores: parseFloat(formData.previous_scores),
          extracurricular_activities: formData.extracurricular_activities,
          sleep_hours: parseFloat(formData.sleep_hours),
          sample_question_papers_practiced: parseInt(formData.sample_question_papers_practiced),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 🔥 APPLY YOUR EXACT LOGIC
      const { adjustedScore, category, color } = applyStudyHourLogic(
        response.data.predicted_score,
        hours
      );

      setResult({
        ...response.data,
        predicted_score: adjustedScore,
        category,
        color
      });

      setWhatIfData({
        hours_studied: hours,
        previous_scores: parseFloat(formData.previous_scores),
        extracurricular_activities: formData.extracurricular_activities,
        sleep_hours: parseFloat(formData.sleep_hours),
        sample_question_papers_practiced: parseInt(formData.sample_question_papers_practiced),
      });

      setWhatIfResult(null);
      toast.success('Prediction generated successfully!');
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error('Failed to generate prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // WHAT-IF SIMULATION
  // ============================
  const handleWhatIfChange = (e) => {
    setWhatIfData({ ...whatIfData, [e.target.name]: e.target.value });
  };

  const runWhatIfSimulation = async () => {
    if (!whatIfData) return;

    setWhatIfLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API}/predict`,
        {
          hours_studied: parseFloat(whatIfData.hours_studied),
          previous_scores: parseFloat(whatIfData.previous_scores),
          extracurricular_activities: whatIfData.extracurricular_activities,
          sleep_hours: parseFloat(whatIfData.sleep_hours),
          sample_question_papers_practiced: parseInt(whatIfData.sample_question_papers_practiced),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 🔁 APPLY SAME RULE
      const { adjustedScore, category, color } = applyStudyHourLogic(
        response.data.predicted_score,
        parseFloat(whatIfData.hours_studied)
      );

      setWhatIfResult({
        ...response.data,
        predicted_score: adjustedScore,
        category,
        color
      });
    } catch (error) {
      console.error("What-if error:", error);
      toast.error('Failed to run What-If simulation');
    } finally {
      setWhatIfLoading(false);
    }
  };

  // ============================
  // AI INSIGHT GENERATOR
  // ============================
  const generateAIInsights = () => {
    if (!result) return [];

    const insights = [];
    const input = result.input_data;
    const score = result.predicted_score;

    if (input.sleep_hours < 6) {
      insights.push("😴 Sleeping less than 6 hours is reducing your performance. Try to sleep at least 7–8 hours.");
    }

    if (input.hours_studied < 5) {
      insights.push("📚 Increasing study hours to 5–7 hours/day can significantly improve your predicted score.");
    }

    if (input.sample_question_papers_practiced < 3) {
      insights.push("📝 Practicing more sample papers will strengthen exam readiness and boost performance.");
    }

    if (input.previous_scores < 60) {
      insights.push("⚠️ Your previous academic base is weak. Focus on fundamentals and revision to improve future outcomes.");
    }

    if (score < 60) {
      insights.push("🚀 With better habits, your performance can move into the ‘Good’ category.");
    } else if (score >= 60 && score < 80) {
      insights.push("🎯 You are close to the ‘Excellent’ category. A little more consistency can push you further.");
    } else {
      insights.push("🏆 Excellent performance! Maintain this routine to stay ahead.");
    }

    return insights;
  };

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        {/* HEADER */}
        <motion.div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-6 shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Student Performance Predictor</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Predict performance and explore how changes can improve results
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* FORM */}
          <div className="bg-white rounded-2xl p-8 shadow border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { name: 'hours_studied', label: 'Study Hours per Day (1–9)', min: 1, max: 9, icon: Clock },
                { name: 'previous_scores', label: 'Previous Score (%)', min: 0, max: 100, icon: Award },
                { name: 'sleep_hours', label: 'Sleep Hours', min: 0, max: 12, icon: Moon },
                { name: 'sample_question_papers_practiced', label: 'Sample Papers', min: 0, max: 15, icon: Book },
              ].map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{field.label}</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <input
                        type="number"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        min={field.min}
                        max={field.max}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                );
              })}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Extracurricular Activities
                </label>
                <select
                  name="extracurricular_activities"
                  value={formData.extracurricular_activities}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold"
              >
                {loading ? 'Predicting...' : 'Predict Performance'}
              </button>
            </form>
          </div>

          {/* RESULT PANEL (UNCHANGED UI) */}
          <div className="bg-white rounded-2xl p-8 shadow border border-slate-200">
            {result ? (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">Prediction Result</h3>
                  <div
                    className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4"
                    style={{ backgroundColor: `${result.color}20` }}
                  >
                    <p className="text-4xl font-bold" style={{ color: result.color }}>
                      {result.predicted_score.toFixed(1)}
                    </p>
                  </div>
                  <div
                    className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
                    style={{ backgroundColor: result.color }}
                  >
                    {result.category}
                  </div>
                </div>

                {/* AI INSIGHTS */}
                <div className="border-t pt-6">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    AI Insights & Recommendations
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {generateAIInsights().map((tip, index) => (
                      <li key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WHAT-IF SIMULATOR */}
                {whatIfData && (
                  <div className="border-t pt-6 space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-primary" />
                      What-If Simulator
                    </h4>

                    {Object.keys(whatIfData).map((field) => (
                      <div key={field}>
                        <label className="text-sm text-slate-600 capitalize">
                          {field.replace(/_/g, ' ')}
                        </label>
                        <input
                          type="range"
                          min={field === 'hours_studied' ? 1 : field === 'previous_scores' ? 0 : 0}
                          max={field === 'hours_studied' ? 9 : field === 'previous_scores' ? 100 : 24}
                          step="1"
                          name={field}
                          value={whatIfData[field]}
                          onChange={handleWhatIfChange}
                          className="w-full"
                        />
                        <p className="text-sm font-semibold">{whatIfData[field]}</p>
                      </div>
                    ))}

                    <button
                      onClick={runWhatIfSimulation}
                      disabled={whatIfLoading}
                      className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
                    >
                      {whatIfLoading ? 'Simulating...' : 'Run What-If Simulation'}
                    </button>

                    {whatIfResult && (
                      <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
                        <p className="text-sm font-semibold">
                          📈 Simulated Score: {whatIfResult.predicted_score.toFixed(1)} ({whatIfResult.category})
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          👉 More study hours directly increase predicted performance.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-600 text-center">Fill the form and predict to see results.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePrediction;
