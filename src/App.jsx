import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Code, CheckCircle, PenTool, Loader2, Sun, Moon, ArrowLeft } from 'lucide-react';

// --- OPTIMIZED Interactive Neural Network Background ---
function NetworkBackground({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // PERFORMANCE FIX: Detect mobile and hard-cap particles to prevent lag
      const isMobile = window.innerWidth <= 768;
      const maxParticles = isMobile ? 25 : 65;

      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.8 : 1.2), // Slower on mobile
          vy: (Math.random() - 0.5) * (isMobile ? 0.8 : 1.2),
        });
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isMobile = window.innerWidth <= 768;

      const nodeColor = isDark ? '148, 163, 184' : '192, 132, 252';
      const mouseLineColor = isDark ? '99, 102, 241' : '147, 51, 234';

      // Performance Fix: Shorter line distances on mobile
      const connectDist = isMobile ? 80 : 120;
      const mouseDist = isMobile ? 140 : 220;

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeColor}, 0.6)`;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < connectDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${nodeColor}, ${0.3 - dist / (connectDist * 3)})`;
            ctx.stroke();
          }
        }

        const distMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (distMouse < mouseDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${mouseLineColor}, ${0.8 - distMouse / mouseDist})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(true); // Default to dark mode for that hacker aesthetic

  const handleSubmit = async (e) => {
    e.preventDefault();

    // STRICT VALIDATION: Description is strictly compulsory and needs detail
    if (!description || description.trim().length < 15) {
      setError("Please provide a detailed description (at least 15 characters) so the AI can properly analyze your project's intent.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://projito-backend.onrender.com/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ github_url: githubUrl, description }),
      });
      const data = await response.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch (err) {
      setError("Failed to connect to the backend server. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setGithubUrl('');
    setDescription('');
    setError(null);
  };

  const scoreData = result ? [
    { name: 'Score', value: result.score },
    { name: 'Remaining', value: 100 - result.score }
  ] : [];

  const metricData = result ? [
    { name: 'Strengths', count: result.strengths.length },
    { name: 'Improvements', count: result.improvements.length }
  ] : [];

  return (
    <div className={`min-h-screen font-sans relative overflow-x-hidden transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-200 selection:bg-indigo-500/30' : 'bg-[#f8f5ff] text-slate-800 selection:bg-purple-200'
      }`}>

      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full backdrop-blur-md border z-50 transition-all hover:scale-110 shadow-lg ${isDark ? 'bg-slate-800/50 border-slate-700 text-yellow-400' : 'bg-white/50 border-purple-200 text-indigo-600'
          }`}
      >
        {isDark ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>

      {/* Backgrounds */}
      <NetworkBackground isDark={isDark} />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Softened glows for better mobile performance */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className={`absolute -top-32 -right-32 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] transition-colors duration-700 ${isDark ? 'bg-indigo-900/20' : 'bg-purple-300/30'
            }`} />
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 relative z-10">

        <AnimatePresence mode="wait">

          {/* ================= PAGE 1: HOME FORM ================= */}
          {!result ? (
            <motion.div
              key="home-page"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8 sm:mb-12">
                <div className={`inline-flex items-center justify-center p-3 shadow-sm rounded-2xl mb-4 sm:mb-6 border transition-colors ${isDark ? 'bg-slate-900/80 border-slate-800 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-white border-purple-100'
                  }`}>
                  <Sparkles className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'text-indigo-400' : 'text-purple-600'}`} />
                </div>
                <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  AI Project <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-indigo-400 to-blue-400' : 'from-purple-600 to-purple-400'}`}>Evaluator</span>
                </h1>
                <p className={`text-base sm:text-lg max-w-2xl mx-auto px-2 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Experience high-end Llama 3 analysis. Paste your repository to generate a premium code diagnostic.
                </p>
              </div>

              <div className={`backdrop-blur-xl shadow-2xl rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 mb-12 border transition-colors duration-500 ${isDark ? 'bg-slate-900/70 shadow-black/50 border-slate-800/60' : 'bg-white/80 shadow-purple-900/5 border-white'
                }`}>
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div>
                    <label className={`flex items-center text-sm font-semibold mb-2 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Code className={`w-4 h-4 mr-2 ${isDark ? 'text-indigo-400' : 'text-purple-500'}`} /> GitHub Repository URL(make sure to remove(.git))
                    </label>
                    <input type="url" required value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username/repository "
                      className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl outline-none transition-all focus:ring-4 text-sm sm:text-base ${isDark ? 'bg-slate-950/50 border border-slate-800 text-white placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500' : 'bg-white/50 border border-purple-100 text-slate-800 placeholder-slate-300 focus:ring-purple-500/20 focus:border-purple-500'
                        }`} />
                  </div>

                  <div>
                    <label className={`flex items-center text-sm font-semibold mb-2 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Project Description <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea required rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Compulsory: Briefly describe what this project does and the tech stack (Min 15 chars)..."
                      className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl outline-none transition-all resize-none focus:ring-4 text-sm sm:text-base ${isDark ? 'bg-slate-950/50 border border-slate-800 text-white placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500' : 'bg-white/50 border border-purple-100 text-slate-800 placeholder-slate-300 focus:ring-purple-500/20 focus:border-purple-500'
                        }`} />
                  </div>

                  <button type="submit" disabled={loading}
                    className={`w-full relative overflow-hidden group py-3 sm:py-4 px-6 rounded-xl font-bold text-white transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed ${isDark ? 'shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]' : 'hover:shadow-purple-500/30'
                      }`}>
                    <div className={`absolute inset-0 transition-transform duration-300 group-hover:scale-[1.02] ${isDark ? 'bg-gradient-to-r from-indigo-600 to-blue-600 opacity-90' : 'bg-gradient-to-r from-purple-600 to-purple-400'
                      }`} />
                    <div className="relative flex items-center justify-center text-sm sm:text-base">
                      {loading ? <><Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-3 animate-spin" /> Analyzing...</> : 'Run Diagnostic'}
                    </div>
                  </button>
                </form>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-5 sm:mt-6 p-3 sm:p-4 text-sm sm:text-base border rounded-xl flex items-start shadow-lg ${isDark ? 'bg-red-950/50 text-red-400 border-red-900/50' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>⚠️ <span className="ml-2">{error}</span></motion.div>
                )}
              </div>
            </motion.div>
          ) : (

            /* ================= PAGE 2: RESULTS DASHBOARD ================= */
            <motion.div
              key="results-page"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Back Navigation Bar - Mobile friendly wrap */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 sm:mb-8 gap-4">
                <button
                  onClick={handleReset}
                  className={`flex items-center justify-center px-4 sm:px-5 py-3 rounded-xl font-bold transition-all shadow-sm text-sm sm:text-base ${isDark ? 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white'
                    : 'bg-white/80 text-purple-700 border border-purple-100 hover:bg-white hover:shadow-md'
                    }`}
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Analyze New Project
                </button>
                <div className={`text-xs sm:text-sm text-center font-semibold tracking-wider uppercase px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg ${isDark ? 'bg-slate-900/50 text-slate-400 border border-slate-800' : 'bg-white/50 text-slate-500 border border-purple-100'
                  }`}>
                  Diagnostic Complete
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                {/* Score Donut */}
                <div className={`backdrop-blur-xl p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border shadow-xl flex flex-col items-center justify-center relative transition-colors duration-500 ${isDark ? 'bg-slate-900/70 border-slate-800/60 shadow-black/50' : 'bg-white/80 border-white shadow-purple-900/5'
                  }`}>
                  <h3 className={`text-base sm:text-lg font-bold absolute top-6 sm:top-8 left-6 sm:left-8 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Overall Score</h3>
                  <div className="h-[200px] sm:h-[250px] w-full mt-8 sm:mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={scoreData} innerRadius={60} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value" stroke="none" animationDuration={1500}>
                          <Cell fill="url(#dynamicGradient)" />
                          <Cell fill={isDark ? '#1e293b' : '#f1f5f9'} />
                        </Pie>
                        <defs>
                          <linearGradient id="dynamicGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={isDark ? "#6366f1" : "#9333ea"} />
                            <stop offset="100%" stopColor={isDark ? "#3b82f6" : "#c084fc"} />
                          </linearGradient>
                        </defs>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center mt-8 sm:mt-6">
                    <span className={`text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b ${isDark ? 'from-white to-slate-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'from-purple-700 to-purple-500'
                      }`}>{result.score}</span>
                  </div>
                </div>

                {/* Analytical Bar Chart (Upgraded to look more 'Real') */}
                <div className={`backdrop-blur-xl p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border shadow-xl flex flex-col transition-colors duration-500 ${isDark ? 'bg-slate-900/70 border-slate-800/60 shadow-black/50' : 'bg-white/80 border-white shadow-purple-900/5'
                  }`}>
                  <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Matrix Distribution</h3>
                  <div className="flex-grow min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metricData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                        {/* Added Grid lines to make it look like a real analytical dashboard */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : '#fff', borderRadius: '12px', color: isDark ? '#f8fafc' : '#333' }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={1500}>
                          {metricData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? (isDark ? '#6366f1' : '#8b5cf6') : (isDark ? '#3b82f6' : '#d8b4fe')} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Text Feedback Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                {/* Strengths Card */}
                <div className={`backdrop-blur-xl p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border shadow-xl transition-colors duration-500 ${isDark ? 'bg-slate-900/70 border-slate-800/60 shadow-black/50' : 'bg-white/80 border-white shadow-purple-900/5'
                  }`}>
                  <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <CheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 mr-3 ${isDark ? 'text-emerald-400' : 'text-purple-500'}`} /> Key Strengths
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {result.strengths.map((item, index) => (
                      <motion.li
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (index * 0.1) }}
                        key={index} className={`flex items-start p-3 sm:p-4 rounded-xl border transition-colors text-sm sm:text-base ${isDark ? 'text-slate-300 bg-slate-950/50 border-slate-800/80' : 'text-slate-600 bg-purple-50/50 border-purple-100/50'
                          }`}
                      >
                        <span className={`h-2 w-2 mt-1.5 sm:mt-2 mr-3 rounded-full shrink-0 ${isDark ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-purple-400'}`} />
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Improvements Card */}
                <div className={`backdrop-blur-xl p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border shadow-xl transition-colors duration-500 ${isDark ? 'bg-slate-900/70 border-slate-800/60 shadow-black/50' : 'bg-white/80 border-white shadow-purple-900/5'
                  }`}>
                  <h3 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <PenTool className={`w-5 h-5 sm:w-6 sm:h-6 mr-3 ${isDark ? 'text-amber-400' : 'text-purple-400'}`} /> Action Items
                  </h3>
                  {result.improvements.length === 0 ? (
                    <p className={`font-medium p-4 rounded-xl border text-sm sm:text-base ${isDark ? 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50' : 'text-purple-600 bg-purple-50 border-purple-100'
                      }`}>
                      🎉 Excellent work! No major improvements needed based on current parameters.
                    </p>
                  ) : (
                    <ul className="space-y-3 sm:space-y-4">
                      {result.improvements.map((item, index) => (
                        <motion.li
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (index * 0.1) }}
                          key={index} className={`flex items-start p-3 sm:p-4 rounded-xl border transition-colors text-sm sm:text-base ${isDark ? 'text-slate-300 bg-slate-950/50 border-slate-800/80' : 'text-slate-600 bg-slate-50 border-slate-100'
                            }`}
                        >
                          <span className={`h-2 w-2 mt-1.5 sm:mt-2 mr-3 rounded-full shrink-0 ${isDark ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]' : 'bg-slate-300'}`} />
                          <span className="leading-relaxed">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}