/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Info, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Wrench,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// --- Types ---

type Stroke = 'Hisap' | 'Kompresi' | 'Usaha' | 'Buang';

interface ComponentInfo {
  name: string;
  function: string;
  description: string;
}

interface DiagnosticCase {
  symptom: string;
  cause: string;
  solution: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
}

// --- Constants ---

const STROKES: { name: Stroke; description: string; color: string }[] = [
  { 
    name: 'Hisap', 
    description: 'Piston bergerak turun, katup masuk terbuka. Campuran udara dan bahan bakar masuk ke ruang bakar.',
    color: 'bg-blue-500'
  },
  { 
    name: 'Kompresi', 
    description: 'Piston bergerak naik, kedua katup tertutup. Campuran udara dan bahan bakar dimampatkan untuk meningkatkan tekanan.',
    color: 'bg-yellow-500'
  },
  { 
    name: 'Usaha', 
    description: 'Busi memercikkan bunga api, terjadi ledakan yang mendorong piston turun dengan tenaga besar.',
    color: 'bg-red-500'
  },
  { 
    name: 'Buang', 
    description: 'Piston bergerak naik, katup buang terbuka. Gas sisa pembakaran didorong keluar menuju knalpot.',
    color: 'bg-gray-500'
  }
];

const COMPONENTS: ComponentInfo[] = [
  { 
    name: 'Piston', 
    function: 'Mengubah energi ekspansi menjadi energi mekanik.',
    description: 'Bergerak naik turun di dalam silinder untuk melakukan siklus kerja.'
  },
  { 
    name: 'Poros Engkol (Crankshaft)', 
    function: 'Mengubah gerak naik-turun piston menjadi gerak putar.',
    description: 'Komponen utama yang meneruskan tenaga ke transmisi.'
  },
  { 
    name: 'Katup (Valves)', 
    function: 'Mengatur masuknya campuran bahan bakar dan keluarnya gas buang.',
    description: 'Terdiri dari katup masuk (intake) dan katup buang (exhaust).'
  },
  { 
    name: 'Busi (Spark Plug)', 
    function: 'Memercikkan bunga api untuk memulai pembakaran.',
    description: 'Hanya bekerja pada akhir langkah kompresi.'
  },
  { 
    name: 'Batang Piston (Connecting Rod)', 
    function: 'Menghubungkan piston dengan poros engkol.',
    description: 'Meneruskan gaya dari piston ke poros engkol.'
  }
];

const DIAGNOSTICS: DiagnosticCase[] = [
  {
    symptom: 'Asap knalpot berwarna biru pekat.',
    cause: 'Oli mesin ikut terbakar di ruang bakar.',
    solution: 'Ganti ring piston atau seal katup yang sudah aus.',
    difficulty: 'Sedang'
  },
  {
    symptom: 'Mesin terasa "ngelitik" (knocking) saat akselerasi.',
    cause: 'Pembakaran tidak sempurna atau penggunaan bahan bakar oktan rendah.',
    solution: 'Gunakan bahan bakar oktan lebih tinggi atau bersihkan kerak karbon di ruang bakar.',
    difficulty: 'Mudah'
  },
  {
    symptom: 'Mesin kehilangan tenaga (loss power) secara drastis.',
    cause: 'Kompresi rendah akibat kebocoran pada katup atau ring piston.',
    solution: 'Lakukan servis besar (skir klep) atau penggantian komponen silinder.',
    difficulty: 'Sulit'
  },
  {
    symptom: 'Asap knalpot berwarna putih dan air radiator cepat habis.',
    cause: 'Air pendingin masuk ke ruang bakar (paking kepala silinder bocor).',
    solution: 'Ganti paking kepala silinder (cylinder head gasket).',
    difficulty: 'Sulit'
  }
];

// --- Components ---

