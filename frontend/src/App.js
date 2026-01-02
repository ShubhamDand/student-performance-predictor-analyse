import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import SinglePrediction from "./pages/SinglePrediction";
import BatchPrediction from "./pages/BatchPrediction";
import Analytics from "./pages/Analytics";
import Navigation from "./components/Navigation";
import "@/App.css";

function App() {
  return (
    <div className="App min-h-screen bg-slate-50">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<SinglePrediction />} />
          <Route path="/batch" element={<BatchPrediction />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;
