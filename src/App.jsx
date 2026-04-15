import React, { useState, useEffect, useRef } from 'react';

// Bảng quy đổi điểm chữ NEU sang điểm số hệ 10 tối thiểu cần đạt
const gradeScale = {
  'A': 8.5,
  'B+': 8.0,
  'B': 7.0,
  'C+': 6.5,
  'C': 5.5,
  'D+': 5.0,
  'D': 4.0
};

const gradeDescriptions = {
  'A': "Xuất sắc, đỉnh cao phong độ! ✨",
  'B+': "Giỏi, rất đáng khen ngợi. 👍",
  'B': "Khá, một kết quả vững chắc. ✅",
  'C+': "Trung bình khá, cần cố gắng chút nữa. 💪",
  'C': "Trung bình, qua môn an toàn. 🛡️",
  'D+': "Yếu khá, sát nút qua môn. 😅",
  'D': "Yếu, qua môn tối thiểu. ⚠️"
};

// Hàm convert hệ 10 sang hệ 4 (Cần từ App cũ để Dashboard tính toán)
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

// --- COMPONENT TYPING TEXT: Fix lỗi font và thêm hiệu ứng typing ngọt ngào ---
const TypingText = ({ text, colorClass = "text-slate-600" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const typingIndex = useRef(0);
  const chars = Array.from(text); // ĐÃ FIX: Sử dụng Array.from() để không cắt ngang Emoji và dấu Tiếng Việt

  useEffect(() => {
    typingIndex.current = 0;
    setDisplayedText("");
    
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        if (typingIndex.current < chars.length) {
          const nextChar = chars[typingIndex.current];
          typingIndex.current++;
          return prev + nextChar;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 50); // Tốc độ gõ: 50ms / ký tự

    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className={`${colorClass} font-medium leading-relaxed min-h-[50px] text-sm`}>
      {displayedText}
      {/* Con trỏ nhấp nháy */}
      <span className="animate-pulse inline-block w-1 h-3.5 bg-slate-500 ml-1 align-middle"></span>
    </p>
  );
};

// --- COMPONENT CHÍNH: Cấu trúc mục tiêu điểm số và điểm chữ siêu đẹp ---
export default function GoalSelector({ subjectName = "Môn học thí dụ", onTargetChange }) {
  const [targetType, setTargetType] = useState('letter'); // 'letter' hoặc 'number'
  const [letterGrade, setLetterGrade] = useState('A');
  const [numericScore, setNumericScore] = useState(8.5);
  const sliderRef = useRef(null);

  // Hàm tính toán mô tả và điểm hệ 10
  const getDetails = () => {
    if (targetType === 'letter') {
      return {
        desc: `Bé đặt mục tiêu điểm ${letterGrade}: ${gradeDescriptions[letterGrade]}`,
        score10: gradeScale[letterGrade],
        score4: 4.0 // A luôn là 4.0
      };
    } else {
      return {
        desc: `Bé muốn đạt điểm số: ${numericScore} (Hệ 10)`,
        score10: numericScore,
        score4: convertTo4Scale(numericScore)
      };
    }
  };

  const details = getDetails();

  // Gọi hàm callback khi mục tiêu thay đổi (để Dashboard update)
  useEffect(() => {
    if (onTargetChange) {
      onTargetChange(details);
    }
  }, [targetType, letterGrade, numericScore, onTargetChange]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-slate-200">
      
      {/* Header & Công tắc Chữ / Số */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
           <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
             Đặt mục tiêu điểm
           </h3>
           <p className="text-xs font-medium text-slate-500 mt-1">Học xong anh dẫn đi ăn nhé, cố lên nha em! 🥰</p>
        </div>
        
        {/* Switch chuyển đổi hiện đại */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-inner w-full md:w-auto">
          <button 
            onClick={() => setTargetType('letter')} 
            className={`flex-1 md:flex-initial px-4 py-2 text-sm font-bold rounded-lg transition-all ${targetType === 'letter' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-blue-500"}`}
          >
            Điểm chữ
          </button>
          <button 
            onClick={() => setTargetType('number')} 
            className={`flex-1 md:flex-initial px-4 py-2 text-sm font-bold rounded-lg transition-all ${targetType === 'number' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-blue-500"}`}
          >
            Điểm số
          </button>
        </div>
      </div>

      {/* KHU VỰC CHỌN ĐIỂM CHỮ: Dùng các thẻ Card sành điệu */}
      <div className={`grid grid-cols-4 sm:grid-cols-7 gap-2 ${targetType === 'number' ? "hidden" : ""}`}>
        {Object.keys(gradeScale).map((grade) => (
          <button
            key={grade}
            onClick={() => setLetterGrade(grade)}
            className={`p-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${
              letterGrade === grade
                ? "bg-blue-600 text-white border-blue-700 shadow-md scale-105"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            <div className="text-lg md:text-xl">{grade}</div>
            <div className="text-[10px] md:text-xs font-medium opacity-80">({gradeScale[grade]})</div>
          </button>
        ))}
      </div>

      {/* KHU VỰC CHỌN ĐIỂM SỐ: Dùng thanh trượt Slider mượt mà */}
      <div className={`mt-4 ${targetType === 'letter' ? "hidden" : ""}`}>
         <div className="flex items-center gap-4 md:gap-6 mb-4">
            <input 
              ref={sliderRef}
              type="range" 
              min="4.0" 
              max="10.0" 
              step="0.1" 
              value={numericScore} 
              onChange={(e) => setNumericScore(parseFloat(e.target.value).toFixed(1))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-inner"
            />
            <div className="w-[100px] md:w-[120px] p-4 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-center shadow-inner shrink-0">
                <div className="text-3xl md:text-4xl font-extrabold">{numericScore}</div>
                <div className="text-xs font-medium opacity-80">(Hệ 10)</div>
            </div>
         </div>
         <div className="flex justify-between text-[11px] md:text-xs text-slate-400 px-1 font-medium">
            <span>D (Yếu) - 4.0</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <span>B (Khá) - 7.0</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <span>A (Xuất sắc) - 10.0</span>
         </div>
      </div>

      {/* Lời chúc Typing Text ngọt ngào */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-5">
          <div className="w-px h-16 bg-slate-100 hidden md:block"></div>
          <TypingText text={details.desc} colorClass="text-blue-700 bg-blue-50 p-4 rounded-2xl flex-1 border border-blue-100 shadow-inner" />
      </div>
    </div>
  );
}