"use client";
import { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";

interface Character { 
  id: number;
  name: string;
  description: string;
}

const initialCharacters: Character[] = [
  { id: 1, name: "角色1", description: "这是角色1的描述" },
  { id: 2, name: "角色2", description: "这是角色2的描述" },
];

const CharacterSetting = () => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [showCharacterList, setShowCharacterList] = useState<boolean>(true);

  const handleCardClick = (id: number) => {
    const character = characters.find((char) => char.id === id);
    if (character) {
      setEditingId(id);
      setEditedName(character.name);
      setEditedDescription(character.description);
      setShowCard(true);
      setShowCharacterList(false);
    }
  };

  const handleSave = () => {
    if (editingId !== null) {
      setCharacters(
        characters.map((char) =>
          char.id === editingId
            ? { ...char, name: editedName, description: editedDescription }
            : char
        )
      );
      setShowCard(false);
      setShowCharacterList(true);
    }
  };

  const handleBack = () => {
    setShowCard(false);
    setShowCharacterList(true);
  };

  return (
    <div>
      {showCharacterList && (
        characters.map((character) => (
          <Card 
            key={character.id} 
            className="mb-3" 
            onClick={() => handleCardClick(character.id)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>{character.name}</Card.Title>
              <Card.Text>{character.description}</Card.Text>
            </Card.Body>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{character.name}</Card.Title>
                <Button 
                  variant="primary"

                >
                  问AI
                </Button>
              </Card.Body>
            </Card>
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
                <Form.Label>角色名称</Form.Label>
                <Form.Control
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>角色描述</Form.Label>
                <Form.Control
                  as="textarea"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSave}>
                保存
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CharacterSetting;