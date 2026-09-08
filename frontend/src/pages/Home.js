import React from "react";
import AIChatbot from "../components/AIChatbot.jsx/AIChatbot";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  Upload,
  BarChart3,
  TrendingUp,
  Brain,
  Clock,
  CheckCircle2,
  GraduationCap,
  LineChart,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const features = [
    {
      icon: Calculator,
      title: "Single Student Prediction",
      description:
        "Enter student academic and behavioral information to predict performance using our machine-learning model.",
      link: "/predict",
      button: "Predict Performance",
    },
    {
      icon: Upload,
      title: "Batch Student Analysis",
      description:
        "Upload a CSV file containing multiple student records and generate performance predictions for the entire dataset.",
      link: "/batch",
      button: "Analyze Students",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Explore model metrics, performance categories, trends, and analytical insights through the analytics dashboard.",
      link: "/analytics",
      button: "View Analytics",
    },
  ];

  const stats = [
    {
      icon: Brain,
      label: "Prediction Technology",
      value: "Machine Learning",
    },
    {
      icon: TrendingUp,
      label: "Performance Insights",
      value: "Data-Driven",
    },
    {
      icon: Clock,
      label: "Prediction Results",
      value: "Real-Time",
    },
  ];

  const benefits = [
    "Predict individual student performance",
    "Analyze multiple students using CSV upload",
    "Understand important performance factors",
    "Explore academic performance through analytics",
    "Get personalized guidance with the AI Study Mentor",
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute top-40 -left-24 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Sparkles size={16} />
                AI-Powered Academic Analysis
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-outfit tracking-tight text-slate-900 mb-6">
                Student Performance Predictor & Analyzer

                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-2">
                  Powered by Machine Learning
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed">
                Predict student academic performance using machine learning.
                Analyze study hours, previous scores, sleep habits,
                extracurricular activities, and practice patterns to
                understand performance and make better study decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">

                <Link
                  to="/predict"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  Predict Performance
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/analytics"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  Explore Analytics
                  <BarChart3 size={18} />
                </Link>

              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  Machine Learning
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  Individual Prediction
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  Batch Analysis
                </div>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-8">

                <div className="flex items-center justify-between mb-7">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                      <GraduationCap
                        size={24}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        Student Analysis
                      </p>
                      <p className="text-sm text-slate-500">
                        Performance Prediction
                      </p>
                    </div>
                  </div>

                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>

                {/* Mock Analysis Card */}
                <div className="bg-slate-50 rounded-2xl p-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500">
                      Predicted Performance
                    </span>

                    <LineChart
                      size={20}
                      className="text-primary"
                    />
                  </div>

                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-slate-900">
                      AI
                    </span>

                    <span className="text-sm text-green-600 font-medium mb-1">
                      Data-Driven Prediction
                    </span>
                  </div>
                </div>

                {/* Input Factors */}
                <div className="space-y-3">

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-sm text-slate-600">
                      Study Hours
                    </span>

                    <span className="font-semibold text-slate-900">
                      Analyzed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-sm text-slate-600">
                      Previous Scores
                    </span>

                    <span className="font-semibold text-slate-900">
                      Analyzed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-sm text-slate-600">
                      Sleep & Practice
                    </span>

                    <span className="font-semibold text-slate-900">
                      Analyzed
                    </span>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =========================================================
          SEO / ABOUT SECTION
      ========================================================= */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12">

          <div className="text-center mb-10">

            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-slate-900 mb-4">
              Student Performance Prediction and Analysis
            </h2>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              Student Performance Predictor and Analyzer is a
              machine-learning platform designed to help students and
              educators understand academic performance. The platform
              analyzes important academic and lifestyle factors to generate
              performance predictions and useful insights.
            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* How It Works */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <Brain
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-4">
                How Does the Student Performance Predictor Work?
              </h3>

              <p className="text-slate-600 leading-relaxed">
                Enter information such as study hours, previous scores,
                sleep hours, extracurricular activities, and practice
                habits. Our machine-learning model analyzes these factors
                and generates a predicted performance score and performance
                category.
              </p>

            </div>

            {/* What Can You Analyze */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">

              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-5">
                <BarChart3
                  size={24}
                  className="text-purple-600"
                />
              </div>

              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-4">
                What Can You Analyze?
              </h3>

              <p className="text-slate-600 leading-relaxed">
                Use single-student prediction for individual analysis or
                upload a CSV file for batch student performance analysis.
                The platform also provides analytics and an AI Study Mentor
                to help students understand and improve their study habits.
              </p>

            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          STATS SECTION
      ========================================================= */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-12">

          <div className="grid sm:grid-cols-3 gap-6">

            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 text-center"
                >

                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Icon
                      size={23}
                      className="text-primary"
                    />
                  </div>

                  <p className="text-xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </p>

                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

                </motion.div>
              );
            })}

          </div>

        </div>
      </section>


      {/* =========================================================
          FEATURES SECTION
      ========================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="text-center max-w-3xl mx-auto mb-14">

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
              <Sparkles size={16} />
              Powerful Features
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-slate-900 mb-4">
              Student Performance Analysis Tools
            </h2>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Use machine learning, data analysis, and AI-powered tools to
              understand student performance and make informed academic
              decisions.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-7">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="group bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >

                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Icon
                      size={27}
                      className="text-primary"
                    />
                  </div>

                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <Link
                    to={feature.link}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                  >
                    {feature.button}
                    <ArrowRight size={17} />
                  </Link>

                </motion.div>
              );
            })}

          </div>

        </div>
      </section>


      {/* =========================================================
          WHAT YOU CAN DO SECTION
      ========================================================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>

              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Why Use Student Performance Predictor?
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-slate-900 mt-3 mb-6">
                Turn Student Data Into Useful Academic Insights
              </h2>

              <p className="text-slate-600 leading-relaxed mb-8">
                Student performance prediction can help students and
                educators understand patterns in academic and behavioral
                data. GradeOracle combines prediction, analysis, and
                AI-powered guidance in one platform.
              </p>

              <div className="space-y-4">

                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={21}
                      className="text-green-600 mt-0.5 flex-shrink-0"
                    />

                    <span className="text-slate-700">
                      {benefit}
                    </span>
                  </div>
                ))}

              </div>

            </div>


            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">

              <div className="flex items-center gap-4 mb-7">

                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <GraduationCap
                    size={25}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900">
                    Academic Performance
                  </h3>

                  <p className="text-sm text-slate-500">
                    Analyze important student factors
                  </p>
                </div>

              </div>


              <div className="space-y-4">

                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Hours Studied
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      Input Factor
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Previous Scores
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      Input Factor
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Sleep Hours
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      Input Factor
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Sample Papers Practiced
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      Input Factor
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Extracurricular Activities
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      Input Factor
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          AI STUDY MENTOR SECTION
      ========================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">

          <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 md:p-12">

            <div className="grid md:grid-cols-2 gap-10 items-center">

              <div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-5">
                  <Sparkles size={16} />
                  AI Study Mentor
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold font-outfit mb-5">
                  Get Personalized Study Guidance
                </h2>

                <p className="text-slate-300 leading-relaxed mb-7">
                  Use the AI Study Mentor to ask questions, get study tips,
                  understand performance challenges, and receive
                  personalized academic guidance.
                </p>

                <p className="text-sm text-slate-400">
                  Your AI-powered academic companion is available directly
                  inside the platform.
                </p>

              </div>

              <div className="bg-white/10 border border-white/10 rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Brain size={22} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      AI Study Mentor
                    </p>

                    <p className="text-xs text-slate-400">
                      Personalized academic support
                    </p>
                  </div>

                </div>

                <div className="space-y-3">

                  <div className="bg-white/10 rounded-xl p-4 text-sm text-slate-200">
                    Ask about study strategies, exam preparation, or
                    improving academic performance.
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 text-sm text-slate-300">
                    Get clear and practical study recommendations based on
                    your questions.
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          FINAL CTA SECTION
      ========================================================= */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white shadow-md flex items-center justify-center">
            <TrendingUp
              size={30}
              className="text-primary"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-slate-900 mb-5">
            Ready to Analyze Student Performance?
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
            Start with a single student prediction, analyze multiple
            students using batch processing, or explore the analytics
            dashboard.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">

            <Link
              to="/predict"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Start Prediction
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/batch"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold hover:shadow-md transition-all"
            >
              Upload Student Data
              <Upload size={18} />
            </Link>

          </div>

        </div>
      </section>


      {/* =========================================================
          AI CHATBOT
      ========================================================= */}
      <AIChatbot />

    </div>
  );
};

export default Home;
