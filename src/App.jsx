import React, { useEffect, useState } from 'react';

const subjectsList = [
  { id: "CNTT1112_02", name: "Kiến trúc máy tính", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1114_03", name: "Mạng máy tính & truyền số liệu", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1137_02", name: "Phân tích nghiệp vụ", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1165_02", name: "Thiết kế WEB", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1186_02", name: "Công nghệ hiện đại CNTT", credits: 3, weights: { attendance: 0.1, midterm: 0.9, final: 0 }, hasFinal: false },
  { id: "LLNL1106_12", name: "Kinh tế chính trị Mác Lênin", credits: 2, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true }
];

const quotes = [
  "Cố lên Khánh Ly, điểm A đang vẫy gọi kìa!",
  "Học tài thi phận, nhưng em bé của anh thi chắc chắn A!",
  "Nhập điểm xong nghỉ ngơi chút nha, anh thương ❤️",
  "GPA NEU có khó đến mấy thì Ly của anh cũng cân được hết!"
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
    <div className="flex flex-col items-center pointer-events-none">
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
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
  const [scores, setScores] = useState({});
  const [quote, setQuote] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('gpa-ly-data-v3');
      if (savedScores) {
        const parsed = JSON.parse(savedScores);
        Object.keys(parsed).forEach(key => { parsed[key].final = ''; });
        setScores(parsed);
      }
    } catch (error) {}
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gpa-ly-data-v3', JSON.stringify(scores));
    }
  }, [scores, isLoaded]);

  const updateScore = (subjectId, field, value) => {
    const validValue = value.replace(/[^0-9.]/g, '');
    setScores(prev => ({
      ...prev,
      [subjectId]: {
        ...(prev[subjectId] || { attendance: '', midterm: '', final: '' }),
        [field]: validValue
      }
    }));
  };

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

  if (!isLoaded) return <div className="min-h-screen bg-[#e8f4fc]"></div>;

  return (
    <div className="min-h-screen p-0 md:p-6 flex items-center justify-center bg-[#e8f4fc]">
      <div className="w-full max-w-[1200px] bg-white border border-slate-200 rounded-none md:rounded-[24px] shadow-2xl flex flex-col md:flex-row h-screen md:h-[90vh] overflow-hidden">
        
        <div className="w-full md:w-[260px] bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-5 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-4 md:mb-8 px-2">
            <span className="text-[24px]">🚀</span>
            {/* ĐÂY LÀ CHỖ NHẬN DIỆN V3 */}
            <h1 className="text-[18px] font-bold text-slate-800 tracking-tight text-blue-600">GPA Master V3</h1>
          </div>
          <div className="mt-auto pt-4 md:pt-6 border-t border-slate-200">
            <p className="text-[13px] text-[#0ea5e9] font-semibold">"{quote}" {emoji}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full bg-white relative z-10 pointer-events-auto">
          <div className="hidden md:flex px-8 py-6 justify-between items-center border-b border-slate-100 shrink-0">
            <h2 className="text-[22px] font-bold text-slate-800">Trung tâm điều khiển</h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8 pb-24 relative z-20 pointer-events-auto">
            <div className="bg-slate-50 rounded-[16px] p-6 border border-slate-100 mb-8">
              <h3 className="text-[16px] font-semibold text-slate-700 mb-6 text-center md:text-left">Hiệu suất học tập</h3>
              <div className="flex justify-around items-center">
                <CircularProgress value={totalCredits} label="Tín chỉ đã nạp" max={16} />
                <CircularProgress value={gpa} label="GPA Hệ 4" max={4.0} />
              </div>
            </div>

            <h3 className="text-[16px] font-semibold text-slate-700 mb-4 px-2">Cài đặt môn học</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 relative z-30">
              {subjectsList.map((subject) => {
                const s = scores[subject.id] || { attendance: '', midterm: '', final: '' };
                const att = parseFloat(s.attendance) || 0;
                const mid = parseFloat(s.midterm) || 0;
                
                let requiredForA = 0;
                if (subject.hasFinal) {
                  requiredForA = (8.5 - (att * subject.weights.attendance) - (mid * subject.weights.midterm)) / subject.weights.final;
                }

                return (
                  <div key={subject.id} className="bg-white rounded-[16px] p-5 border border-slate-200 shadow-sm relative z-40 pointer-events-auto">
                    <div className="mb-4">
                      <h4 className="text-[15px] font-semibold text-slate-800">{subject.name}</h4>
                      <p className="text-[13px] text-slate-500 mt-0.5">Tín chỉ: {subject.credits}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 relative z-50">
                      <div className="flex flex-col relative z-[9999]">
                        <label className="text-[11px] font-medium text-slate-500 mb-1">10% C.Cần</label>
                        <input type="text" inputMode="decimal" placeholder="0" value={s.attendance} onChange={(e) => updateScore(subject.id, 'attendance', e.target.value)}
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 99999 }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-[8px] px-3 py-2 text-[14px] text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white focus:ring-2 focus:ring-[#0ea5e9]/30" />
                      </div>
                      <div className="flex flex-col relative z-[9999]">
                        <label className="text-[11px] font-medium text-slate-500 mb-1">{subject.weights.midterm * 100}% Q.Trình</label>
                        <input type="text" inputMode="decimal" placeholder="0" value={s.midterm} onChange={(e) => updateScore(subject.id, 'midterm', e.target.value)}
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 99999 }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-[8px] px-3 py-2 text-[14px] text-slate-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white focus:ring-2 focus:ring-[#0ea5e9]/30" />
                      </div>
                      {subject.hasFinal ? (
                        <div className="flex flex-col relative z-[9999]">
                          <label className="text-[11px] font-bold text-[#0ea5e9] mb-1">50% Cuối kì</label>
                          <input type="text" inputMode="decimal" placeholder="0" value={s.final} onChange={(e) => updateScore(subject.id, 'final', e.target.value)}
                            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 99999 }}
                            className="w-full bg-blue-50 border border-blue-300 rounded-[8px] px-3 py-2 text-[14px] font-bold text-[#0ea5e9] focus:outline-none focus:border-[#0ea5e9] focus:bg-white focus:ring-2 focus:ring-[#0ea5e9]/30" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center bg-slate-100 border border-slate-200 rounded-[8px]">
                          <span className="text-[11px] text-slate-400 font-medium">Ko thi CK</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}