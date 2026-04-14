import React, { useEffect, useState } from 'react';
import { useStore } from './store';

const subjectsList = [
  { id: "CNTT1112_02", name: "Kiến trúc máy tính", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1114_03", name: "Mạng máy trinh & truyền dữ liệu", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1137_02", name: "Phân tích nghiệp vụ", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1165_02", name: "Thiết kế WEB", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1186_02", name: "Công nghệ hiện đại CNTT", credits: 3, weights: { attendance: 0.1, midterm: 0.9, final: 0 }, hasFinal: false },
  { id: "LLNL1106_12", name: "Kinh tế chính trị Mác Lênin", credits: 2, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true }
];

const quotes = [
  "Cố lên bé iu, điểm A đang vẫy gọi kìa!",
  "Học tài thi phận, nhưng em bé của anh thi chắc chắn A!",
  "Nhập điểm xong nghỉ ngơi chút nha, anh thương ❤️",
  "Sắp qua môn rồi, cố lên nốt xíu nữa thôi!"
];

const convertTo4Scale = (score) => {
  if (score >= 8.5) return 4.0;
  if (score >= 8.0) return 3.5;
  if (score >= 7.0) return 3.0;
  if (score >= 6.5) return 2.5;
  if (score >= 5.5) return 2.0;
  if (score >= 5.0) return 1.5;
  if (score >= 4.0) return 1.0;
  return 0.0;
};

const CircularProgress = ({ value, label, max }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / max) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="text-[#0ea5e9] transition-all duration-1000 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute text-center">
          <span className="text-[20px] font-bold text-slate-700 block leading-none">{value}</span>
        </div>
      </div>
      <span className="mt-2 text-[13px] font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{label}</span>
    </div>
  );
};

export default function App() {
  const { scores, updateScore, clearFinalScores } = useStore();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    clearFinalScores();
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  let totalCredits = 0;
  let totalPoints = 0;

  subjectsList.forEach(sub => {
    const s = scores[sub.id] || { attendance: '', midterm: '', final: '' };
    const att = parseFloat(s.attendance) || 0;
    const mid = parseFloat(s.midterm) || 0;
    const fin = parseFloat(s.final) || 0;

    const final10 = (att * sub.weights.attendance) + (mid * sub.weights.midterm) + (fin * sub.weights.final);
    if (att || mid || fin) { 
      totalCredits += sub.credits;
      totalPoints += convertTo4Scale(final10) * sub.credits;
    }
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  const emoji = gpa >= 3.2 ? '🥰' : (gpa > 0 ? '🥺' : '😴');

  return (
    <div className="min-h-screen p-2 md:p-6 flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-[1200px] bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex flex-col md:flex-row h-[90vh] overflow-hidden">
        
        <div className="w-full md:w-[260px] bg-white/40 border-r border-white/60 p-5 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-8 px-2">
            <span className="text-[24px]">🚀</span>
            <h1 className="text-[18px] font-bold text-slate-800 tracking-tight">GPA Master</h1>
          </div>

          <nav className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 bg-white/80 text-[#0ea5e9] font-semibold rounded-[12px] shadow-sm border border-white shadow-[0_2px_10px_rgba(14,165,233,0.1)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              Tổng quan
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white/40 font-medium rounded-[12px] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Chi tiết môn học
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white/40 font-medium rounded-[12px] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Cài đặt hệ thống
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/50">
            <p className="text-[13px] text-slate-500 font-medium">"{quote}" {emoji}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full bg-transparent relative">
          
          <div className="px-8 py-6 flex justify-between items-center border-b border-white/30 shrink-0">
            <h2 className="text-[22px] font-bold text-slate-800">Trung tâm điều khiển</h2>
            <div className="flex items-center gap-4">
              <button className="text-slate-500 hover:text-slate-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </button>
              <button className="text-slate-500 hover:text-slate-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8">
            
            <div className="bg-white/80 rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/60 mb-8">
              <h3 className="text-[16px] font-semibold text-slate-700 mb-6">Hiệu suất học tập</h3>
              <div className="flex justify-around items-center">
                <CircularProgress value={totalCredits} label="Tín chỉ đã nạp" max={16} />
                <CircularProgress value={gpa} label="GPA Hệ 4" max={4.0} />
              </div>
            </div>

            <h3 className="text-[16px] font-semibold text-slate-700 mb-4 px-2">Cài đặt môn học</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {subjectsList.map((subject) => {
                const s = scores[subject.id] || { attendance: '', midterm: '', final: '' };
                const att = parseFloat(s.attendance) || 0;
                const mid = parseFloat(s.midterm) || 0;
                
                let requiredForA = 0;
                if (subject.hasFinal) {
                  requiredForA = (8.5 - (att * subject.weights.attendance) - (mid * subject.weights.midterm)) / subject.weights.final;
                }

                return (
                  <div key={subject.id} className="bg-white/70 rounded-[16px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-white/80 hover:bg-white/90 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-[15px] font-semibold text-slate-800">{subject.name}</h4>
                        <p className="text-[13px] text-slate-500 mt-0.5">Tín chỉ: {subject.credits}</p>
                      </div>
                      <div className="w-10 h-5 bg-[#0ea5e9] rounded-full relative shadow-inner">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">10% C.Cần</label>
                        <input type="number" value={s.attendance} onChange={(e) => updateScore(subject.id, 'attendance', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all" />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">{subject.weights.midterm * 100}% Q.Trình</label>
                        <input type="number" value={s.midterm} onChange={(e) => updateScore(subject.id, 'midterm', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all" />
                      </div>
                      {subject.hasFinal ? (
                        <div>
                          <label className="text-[11px] font-medium text-[#0ea5e9] block mb-1">50% Cuối kì</label>
                          <input type="number" value={s.final} onChange={(e) => updateScore(subject.id, 'final', e.target.value)}
                            className="w-full bg-blue-50 border border-blue-200 rounded-[8px] px-3 py-2 text-[14px] font-semibold text-[#0ea5e9] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-[8px]">
                          <span className="text-[11px] text-slate-400 font-medium">Ko thi CK</span>
                        </div>
                      )}
                    </div>

                    {subject.hasFinal && (
                      <div className="mt-4 flex items-center justify-between text-[13px]">
                        <span className="text-slate-500">Mục tiêu A:</span>
                        <span className={`font-semibold px-3 py-1 rounded-full ${requiredForA > 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {requiredForA <= 0 ? 'Đã đạt' : (requiredForA > 10 ? 'Tạch A rồi' : `Cần ${requiredForA.toFixed(2)}`)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center pb-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-8 py-2.5 rounded-[12px] font-medium transition-colors shadow-[0_4px_12px_rgba(14,165,233,0.3)] active:scale-95"
              >
                Oce! Tính xong
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}