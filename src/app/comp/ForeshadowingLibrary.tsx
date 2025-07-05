"use client";
import { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";

interface Foreshadowing {
  id: number;
  title: string;
  description: string;
}

const initialForeshadowings: Foreshadowing[] = [
  { id: 1, title: "伏笔1", description: "这是伏笔1的描述" },
  { id: 2, title: "伏笔2", description: "这是伏笔2的描述" },
  { id: 3, title: "伏笔3", description: "这是伏笔3的描述" },
  { id: 4, title: "伏笔4", description: "这是伏笔4的描述" },
  { id: 5, title: "伏笔5", description: "这是伏笔5的描述" },
];

const ForeshadowingLibrary = () => {
  const [foreshadowings, setForeshadowings] = useState<Foreshadowing[]>(initialForeshadowings);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [showForeshadowingList, setShowForeshadowingList] = useState<boolean>(true);

  const handleCardClick = (id: number) => {
    const foreshadowing = foreshadowings.find((fs) => fs.id === id);
    if (foreshadowing) {
      setEditingId(id);
      setEditedTitle(foreshadowing.title);
      setEditedDescription(foreshadowing.description);
      setShowCard(true);
      setShowForeshadowingList(false);
    }
  };

  const handleSave = () => {
    if (editingId !== null) {
      setForeshadowings(
        foreshadowings.map((fs) =>
          fs.id === editingId
            ? { ...fs, title: editedTitle, description: editedDescription }
            : fs
        )
      );
      setShowCard(false);
      setShowForeshadowingList(true);
    }
  };

  const handleBack = () => {
    setShowCard(false);
    setShowForeshadowingList(true);
  };

  const handleDelete = (id: number) => {
    setForeshadowings(foreshadowings.filter((fs) => fs.id !== id));
  };

  const handleAdd = () => {
    const newId = Math.max(...foreshadowings.map((fs) => fs.id)) + 1;
    setForeshadowings([
      ...foreshadowings,
      { id: newId, title: "新伏笔", description: "请输入描述" }
    ]);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleAdd} className="mb-3">
        添加伏笔
      </Button>
      {showForeshadowingList && (
        foreshadowings.map((foreshadowing) => (
          <Card 
            key={foreshadowing.id} 
            className="mb-3"
            onClick={() => handleCardClick(foreshadowing.id)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>{foreshadowing.title}</Card.Title>
              <Card.Text>{foreshadowing.description}</Card.Text>
              <Button variant="danger" onClick={(e) => {
                e.stopPropagation();
                handleDelete(foreshadowing.id);
              }}>
                删除
              </Button>
            </Card.Body>
          </Card>
        ))
      )}

      {showCard && editingId !== null && (
        <Card className="mt-3">
          <Card.Body>
            <Button variant="secondary" onClick={handleBack} className="mb-3">
              返回
            </Button>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>伏笔标题</Form.Label>
                <Form.Control
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>伏笔描述</Form.Label>
                <Form.Control
                  as="textarea"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSave}>保存</Button>
            </Form>
          </Card.Body>
          <Card.Body>
            <Card.Title>{editedTitle}</Card.Title>
            <Card.Text>{editedDescription}</Card.Text>
            <Button 

            >
              问AI
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ForeshadowingLibrary;