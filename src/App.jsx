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

// === COMPONENT CHỮ CHẠY (ĐÃ FIX LỖI FONT) ===
const TypingText = ({ text, colorClass = "text-white" }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText("");
    const charsArray = Array.from(text);
    
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + charsArray[currentIndex]);
      currentIndex++;
      if (currentIndex === charsArray.length) {
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
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(value, max) / max) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-2">
        <svg className="transform -rotate-90 w-full h-full absolute inset-0">
          <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="7" fill="transparent" className="text-slate-100" />
          <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="7" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className={`${colorClass} transition-all duration-1000`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[18px] md:text-[20px] font-extrabold text-slate-800">{mainText}</span>
        </div>
      </div>
      <span className="text-[11px] md:text-[12px] font-bold text-slate-500 uppercase">{subText}</span>
    </div>
  );
};

// === ỨNG DỤNG CHÍNH ===
export default function App() {
  const [subjectsList, setSubjectsList] = useState([]);
  const [scores, setScores] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quote, setQuote] = useState("");
  
  // Các state quản lý Modal (Bảng thông báo)
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [targetModalSubject, setTargetModalSubject] = useState(null);
  
  const [newSub, setNewSub] = useState({ name: '', credits: 3, attW: 10, midW: 40, finW: 50, hasFinal: true });

  // Khôi phục dữ liệu
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('gpa-master-v12-full');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setScores(parsed.scores || {});
        setSubjectsList(parsed.subjectsList || []);
      } else {
        // Dữ liệu khởi tạo mặc định nếu chưa có gì
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

  // Tự động lưu
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gpa-master-v12-full', JSON.stringify({ scores, subjectsList }));
    }
  }, [scores, subjectsList, isLoaded]);

  // Cập nhật điểm và lọc số
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

  // Tính năng Chọn Hàng Loạt
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === subjectsList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(subjectsList.map(s => s.id));
    }
  };
  
  const handleBulkDelete = () => {
    setSubjectsList(prev => prev.filter(s => !selectedIds.includes(s.id)));
    setSelectedIds([]);
    setShowBulkDeleteModal(false);
  };

  const handleBulkAdd = (items) => {
    const newItems = items.map(it => ({ 
      ...it, 
      id: "BULK_" + Math.random().toString(36).substr(2, 9) 
    }));
    setSubjectsList(prev => [...prev, ...newItems]);
    setShowBulkAddModal(false);
  };

  // Tính toán Tổng
  let totalCredits = 0;
  let totalPoints = 0;
  let completedCount = 0;

  subjectsList.forEach(sub => {
    const s = scores[sub.id] || {};
    const att = parseFloat(s.attendance) || 0;
    const mid = parseFloat(s.midterm) || 0;
    const fin = parseFloat(s.final) || 0;
    
    if (att > 0 || mid > 0 || fin > 0) {
      completedCount++;
    }
    
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
      <div className="w-full max-w-[1200px] bg-white md:rounded-[32px] shadow-2xl flex flex-col md:flex-row min-h-screen md:min-h-[90vh] md:overflow-hidden">
        
        {/* === SIDEBAR (BẢNG TRÁI) === */}
        <div className="w-full md:w-[300px] bg-[#f8fafc] border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🚀</span>
            <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">GPA MASTER</h1>
          </div>
          
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6">
            <div className="flex flex-row justify-around w-full">
              <CircularProgress value={completedCount} mainText={`${completedCount}/${subjectsList.length}`} subText="Tiến độ" max={subjectsList.length || 1} colorClass="text-emerald-500" />
              <div className="w-px bg-slate-100 mx-2" />
              <CircularProgress value={gpa} mainText={gpa} subText="GPA Hệ 4" max={4.0} colorClass="text-blue-600" />
            </div>
          </div>

          <div className="mt-auto bg-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-200">
             <TypingText text={quote} />
          </div>
        </div>

        {/* === MAIN CONTENT (BẢNG PHẢI) === */}
        <div className="flex-1 flex flex-col bg-[#fcfcfc] relative">
          
          {/* Thanh Toolbar phía trên */}
          <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">Môn học của Ly</h2>
              {selectedIds.length > 0 && (
                <span className="text-xs text-blue-600 font-bold mt-1">Đang chọn {selectedIds.length} môn</span>
              )}
            </div>
            
            <div className="flex gap-2">
              {selectedIds.length > 0 ? (
                // Nút Xóa Hàng Loạt (Chỉ hiện khi có chọn)
                <button 
                  onClick={() => setShowBulkDeleteModal(true)} 
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm border border-red-100 flex items-center gap-2 transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Xóa đã chọn
                </button>
              ) : (
                // Nút Nạp Nhanh & Thêm Môn
                <>
                  <button 
                    onClick={() => setShowBulkAddModal(true)} 
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100 transition-all active:scale-95 whitespace-nowrap"
                  >
                    ⚡ Nạp nhanh
                  </button>
                  <button 
                    onClick={() => setShowAddModal(true)} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 whitespace-nowrap"
                  >
                    + Thêm môn
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Danh sách môn học */}
          <div className="flex-1 overflow-visible md:overflow-y-auto p-4 md:p-6 space-y-4 pb-20 custom-scroll">
            
            {/* Nút Chọn Tất Cả */}
            {subjectsList.length > 0 && (
              <div className="flex items-center gap-2 px-2 mb-2">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === subjectsList.length && subjectsList.length > 0} 
                  onChange={selectAll} 
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chọn tất cả</span>
              </div>
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
                <div key={sub.id} className={`bg-white rounded-3xl p-5 border-2 transition-all flex items-start gap-4 ${isSelected ? 'border-blue-500 shadow-md bg-blue-50/30' : 'border-slate-100 shadow-sm'}`}>
                  
                  {/* Checkbox chọn môn */}
                  <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={() => toggleSelect(sub.id)} 
                    className="w-5 h-5 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0" 
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-4">
                      <div onClick={() => toggleSelect(sub.id)} className="cursor-pointer">
                        <h4 className="font-bold text-slate-800 truncate pr-2">{sub.name}</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{sub.credits} Tín chỉ</p>
                      </div>
                      
                      {/* Nút Xóa Từng Môn */}
                      <button 
                        onClick={() => setSubjectToDelete(sub)} 
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    {/* Hàng Nhập Điểm */}
                    <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
                      <div>
                        <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-1 ml-1 truncate">Chuyên cần</label>
                        <input type="text" inputMode="decimal" value={s.attendance || ''} onChange={e => updateScore(sub.id, 'attendance', e.target.value)} 
                          className="w-full text-center py-2 rounded-xl font-bold text-sm border-2 bg-slate-50 border-slate-100 focus:border-blue-400 focus:outline-none transition-all" />
                      </div>
                      
                      <div>
                        <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-1 ml-1 truncate">Quá trình</label>
                        <input type="text" inputMode="decimal" value={s.midterm || ''} onChange={e => updateScore(sub.id, 'midterm', e.target.value)} 
                          className="w-full text-center py-2 rounded-xl font-bold text-sm border-2 bg-slate-50 border-slate-100 focus:border-blue-400 focus:outline-none transition-all" />
                      </div>

                      {sub.hasFinal ? (
                        <div>
                          <label className="block text-[9px] md:text-[10px] font-black text-blue-500 uppercase mb-1 ml-1 truncate">Cuối kì</label>
                          <input type="text" inputMode="decimal" value={s.final || ''} onChange={e => updateScore(sub.id, 'final', e.target.value)} 
                            className="w-full text-center py-2 rounded-xl font-bold text-sm border-2 bg-blue-50 border-blue-100 text-blue-600 focus:border-blue-500 focus:outline-none transition-all" />
                        </div>
                      ) : (
                        <div className="flex flex-col justify-end">
                           <div className="bg-slate-50 rounded-2xl h-[40px] flex items-center justify-center border border-slate-100">
                             <span className="text-[10px] font-bold text-slate-300 uppercase">Ko thi CK</span>
                           </div>
                        </div>
                      )}
                    </div>

                    {/* Hàng Quản lý Mục tiêu */}
                    {sub.hasFinal && (
                      <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-50 rounded-2xl p-3 border border-slate-100 gap-3">
                        
                        <button 
                          onClick={() => setTargetModalSubject(sub.id)} 
                          className="flex flex-col text-left hover:opacity-80 transition-opacity"
                        >
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Mục tiêu hiện tại</span>
                          <span className="text-sm font-bold text-blue-600">
                            {targetType === 'letter' ? `Điểm ${targetVal} (${gradeScale[targetVal]})` : `${targetVal} Hệ 10`}
                            <span className="ml-1 text-[10px]">⚙️</span>
                          </span>
                        </button>
                        
                        <div className="flex items-center gap-2 justify-end">
                          {requiredFinal > 0 && requiredFinal <= 10 && numericTarget > 0 && (
                            <button 
                              onClick={() => updateScore(sub.id, 'final', requiredFinal.toFixed(2))} 
                              className="bg-white text-[10px] md:text-xs font-black text-blue-500 px-3 py-2 rounded-xl border border-blue-100 shadow-sm active:scale-95 transition-all"
                            >
                              ⚡ TỰ ĐIỀN
                            </button>
                          )}
                          <span className={`text-[11px] md:text-xs font-black px-3 py-2 rounded-xl border ${numericTarget <= 0 ? 'bg-slate-100 text-slate-400 border-slate-200' : (requiredFinal <= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : (requiredFinal > 10 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'))}`}>
                            {numericTarget <= 0 ? 'CHƯA NHẬP' : (requiredFinal <= 0 ? 'ĐÃ ĐẠT 🎉' : (requiredFinal > 10 ? 'KHÔNG THỂ ❌' : `CẦN THI ${requiredFinal.toFixed(2)}`))}
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

        {/* === MODAL: XÁC NHẬN XÓA HÀNG LOẠT === */}
        {showBulkDeleteModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="text-xl font-black text-center mb-2">Xóa {selectedIds.length} môn học?</h3>
              <p className="text-center text-slate-500 text-sm font-medium mb-8">Ly có chắc chắn không? Toàn bộ điểm số của các môn đã chọn sẽ biến mất vĩnh viễn đó nha em iu.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowBulkDeleteModal(false)} className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-all">Hủy</button>
                <button onClick={handleBulkDelete} className="flex-1 py-3 font-bold text-white bg-red-500 rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-all">Xóa sạch!</button>
              </div>
            </div>
          </div>
        )}

        {/* === MODAL: NẠP NHANH MÔN HỌC (GỢI Ý) === */}
        {showBulkAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-6 max-w-md w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
              <h3 className="text-xl font-black mb-4">Nạp nhanh danh sách</h3>
              <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
                {defaultSuggestions.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <span className="font-bold text-sm text-slate-700">{s.name} ({s.credits}t)</span>
                    <button 
                      onClick={() => handleBulkAdd([s])} 
                      className="text-blue-600 font-black text-xs bg-white px-3 py-2 rounded-xl border border-blue-100 shadow-sm active:scale-95 transition-all"
                    >
                      + THÊM
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleBulkAdd(defaultSuggestions)} 
                  className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                >
                  + THÊM TẤT CẢ
                </button>
                <button 
                  onClick={() => setShowBulkAddModal(false)} 
                  className="px-6 py-3 font-bold text-slate-500 bg-slate-100 rounded-2xl active:scale-95 transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === MODAL: CÀI ĐẶT MỤC TIÊU SANG CHẢNH === */}
        {targetModalSubject && (() => {
           const id = targetModalSubject; 
           const s = scores[id] || {}; 
           const currentType = s.targetType || 'letter'; 
           const currentVal = s.target || 'A';
           
           return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
              <div className="bg-white rounded-t-[40px] md:rounded-[32px] p-6 md:p-8 w-full max-w-lg shadow-2xl animate-[slideUp_0.3s_ease-out]">
                
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>

                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-800">Đặt Mục Tiêu</h3>
                    <p className="text-[12px] font-bold text-slate-400 mt-1 truncate max-w-[200px]">{subjectsList.find(sub => sub.id === id)?.name}</p>
                  </div>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                    <button 
                      onClick={() => updateScore(id, 'targetType', 'letter')} 
                      className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${currentType === 'letter' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
                    >CHỮ</button>
                    <button 
                      onClick={() => updateScore(id, 'targetType', 'number')} 
                      className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${currentType === 'number' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
                    >SỐ</button>
                  </div>
                </div>

                <div className="min-h-[140px]">
                  {currentType === 'letter' ? (
                    <div className="grid grid-cols-4 gap-3 mb-6 animate-[fadeIn_0.3s_ease-out]">
                      {Object.keys(gradeScale).map(g => (
                        <button 
                          key={g} 
                          onClick={() => updateScore(id, 'target', g)} 
                          className={`py-4 rounded-2xl border-2 font-black transition-all ${currentVal === g ? "border-blue-500 bg-blue-50 text-blue-600 scale-105 shadow-md" : "border-slate-100 text-slate-400 hover:border-blue-200"}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-6 animate-[fadeIn_0.3s_ease-out]">
                      <div className="flex items-center gap-4 mb-4">
                        <input 
                          type="range" min="4.0" max="10.0" step="0.1" 
                          value={parseFloat(currentVal) || 4.0} 
                          onChange={e => updateScore(id, 'target', parseFloat(e.target.value).toFixed(1))} 
                          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-inner" 
                        />
                        <div className="w-[100px] p-2 bg-blue-50 border border-blue-200 rounded-2xl shadow-inner shrink-0">
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
                            className="w-full bg-transparent text-center text-3xl font-black text-blue-600 outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 px-1 font-bold">
                        <span>4.0 (D)</span>
                        <span>7.0 (B)</span>
                        <span>10.0 (A)</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl mb-8 border border-blue-100">
                  <p className="text-blue-700 text-sm font-bold text-center">
                    "{currentType === 'letter' ? gradeDescriptions[currentVal] : 'Bé cố gắng đạt con số này nhé!'}"
                  </p>
                </div>
                
                <button 
                  onClick={() => setTargetModalSubject(null)} 
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
                >
                  XÁC NHẬN XONG
                </button>
              </div>
            </div>
           );
        })()}

        {/* === MODAL: THÊM MÔN THỦ CÔNG === */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Môn mới cho Ly
              </h3>
              
              <div className="space-y-4 mb-8">
                <input 
                  type="text" 
                  placeholder="Tên môn học..." 
                  value={newSub.name} 
                  onChange={e => setNewSub({...newSub, name: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:outline-none focus:border-blue-500 transition-colors" 
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number" 
                    placeholder="Tín chỉ" 
                    value={newSub.credits} 
                    onChange={e => setNewSub({...newSub, credits: e.target.value})} 
                    className="px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-center focus:outline-none focus:border-blue-500 transition-colors" 
                  />
                  <label className="flex items-center justify-center gap-3 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newSub.hasFinal} 
                      onChange={e => setNewSub({...newSub, hasFinal: e.target.checked})} 
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-xs font-bold text-slate-500">Có thi CK</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 py-4 font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleAddSubject} 
                  className="flex-1 py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Thêm ngay
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}