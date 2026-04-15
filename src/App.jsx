import React, { useEffect, useState, useRef } from 'react';

// === DỮ LIỆU MẶC ĐỊNH ===
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

const gradeScale = {
  'A': 8.5, 'B+': 8.0, 'B': 7.0, 'C+': 6.5, 'C': 5.5, 'D+': 5.0, 'D': 4.0
};

const gradeDescriptions = {
  'A': "Xuất sắc, đỉnh cao phong độ! ✨",
  'B+': "Giỏi, rất đáng khen ngợi. 👍",
  'B': "Khá, một kết quả vững chắc. ✅",
  'C+': "Trung bình khá, cần cố gắng. 💪",
  'C': "Trung bình, qua môn an toàn. 🛡️",
  'D+': "Yếu khá, sát nút qua môn. 😅",
  'D': "Yếu, qua môn tối thiểu. ⚠️"
};

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

// === COMPONENT CHỮ CHẠY TÌNH CẢM ===
const TypingText = ({ text, colorClass = "text-white" }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText("");
    const charsArray = Array.from(text || "");
    
    const timer = setInterval(() => {
      if (currentIndex < charsArray.length) {
        setDisplayedText(charsArray.slice(0, currentIndex + 1).join(""));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, [text]);

  return (
    <p className={`${colorClass} font-medium leading-relaxed min-h-[60px] text-[14px]`}>
      {displayedText}
      <span className="animate-pulse inline-block w-1.5 h-4 bg-current ml-1 align-middle"></span>
    </p>
  );
};

// === COMPONENT BIỂU ĐỒ VÒNG TRÒN ===
const CircularProgress = ({ value, mainText, subText, max, colorClass }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(value, max) / max) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-20 h-20 md:w-32 md:h-32 mb-2 md:mb-4 transition-all">
        <svg className="transform -rotate-90 w-full h-full absolute inset-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
          <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className={`${colorClass} transition-all duration-1000`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[18px] md:text-[26px] font-extrabold text-slate-800">{mainText}</span>
        </div>
      </div>
      <span className="text-[11px] md:text-[14px] font-bold text-slate-500 uppercase tracking-wider">{subText}</span>
    </div>
  );
};

// === ỨNG DỤNG CHÍNH ===
export default function App() {
  const [subjectsList, setSubjectsList] = useState([]);
  const [scores, setScores] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [quote, setQuote] = useState("");
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [targetModalSubject, setTargetModalSubject] = useState(null);
  
  // State nâng cấp cho Form thêm môn mới
  const initialNewSub = { name: '', credits: 3, attW: 10, midW: 40, finW: 50, hasFinal: true, targetType: 'letter', target: 'A' };
  const [newSub, setNewSub] = useState(initialNewSub);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('gpa-master-v15');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setScores(parsed.scores || {});
        setSubjectsList(parsed.subjectsList || []);
      } else {
        setSubjectsList([
          { id: "INIT_1", name: "Kiến trúc máy tính", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true },
          { id: "INIT_2", name: "Mạng máy tính", credits: 3, weights: { attendance: 0.1, midterm: 0.4, final: 0.5 }, hasFinal: true }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gpa-master-v15', JSON.stringify({ scores, subjectsList }));
    }
  }, [scores, subjectsList, isLoaded]);

  const updateScore = (id, field, val) => {
    let cleanVal = val;
    
    if (['attendance', 'midterm', 'final'].includes(field)) {
      cleanVal = val.replace(/[^0-9.]/g, '');
      if ((cleanVal.match(/\./g) || []).length > 1) return;
    }
    
    if (field === 'target' && scores[id]?.targetType === 'number') {
      cleanVal = val.replace(/[^0-9.]/g, '');
      if ((cleanVal.match(/\./g) || []).length > 1) return;
    }

    setScores(prev => {
      const currentData = prev[id] || { attendance: '', midterm: '', final: '', target: 'A', targetType: 'letter' };
      if (field === 'targetType') {
        return { 
          ...prev, 
          [id]: { ...currentData, targetType: cleanVal, target: cleanVal === 'letter' ? 'A' : '8.5' } 
        };
      }
      return { ...prev, [id]: { ...currentData, [field]: cleanVal } };
    });
  };

  const toggleSelectMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]); 
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === subjectsList.length) setSelectedIds([]);
    else setSelectedIds(subjectsList.map(s => s.id));
  };
  
  const handleBulkDelete = () => {
    setSubjectsList(prev => prev.filter(s => !selectedIds.includes(s.id)));
    setSelectedIds([]);
    setShowBulkDeleteModal(false);
    setIsSelectionMode(false);
  };

  const handleBulkAdd = (items) => {
    const newItems = items.map(it => ({ 
      ...it, 
      id: "BULK_" + Math.random().toString(36).substr(2, 9) 
    }));
    setSubjectsList(prev => [...prev, ...newItems]);
    setShowBulkAddModal(false);
  };

  // Hàm Thêm Môn Nâng Cấp (Hỗ trợ thêm nhiều & gán mục tiêu luôn)
  const handleAddSubject = (keepOpen = false) => {
    if (!newSub.name.trim()) return alert("Khánh Ly nhớ nhập tên môn học nhé!");
    
    const id = "SUB_" + Math.random().toString(36).substr(2, 9);
    const cred = Number(newSub.credits) || 0;
    const att = Number(newSub.attW) || 0;
    const mid = Number(newSub.midW) || 0;
    const fin = Number(newSub.finW) || 0;

    const newSubject = {
      id, name: newSub.name, credits: cred,
      weights: { attendance: att / 100, midterm: mid / 100, final: newSub.hasFinal ? (fin / 100) : 0 },
      hasFinal: newSub.hasFinal
    };
    
    // Lưu môn học vào danh sách
    setSubjectsList(prev => [...prev, newSubject]);
    
    // Gán ngay mục tiêu cho môn học vừa tạo
    setScores(prev => ({
      ...prev,
      [id]: { attendance: '', midterm: '', final: '', targetType: newSub.targetType, target: newSub.target }
    }));

    if (keepOpen) {
      setNewSub(initialNewSub); // Xóa form để Ly nhập tiếp
    } else {
      setShowAddModal(false);
      setNewSub(initialNewSub);
    }
  };

  const confirmDelete = () => {
    setSubjectsList(prev => prev.filter(s => s.id !== subjectToDelete.id));
    setSubjectToDelete(null);
  };

  let totalCredits = 0, totalPoints = 0, completedCount = 0;

  subjectsList.forEach(sub => {
    const s = scores[sub.id] || {};
    const att = parseFloat(s.attendance) || 0;
    const mid = parseFloat(s.midterm) || 0;
    const fin = parseFloat(s.final) || 0;
    
    if (att > 0 || mid > 0 || fin > 0) completedCount++;
    if (att || mid || fin) {
      totalCredits += sub.credits;
      const final10 = (att * sub.weights.attendance) + (mid * sub.weights.midterm) + (fin * sub.weights.final);
      totalPoints += convertTo4Scale(final10) * sub.credits;
    }
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  if (!isLoaded) return <div className="min-h-screen bg-[#f1f5f9]"></div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-800 flex justify-center p-0 md:p-6">
      <div className="w-full max-w-[1280px] bg-white md:rounded-[32px] shadow-none md:shadow-2xl flex flex-col md:flex-row min-h-screen md:min-h-[90vh] md:overflow-hidden border-0 md:border border-slate-200">
        
        {/* === SIDEBAR === */}
        <div className="w-full md:w-[320px] bg-[#f8fafc] border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-6 md:mb-10">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">GPA MASTER</h1>
          </div>
          
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6 flex-1 flex flex-col justify-center">
            <div className="flex flex-row md:flex-col justify-around items-center w-full gap-2 md:gap-8">
              <CircularProgress value={completedCount} mainText={`${completedCount}/${subjectsList.length}`} subText="Tiến độ" max={subjectsList.length || 1} colorClass="text-emerald-500" />
              <div className="h-12 w-px md:w-20 md:h-px bg-slate-200" />
              <CircularProgress value={gpa} mainText={gpa} subText="GPA Hệ 4" max={4.0} colorClass="text-blue-600" />
            </div>
          </div>

          <div className="mt-auto bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
             <div className="flex items-center gap-2 mb-3 opacity-80">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
              <span className="text-[12px] font-bold uppercase tracking-wider">Gửi Khánh Ly</span>
             </div>
             <TypingText text={quote} />
          </div>
        </div>

        {/* === MAIN CONTENT === */}
        <div className="flex-1 flex flex-col h-full bg-[#fcfcfc] relative">
          
          <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 md:px-8 py-4 border-b border-slate-200 flex flex-row justify-between items-center gap-2">
            <div className="flex flex-col">
              <h2 className="text-lg md:text-2xl font-bold">Môn học của Ly</h2>
            </div>
            <div className="flex items-center gap-2">
              {subjectsList.length > 0 && (
                <button 
                  onClick={toggleSelectMode}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 ${isSelectionMode ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {isSelectionMode ? 'Xong' : 'Chỉnh sửa'}
                </button>
              )}
            </div>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isSelectionMode ? 'max-h-[80px] border-b border-slate-200 bg-slate-50/50' : 'max-h-0'}`}>
             <div className="px-4 md:px-8 py-3 flex items-center justify-between">
                <button onClick={selectAll} className="flex items-center gap-3 outline-none group cursor-pointer">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedIds.length === subjectsList.length && subjectsList.length > 0 ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                    {selectedIds.length === subjectsList.length && subjectsList.length > 0 && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm font-bold text-slate-600">Chọn tất cả</span>
                </button>
                
                {selectedIds.length > 0 && (
                  <button 
                    onClick={() => setShowBulkDeleteModal(true)} 
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm border border-red-100 flex items-center gap-2 transition-all active:scale-95 hover:bg-red-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Xóa {selectedIds.length} môn
                  </button>
                )}
             </div>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${!isSelectionMode ? 'max-h-[80px]' : 'max-h-0'}`}>
             <div className="px-4 md:px-8 py-4 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowBulkAddModal(true)} 
                  className="bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl font-bold text-sm border border-blue-100 transition-all active:scale-95 whitespace-nowrap hover:bg-blue-100"
                >
                  ⚡ Nạp nhanh
                </button>
                <button 
                  onClick={() => setShowAddModal(true)} 
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 whitespace-nowrap hover:bg-blue-700"
                >
                  + Thêm môn mới
                </button>
             </div>
          </div>

          {/* Danh sách */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 pb-20 custom-scroll">
            {subjectsList.length === 0 && (
               <div className="text-center mt-10 text-slate-400 font-medium">Chưa có môn học nào, Ly thêm môn mới nhé!</div>
            )}

            {subjectsList.map(sub => {
              const s = scores[sub.id] || {};
              const targetType = s.targetType || 'letter';
              const targetVal = s.target || 'A';
              
              const numericTarget = targetType === 'letter' ? (gradeScale[targetVal] || 8.5) : (parseFloat(targetVal) || 0);
              const att = parseFloat(s.attendance) || 0;
              const mid = parseFloat(s.midterm) || 0;
              const requiredFinal = sub.hasFinal ? (numericTarget - (att * sub.weights.attendance) - (mid * sub.weights.midterm)) / sub.weights.final : 0;
              const isSelected = selectedIds.includes(sub.id);

              return (
                <div 
                  key={sub.id} 
                  className={`bg-white rounded-3xl p-5 border-2 transition-all duration-300 flex items-start gap-4 ${isSelected ? 'border-blue-500 shadow-md bg-blue-50/40' : 'border-slate-100 shadow-sm'} ${isSelectionMode ? 'cursor-pointer hover:border-blue-300' : ''}`}
                  onClick={() => isSelectionMode && toggleSelect(sub.id)}
                >
                  <div className={`overflow-hidden transition-all duration-300 flex items-center justify-center pt-1 ${isSelectionMode ? 'w-8 opacity-100' : 'w-0 opacity-0'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                      {isSelected && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-[16px] md:text-lg text-slate-800 pr-2">{sub.name}</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{sub.credits} Tín chỉ</p>
                      </div>
                      {!isSelectionMode && (
                        <button onClick={(e) => { e.stopPropagation(); setSubjectToDelete(sub); }} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>

                    <div className={`grid grid-cols-3 gap-2 md:gap-4 mb-4 transition-opacity ${isSelectionMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                      <div>
                        <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-1 ml-1 truncate">C.Cần ({sub.weights.attendance * 100}%)</label>
                        <input type="text" inputMode="decimal" value={s.attendance || ''} onChange={e => updateScore(sub.id, 'attendance', e.target.value)} 
                          className="w-full text-center py-2.5 md:py-3 rounded-xl font-bold text-[14px] md:text-[15px] border-2 bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase mb-1 ml-1 truncate">Q.Trình ({sub.weights.midterm * 100}%)</label>
                        <input type="text" inputMode="decimal" value={s.midterm || ''} onChange={e => updateScore(sub.id, 'midterm', e.target.value)} 
                          className="w-full text-center py-2.5 md:py-3 rounded-xl font-bold text-[14px] md:text-[15px] border-2 bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                      </div>
                      {sub.hasFinal ? (
                        <div>
                          <label className="block text-[10px] md:text-xs font-black text-blue-500 uppercase mb-1 ml-1 truncate">Cuối kì ({sub.weights.final * 100}%)</label>
                          <input type="text" inputMode="decimal" value={s.final || ''} onChange={e => updateScore(sub.id, 'final', e.target.value)} 
                            className="w-full text-center py-2.5 md:py-3 rounded-xl font-black text-[14px] md:text-[15px] border-2 bg-blue-50 border-blue-200 text-blue-700 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all" />
                        </div>
                      ) : (
                        <div className="flex flex-col justify-end">
                           <div className="bg-slate-50 rounded-2xl h-[46px] md:h-[52px] flex items-center justify-center border border-slate-100">
                             <span className="text-[11px] font-bold text-slate-400 uppercase">Ko thi CK</span>
                           </div>
                        </div>
                      )}
                    </div>

                    {sub.hasFinal && (
                      <div className={`flex flex-col md:flex-row md:items-center justify-between bg-slate-50 rounded-2xl p-3 border border-slate-100 gap-3 transition-opacity ${isSelectionMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <button onClick={(e) => { e.stopPropagation(); setTargetModalSubject(sub.id); }} className="flex flex-col text-left hover:bg-slate-100 p-2 rounded-xl transition-colors">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mục tiêu hiện tại</span>
                          <span className="text-sm md:text-base font-black text-blue-600 flex items-center gap-2 mt-0.5">
                            {targetType === 'letter' ? `Điểm ${targetVal} (${gradeScale[targetVal].toFixed(1)})` : `${targetVal} Hệ 10`}
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                          </span>
                        </button>
                        <div className="flex items-center gap-2 justify-end">
                          {requiredFinal > 0 && requiredFinal <= 10 && numericTarget > 0 && (
                            <button onClick={(e) => { e.stopPropagation(); updateScore(sub.id, 'final', requiredFinal.toFixed(2)); }} className="bg-white text-[11px] md:text-xs font-black text-blue-500 px-3 md:px-4 py-2.5 rounded-xl border border-blue-100 shadow-sm active:scale-95 transition-all hover:bg-blue-50">
                              ⚡ TỰ ĐIỀN
                            </button>
                          )}
                          <span className={`text-[12px] md:text-sm font-black px-4 py-2.5 rounded-xl border ${numericTarget <= 0 ? 'bg-slate-100 text-slate-400 border-slate-200' : (requiredFinal <= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : (requiredFinal > 10 ? 'bg-red-50 text-red-500 border-red-200' : 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'))}`}>
                            {numericTarget <= 0 ? 'CHƯA NHẬP' : (requiredFinal <= 0 ? 'ĐĐ ĐẠT 🎉' : (requiredFinal > 10 ? 'KHÔNG THỂ ❌' : `CẦN THI ${requiredFinal.toFixed(2)}`))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === MODALS TÍNH NĂNG === */}
        
        {/* MODAL CÀI ĐẶT MỤC TIÊU SANG CHẢNH */}
        {targetModalSubject && (() => {
           const id = targetModalSubject; 
           const s = scores[id] || {}; 
           const currentType = s.targetType || 'letter'; 
           const currentVal = s.target || 'A';
           
           return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
              <div className="bg-white rounded-t-[40px] md:rounded-[32px] p-6 md:p-8 w-full max-w-lg shadow-2xl animate-[slideUp_0.3s_ease-out]">
                <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>

                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">Đặt Mục Tiêu</h3>
                    <p className="text-[13px] font-bold text-slate-400 mt-1 truncate max-w-[200px]">{subjectsList.find(sub => sub.id === id)?.name}</p>
                  </div>
                  <div className="relative flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner w-[140px]">
                    <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-transform duration-300 ease-in-out z-0 ${currentType === 'letter' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'}`}></div>
                    <button onClick={() => updateScore(id, 'targetType', 'letter')} className={`relative z-10 flex-1 py-2 text-xs font-black rounded-xl transition-colors duration-300 ${currentType === 'letter' ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}>CHỮ</button>
                    <button onClick={() => updateScore(id, 'targetType', 'number')} className={`relative z-10 flex-1 py-2 text-xs font-black rounded-xl transition-colors duration-300 ${currentType === 'number' ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}>SỐ</button>
                  </div>
                </div>

                <div className="relative h-[180px] w-full overflow-hidden">
                  <div className={`absolute inset-0 transition-all duration-300 ease-out ${currentType === 'letter' ? 'opacity-100 translate-x-0 z-10 pointer-events-auto' : 'opacity-0 -translate-x-10 z-0 pointer-events-none'}`}>
                    <div className="flex flex-wrap justify-center gap-3">
                      {Object.keys(gradeScale).map(g => (
                        <button 
                          key={g} 
                          onClick={() => updateScore(id, 'target', g)} 
                          className={`flex flex-col items-center justify-center w-[72px] sm:w-[86px] h-[76px] rounded-2xl border-2 font-black transition-all ${currentVal === g ? "border-blue-500 bg-blue-50 text-blue-600 shadow-md ring-2 ring-blue-100 scale-105" : "border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-slate-50"}`}
                        >
                          <div className="text-2xl leading-none">{g}</div>
                          <div className="text-[11px] mt-1.5 opacity-70">({gradeScale[g].toFixed(1)})</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`absolute inset-0 transition-all duration-300 ease-out ${currentType === 'number' ? 'opacity-100 translate-x-0 z-10 pointer-events-auto' : 'opacity-0 translate-x-10 z-0 pointer-events-none'}`}>
                    <div className="flex items-center gap-5 mt-4">
                        <input 
                          type="range" min="4.0" max="10.0" step="0.1" 
                          value={parseFloat(currentVal) || 4.0} 
                          onChange={e => updateScore(id, 'target', parseFloat(e.target.value).toFixed(1))} 
                          className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 shadow-inner" 
                        />
                        <div className="w-[110px] p-2 bg-blue-50 border-2 border-blue-100 rounded-2xl shadow-inner shrink-0 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                          <input 
                            type="text" 
                            inputMode="decimal"
                            value={currentVal} 
                            onChange={e => updateScore(id, 'target', e.target.value)}
                            onBlur={e => {
                              let num = parseFloat(e.target.value);
                              if (isNaN(num)) num = 8.5;
                              if (num > 10) num = 10.0;
                              if (num < 0) num = 0.0;
                              updateScore(id, 'target', num.toFixed(1));
                            }}
                            className="w-full bg-transparent text-center text-4xl font-black text-blue-600 outline-none"
                          />
                        </div>
                    </div>
                    <div className="flex justify-between text-[12px] text-slate-400 px-2 mt-4 font-bold uppercase tracking-wider">
                        <span>D (4.0)</span>
                        <span>B (7.0)</span>
                        <span>A (10.0)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/60 p-5 rounded-2xl mt-4 mb-8 border border-blue-100">
                  <p className="text-blue-700 text-sm font-bold text-center leading-relaxed">
                    "{currentType === 'letter' ? gradeDescriptions[currentVal] : 'Bé cố gắng đạt con số này nhé, qua môn dễ ẹc!'}"
                  </p>
                </div>
                
                <button 
                  onClick={() => setTargetModalSubject(null)} 
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-all"
                >
                  XÁC NHẬN XONG
                </button>
              </div>
            </div>
           );
        })()}

        {/* === MODAL THÊM MÔN CHUYÊN NGHIỆP (ĐÃ NÂNG CẤP) === */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[32px] p-6 md:p-8 max-w-lg w-full shadow-2xl animate-[fadeIn_0.2s_ease-out] my-8">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl md:text-2xl font-black flex items-center gap-3 text-slate-800">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  Môn mới cho Ly
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-2 bg-slate-100 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="space-y-5">
                
                {/* Khu vực 1: Thông tin cơ bản */}
                <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100">
                  <div className="mb-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Tên môn học</label>
                    <input 
                      type="text" 
                      placeholder="VD: Triết học Mác - Lênin..." 
                      value={newSub.name} 
                      onChange={e => setNewSub({...newSub, name: e.target.value})} 
                      className="w-full px-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Số tín chỉ</label>
                      <input 
                        type="number" 
                        value={newSub.credits} 
                        onChange={e => setNewSub({...newSub, credits: e.target.value})} 
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl font-bold text-center focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 ml-1 opacity-0">Tùy chọn</label>
                      <label className="flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-slate-100 rounded-xl cursor-pointer hover:border-blue-300 transition-colors shadow-sm select-none">
                        <input 
                          type="checkbox" 
                          checked={newSub.hasFinal} 
                          onChange={e => setNewSub({...newSub, hasFinal: e.target.checked})} 
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                        />
                        <span className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Có thi CK</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Khu vực 2: Trọng số */}
                <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3 text-center">Trọng số điểm (%)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 text-center font-bold">Chuyên Cần</label>
                      <input type="number" value={newSub.attW} onChange={e => setNewSub({...newSub, attW: e.target.value})} className="w-full border-2 border-slate-100 bg-white rounded-xl px-2 py-2.5 text-center text-sm font-bold shadow-sm focus:border-blue-400 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 text-center font-bold">Quá Trình</label>
                      <input type="number" value={newSub.midW} onChange={e => setNewSub({...newSub, midW: e.target.value})} className="w-full border-2 border-slate-100 bg-white rounded-xl px-2 py-2.5 text-center text-sm font-bold shadow-sm focus:border-blue-400 outline-none" />
                    </div>
                    <div className={!newSub.hasFinal ? "opacity-50" : ""}>
                      <label className="block text-[10px] text-blue-500 mb-1 text-center font-bold">Cuối Kì</label>
                      <input type="number" disabled={!newSub.hasFinal} value={newSub.hasFinal ? newSub.finW : 0} onChange={e => setNewSub({...newSub, finW: e.target.value})} className={`w-full border-2 border-blue-100 bg-blue-50 text-blue-700 rounded-xl px-2 py-2.5 text-center text-sm font-bold shadow-sm focus:border-blue-500 outline-none ${!newSub.hasFinal ? 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Khu vực 3: Mục tiêu (Tích hợp) */}
                <div className={`bg-blue-50/50 p-4 md:p-5 rounded-2xl border border-blue-100 transition-all ${!newSub.hasFinal ? "opacity-40 pointer-events-none grayscale" : ""}`}>
                  <div className="flex justify-between items-center mb-4">
                     <label className="block text-[11px] font-black text-blue-600 uppercase tracking-wider">Cài đặt Mục tiêu</label>
                     <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button onClick={() => setNewSub({...newSub, targetType: 'letter', target: 'A'})} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${newSub.targetType === 'letter' ? "bg-blue-600 text-white" : "text-slate-400"}`}>CHỮ</button>
                        <button onClick={() => setNewSub({...newSub, targetType: 'number', target: '8.5'})} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${newSub.targetType === 'number' ? "bg-blue-600 text-white" : "text-slate-400"}`}>SỐ</button>
                     </div>
                  </div>
                  
                  {newSub.targetType === 'letter' ? (
                     <div className="grid grid-cols-4 gap-2">
                       {Object.keys(gradeScale).map(g => (
                         <button key={g} onClick={() => setNewSub({...newSub, target: g})} className={`py-2 rounded-xl border-2 font-black transition-all ${newSub.target === g ? "border-blue-500 bg-white text-blue-600 shadow-sm" : "border-transparent text-slate-500 hover:bg-white/50"}`}>
                           {g}
                         </button>
                       ))}
                     </div>
                  ) : (
                     <div className="flex items-center gap-4">
                        <input type="range" min="4.0" max="10.0" step="0.1" value={parseFloat(newSub.target) || 4.0} onChange={e => setNewSub({...newSub, target: parseFloat(e.target.value).toFixed(1)})} className="w-full h-2 bg-blue-100 rounded-full appearance-none cursor-pointer accent-blue-600" />
                        <div className="w-[70px] bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
                           <input type="text" inputMode="decimal" value={newSub.target} onChange={e => setNewSub({...newSub, target: e.target.value.replace(/[^0-9.]/g, '')})} onBlur={e => { let num = parseFloat(e.target.value); if(isNaN(num)) num=8.5; if(num>10) num=10; if(num<0) num=0; setNewSub({...newSub, target: num.toFixed(1)}); }} className="w-full text-center font-black text-blue-600 py-1.5 outline-none" />
                        </div>
                     </div>
                  )}
                </div>

              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button onClick={() => handleAddSubject(true)} className="flex-1 py-4 font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors border border-blue-100 active:scale-95 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  Lưu & Thêm tiếp
                </button>
                <button onClick={() => handleAddSubject(false)} className="flex-[1.2] py-4 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-xl transition-all active:scale-95">
                  Xong!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL NẠP NHANH MÔN HỌC */}
        {showBulkAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">⚡ Nạp nhanh danh sách</h3>
              <div className="space-y-2 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scroll">
                {defaultSuggestions.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group">
                    <div className="flex flex-col">
                       <span className="font-bold text-[15px] text-slate-800">{s.name}</span>
                       <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{s.credits} Tín chỉ</span>
                    </div>
                    <button onClick={() => handleBulkAdd([s])} className="text-blue-600 font-black text-[11px] bg-white px-3 py-2 rounded-xl border border-blue-100 shadow-sm active:scale-95 transition-all group-hover:bg-blue-600 group-hover:text-white">
                      + THÊM
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowBulkAddModal(false)} className="flex-1 py-3.5 font-bold text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-all hover:bg-slate-200">Đóng</button>
                <button onClick={() => handleBulkAdd(defaultSuggestions)} className="flex-[2] py-3.5 font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all hover:bg-blue-700">+ THÊM TẤT CẢ VÀO DANH SÁCH</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÓA LẺ */}
        {subjectToDelete && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="text-xl font-black text-center mb-2">Chờ đã nào!</h3>
              <p className="text-center text-slate-500 text-sm font-medium mb-8">Ly có chắc chắn muốn xóa môn <strong className="text-slate-800">"{subjectToDelete.name}"</strong> không? Điểm đã nhập sẽ mất đó nha.</p>
              <div className="flex gap-4">
                <button onClick={() => setSubjectToDelete(null)} className="flex-1 py-3.5 font-bold text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-all hover:bg-slate-200">Hủy</button>
                <button onClick={confirmDelete} className="flex-1 py-3.5 font-bold text-white bg-red-500 rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-all hover:bg-red-600">Xóa luôn!</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÓA HÀNG LOẠT */}
        {showBulkDeleteModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="text-xl font-black text-center mb-2">Xóa {selectedIds.length} môn học?</h3>
              <p className="text-center text-slate-500 text-sm font-medium mb-8">Ly có chắc chắn không? Toàn bộ điểm số của các môn đã chọn sẽ biến mất vĩnh viễn đó nha em iu.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowBulkDeleteModal(false)} className="flex-1 py-3.5 font-bold text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-all hover:bg-slate-200">Hủy</button>
                <button onClick={handleBulkDelete} className="flex-1 py-3.5 font-bold text-white bg-red-500 rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-all hover:bg-red-600">Xóa sạch!</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}