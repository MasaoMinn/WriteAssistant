import React, { useState, createContext, useContext } from 'react';
import { Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';

// 创建灵感卡片上下文
const InspirationContext = createContext<{
  inspirations: { id: number; title: string; content: string; tag: string; backgroundColor: string; textColor: string }[];
  addInspiration: (title: string, content: string, tag: string, backgroundColor: string, textColor: string) => void;
  updateInspiration: (id: number, title: string, content: string, tag: string, backgroundColor: string, textColor: string) => void;
  deleteInspiration: (id: number) => void;
} | null>(null);

// 灵感卡片数据管理组件
const InspirationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inspirations, setInspirations] = useState<{
    id: number;
    title: string;
    content: string;
    tag: string;
    backgroundColor: string;
    textColor: string;
  }[]>([
    {
      id: 1,
      title: '示例主题1',
      content: '这是一个示例灵感内容。',
      tag: '示例分类',
      backgroundColor: '#ffffff',
      textColor: '#000000',
    },
    {
      id: 2,
      title: '示例主题2',
      content: '另一个示例灵感内容。',
      tag: '示例分类',
      backgroundColor: '#ffffff',
      textColor: '#000000',
    },
  ]);

  const addInspiration = (title: string, content: string, tag: string, backgroundColor: string, textColor: string) => {
    setInspirations([
      ...inspirations,
      {
        id: inspirations.length > 0 ? Math.max(...inspirations.map(i => i.id)) + 1 : 1,
        title,
        content,
        tag,
        backgroundColor,
        textColor,
      },
    ]);
  };

  const updateInspiration = (id: number, title: string, content: string, tag: string, backgroundColor: string, textColor: string) => {
    setInspirations(
      inspirations.map(inspiration =>
        inspiration.id === id
          ? { ...inspiration, title, content, tag, backgroundColor, textColor }
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
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const { addInspiration } = useContext(InspirationContext) || {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content && tag && addInspiration) {
      addInspiration(title, content, tag, backgroundColor, textColor);
      setTitle('');
      setContent('');
      setTag('');
      setBackgroundColor('#ffffff');
      setTextColor('#000000');
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
      <Form.Group className="mb-3">
        <Form.Label>背景颜色</Form.Label>
        <Form.Control
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>字体颜色</Form.Label>
        <Form.Control
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
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

const InspirationList: React.FC = () => {
  const { inspirations, updateInspiration, deleteInspiration } = useContext(InspirationContext) || {};
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editBackgroundColor, setEditBackgroundColor] = useState('#ffffff');
  const [editTextColor, setEditTextColor] = useState('#000000');
  const [selectedInspiration, setSelectedInspiration] = useState<{
    id: number;
    title: string;
    content: string;
    tag: string;
    backgroundColor: string;
    textColor: string;
  } | null>(null);

  const handleEditClick = (inspiration: {
    id: number;
    title: string;
    content: string;
    tag: string;
    backgroundColor: string;
    textColor: string;
  }) => {
    setEditingId(inspiration.id);
    setEditTitle(inspiration.title);
    setEditContent(inspiration.content);
    setEditTag(inspiration.tag);
    setEditBackgroundColor(inspiration.backgroundColor);
    setEditTextColor(inspiration.textColor);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null && updateInspiration) {
      updateInspiration(editingId, editTitle, editContent, editTag, editBackgroundColor, editTextColor);
      setEditingId(null);
      setSelectedInspiration(null); // 关闭 Modal 并清空状态
    }
  };

  const handleCardClick = (inspiration: {
    id: number;
    title: string;
    content: string;
    tag: string;
    backgroundColor: string;
    textColor: string;
  }) => {
    setSelectedInspiration(inspiration);
    setEditingId(null); // Ensure exiting edit state when clicking the card
  };
  const tagStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    padding: '2px 6px',
    display: 'inline-block'
  };

  return (
    <div>
      <div className="row">
        {inspirations &&
          inspirations.map((inspiration) => (
            <div key={inspiration.id} className="col-md-4 mb-3">
              <Card 
                onClick={() => handleCardClick(inspiration)}
                style={{ cursor: 'pointer', backgroundColor: inspiration.backgroundColor, color: inspiration.textColor }}>
                <Card.Body>
                  <Card.Title>{inspiration.title}</Card.Title>
                  <Card.Text>{inspiration.content}</Card.Text>

                  <Card.Subtitle className="mb-2 text-muted" style={tagStyle}>
                    分类: {inspiration.tag}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </div>
          ))}
      </div> 
      {selectedInspiration && (
        <Modal 
          show={!!selectedInspiration}
          onHide={() => setSelectedInspiration(null)}
        >
          <Modal.Header closeButton style={{ backgroundColor: selectedInspiration.backgroundColor, color: selectedInspiration.textColor }}>
            <Modal.Title className="ms-auto">{editingId === selectedInspiration.id ? '编辑灵感卡片' : selectedInspiration.title}</Modal.Title>
          </Modal.Header>
          {editingId !== selectedInspiration.id && (
            <Modal.Body style={{ backgroundColor: selectedInspiration.backgroundColor, color: selectedInspiration.textColor }}>
              <p>{selectedInspiration.content}</p>
              <p style={tagStyle}>分类: {selectedInspiration.tag}</p>
            </Modal.Body>
          )}
          <Modal.Footer style={{ backgroundColor: selectedInspiration.backgroundColor, color: selectedInspiration.textColor }}>
            {editingId !== selectedInspiration.id && (
              <> 
                <Button variant="warning" onClick={() => handleEditClick(selectedInspiration)}>
                  编辑
                </Button>
                <Button variant="danger" onClick={() => {
                  if (deleteInspiration) {
                    deleteInspiration(selectedInspiration.id);
                    setSelectedInspiration(null);
                  }
                }}>
                  删除
                </Button>
              </>
            )}
          </Modal.Footer>
          {editingId === selectedInspiration.id && (
            <Modal.Body>
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
                <Form.Group className="mb-3">
                  <Form.Label>背景颜色</Form.Label>
                  <Form.Control
                    type="color"
                    value={editBackgroundColor}
                    onChange={(e) => setEditBackgroundColor(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>字体颜色</Form.Label>
                  <Form.Control
                    type="color"
                    value={editTextColor}
                    onChange={(e) => setEditTextColor(e.target.value)}
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
            </Modal.Body>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Inspiration;