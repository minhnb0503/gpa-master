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
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-24 h-24">
        <svg className="transform -rotate-90 w-24 h-24 absolute inset-0">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="text-[#0ea5e9] transition-all duration-1000 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[20px] font-bold text-slate-700 leading-none">{value}</span>
        </div>
      </div>
      <span className="mt-3 text-[13px] font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{label}</span>
    </div>
  );
};

export default function App() {
  const [scores, setScores] = useState({});
  const [quote, setQuote] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('gpa-master-v5');
      if (savedScores) {
        const parsed = JSON.parse(savedScores);
        Object.keys(parsed).forEach(key => { parsed[key].final = ''; });
        setScores(parsed);
      }
    } catch (error) {
      console.error(error);
    }
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gpa-master-v5', JSON.stringify(scores));
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

  if (!isLoaded) return <div className="min-h-screen bg-slate-50"></div>;

  return (
    <div className="min-h-screen bg-slate-100 p-0 md:p-6 flex items-center justify-center font-sans text-slate-800">
      <div className="w-full max-w-[1200px] bg-white md:rounded-[24px] shadow-xl flex flex-col md:flex-row h-screen md:h-[90vh] overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-full md:w-[260px] bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="text-[28px]">🚀</span>
            <h1 className="text-[20px] font-bold text-blue-600 tracking-tight">GPA Master</h1>
          </div>
          
          <div className="hidden md:flex flex-col gap-3">
            <div className="px-4 py-3 bg-blue-50 text-blue-600 font-semibold rounded-xl border border-blue-100">
              Tổng quan
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-200">
            <p className="text-[14px] text-blue-600 font-medium leading-relaxed">"{quote}" {emoji}</p>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 flex flex-col h-full bg-white">
          <div className="hidden md:flex px-8 py-6 items-center border-b border-slate-100">
            <h2 className="text-[22px] font-bold text-slate-800">Trung tâm điều khiển</h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8 space-y-8">
            
            {/* Dashboard */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-[16px] font-bold text-slate-700 mb-6 text-center md:text-left">Hiệu suất học tập</h3>
              <div className="flex justify-around items-center">
                <CircularProgress value={totalCredits} label="Tín chỉ đã nạp" max={16} />
                <CircularProgress value={gpa} label="GPA Hệ 4" max={4.0} />
              </div>
            </div>

            {/* Các môn học */}
            <div>
              <h3 className="text-[16px] font-bold text-slate-700 mb-4 px-2">Cài đặt môn học</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {subjectsList.map((subject) => {
                  const s = scores[subject.id] || { attendance: '', midterm: '', final: '' };
                  const att = parseFloat(s.attendance) || 0;
                  const mid = parseFloat(s.midterm) || 0;
                  
                  let requiredForA = 0;
                  if (subject.hasFinal) {
                    requiredForA = (8.5 - (att * subject.weights.attendance) - (mid * subject.weights.midterm)) / subject.weights.final;
                  }

                  return (
                    <div key={subject.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-4">
                        <h4 className="text-[15px] font-bold text-slate-800 leading-tight">{subject.name}</h4>
                        <p className="text-[13px] text-slate-500 mt-1">{subject.credits} tín chỉ</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col">
                          <label className="text-[11px] font-semibold text-slate-500 mb-1">C.Cần (10%)</label>
                          <input type="text" inputMode="decimal" placeholder="0" value={s.attendance} onChange={(e) => updateScore(subject.id, 'attendance', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-[15px] font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[11px] font-semibold text-slate-500 mb-1">Q.Trình ({subject.weights.midterm * 100}%)</label>
                          <input type="text" inputMode="decimal" placeholder="0" value={s.midterm} onChange={(e) => updateScore(subject.id, 'midterm', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-[15px] font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
                        </div>
                        {subject.hasFinal ? (
                          <div className="flex flex-col">
                            <label className="text-[11px] font-bold text-blue-600 mb-1">C.Kì (50%)</label>
                            <input type="text" inputMode="decimal" placeholder="0" value={s.final} onChange={(e) => updateScore(subject.id, 'final', e.target.value)}
                              className="w-full bg-blue-50 border border-blue-300 rounded-lg px-3 py-2 text-[15px] font-bold text-blue-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center bg-slate-100 border border-slate-200 rounded-lg">
                            <span className="text-[11px] text-slate-400 font-semibold">Ko thi CK</span>
                          </div>
                        )}
                      </div>

                      {subject.hasFinal && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[13px]">
                          <span className="text-slate-500 font-medium">Mục tiêu A:</span>
                          <span className={`font-bold px-2 py-1 rounded ${requiredForA > 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                            {requiredForA <= 0 ? 'Đã đạt' : (requiredForA > 10 ? 'Không thể đạt' : `Cần ${requiredForA.toFixed(2)}`)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}