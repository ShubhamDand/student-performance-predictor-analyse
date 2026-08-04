import AIChatbot from "../components/AIChatbot.jsx/AIChatbot";
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Upload, BarChart3, TrendingUp, Brain, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Single Prediction',
      description: 'Get instant performance predictions for individual students',
      link: '/predict',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: Upload,
      title: 'Batch Upload',
      description: 'Upload CSV files for bulk student performance analysis',
      link: '/batch',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Visualize data insights and model performance metrics',
      link: '/analytics',
      color: 'from-orange-500 to-red-600',
    },
  ];

  const stats = [
    { icon: Brain, label: 'ML Model Accuracy', value: '95%+' },
    { icon: TrendingUp, label: 'Predictions Made', value: '10K+' },
    { icon: Clock, label: 'Real-time Results', value: '<1s' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-teal-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-outfit tracking-tight text-slate-900 mb-6">
                Predict Student Success with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  AI Precision
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed">
                Advanced machine learning algorithms analyze multiple factors to predict student performance. 
                Empower educators with data-driven insights for better academic outcomes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/predict"
                  data-testid="get-started-button"
                  className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:shadow-hover transition-shadow"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/analytics"
                  data-testid="view-analytics-button"
                  className="inline-flex items-center px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold border-2 border-slate-200 hover:border-primary transition-colors"
                >
                  View Analytics
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1589872880544-76e896b0592c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMG1vZGVybiUyMGxpYnJhcnl8ZW58MHx8fHwxNzY3MzQyNzM2fDA&ixlib=rb-4.1.0&q=85"
                  alt="Students studying"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">95%</p>
                      <p className="text-sm text-slate-600">Accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-outfit text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to analyze and predict student performance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={feature.link}
                    data-testid={`feature-card-${index}`}
                    className="block h-full bg-white rounded-2xl p-8 shadow-card hover:shadow-hover transition-all card-hover border border-slate-200"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold font-outfit text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-primary font-semibold">
                      Learn more
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-6 md:px-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-6">
            Ready to Transform Student Outcomes?
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Start predicting student performance with our AI-powered platform today
          </p>
          <Link
            to="/predict"
            data-testid="cta-button"
            className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:shadow-2xl transition-shadow"
          >
            Start Predicting Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ================= AI CHATBOT ADDED HERE ================= */}
      <AIChatbot />

    </div>
  );
};

export default Home;
