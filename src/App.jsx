import React, { useEffect, useState } from 'react';

const subjectsList = [
  { id: "CNTT1112_02", name: "Kiến trúc máy tính", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1114_03", name: "Mạng máy tính & truyền số liệu", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1137_02", name: "Phân tích nghiệp vụ", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1165_02", name: "Thiết kế WEB", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1186_02", name: "Công nghệ hiện đại CNTT", credits: 3, weights: { attendance: 0.1, midterm: 0.9, final: 0 }, hasFinal: false },
  { id: "LLNL1106_12", name: "Kinh tế chính trị Mác Lênin", credits: 2, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true }
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

export default function App() {
  const [scores, setScores] = useState({});

  // Khôi phục dữ liệu cũ nếu có
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gpa-master-v6');
      if (saved) setScores(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Tự động lưu khi có thay đổi
  useEffect(() => {
    localStorage.setItem('gpa-master-v6', JSON.stringify(scores));
  }, [scores]);

  const updateScore = (id, field, val) => {
    setScores(prev => ({
      ...prev,
      [id]: { ...(prev[id] || { attendance: '', midterm: '', final: '' }), [field]: val }
    }));
  };

  let totalCredits = 0, totalPoints = 0;
  
  subjectsList.forEach(sub => {
    const s = scores[sub.id] || { attendance: '', midterm: '', final: '' };
    const att = parseFloat(s.attendance) || 0;
    const mid = parseFloat(s.midterm) || 0;
    const fin = parseFloat(s.final) || 0;
    
    if (att || mid || fin) {
      totalCredits += sub.credits;
      const final10 = (att * sub.weights.attendance) + (mid * sub.weights.midterm) + (fin * sub.weights.final);
      totalPoints += convertTo4Scale(final10) * sub.credits;
    }
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-blue-100 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">🚀 GPA Master</h1>
          <p className="text-slate-600 font-medium">Học tài thi phận, nhưng em bé của anh thi chắc chắn A! 🥰</p>
        </div>

        {/* Dashboard */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex justify-around items-center border border-slate-200">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500 mb-1">Tín chỉ đã nạp</p>
            <p className="text-3xl md:text-4xl font-bold text-slate-800">{totalCredits}</p>
          </div>
          <div className="w-px h-12 bg-slate-200"></div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500 mb-1">GPA Hệ 4</p>
            <p className="text-3xl md:text-4xl font-bold text-blue-600">{gpa}</p>
          </div>
        </div>

        {/* Danh sách môn học */}
        <div className="space-y-4">
          {subjectsList.map(sub => {
            const s = scores[sub.id] || { attendance: '', midterm: '', final: '' };
            const att = parseFloat(s.attendance) || 0;
            const mid = parseFloat(s.midterm) || 0;
            let reqA = sub.hasFinal ? (8.5 - (att * sub.weights.attendance) - (mid * sub.weights.midterm)) / sub.weights.final : 0;

            return (
              <div key={sub.id} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-200 transition-colors">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-slate-800">{sub.name}</h3>
                  <p className="text-sm font-medium text-slate-500">{sub.credits} tín chỉ</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">C.Cần (10%)</label>
                    <input type="number" step="0.1" value={s.attendance} onChange={e => updateScore(sub.id, 'attendance', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Q.Trình ({sub.weights.midterm * 100}%)</label>
                    <input type="number" step="0.1" value={s.midterm} onChange={e => updateScore(sub.id, 'midterm', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                  </div>
                  {sub.hasFinal ? (
                    <div>
                      <label className="block text-xs font-bold text-blue-600 mb-1">C.Kì (50%)</label>
                      <input type="number" step="0.1" value={s.final} onChange={e => updateScore(sub.id, 'final', e.target.value)}
                        className="w-full bg-blue-50 border border-blue-300 rounded-lg px-3 py-2 font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                    </div>
                  ) : (
                    <div className="flex items-end">
                      <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-2 rounded-lg w-full text-center border border-slate-200">Không thi CK</span>
                    </div>
                  )}
                </div>
                
                {sub.hasFinal && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">Mục tiêu A (8.5): </span>
                    <span className={`font-bold px-3 py-1 rounded-full ${reqA <= 0 ? 'bg-green-100 text-green-700' : (reqA > 10 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700')}`}>
                      {reqA <= 0 ? 'Đã đạt' : (reqA > 10 ? 'Không thể đạt' : `Cần ${reqA.toFixed(2)}`)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}