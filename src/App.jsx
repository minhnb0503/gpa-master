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

// Biểu đồ vòng tròn xịn sò chuẩn UI Dashboard
const CircularProgress = ({ value, mainText, subText, max, colorClass, trailColor = "text-slate-100" }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(Math.max(value, 0), max);
  const strokeDashoffset = circumference - (safeValue / max) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-28 h-28 mb-3">
        <svg className="transform -rotate-90 w-full h-full absolute inset-0">
          <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className={trailColor} />
          <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className={`${colorClass} transition-all duration-1000 ease-out`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-extrabold text-slate-800 leading-none">{mainText}</span>
        </div>
      </div>
      <span className="text-[14px] font-bold text-slate-700">{subText}</span>
    </div>
  );
};

export default function App() {
  const [scores, setScores] = useState({});
  const [globalTarget, setGlobalTarget] = useState("8.5"); // Trạng thái lưu mục tiêu do user tự điền
  const [quote, setQuote] = useState("");

  // Khôi phục dữ liệu từ bộ nhớ trình duyệt
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('gpa-master-v8');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.target) setGlobalTarget(parsed.target);
      }
    } catch (e) {
      console.error(e);
    }
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Tự động lưu khi có thay đổi điểm hoặc thay đổi mục tiêu
  useEffect(() => {
    localStorage.setItem('gpa-master-v8', JSON.stringify({ scores, target: globalTarget }));
  }, [scores, globalTarget]);

  // Hàm update điểm: Cấm các ký tự chữ cái, chỉ cho phép số và dấu chấm
  const updateScore = (id, field, val) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    if ((cleanVal.match(/\./g) || []).length > 1) return;

    setScores(prev => ({
      ...prev,
      [id]: { ...(prev[id] || { attendance: '', midterm: '', final: '' }), [field]: cleanVal }
    }));
  };

  // Hàm update mục tiêu
  const handleTargetChange = (val) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    if ((cleanVal.match(/\./g) || []).length > 1) return;
    setGlobalTarget(cleanVal);
  };

  let totalCredits = 0, totalPoints = 0, completedSubjects = 0;
  
  subjectsList.forEach(sub => {
    const s = scores[sub.id] || { attendance: '', midterm: '', final: '' };
    const att = parseFloat(s.attendance) || 0;
    const mid = parseFloat(s.midterm) || 0;
    const fin = parseFloat(s.final) || 0;
    
    // Đếm số môn đã hoàn thành (có điểm quá trình hoặc điểm thi)
    if (att > 0 || mid > 0 || fin > 0) {
      completedSubjects += 1;
    }

    if (att || mid || fin) {
      totalCredits += sub.credits;
      const final10 = (att * sub.weights.attendance) + (mid * sub.weights.midterm) + (fin * sub.weights.final);
      totalPoints += convertTo4Scale(final10) * sub.credits;
    }
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  const numTarget = parseFloat(globalTarget) || 0; // Chuyển mục tiêu từ chuỗi sang số để tính toán

  return (
    <div className="min-h-screen bg-[#f0f4f8] p-2 md:p-6 font-sans text-slate-800 flex justify-center">
      <div className="w-full max-w-[1280px] bg-white md:rounded-[24px] shadow-2xl flex flex-col md:flex-row h-screen md:h-[90vh] overflow-hidden border border-slate-200">
        
        {/* Sidebar */}
        <div className="w-full md:w-[260px] bg-[#f8fafc] border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[32px] drop-shadow-md">🚀</span>
            <h1 className="text-[22px] font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">GPA Master</h1>
          </div>
          
          <nav className="hidden md:flex flex-col gap-2">
            <div className="px-4 py-3.5 bg-white text-blue-600 font-bold rounded-xl border border-blue-100 shadow-sm flex items-center gap-3 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Tổng quan
            </div>
          </nav>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 flex flex-col h-full bg-[#f8fafc]">
          <div className="hidden md:flex px-8 py-5 items-center border-b border-slate-200 bg-white">
            <h2 className="text-[24px] font-extrabold text-slate-800">Trung tâm điều khiển</h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8 space-y-6">
            
            {/* GRID DASHBOARD: Giống hệt UI bạn gửi */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Panel 1: Biểu đồ hiệu suất (Chiếm 2 cột) */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col">
                <h3 className="text-[16px] font-bold text-slate-700 mb-8">Hiệu suất học tập</h3>
                <div className="flex flex-row justify-around items-center flex-1">
                  <CircularProgress value={completedSubjects} mainText={`${completedSubjects}/6`} subText="Tiến độ môn" max={6} colorClass="text-emerald-500" />
                  <CircularProgress value={totalCredits} mainText={`${totalCredits}`} subText="Tín chỉ nạp" max={16} colorClass="text-blue-500" />
                  <CircularProgress value={gpa} mainText={gpa} subText="GPA Hệ 4" max={4.0} colorClass="text-purple-500" />
                </div>
              </div>

              {/* Panel 2 & 3: Stacked bên phải (Cài đặt & Lời chúc) */}
              <div className="flex flex-col gap-6">
                
                {/* Cài đặt mục tiêu nhanh */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-bold text-slate-700">Mục tiêu điểm</h3>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-500 mb-2">Bạn muốn đạt mấy phẩy? (Hệ 10)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        inputMode="decimal" 
                        value={globalTarget} 
                        onChange={e => handleTargetChange(e.target.value)}
                        className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-[18px] font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-center" 
                      />
                    </div>
                    <p className="text-[12px] text-slate-400 mt-3 italic leading-relaxed">
                      *Hệ thống sẽ dùng điểm này để tính toán điểm Cuối Kì bạn cần đạt.
                    </p>
                  </div>
                </div>

                {/* Lời nhắc động lực */}
                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-6 shadow-md text-white flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 opacity-80">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    <span className="text-[13px] font-semibold uppercase tracking-wider">Động lực hôm nay</span>
                  </div>
                  <p className="text-[15px] font-medium leading-relaxed">"{quote}"</p>
                </div>

              </div>
            </div>

            {/* DANH SÁCH MÔN HỌC */}
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-800 mb-5 px-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                Chi tiết môn học
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {subjectsList.map((subject) => {
                  const s = scores[subject.id] || { attendance: '', midterm: '', final: '' };
                  const att = parseFloat(s.attendance) || 0;
                  const mid = parseFloat(s.midterm) || 0;
                  
                  // Tính toán dựa trên numTarget (mục tiêu user tự điền) thay vì fix cứng 8.5
                  let reqA = 0;
                  if (subject.hasFinal) {
                    reqA = (numTarget - (att * subject.weights.attendance) - (mid * subject.weights.midterm)) / subject.weights.final;
                  }

                  return (
                    <div key={subject.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow hover:border-blue-300">
                      <div className="mb-5 flex justify-between items-start">
                        <div>
                          <h4 className="text-[16px] font-bold text-slate-800 leading-tight">{subject.name}</h4>
                          <p className="text-[13px] text-slate-500 mt-1 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded">{subject.credits} tín chỉ</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 md:gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">C.Cần (10%)</label>
                          <input type="text" inputMode="decimal" placeholder="0" value={s.attendance} onChange={e => updateScore(subject.id, 'attendance', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-[15px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-center shadow-inner" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Q.Trình ({subject.weights.midterm * 100}%)</label>
                          <input type="text" inputMode="decimal" placeholder="0" value={s.midterm} onChange={e => updateScore(subject.id, 'midterm', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-[15px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-center shadow-inner" />
                        </div>
                        {subject.hasFinal ? (
                          <div>
                            <label className="block text-[11px] font-bold text-blue-600 mb-1.5 uppercase">C.Kì (50%)</label>
                            <input type="text" inputMode="decimal" placeholder="0" value={s.final} onChange={e => updateScore(subject.id, 'final', e.target.value)}
                              className="w-full bg-blue-50 border border-blue-300 rounded-xl px-3 py-2.5 text-[15px] font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-center shadow-inner" />
                          </div>
                        ) : (
                          <div className="flex items-end">
                            <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-3 py-2.5 rounded-xl w-full text-center border border-slate-200">Không thi CK</span>
                          </div>
                        )}
                      </div>
                      
                      {subject.hasFinal && (
                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[13px] text-slate-500 font-bold hidden md:inline">Mục tiêu ({numTarget || 0}): </span>
                          <span className="text-[13px] text-slate-500 font-bold md:hidden">Cần CK: </span>
                          <div className="flex items-center gap-2 md:gap-3">
                              {/* Nút bấm tự điền điểm */}
                              {reqA > 0 && reqA <= 10 && numTarget > 0 && (
                                <button
                                  onClick={() => updateScore(subject.id, 'final', reqA.toFixed(2))}
                                  className="text-[12px] bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg transition-colors font-bold shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                  Tự điền
                                </button>
                              )}
                              <span className={`font-bold px-3 py-1.5 rounded-lg text-[13px] border ${reqA <= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : (reqA > 10 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm')}`}>
                                {numTarget <= 0 ? 'Chưa nhập MT' : (reqA <= 0 ? 'Đã đạt mục tiêu 🎉' : (reqA > 10 ? 'Không thể đạt ❌' : `${reqA.toFixed(2)} điểm`))}
                              </span>
                          </div>
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