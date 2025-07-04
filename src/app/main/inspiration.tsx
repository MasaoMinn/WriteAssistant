import React, { useState, createContext, useContext } from 'react';
import { Button, Card, Form, InputGroup, ListGroup } from 'react-bootstrap';

// 创建灵感卡片上下文
const InspirationContext = createContext<{
  inspirations: { id: number; title: string; content: string; tag: string }[];
  addInspiration: (title: string, content: string, tag: string) => void;
  updateInspiration: (id: number, title: string, content: string, tag: string) => void;
  deleteInspiration: (id: number) => void;
} | null>(null);

// 灵感卡片数据管理组件
const InspirationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inspirations, setInspirations] = useState<{
    id: number;
    title: string;
    content: string;
    tag: string;
  }[]>([
    {
      id: 1,
      title: '示例主题1',
      content: '这是一个示例灵感内容。',
      tag: '示例分类',
    },
    {
      id: 2,
      title: '示例主题2',
      content: '另一个示例灵感内容。',
      tag: '示例分类',
    },
  ]);

  const addInspiration = (title: string, content: string, tag: string) => {
    setInspirations([
      ...inspirations,
      {
        id: inspirations.length > 0 ? Math.max(...inspirations.map(i => i.id)) + 1 : 1,
        title,
        content,
        tag,
      },
    ]);
  };

  const updateInspiration = (id: number, title: string, content: string, tag: string) => {
    setInspirations(
      inspirations.map(inspiration =>
        inspiration.id === id
          ? { ...inspiration, title, content, tag }
          : inspiration
      )
    );
  };

  const deleteInspiration = (id: number) => {
    setInspirations(inspirations.filter(inspiration => inspiration.id !== id));
  };

  return (
    <InspirationContext.Provider
      value={{ inspirations, addInspiration, updateInspiration, deleteInspiration }}
    >
      {children}
    </InspirationContext.Provider>
  );
};

// 灵感卡片编辑器组件
const InspirationEditor: React.FC<{ onSubmit: () => void; onCancel: () => void }> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const { addInspiration } = useContext(InspirationContext) || {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content && tag && addInspiration) {
      addInspiration(title, content, tag);
      setTitle('');
      setContent('');
      setTag('');
      onSubmit();
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4 border border-primary">
      <Form.Group className="mb-3">
        <Form.Label>主题</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>内容</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>分类标签</Form.Label>
        <Form.Control
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
        />
      </Form.Group>
      <InputGroup>
        <Button variant="primary" type="submit">
          保存
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          取消
        </Button>
      </InputGroup>
    </Form>
  );
};

// 主灵感卡片组件
const Inspiration: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <InspirationProvider>
      <div className="container mt-4">
        <h2>灵感卡片管理</h2>
        <Button variant="primary" onClick={() => setShowEditor(true)}>
          添加灵感卡片
        </Button>
        {showEditor && (
          <InspirationEditor 
            onSubmit={() => setShowEditor(false)}
            onCancel={() => setShowEditor(false)}
          />
        )}
        <InspirationList />
      </div>
    </InspirationProvider>
  );
};

// 灵感卡片列表组件
const InspirationList: React.FC = () => {
  const { inspirations, updateInspiration, deleteInspiration } = useContext(InspirationContext) || {};
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTag, setEditTag] = useState('');

  const handleEditClick = (inspiration: {
    id: number;
    title: string;
    content: string;
    tag: string;
  }) => {
    setEditingId(inspiration.id);
    setEditTitle(inspiration.title);
    setEditContent(inspiration.content);
    setEditTag(inspiration.tag);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null && updateInspiration) {
      updateInspiration(editingId, editTitle, editContent, editTag);
      setEditingId(null);
      setEditTitle('');
      setEditContent('');
      setEditTag('');
    }
  };

  return (
    <ListGroup>
      {inspirations &&
        inspirations.map((inspiration) => (
          <ListGroup.Item key={inspiration.id} className="mb-3">
            {editingId === inspiration.id ? (
              <Form onSubmit={handleUpdateSubmit} className="border border-primary">
                <Form.Group className="mb-3">
                  <Form.Label>主题</Form.Label>
                  <Form.Control
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>内容</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>分类标签</Form.Label>
                  <Form.Control
                    type="text"
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    required
                  />
                </Form.Group>
                <InputGroup>
                  <Button variant="primary" type="submit">
                    保存修改
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditingId(null)}
                  >
                    取消
                  </Button>
                </InputGroup>
              </Form>
            ) : (
              <Card>
                <Card.Body>
                  <Card.Title>{inspiration.title}</Card.Title>
                  <Card.Text>{inspiration.content}</Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    分类: {inspiration.tag}
                  </Card.Subtitle>
                  <InputGroup>
                    <Button
                      variant="warning"
                      onClick={() => handleEditClick(inspiration)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (deleteInspiration) {
                          deleteInspiration(inspiration.id);
                        }
                      }}
                    >
                      删除
                    </Button>
                  </InputGroup>
                </Card.Body>
              </Card>
            )}
          </ListGroup.Item>
        ))}
    </ListGroup>
  );
};

export default Inspiration;