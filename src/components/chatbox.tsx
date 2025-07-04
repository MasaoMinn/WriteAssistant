"use client";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

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
    <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card-header bg-primary text-white">
        AI Chat
      </div>
      <div
        className="card-body"
        style={{
          height: "400px",
          overflowY: "auto",
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
          </div>
        ))}
        {loading && (
          <div className="text-muted">AI is typing...</div>
        )}
      </div>
      <div className="card-footer">
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
