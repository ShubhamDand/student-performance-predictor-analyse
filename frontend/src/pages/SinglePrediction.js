import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calculator, Loader2, TrendingUp, Clock, Moon, Book, Award } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API}/predict`, {
        hours_studied: parseFloat(formData.hours_studied),
        previous_scores: parseFloat(formData.previous_scores),
        extracurricular_activities: formData.extracurricular_activities,
        sleep_hours: parseFloat(formData.sleep_hours),
        sample_question_papers_practiced: parseInt(formData.sample_question_papers_practiced),
      });

      setResult(response.data);
      toast.success('Prediction generated successfully!');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to generate prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    {
      name: 'hours_studied',
      label: 'Hours Studied per Week',
      type: 'number',
      min: 0,
      max: 168,
      step: 0.5,
      icon: Clock,
      placeholder: 'e.g., 25',
    },
    {
      name: 'previous_scores',
      label: 'Previous Scores (%)',
      type: 'number',
      min: 0,
      max: 100,
      step: 1,
      icon: Award,
      placeholder: 'e.g., 85',
    },
    {
      name: 'sleep_hours',
      label: 'Average Sleep Hours per Day',
      type: 'number',
      min: 0,
      max: 24,
      step: 0.5,
      icon: Moon,
      placeholder: 'e.g., 7',
    },
    {
      name: 'sample_question_papers_practiced',
      label: 'Sample Papers Practiced',
      type: 'number',
      min: 0,
      step: 1,
      icon: Book,
      placeholder: 'e.g., 5',
    },
  ];

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-6 shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-outfit text-slate-900 mb-4">
            Student Performance Predictor
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Enter student information to predict their academic performance using our AI model
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                {inputFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.name}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        <input
                          type={field.type}
                          name={field.name}
                          data-testid={`input-${field.name}`}
                          value={formData[field.name]}
                          onChange={handleChange}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          placeholder={field.placeholder}
                          required
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
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
                    data-testid="input-extracurricular_activities"
                    value={formData.extracurricular_activities}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <button
                  type="submit"
                  data-testid="predict-button"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold hover:shadow-hover transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Predicting...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span>Predict Performance</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-200 h-full">
              {result ? (
                <div data-testid="prediction-result" className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold font-outfit text-slate-900 mb-4">
                      Prediction Result
                    </h3>
                    <div
                      className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4"
                      style={{ backgroundColor: `${result.color}20` }}
                    >
                      <div className="text-center">
                        <p className="text-4xl font-bold" style={{ color: result.color }}>
                          {result.predicted_score.toFixed(1)}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">Score</p>
                      </div>
                    </div>
                    <div
                      className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
                      style={{ backgroundColor: result.color }}
                    >
                      {result.category}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6 space-y-4">
                    <h4 className="font-bold text-slate-900">Input Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-600 mb-1">Study Hours</p>
                        <p className="font-semibold text-slate-900">
                          {result.input_data.hours_studied}h/week
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-600 mb-1">Previous Score</p>
                        <p className="font-semibold text-slate-900">
                          {result.input_data.previous_scores}%
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-600 mb-1">Sleep Hours</p>
                        <p className="font-semibold text-slate-900">
                          {result.input_data.sleep_hours}h/day
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-600 mb-1">Sample Papers</p>
                        <p className="font-semibold text-slate-900">
                          {result.input_data.sample_question_papers_practiced}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-600">
                      Fill in the form and click predict to see results
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SinglePrediction;
