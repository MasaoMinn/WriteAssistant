"use client";
import { useState, useEffect } from "react";
import { Button, Form, Badge } from "react-bootstrap";

export interface ContextItem {
  id: number;
  title: string;
  content: string;
}

interface ChatBoxProps {
  contextItems: ContextItem[];
  onRemoveContext: (id: number) => void;
  onSend: (message: string, context: ContextItem[]) => void;
}

const ChatBox = ({ contextItems, onRemoveContext, onSend }: ChatBoxProps) => {
  const [message, setMessage] = useState('');
  const [localContext, setLocalContext] = useState<ContextItem[]>(contextItems);

  useEffect(() => {
    setLocalContext(contextItems);
  }, [contextItems]);

  const handleSend = () => {
    const fullMessage = `${message}\n\n上下文：\n${localContext
      .map(c => `${c.title}: ${c.content}`)
      .join('\n')}`;
    onSend(fullMessage, localContext);
    setMessage('');
  };

  return (
    <div className="chat-box p-3 border rounded">
      <div className="context-preview mb-3">
        <h6>已添加上下文：</h6>
        {localContext.map(item => (
          <div key={item.id} className="d-flex align-items-center mb-2">
            <Badge bg="info" className="me-2" key={item.id}>
              {item.title}
              <Button
                variant="link"
                className="text-white p-0 ms-2"
                onClick={() => onRemoveContext(item.id)}
              >
                ×
              </Button>
            </Badge>
          </div>
        ))}
      </div>

      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入你的问题..."
        />
      </Form.Group>
      <Button variant="primary" onClick={handleSend}>发送</Button>
    </div>
  );
};

export default ChatBox;