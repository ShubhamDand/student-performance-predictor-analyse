import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BarChart3, Loader2, Brain, Target, Award } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

/* Backend URL */
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

const API = `${BACKEND_URL}/api`;

console.log("Analytics Backend URL:", BACKEND_URL);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You are not logged in");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API}/model-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Analytics data:", response.data);

      setModelInfo(response.data || {});
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  /* Loading Screen */
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

  /* Chart Data */
  const featureImportanceData = Object.entries(
    modelInfo?.feature_importance || {}
  ).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    importance: Number((value * 100).toFixed(1)),
  }));

  const performanceDistData = Object.entries(
    modelInfo?.dataset_stats?.performance_distribution || {}
  ).map(([category, count]) => ({
    name: category,
    count: count,
  }));

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="min-h-screen py-12 md:py-20 bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6 shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Analytics Dashboard
          </h1>

          <p className="text-lg text-slate-600">
            Insights into model performance and dataset statistics
          </p>
        </motion.div>

        {/* Model Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 mb-10 shadow-xl text-white"
        >
          <div className="flex justify-between mb-6 flex-wrap gap-4">

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Brain className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Active Model</h2>
                <p className="text-purple-200">
                  {modelInfo?.best_model || "N/A"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold">
                {modelInfo?.dataset_stats?.total_samples || 0}
              </p>
              <p className="text-purple-200">Training Samples</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-purple-200 text-sm">R² Accuracy</p>
              <p className="text-3xl font-bold">
                {modelInfo?.model_metrics?.r2
                  ? (modelInfo.model_metrics.r2 * 100).toFixed(1)
                  : "0"}
                %
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-purple-200 text-sm">MAE</p>
              <p className="text-3xl font-bold">
                {modelInfo?.model_metrics?.mae
                  ? modelInfo.model_metrics.mae.toFixed(2)
                  : "0"}
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-purple-200 text-sm">RMSE</p>
              <p className="text-3xl font-bold">
                {modelInfo?.model_metrics?.rmse
                  ? modelInfo.model_metrics.rmse.toFixed(2)
                  : "0"}
              </p>
            </div>

          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Feature Importance */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold">Feature Importance</h3>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="importance" fill="#7C3AED" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border">
            <div className="flex items-center space-x-3 mb-6">
              <Award className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold">Performance Distribution</h3>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceDistData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ name, count }) => `${name}: ${count}`}
                >
                  {performanceDistData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Analytics;