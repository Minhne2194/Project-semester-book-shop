import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

const SYSTEM_INSTRUCTION = `
Bạn là "Thủ Thư Ảo" của Nhà Sách FamilyBook (trước đây là DoAn_CoSo_Nhom2).
Mục tiêu của bạn là giúp khách hàng tìm sách trong danh mục cụ thể của chúng tôi và trả lời các câu hỏi văn học chung.
Hãy lịch sự, am hiểu và nhiệt tình nói về việc đọc sách.
Bạn cũng có thể gợi ý người dùng đọc Blog của FamilyBook để tìm hiểu thêm kiến thức.
Nếu được hỏi về cấu trúc dự án hoặc mã nguồn, hãy hướng dẫn họ xem tab 'Docs'.

Danh mục sách gợi ý:
1. Thuật Toán Của Cuộc Sống (Công Nghệ, TS. Sarah Trần)
2. Lời Thì Thầm Từ Thế Giới Cũ (Văn Học, Elena Vũ)
3. Các Mẫu Thiết Kế React (Lập Trình, Michael Phạm)
4. Hành Trình Ẩm Thực (Đời Sống, Đầu bếp Marco)
5. Vũ Trụ Tĩnh Lặng (Khoa Học, Nguyễn Vũ)
6. Làm Chủ Cơ Sở Dữ Liệu (Lập Trình, Trần Thị Widom)

Giữ câu trả lời ngắn gọn (dưới 100 từ) trừ khi được yêu cầu chi tiết.
`;

export const sendMessageToGemini = async (message, history = []) => {
  if (!apiKey) {
    console.error("REACT_APP_GEMINI_API_KEY is missing in .env");
    return "Chưa cấu hình API key Gemini. Vui lòng đặt REACT_APP_GEMINI_API_KEY trong file .env.";
  }

  try {
    // Lấy 4 tin nhắn gần nhất để làm ngữ cảnh ngắn gọn
    const recentHistory = Array.isArray(history) ? history.slice(-4).join('\n') : '';
    
    const prompt = `
Lịch sử trò chuyện (ngắn):
${recentHistory}

Người dùng: ${message}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Xin lỗi, tôi không tìm thấy câu trả lời phù hợp.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tôi đang gặp sự cố khi truy cập kho lưu trữ thư viện ngay bây giờ. Vui lòng thử lại sau.";
  }
};