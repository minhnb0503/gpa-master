import React, { useEffect, useState, useRef } from 'react';

const defaultSubjects = [
  { id: "CNTT1112_02", name: "Kiến trúc máy tính", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1114_03", name: "Mạng máy tính & truyền số liệu", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1137_02", name: "Phân tích nghiệp vụ", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1165_02", name: "Thiết kế WEB", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "CNTT1186_02", name: "Công nghệ hiện đại CNTT", credits: 3, weights: { attendance: 0.1, midterm: 0.9, final: 0 }, hasFinal: false },
  { id: "LLNL1106_12", name: "Kinh tế chính trị Mác Lênin", credits: 2, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true }
];

const quotes = [
  "Bé iu của anh ơi, cố lên nhé! Anh luôn ở đây ủng hộ Ly. ❤️",
  "Gửi ngàn nụ hôn cho cô gái NEU giỏi giang của anh. Yêu Ly nhất!",
  "Học xong anh dẫn đi ăn đồ Hàn nhé, Ly của anh vất vả rồi 🥰",
  "GPA NEU khó thế nào cũng không làm khó được em bé của anh đâu!",
  "Ly cứ việc học giỏi, cả thế giới cứ để anh lo. Thương em lắm!",
  "Nhìn Ly chăm chỉ mà anh thấy yêu quá, cố lên nốt môn này nha!"
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

// Biểu đồ vòng tròn
const CircularProgress = ({ value, mainText, subText, max, colorClass, trailColor = "text-slate-100" }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(Math.max(value, 0), max);
  const strokeDashoffset = circumference - (safeValue / max) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28 mb-3">
        <svg className="transform -rotate-90 w-full h-full absolute inset-0">
          <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className={trailColor} />
          <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className={`${colorClass} transition-all duration-1000 ease-out`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[20px] md:text-[22px] font-extrabold text-slate-800 leading-none">{mainText}</span>
        </div>
      </div>
      <span className="text-[12px] md:text-[14px] font-bold text-slate-700">{subText}</span>
    </div>
  );
};

export default function App() {
  const [subjectsList, setSubjectsList] = useState(defaultSubjects);
  const [scores, setScores] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  
  // State cho hiệu ứng gõ chữ
  const [quote, setQuote] = useState("");
  const [displayedQuote, setDisplayedQuote] = useState("");
  const typingIndex = useRef(0);

  // State cho Modal Xóa
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  // State cho Modal Thêm môn
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', credits: 3, attW: 10, midW: 40, finW: 50, hasFinal: true });

  // Khôi phục dữ liệu
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('gpa-master-v9');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.subjectsList && parsed.subjectsList.length > 0) setSubjectsList(parsed.subjectsList);
      }
    } catch (e) {
      console.error(e);
    }
    
    // Chọn câu chúc ngẫu nhiên
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setIsLoaded(true);
  }, []);

  // Tự động lưu khi có thay đổi
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gpa-master-v9', JSON.stringify({ scores, subjectsList }));
    }
  }, [scores, subjectsList, isLoaded]);

  // Hiệu ứng gõ chữ (Typing Effect)
  useEffect(() => {
    if (!quote) return;
    typingIndex.current = 0;
    setDisplayedQuote("");
    
    const interval = setInterval(() => {
      setDisplayedQuote((prev) => {
        if (typingIndex.current < quote.length) {
          const nextChar = quote[typingIndex.current];
          typingIndex.current++;
          return prev + nextChar;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 60); // Tốc độ gõ: 60ms / ký tự

    return () => clearInterval(interval);
  }, [quote]);

  // Hàm update điểm & mục tiêu riêng
  const updateScore = (id, field, val) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    if ((cleanVal.match(/\./g) || []).length > 1) return;

    setScores(prev => ({
      ...prev,
      [id]: { ...(prev[id] || { attendance: '', midterm: '', final: '', target: '8.5' }), [field]: cleanVal }
    }));
  };

  // Hàm xử lý Thêm môn học
  const handleAddSubject = () => {
    if (!newSub.name.trim()) {
      alert("Khánh Ly nhớ nhập tên môn học nhé!");
      return;
    }
    const id = "SUB_" + Date.now();
    const newSubject = {
      id,
      name: newSub.name,
      credits: parseInt(newSub.credits) || 0,
      weights: {
        attendance: (parseFloat(newSub.attW) || 0) / 100,
        midterm: (parseFloat(newSub.midW) || 0) / 100,
        final: newSub.hasFinal ? (parseFloat(newSub.finW) || 0) / 100 : 0
      },
      hasFinal: newSub.hasFinal
    };
    
    setSubjectsList([...subjectsList, newSubject]);
    setShowAddModal(false);
    // Reset form
    setNewSub({ name: '', credits: 3, attW: 10, midW: 40, finW: 50, hasFinal: true });
  };

  // Xử lý Xóa môn học
  const confirmDelete = () => {
    setSubjectsList(prev => prev.filter(s => s.id !== subjectToDelete.id));
    setSubjectToDelete(null);
  };

  // Tính toán tổng điểm
  let totalCredits = 0, totalPoints = 0, completedSubjects = 0;
  
  subjectsList.forEach(sub => {
    const s = scores[sub.id] || { attendance: '', midterm: '', final: '', target: '8.5' };
    const att = parseFloat(s.attendance) || 0;
    const mid = parseFloat(s.midterm) || 0;
    const fin = parseFloat(s.final) || 0;
    
    if (att > 0 || mid > 0 || fin > 0) completedSubjects += 1;

    if (att || mid || fin) {
      totalCredits += sub.credits;
      const final10 = (att * sub.weights.attendance) + (mid * sub.weights.midterm) + (fin * sub.weights.final);
      totalPoints += convertTo4Scale(final10) * sub.credits;
    }
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  if (!isLoaded) return <div className="min-h-screen bg-[#f0f4f8]"></div>;

  return (
    <div className="min-h-screen bg-[#f0f4f8] p-0 md:p-6 font-sans text-slate-800 flex justify-center relative">
      <div className="w-full max-w-[1280px] bg-white md:rounded-[24px] shadow-2xl flex flex-col md:flex-row h-screen md:h-[90vh] overflow-hidden border border-slate-200">
        
        {/* Sidebar */}
        <div className="w-full md:w-[260px] bg-[#f8fafc] border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col shrink-0 relative z-10">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="text-[32px] drop-shadow-md">🚀</span>
            <h1 className="text-[22px] font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">GPA Master</h1>
          </div>
          
          {/* Dashboard Panel Nhỏ */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col items-center mb-6">
            <h3 className="text-[14px] font-bold text-slate-500 mb-4 uppercase tracking-wider">Hiệu suất</h3>
            <div className="flex flex-col gap-4 w-full">
              <CircularProgress value={completedSubjects} mainText={`${completedSubjects}/${subjectsList.length}`} subText="Tiến độ" max={subjectsList.length} colorClass="text-emerald-500" />
              <div className="w-full border-t border-slate-100 my-1"></div>
              <CircularProgress value={gpa} mainText={gpa} subText="GPA Hệ 4" max={4.0} colorClass="text-purple-500" />
            </div>
          </div>

          {/* Lời nhắn yêu thương (Typing) */}
          <div className="mt-auto bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-5 shadow-md text-white">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
              <span className="text-[12px] font-bold uppercase tracking-wider">Gửi Khánh Ly</span>
            </div>
            <p className="text-[14px] font-medium leading-relaxed min-h-[60px]">
              {displayedQuote}
              <span className="animate-pulse inline-block w-1.5 h-4 bg-white ml-1 align-middle"></span>
            </p>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative z-10">
          <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-slate-200 bg-white shadow-sm z-20">
            <h2 className="text-[20px] md:text-[24px] font-extrabold text-slate-800">Quản lý môn học</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              <span className="hidden md:inline">Thêm môn mới</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8 space-y-5">
            {subjectsList.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-medium">Chưa có môn học nào, Ly thêm môn mới nhé!</div>
            ) : (
              subjectsList.map((subject) => {
                const s = scores[subject.id] || { attendance: '', midterm: '', final: '', target: '8.5' };
                const att = parseFloat(s.attendance) || 0;
                const mid = parseFloat(s.midterm) || 0;
                const target = parseFloat(s.target) || 0;
                
                let reqA = 0;
                if (subject.hasFinal) {
                  reqA = (target - (att * subject.weights.attendance) - (mid * subject.weights.midterm)) / subject.weights.final;
                }

                return (
                  <div key={subject.id} className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
                    
                    {/* Nút Xóa (Thùng rác) */}
                    <button 
                      onClick={() => setSubjectToDelete(subject)}
                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa môn này"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>

                    <div className="mb-5 pr-10">
                      <h4 className="text-[16px] font-bold text-slate-800 leading-tight">{subject.name}</h4>
                      <p className="text-[13px] text-slate-500 mt-1 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded">{subject.credits} tín chỉ</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">C.Cần ({subject.weights.attendance * 100}%)</label>
                        <input type="text" inputMode="decimal" placeholder="0" value={s.attendance} onChange={e => updateScore(subject.id, 'attendance', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2.5 text-[15px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-center shadow-inner" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Q.Trình ({subject.weights.midterm * 100}%)</label>
                        <input type="text" inputMode="decimal" placeholder="0" value={s.midterm} onChange={e => updateScore(subject.id, 'midterm', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2.5 text-[15px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-center shadow-inner" />
                      </div>
                      {subject.hasFinal ? (
                        <div>
                          <label className="block text-[11px] font-bold text-blue-600 mb-1.5 uppercase">C.Kì ({subject.weights.final * 100}%)</label>
                          <input type="text" inputMode="decimal" placeholder="0" value={s.final} onChange={e => updateScore(subject.id, 'final', e.target.value)}
                            className="w-full bg-blue-50 border border-blue-300 rounded-xl px-2 py-2.5 text-[15px] font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-center shadow-inner" />
                        </div>
                      ) : (
                        <div className="flex items-end">
                          <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-2 py-2.5 rounded-xl w-full text-center border border-slate-200">Không thi CK</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Phần cấu hình Mục tiêu riêng */}
                    {subject.hasFinal && (
                      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-slate-500 font-bold">Mục tiêu:</span>
                          <input 
                            type="text" 
                            inputMode="decimal" 
                            value={s.target !== undefined ? s.target : '8.5'} 
                            onChange={e => updateScore(subject.id, 'target', e.target.value)}
                            title="Điểm mục tiêu của riêng môn này"
                            className="w-[60px] bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-[14px] font-bold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-inner" 
                          />
                        </div>
                        
                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                            {reqA > 0 && reqA <= 10 && target > 0 && (
                              <button
                                onClick={() => updateScore(subject.id, 'final', reqA.toFixed(2))}
                                className="text-[12px] bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg transition-colors font-bold shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
                              >
                                ⚡ Tự điền
                              </button>
                            )}
                            <span className={`font-bold px-3 py-1.5 rounded-lg text-[13px] border ${target <= 0 ? 'bg-slate-50 text-slate-500 border-slate-200' : (reqA <= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : (reqA > 10 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'))}`}>
                              {target <= 0 ? 'Nhập MT' : (reqA <= 0 ? 'Đã đạt MT 🎉' : (reqA > 10 ? 'Không thể đạt ❌' : `Cần thi ${reqA.toFixed(2)}`))}
                            </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MODAL: XÁC NHẬN XÓA */}
        {subjectToDelete && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-[fadeIn_0.2s_ease-out]">
              <div className="text-red-500 w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Chờ đã nào!</h3>
              <p className="text-center text-slate-600 font-medium mb-6">
                Ly có chắc chắn muốn xóa môn <strong className="text-slate-800">"{subjectToDelete.name}"</strong> không? Điểm đã nhập sẽ mất đó nha.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setSubjectToDelete(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors">
                  Hủy bỏ
                </button>
                <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-red-500/30">
                  Xóa luôn!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: THÊM MÔN HỌC MỚI */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full my-8 animate-[fadeIn_0.2s_ease-out]">
              <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Thêm môn học mới
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-1">Tên môn học</label>
                  <input type="text" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} placeholder="VD: Triết học Mác Lênin..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-700 mb-1">Số tín chỉ</label>
                    <input type="number" value={newSub.credits} onChange={e => setNewSub({...newSub, credits: e.target.value})}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center" />
                  </div>
                  <div className="flex items-center justify-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newSub.hasFinal} onChange={e => setNewSub({...newSub, hasFinal: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                      <span className="text-[13px] font-bold text-slate-700">Có thi Cuối Kì</span>
                    </label>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-[13px] font-bold text-slate-700 mb-3 text-center">Trọng số điểm (%)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1 text-center">Chuyên Cần</label>
                      <input type="number" value={newSub.attW} onChange={e => setNewSub({...newSub, attW: e.target.value})} className="w-full border border-slate-300 rounded-lg px-2 py-2 text-center" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1 text-center">Quá Trình</label>
                      <input type="number" value={newSub.midW} onChange={e => setNewSub({...newSub, midW: e.target.value})} className="w-full border border-slate-300 rounded-lg px-2 py-2 text-center" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1 text-center">Cuối Kì</label>
                      <input type="number" disabled={!newSub.hasFinal} value={newSub.hasFinal ? newSub.finW : 0} onChange={e => setNewSub({...newSub, finW: e.target.value})} 
                        className={`w-full border border-slate-300 rounded-lg px-2 py-2 text-center ${!newSub.hasFinal ? 'bg-slate-200 text-slate-400' : ''}`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors">
                  Hủy
                </button>
                <button onClick={handleAddSubject} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/30">
                  Thêm môn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}