const PistonAnimation = ({ strokeIndex, isPlaying }: { strokeIndex: number; isPlaying: boolean }) => {
  // 0: Intake (Down), 1: Compression (Up), 2: Power (Down), 3: Exhaust (Up)
  const isDown = strokeIndex === 0 || strokeIndex === 2;
  const isIntakeOpen = strokeIndex === 0;
  const isExhaustOpen = strokeIndex === 3;
  const isSparking = strokeIndex === 2;

  return (
    <div className="relative w-64 h-96 bg-zinc-900 rounded-3xl border-4 border-zinc-700 overflow-hidden shadow-2xl">
      {/* Cylinder Walls */}
      <div className="absolute inset-x-4 top-0 bottom-0 border-x-2 border-zinc-800 bg-zinc-950/50" />
      
      {/* Valves */}
      <div className="absolute top-0 inset-x-0 h-12 flex justify-around px-8">
        {/* Intake Valve */}
        <motion.div 
          animate={{ y: isIntakeOpen ? 15 : 0 }}
          className={`w-4 h-8 rounded-b-full ${isIntakeOpen ? 'bg-blue-400' : 'bg-zinc-600'}`}
        />
        {/* Spark Plug */}
        <div className="relative">
          <div className="w-2 h-10 bg-zinc-500 mx-auto" />
          {isSparking && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full blur-sm"
            />
          )}
        </div>
        {/* Exhaust Valve */}
        <motion.div 
          animate={{ y: isExhaustOpen ? 15 : 0 }}
          className={`w-4 h-8 rounded-b-full ${isExhaustOpen ? 'bg-gray-400' : 'bg-zinc-600'}`}
        />
      </div>

      {/* Piston */}
      <motion.div 
        animate={{ y: isDown ? 200 : 40 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="absolute left-1/2 -translate-x-1/2 w-48 h-32 bg-zinc-300 rounded-t-lg border-b-8 border-zinc-500 z-10"
      >
        {/* Piston Rings */}
        <div className="mt-4 space-y-2">
          <div className="h-1 bg-zinc-400 mx-4 opacity-50" />
          <div className="h-1 bg-zinc-400 mx-4 opacity-50" />
        </div>
      </motion.div>

      {/* Connecting Rod */}
      <motion.div 
        animate={{ 
          y: isDown ? 280 : 120,
          rotate: isDown ? 5 : -5
        }}
        className="absolute left-1/2 -translate-x-1/2 w-6 h-40 bg-zinc-500 origin-top"
      />

      {/* Crankshaft */}
      <motion.div 
        animate={{ rotate: strokeIndex * 180 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 border-4 border-zinc-700 rounded-full flex items-center justify-center"
      >
        <div className="w-4 h-4 bg-zinc-400 rounded-full" />
        <div className="absolute top-0 w-2 h-12 bg-zinc-600" />
      </motion.div>

      {/* Gas Visualization */}
      <AnimatePresence>
        {strokeIndex === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute top-12 left-8 right-1/2 bottom-1/2 bg-blue-500/30 blur-xl"
          />
        )}
        {strokeIndex === 2 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.6, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className="absolute top-12 inset-x-8 bottom-1/2 bg-orange-500/40 blur-2xl"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulation' | 'components' | 'diagnostics' | 'quiz'>('simulation');
  const [selectedDiag, setSelectedDiag] = useState<number | null>(null);

  // Quiz State
  const [quizStep, setQuizStep] = useState<'intro' | 'questions' | 'registration' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [userInfo, setUserInfo] = useState({ name: '', class: '', school: '' });
  const [finalScore, setFinalScore] = useState(0);

  const QUIZ_QUESTIONS = [
    {
      question: "Apa yang terjadi pada piston dan katup saat langkah 'Hisap'?",
      options: [
        "Piston naik, katup masuk terbuka",
        "Piston turun, katup masuk terbuka",
        "Piston turun, katup buang terbuka",
        "Piston naik, kedua katup tertutup"
      ],
      correct: 1
    },
    {
      question: "Berapa derajat putaran poros engkol (crankshaft) yang dibutuhkan untuk menyelesaikan 1 siklus penuh mesin 4 tak?",
      options: ["180°", "360°", "540°", "720°"],
      correct: 3
    },
    {
      question: "Kapan busi (spark plug) memercikkan bunga api?",
      options: [
        "Awal langkah hisap",
        "Akhir langkah kompresi",
        "Tengah langkah usaha",
        "Akhir langkah buang"
      ],
      correct: 1
    },
    {
      question: "Jika muncul asap biru dari knalpot, komponen apa yang kemungkinan besar mengalami kerusakan?",
      options: ["Busi", "Katup masuk", "Ring piston atau seal katup", "Paking kepala silinder"],
      correct: 2
    },
    {
      question: "Apa fungsi utama dari Poros Engkol (Crankshaft)?",
      options: [
        "Mengatur buka tutup katup",
        "Mendinginkan suhu mesin",
        "Mengubah gerak naik-turun piston menjadi gerak putar",
        "Menyaring kotoran oli"
      ],
      correct: 2
    },
    {
      question: "Langkah di mana kedua katup tertutup dan piston bergerak dari Titik Mati Bawah (TMB) ke Titik Mati Atas (TMA) adalah...",
      options: ["Langkah Hisap", "Langkah Kompresi", "Langkah Usaha", "Langkah Buang"],
      correct: 1
    },
    {
      question: "Apa penyebab utama mesin mengalami 'knocking' atau ngelitik?",
      options: [
        "Oli terlalu encer",
        "Bahan bakar oktan rendah atau kerak karbon",
        "Filter udara kotor",
        "Knalpot bocor"
      ],
      correct: 1
    },
    {
      question: "Gejala air radiator cepat habis dan asap putih pada knalpot menandakan kebocoran pada...",
      options: ["Tangki bensin", "Paking kepala silinder", "Bak oli", "Filter udara"],
      correct: 1
    },
    {
      question: "Komponen yang menghubungkan piston dengan poros engkol adalah...",
      options: ["Batang Piston (Connecting Rod)", "Poros Nok (Camshaft)", "Rantai Keteng", "Bantalan Peluru"],
      correct: 0
    },
    {
      question: "Pada langkah 'Buang', posisi katup yang benar adalah...",
      options: [
        "Katup masuk buka, katup buang tutup",
        "Kedua katup terbuka",
        "Katup masuk tutup, katup buang buka",
        "Kedua katup tertutup"
      ],
      correct: 2
    }
  ];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers, optionIndex];
    setUserAnswers(newAnswers);
    
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizStep('registration');
    }
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === QUIZ_QUESTIONS[idx].correct) score++;
    });
    setFinalScore(score);
    setQuizStep('result');
  };

  const resetQuiz = () => {
    setQuizStep('intro');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setUserInfo({ name: '', class: '', school: '' });
    setFinalScore(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStroke((prev) => (prev + 1) % 4);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextStroke = () => setCurrentStroke((prev) => (prev + 1) % 4);
  const prevStroke = () => setCurrentStroke((prev) => (prev - 1 + 4) % 4);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Settings className="text-zinc-950 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Simulasi Mesin 4 Tak</h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Technical Learning Module v1.0</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-zinc-800/50 p-1 rounded-xl border border-zinc-700">
            <button 
              onClick={() => setActiveTab('simulation')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'simulation' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Simulasi Kerja
            </button>
            <button 
              onClick={() => setActiveTab('components')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'components' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Komponen Utama
            </button>
            <button 
              onClick={() => setActiveTab('diagnostics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'diagnostics' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Analisis Kerusakan
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'quiz' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Kuis Evaluasi
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'simulation' && (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Animation */}
            <div className="flex flex-col items-center">
              <PistonAnimation strokeIndex={currentStroke} isPlaying={isPlaying} />
              
              <div className="mt-8 flex items-center gap-4">
                <button 
                  onClick={prevStroke}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20' : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'}`}
                >
                  {isPlaying ? <Pause className="text-zinc-950 fill-current" /> : <Play className="text-zinc-950 fill-current ml-1" />}
                </button>
                <button 
                  onClick={nextStroke}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => { setIsPlaying(false); setCurrentStroke(0); }}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-700 transition-colors"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-emerald-500 font-mono text-sm font-bold uppercase tracking-widest">Langkah {currentStroke + 1} dari 4</span>
                <h2 className="text-5xl font-bold tracking-tighter italic font-serif">
                  Langkah {STROKES[currentStroke].name}
                </h2>
              </div>

              <div className={`p-6 rounded-2xl border-l-4 ${STROKES[currentStroke].color.replace('bg-', 'border-')} bg-zinc-900/50 border border-zinc-800`}>
                <p className="text-xl leading-relaxed text-zinc-300">
                  {STROKES[currentStroke].description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {STROKES.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => { setIsPlaying(false); setCurrentStroke(i); }}
                    className={`p-4 rounded-xl border transition-all text-left group ${currentStroke === i ? 'bg-zinc-800 border-emerald-500/50 ring-1 ring-emerald-500/20' : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-zinc-500">0{i + 1}</span>
                      <div className={`w-2 h-2 rounded-full ${s.color}`} />
                    </div>
                    <span className={`font-bold ${currentStroke === i ? 'text-white' : 'text-zinc-400'}`}>{s.name}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800 flex gap-4 items-start">
                <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Mesin 4 tak memerlukan 2 putaran poros engkol (720°) untuk menyelesaikan satu siklus pembakaran penuh.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Anatomi Mesin</h2>
              <p className="text-zinc-400">Pelajari bagian-bagian vital yang membuat mesin 4 tak bekerja dengan presisi tinggi.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMPONENTS.map((comp, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={comp.name}
                  className="p-8 bg-zinc-900/50 rounded-3xl border border-zinc-800 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Settings className="text-emerald-500 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{comp.name}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-mono text-emerald-500 uppercase tracking-wider mb-1">Fungsi Utama</p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{comp.function}</p>
                    </div>
                    <div className="pt-4 border-t border-zinc-800">
                      <p className="text-sm text-zinc-500 italic">{comp.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-yellow-500 w-6 h-6" />
                  <h2 className="text-xl font-bold">Diagnostic Lab</h2>
                </div>
                <p className="text-sm text-zinc-400 mb-8">Pilih gejala kerusakan untuk menganalisis penyebab dan solusinya.</p>
                
                <div className="space-y-3">
                  {DIAGNOSTICS.map((diag, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDiag(i)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${selectedDiag === i ? 'bg-zinc-800 border-yellow-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          diag.difficulty === 'Mudah' ? 'bg-emerald-500/10 text-emerald-500' :
                          diag.difficulty === 'Sedang' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {diag.difficulty}
                        </span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2">{diag.symptom}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {selectedDiag !== null ? (
                  <motion.div 
                    key={selectedDiag}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full p-10 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex flex-col"
                  >
                    <div className="mb-10">
                      <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Gejala Terdeteksi</h3>
                      <p className="text-3xl font-bold italic font-serif leading-tight">{DIAGNOSTICS[selectedDiag].symptom}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 flex-grow">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle className="w-5 h-5" />
                          <h4 className="font-bold uppercase tracking-wider text-sm">Penyebab</h4>
                        </div>
                        <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20">
                          <p className="text-zinc-300 leading-relaxed">{DIAGNOSTICS[selectedDiag].cause}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-5 h-5" />
                          <h4 className="font-bold uppercase tracking-wider text-sm">Solusi Perbaikan</h4>
                        </div>
                        <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                          <p className="text-zinc-300 leading-relaxed">{DIAGNOSTICS[selectedDiag].solution}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-zinc-800 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Wrench className="text-zinc-500 w-5 h-5" />
                        <span className="text-sm text-zinc-500">Rekomendasi: Segera lakukan pemeriksaan fisik.</span>
                      </div>
                      <button 
                        onClick={() => setSelectedDiag(null)}
                        className="text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                      >
                        Tutup Analisis
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 bg-zinc-900/20 rounded-3xl border-2 border-dashed border-zinc-800 text-zinc-500">
                    <Wrench className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">Pilih kasus di sebelah kiri untuk memulai diagnosis</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto">
            {quizStep === 'intro' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 bg-zinc-900 rounded-3xl border border-zinc-800 text-center space-y-8"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Wrench className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold italic font-serif">Kuis Kompetensi Mesin 4 Tak</h2>
                  <p className="text-zinc-400 max-w-md mx-auto">Uji pemahaman Anda mengenai siklus kerja, komponen, dan analisis kerusakan mesin. Minimal skor 7 untuk dinyatakan lulus.</p>
                </div>
                <button 
                  onClick={() => setQuizStep('questions')}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  Mulai Kuis Sekarang
                </button>
              </motion.div>
            )}

            {quizStep === 'questions' && (
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Pertanyaan {currentQuestionIndex + 1} dari {QUIZ_QUESTIONS.length}</span>
                    <h3 className="text-2xl font-bold">{QUIZ_QUESTIONS[currentQuestionIndex].question}</h3>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="p-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl text-left transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-500 group-hover:text-emerald-500">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-zinc-300 font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            )}

            {quizStep === 'registration' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-10 bg-zinc-900 rounded-3xl border border-zinc-800 space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold">Lengkapi Data Diri</h2>
                  <p className="text-zinc-400">Silakan masukkan identitas Anda untuk melihat hasil evaluasi.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      placeholder="Masukkan nama Anda"
                      className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Kelas</label>
                      <input 
                        type="text" 
                        value={userInfo.class}
                        onChange={(e) => setUserInfo({...userInfo, class: e.target.value})}
                        placeholder="Contoh: XI TKR 1"
                        className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Asal Sekolah</label>
                      <input 
                        type="text" 
                        value={userInfo.school}
                        onChange={(e) => setUserInfo({...userInfo, school: e.target.value})}
                        placeholder="Nama SMK/Sekolah"
                        className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={!userInfo.name || !userInfo.class || !userInfo.school}
                  onClick={calculateScore}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  Lihat Hasil Nilai
                </button>
              </motion.div>
            )}

            {quizStep === 'result' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 bg-zinc-900 rounded-3xl border border-zinc-800 text-center space-y-10"
              >
                <div className="space-y-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${finalScore >= 7 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {finalScore >= 7 ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                  </div>
                  <h2 className="text-4xl font-bold italic font-serif">
                    {finalScore >= 7 ? 'Selamat, Anda Lulus!' : 'Maaf, Anda Belum Lulus'}
                  </h2>
                  <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 inline-block">
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Skor Akhir</p>
                    <p className="text-6xl font-bold text-white">{finalScore * 10}<span className="text-2xl text-zinc-600">/100</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-left p-6 bg-zinc-800/30 rounded-2xl border border-zinc-800">
                  <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Nama</p>
                    <p className="text-sm font-bold truncate">{userInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Kelas</p>
                    <p className="text-sm font-bold truncate">{userInfo.class}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Sekolah</p>
                    <p className="text-sm font-bold truncate">{userInfo.school}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-zinc-400 text-sm">
                    {finalScore >= 7 
                      ? "Luar biasa! Anda telah menguasai konsep dasar mesin 4 tak dengan sangat baik." 
                      : "Jangan menyerah! Silakan pelajari kembali materi simulasi dan anatomi mesin untuk meningkatkan pemahaman Anda."}
                  </p>
                  <button 
                    onClick={resetQuiz}
                    className="px-8 py-3 border border-zinc-700 hover:border-zinc-500 rounded-xl text-sm font-bold transition-all"
                  >
                    Ulangi Kuis
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 mt-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-mono tracking-tighter">ENGINE_DYNAMICS_LAB_2024</span>
          </div>
          <div className="flex gap-8 text-xs font-mono text-zinc-600 uppercase tracking-widest">
            <span>Intake</span>
            <span>Compression</span>
            <span>Power</span>
            <span>Exhaust</span>
          </div>
          <p className="text-xs text-zinc-600">© 2024 Automotive Learning Systems</p>
        </div>
      </footer>
    </div>
  );
}
