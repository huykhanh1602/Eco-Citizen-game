import { motion } from "motion/react";
import { AlertCircle, TrendingDown } from "lucide-react";

export function GameStage() {
  return (
    <main className="flex-1 overflow-y-auto w-full flex items-center justify-center p-4 md:p-8 relative">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-300/20 rounded-full blur-[80px] -z-10 mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-300/20 rounded-full blur-[100px] -z-10 mix-blend-multiply" />

      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 pb-10">
        {/* Avatar Section */}
        <motion.div 
          className="relative flex-shrink-0 z-10"
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <div className="w-48 h-48 md:w-72 md:h-72 rounded-[40px] border-[12px] border-white shadow-xl overflow-hidden bg-sky-100 rotate-[-2deg]">
            <img 
              src="https://images.unsplash.com/photo-1762088942597-88ef9dc691fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGNhcnRvb24lMjBjaGFyYWN0ZXIlMjBtYXlvcnxlbnwxfHx8fDE3NzY3NjYyNzF8MA&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Mayor Avatar" 
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Status Badge */}
          <div className="absolute -bottom-4 -right-4 bg-white px-5 py-2.5 rounded-2xl border-4 border-slate-100 shadow-lg transform rotate-6">
            <span className="font-extrabold text-sky-600 text-sm md:text-base uppercase tracking-wide">Advisor Bot</span>
          </div>
        </motion.div>

        {/* Speech Bubble */}
        <motion.div 
          className="relative bg-white rounded-[32px] p-6 md:p-10 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border-4 border-white flex-1 max-w-xl"
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Chat bubble tail - Desktop */}
          <div className="hidden md:block absolute -left-8 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[24px] border-t-transparent border-r-[32px] border-r-white border-b-[24px] border-b-transparent drop-shadow-sm" />
          {/* Chat bubble tail - Mobile */}
          <div className="md:hidden absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[24px] border-l-transparent border-b-[32px] border-b-white border-r-[24px] border-r-transparent drop-shadow-sm" />

          <div className="flex items-center gap-3 mb-5">
            <div className="bg-rose-100 p-2.5 rounded-2xl">
              <AlertCircle className="w-7 h-7 text-rose-500" strokeWidth={3} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Crisis Report!</h2>
          </div>
          
          <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed mb-8">
            "Mayor! The local logging companies are clear-cutting the <span className="font-bold text-slate-800">Whispering Woods</span> at an alarming rate. Our environment score is dropping rapidly, but they bring in heavy tax revenue. How should we proceed?"
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-emerald-50 border-2 border-emerald-100 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-500" strokeWidth={2.5} /> 
              Environment -15/hr
            </div>
            <div className="px-4 py-2 bg-rose-50 border-2 border-rose-100 text-rose-700 rounded-xl text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" strokeWidth={2.5} /> 
              Urgent Decision Needed
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}