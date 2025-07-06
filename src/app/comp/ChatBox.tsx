"use client";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Clipboard2 } from 'react-bootstrap-icons';
import { useAiContxt } from './AIContext';

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatBoxProps {
  onSend: (message: string) => Promise<string>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onSend }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { aicontxt,setAicontxt } = useAiContxt();
  const [mode,setMode] =useState<'大纲'|'对话'|'检查'>('对话');
  const modeDescription = {
    '大纲':'根据您提供的上下文生成一份大纲',
    '对话':'可续写/改写故事，也可以聊聊角色设定相关的内容',
    '检查':'检查故事情节是否符合角色设定等',
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const aiReply = await onSend(userMessage.text);
      const aiMessage: Message = { sender: "ai", text: aiReply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = { sender: "ai", text: "Error fetching response." };
      setMessages((prev) => [...prev, errorMessage]);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="card w-100" style={{ margin: "0 auto" }}>
      <div className="card-header bg-primary text-white">
        AI Chat
      </div>
      <div
        className="card-body"
        style={{
          minHeight: "50vh",
          overflow: "auto",
          backgroundColor: "#f8f9fa",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`d-flex mb-2 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`p-2 rounded ${
                msg.sender === "user" ? "bg-primary text-white" : "bg-light"
              }`}
              style={{ maxWidth: "80%" }}
            >
              {msg.text}
            </div>
            {msg.sender === "ai" && (
              <Button
                variant="link"
                size="sm"
                onClick={() => navigator.clipboard.writeText(msg.text)}
                className="ms-2"
              >
                <Clipboard2 />
              </Button>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-muted">AI is typing...</div>
        )}
      </div>
      <div className="card-footer">
        <div className="mb-2 p-2 bg-light rounded">
          <strong>AI上下文:</strong>
          <div>
            {aicontxt.map((item, index) => (
                <div key={index}>{item.lable+':'+item.title}
                <Button variant="light" onClick={() => setAicontxt(aicontxt.filter((_, i) => i !== index))}>X</Button>
                </div>
              ))
            }
          </div>
        </div>
        <div className="mb-2 p-2 bg-light rounded">
          <strong>模式选择:{mode+'--'+modeDescription[mode]}</strong>
          <div>
            <Button variant="outline-primary" onClick={()=>setMode('对话')}>对话</Button>
            <Button variant="outline-primary" onClick={()=>setMode('大纲')}>大纲</Button>
            <Button variant="outline-primary" onClick={()=>setMode('检查')}>检查</Button>
          </div>
        </div>
        <Form>
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={loading}
              className="ms-2"
            >
              Send
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default ChatBox;