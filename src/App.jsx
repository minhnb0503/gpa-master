import React, { useEffect, useState, useRef } from 'react';

const defaultSuggestions = [
  { id: "S_1", name: "Triết học Mác - Lênin", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "S_2", name: "Kinh tế vi mô", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "S_3", name: "Toán cho các nhà kinh tế", credits: 4, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "S_4", name: "Pháp luật đại cương", credits: 2, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "S_5", name: "Tin học đại cương", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
  { id: "S_6", name: "Tiếng Anh chuyên ngành", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true }
];

const quotes = [
  "Bé iu của anh ơi, cố lên nhé! Anh luôn ở đây ủng hộ Ly. ❤️",
  "Gửi ngàn nụ hôn cho cô gái NEU giỏi giang của anh. Yêu Ly nhất! 🥰",
  "Học xong anh dẫn đi ăn đồ Hàn nhé, Ly của anh vất vả rồi 🍲",
  "GPA NEU khó thế nào cũng không làm khó được em bé của anh đâu! 🚀",
  "Ly cứ việc học giỏi, cả thế giới cứ để anh lo. Thương em lắm! 🥺",
  "Nhìn Ly chăm chỉ mà anh thấy yêu quá, cố lên nốt môn này nha! ✨"
];

const gradeScale = { 'A': 8.5, 'B+': 8.0, 'B': 7.0, 'C+': 6.5, 'C': 5.5, 'D+': 5.0, 'D': 4.0 };
const gradeDescriptions = {
  'A': "Xuất sắc, đỉnh cao phong độ! ✨", 'B+': "Giỏi, rất đáng khen ngợi. 👍", 'B': "Khá, một kết quả vững chắc. ✅",
  'C+': "Trung bình khá, cần cố gắng. 💪", 'C': "Trung bình, qua môn an toàn. 🛡️", 'D+': "Yếu khá, sát nút qua môn. 😅", 'D': "Yếu, qua môn tối thiểu. ⚠️"
};

const convertTo4Scale = (score) => {
  if (score >= 8.5) return 4.0; if (score >= 8.0) return 3.5; if (score >= 7.0) return 3.0;
  if (score >= 6.5) return 2.5; if (score >= 5.5) return 2.0; if (score >= 5.0) return 1.5;
  if (score >= 4.0) return 1.0; return 0.0;
};

const TypingText = ({ text, colorClass = "text-white" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const typingIndex = useRef(0);
  useEffect(() => {
    const chars = Array.from(text);
    typingIndex.current = 0; setDisplayedText("");
    const interval = setInterval(() => {
      if (typingIndex.current < chars.length) {
        setDisplayedText(text.slice(0, Array.from(text.slice(0, typingIndex.current + 1)).length === typingIndex.current + 1 ? typingIndex.current + 1 : typingIndex.current + 2));
        typingIndex.current++;
      } else clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text]);
  // Bản fix typing đơn giản hơn cho emoji
  const [simpleText, setSimpleText] = useState("");
  useEffect(() => {
    let i = 0; setSimpleText("");
    const t = Array.from(text);
    const timer = setInterval(() => {
      setSimpleText(prev => prev + t[i]);
      i++;
      if (i === t.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [text]);
  return <p className={`${colorClass} font-medium leading-relaxed min-h-[60px] text-[14px]`}>{simpleText}<span className="animate-pulse inline-block w-1.5 h-4 bg-current ml-1 align-middle"></span></p>;
};

const CircularProgress = ({ value, mainText, subText, max, colorClass }) => {
  const radius = 36; const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(value, max) / max) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-2">
        <svg className="transform -rotate-90 w-full h-full absolute inset-0"><circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="7" fill="transparent" className="text-slate-100" /><circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="7" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className={`${colorClass} transition-all duration-1000`} strokeLinecap="round" /></svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-[18px] md:text-[20px] font-extrabold text-slate-800">{mainText}</span></div>
      </div>
      <span className="text-[11px] md:text-[12px] font-bold text-slate-500 uppercase">{subText}</span>
    </div>
  );
};

export default function App() {
  const [subjectsList, setSubjectsList] = useState([]);
  const [scores, setScores] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quote, setQuote] = useState("");
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [targetModalSubject, setTargetModalSubject] = useState(null);
  const [newSub, setNewSub] = useState({ name: '', credits: 3, attW: 10, midW: 40, finW: 50, hasFinal: true });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gpa-master-v12');
      if (saved) {
        const p = JSON.parse(saved);
        setScores(p.scores || {});
        setSubjectsList(p.subjectsList || []);
      } else { setSubjectsList([
        { id: "INIT_1", name: "Kiến trúc máy tính", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
        { id: "INIT_2", name: "Thiết kế WEB", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true }
      ]);}
    } catch (e) {}
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('gpa-master-v12', JSON.stringify({ scores, subjectsList }));
  }, [scores, subjectsList, isLoaded]);

  const updateScore = (id, field, val) => {
    let c = val;
    if (['attendance', 'midterm', 'final'].includes(field)) { c = val.replace(/[^0-9.]/g, ''); if ((c.match(/\./g) || []).length > 1) return; }
    setScores(prev => {
      const d = prev[id] || { attendance: '', midterm: '', final: '', target: 'A', targetType: 'letter' };
      if (field === 'targetType') return { ...prev, [id]: { ...d, targetType: c, target: c === 'letter' ? 'A' : '8.5' } };
      return { ...prev, [id]: { ...d, [field]: c } };
    });
  };

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const selectAll = () => setSelectedIds(selectedIds.length === subjectsList.length ? [] : subjectsList.map(s => s.id));
  
  const handleBulkDelete = () => {
    setSubjectsList(prev => prev.filter(s => !selectedIds.includes(s.id)));
    setSelectedIds([]);
    setShowBulkDeleteModal(false);
  };

  const handleBulkAdd = (items) => {
    const news = items.map(it => ({ ...it, id: "BULK_" + Math.random().toString(36).substr(2, 9) }));
    setSubjectsList(prev => [...prev, ...news]);
    setShowBulkAddModal(false);
  };

  let totalCredits = 0, totalPoints = 0, completed = 0;
  subjectsList.forEach(sub => {
    const s = scores[sub.id] || {};
    const att = parseFloat(s.attendance) || 0, mid = parseFloat(s.midterm) || 0, fin = parseFloat(s.final) || 0;
    if (att > 0 || mid > 0 || fin > 0) completed++;
    if (att || mid || fin) { totalCredits += sub.credits; totalPoints += convertTo4Scale((att * sub.weights.attendance) + (mid * sub.weights.midterm) + (fin * sub.weights.final)) * sub.credits; }
  });
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-800 flex justify-center p-0 md:p-6">
      <div className="w-full max-w-[1200px] bg-white md:rounded-[32px] shadow-2xl flex flex-col md:flex-row md:h-[90vh] overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-full md:w-[300px] bg-[#f8fafc] border-b md:border-r border-slate-200 p-6 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🚀</span>
            <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">GPA MASTER</h1>
          </div>
          
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6">
            <div className="flex flex-row justify-around w-full">
              <CircularProgress value={completed} mainText={`${completed}/${subjectsList.length}`} subText="Tiến độ" max={subjectsList.length || 1} colorClass="text-emerald-500" />
              <div className="w-px bg-slate-100 mx-2" />
              <CircularProgress value={gpa} mainText={gpa} subText="GPA Hệ 4" max={4.0} colorClass="text-blue-600" />
            </div>
          </div>

          <div className="mt-auto bg-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-200">
             <TypingText text={quote} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#fcfcfc] relative">
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">Môn học của Ly</h2>
              {selectedIds.length > 0 && <span className="text-xs text-blue-600 font-bold">Đã chọn {selectedIds.length} môn</span>}
            </div>
            <div className="flex gap-2">
              {selectedIds.length > 0 ? (
                <button onClick={() => setShowBulkDeleteModal(true)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm border border-red-100 flex items-center gap-2 transition-all active:scale-95"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>Xóa đã chọn</button>
              ) : (
                <>
                  <button onClick={() => setShowBulkAddModal(true)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100 transition-all active:scale-95">Nạp nhanh</button>
                  <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95">+ Thêm môn</button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-20">
            {subjectsList.length > 0 && (
              <div className="flex items-center gap-2 px-2 mb-2">
                <input type="checkbox" checked={selectedIds.length === subjectsList.length && subjectsList.length > 0} onChange={selectAll} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chọn tất cả</span>
              </div>
            )}
            
            {subjectsList.map(sub => {
              const s = scores[sub.id] || {};
              const tType = s.targetType || 'letter';
              const tVal = s.target || 'A';
              const numT = tType === 'letter' ? (gradeScale[tVal] || 8.5) : (parseFloat(tVal) || 0);
              const att = parseFloat(s.attendance) || 0, mid = parseFloat(s.midterm) || 0;
              const req = sub.hasFinal ? (numT - (att * sub.weights.attendance) - (mid * sub.weights.midterm)) / sub.weights.final : 0;

              return (
                <div key={sub.id} className={`bg-white rounded-3xl p-5 border-2 transition-all flex items-start gap-4 ${selectedIds.includes(sub.id) ? 'border-blue-500 shadow-md bg-blue-50/30' : 'border-slate-100 shadow-sm'}`}>
                  <input type="checkbox" checked={selectedIds.includes(sub.id)} onChange={() => toggleSelect(sub.id)} className="w-5 h-5 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div onClick={() => toggleSelect(sub.id)} className="cursor-pointer">
                        <h4 className="font-bold text-slate-800">{sub.name}</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{sub.credits} Tín chỉ</p>
                      </div>
                      <button onClick={() => setSubjectToDelete(sub)} className="text-slate-300 hover:text-red-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {['attendance', 'midterm', 'final'].map(f => (
                        f === 'final' && !sub.hasFinal ? <div key={f} className="bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100"><span className="text-[10px] font-bold text-slate-300 uppercase">Ko thi</span></div> : (
                        <div key={f}>
                          <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">{f === 'attendance' ? 'Chuyên cần' : f === 'midterm' ? 'Quá trình' : 'Cuối kì'}</label>
                          <input type="text" inputMode="decimal" value={s[f] || ''} onChange={e => updateScore(sub.id, f, e.target.value)} className={`w-full text-center py-2 rounded-xl font-bold text-sm border-2 transition-all ${f === 'final' ? 'bg-blue-50 border-blue-100 text-blue-600 focus:border-blue-500' : 'bg-slate-50 border-slate-100 focus:border-blue-400'} focus:outline-none`} />
                        </div>)
                      ))}
                    </div>

                    {sub.hasFinal && (
                      <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3 border border-slate-100">
                        <button onClick={() => setTargetModalSubject(sub.id)} className="flex flex-col text-left">
                          <span className="text-[9px] font-black text-slate-400 uppercase">Mục tiêu</span>
                          <span className="text-xs font-bold text-blue-600">{tType === 'letter' ? `Điểm ${tVal}` : `${tVal} Hệ 10`}</span>
                        </button>
                        <div className="flex items-center gap-2">
                          {req > 0 && req <= 10 && <button onClick={() => updateScore(sub.id, 'final', req.toFixed(2))} className="bg-white text-[10px] font-black text-blue-500 px-2 py-1.5 rounded-lg border border-blue-100 shadow-sm active:scale-95">⚡ TỰ ĐIỀN</button>}
                          <span className={`text-[11px] font-black px-3 py-1.5 rounded-xl border ${req <= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : req > 10 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'}`}>{req <= 0 ? 'ĐÃ ĐẠT 🎉' : req > 10 ? 'KHÔNG THỂ ❌' : `CẦN ${req.toFixed(2)}`}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Xóa Hàng Loạt */}
        {showBulkDeleteModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
              <h3 className="text-xl font-black text-center mb-2">Xóa {selectedIds.length} môn học?</h3>
              <p className="text-center text-slate-500 text-sm font-medium mb-8">Ly có chắc chắn không? Toàn bộ điểm số của các môn đã chọn sẽ biến mất vĩnh viễn đó nha em iu.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowBulkDeleteModal(false)} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-all">Hủy</button>
                <button onClick={handleBulkDelete} className="flex-1 py-3 font-bold text-white bg-red-500 rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-all">Xóa sạch!</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Nạp Nhanh */}
        {showBulkAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-black mb-4">Nạp nhanh danh sách</h3>
              <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
                {defaultSuggestions.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-sm text-slate-700">{s.name} ({s.credits}t)</span>
                    <button onClick={() => handleBulkAdd([s])} className="text-blue-600 font-black text-xs bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm active:scale-95">+ THÊM</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleBulkAdd(defaultSuggestions)} className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 active:scale-95">+ THÊM TẤT CẢ</button>
                <button onClick={() => setShowBulkAddModal(false)} className="px-6 py-3 font-bold text-slate-500 bg-slate-100 rounded-2xl active:scale-95">Đóng</button>
              </div>
            </div>
          </div>
        )}

        {/* Target Modal (Tích hợp từ bản trước) */}
        {targetModalSubject && (() => {
           const id = targetModalSubject; const s = scores[id] || {}; const tType = s.targetType || 'letter'; const tVal = s.target || 'A';
           return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center">
              <div className="bg-white rounded-t-[40px] md:rounded-[32px] p-8 w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black">Đặt Mục Tiêu</h3>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button onClick={() => updateScore(id, 'targetType', 'letter')} className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${tType === 'letter' ? "bg-white text-blue-600 shadow-md" : "text-slate-400"}`}>CHỮ</button>
                    <button onClick={() => updateScore(id, 'targetType', 'number')} className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${tType === 'number' ? "bg-white text-blue-600 shadow-md" : "text-slate-400"}`}>SỐ</button>
                  </div>
                </div>
                {tType === 'letter' ? (
                  <div className="grid grid-cols-4 gap-3 mb-8">
                    {Object.keys(gradeScale).map(g => (
                      <button key={g} onClick={() => updateScore(id, 'target', g)} className={`py-4 rounded-2xl border-2 font-black transition-all ${tVal === g ? "border-blue-500 bg-blue-50 text-blue-600 scale-105" : "border-slate-100 text-slate-400"}`}>{g}</button>
                    ))}
                  </div>
                ) : (
                  <div className="mb-8 px-2">
                    <input type="range" min="4.0" max="10.0" step="0.1" value={tVal} onChange={e => updateScore(id, 'target', e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4" />
                    <div className="text-4xl font-black text-blue-600 text-center">{tVal}</div>
                  </div>
                )}
                <div className="bg-blue-50 p-4 rounded-2xl mb-8"><p className="text-blue-700 text-sm font-bold text-center">"{tType === 'letter' ? gradeDescriptions[tVal] : 'Bé cố gắng đạt con số này nhé!'}"</p></div>
                <button onClick={() => setTargetModalSubject(null)} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all">XÁC NHẬN</button>
              </div>
            </div>
           );
        })()}

        {/* Modal Thêm Môn (Tích hợp bản cũ) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-black mb-6">Môn mới cho Ly</h3>
              <div className="space-y-4 mb-8">
                <input type="text" placeholder="Tên môn học..." value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:outline-none focus:border-blue-500" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Tín chỉ" value={newSub.credits} onChange={e => setNewSub({...newSub, credits: e.target.value})} className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-center" />
                  <label className="flex items-center gap-3 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl cursor-pointer"><input type="checkbox" checked={newSub.hasFinal} onChange={e => setNewSub({...newSub, hasFinal: e.target.checked})} className="w-5 h-5 rounded text-blue-600" /><span className="text-xs font-bold text-slate-500">Có thi CK</span></label>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-bold text-slate-400 bg-slate-100 rounded-2xl">Hủy</button>
                <button onClick={handleAddSubject} className="flex-1 py-4 font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">Thêm ngay</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}