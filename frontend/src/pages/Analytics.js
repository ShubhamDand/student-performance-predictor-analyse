import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart3, Loader2, TrendingUp, Brain, Target, Award } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const response = await axios.get(`${API}/model-info`);
      setModelInfo(response.data);
    } catch (error) {
      console.error('Error fetching model info:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!modelInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">No analytics data available</p>
      </div>
    );
  }

  // Prepare chart data
  const featureImportanceData = Object.entries(modelInfo.feature_importance).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    importance: (value * 100).toFixed(1),
    value: value,
  }));

  const performanceDistData = Object.entries(modelInfo.dataset_stats.performance_distribution).map(([category, count]) => ({
    name: category,
    count: count,
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  const modelMetricsData = [
    { name: 'R² Score', value: (modelInfo.model_metrics.r2 * 100).toFixed(1) },
    { name: 'MAE', value: modelInfo.model_metrics.mae.toFixed(2) },
    { name: 'RMSE', value: modelInfo.model_metrics.rmse.toFixed(2) },
  ];

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6 shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-outfit text-slate-900 mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive insights into model performance and dataset statistics
          </p>
        </motion.div>

        {/* Model Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 mb-8 shadow-xl text-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-outfit">Active Model</h2>
                <p className="text-purple-200">{modelInfo.best_model}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{modelInfo.dataset_stats.total_samples}</p>
              <p className="text-purple-200">Training Samples</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-purple-200 text-sm mb-1">R² Score (Accuracy)</p>
              <p className="text-3xl font-bold">{(modelInfo.model_metrics.r2 * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-purple-200 text-sm mb-1">Mean Absolute Error</p>
              <p className="text-3xl font-bold">{modelInfo.model_metrics.mae.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-purple-200 text-sm mb-1">RMSE</p>
              <p className="text-3xl font-bold">{modelInfo.model_metrics.rmse.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Feature Importance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-card border border-slate-200"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold font-outfit text-slate-900">Feature Importance</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} angle={-15} textAnchor="end" height={80} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="importance" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-card border border-slate-200"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Award className="w-6 h-6 text-secondary" />
              <h3 className="text-xl font-bold font-outfit text-slate-900">Performance Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceDistData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {performanceDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Dataset Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-card border border-slate-200 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-bold font-outfit text-slate-900">Dataset Statistics</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Target Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
              <p className="text-sm text-purple-700 font-semibold mb-3">Performance Index</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Mean:</span>
                  <span className="font-semibold text-slate-900">{modelInfo.dataset_stats.target_stats.mean.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Min:</span>
                  <span className="font-semibold text-slate-900">{modelInfo.dataset_stats.target_stats.min.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Max:</span>
                  <span className="font-semibold text-slate-900">{modelInfo.dataset_stats.target_stats.max.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Feature Stats */}
            {Object.entries(modelInfo.dataset_stats.feature_stats).slice(0, 4).map(([feature, stats]) => (
              <div key={feature} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="text-sm text-slate-700 font-semibold mb-3">{feature.replace(/_/g, ' ')}</p>
                {stats.type === 'numeric' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mean:</span>
                      <span className="font-semibold text-slate-900">{stats.mean.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Range:</span>
                      <span className="font-semibold text-slate-900">
                        {stats.min.toFixed(0)}-{stats.max.toFixed(0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* All Models Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-card border border-slate-200"
        >
          <h3 className="text-xl font-bold font-outfit text-slate-900 mb-6">Model Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Model</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">R² Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">MAE</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">RMSE</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(modelInfo.all_models).map(([name, metrics]) => (
                  <tr key={name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900">{name}</td>
                    <td className="py-3 px-4 text-sm text-slate-900">{(metrics.r2 * 100).toFixed(2)}%</td>
                    <td className="py-3 px-4 text-sm text-slate-900">{metrics.mae.toFixed(3)}</td>
                    <td className="py-3 px-4 text-sm text-slate-900">{metrics.rmse.toFixed(3)}</td>
                    <td className="py-3 px-4">
                      {name === modelInfo.best_model ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                          Tested
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
