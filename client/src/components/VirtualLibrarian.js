import React, { useEffect, useState, useRef } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { sendMessageToGemini } from '../services/geminiClient';

const quickTopics = [
  { key: 'skills', label: 'Kỹ năng sống' },
  { key: 'tech', label: 'Công nghệ' },
  { key: 'lit', label: 'Văn học' },
];

const VirtualLibrarian = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const bodyRef = useRef(null);

  // greet once when opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'ai',
          text: 'Xin chào! Tôi là Thủ thư ảo của Nhóm 2. Tôi có thể giúp bạn tìm cuốn sách yêu thích nào hôm nay?',
        },
      ]);
    }
  }, [open, messages.length]);

  // auto scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    const historyText = messages
      .concat(userMsg)
      .map((m) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`);
    const reply = await sendMessageToGemini(text.trim(), historyText);

    setMessages((m) => [...m, { role: 'ai', text: reply }]);
    setLoading(false);
    setInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleQuick = async (topic) => {
    if (!open) setOpen(true);
    setInput(topic);
    await sendMessage(topic);
  };

  return (
    <div className="librarian-shell">
      <button className="librarian-fab" onClick={() => setOpen(!open)}>
        {open ? '✖' : '🤖'} Thủ thư ảo
      </button>

      {open && (
        <Card className="librarian-panel card-elevated">
          <Card.Header className="librarian-head">
            <div>
              <div className="librarian-title">Thủ Thư Ảo AI</div>
              <div className="librarian-sub">Hỗ trợ bởi Gemini AI</div>
            </div>
          </Card.Header>

          <div className="librarian-body" ref={bodyRef}>
            <div className="d-flex gap-2 flex-wrap mb-3">
              {quickTopics.map((t) => (
                <Button key={t.key} variant="outline-light" size="sm" onClick={() => handleQuick(t.label)}>
                  {t.label}
                </Button>
              ))}
            </div>

            <div className="librarian-chat">
              {messages.map((m, idx) => (
                <div key={idx} className={`chat-bubble ${m.role === 'ai' ? 'ai' : 'user'}`}>
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="chat-bubble ai d-inline-flex align-items-center gap-2">
                  <Spinner animation="border" size="sm" /> Đang gợi ý...
                </div>
              )}
            </div>
          </div>

          <Form onSubmit={handleSubmit} className="librarian-input">
            <Form.Control
              placeholder="Nhập câu hỏi cần tư vấn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              ➤
            </Button>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default VirtualLibrarian;
