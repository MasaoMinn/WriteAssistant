"use client";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import { useAiContxt } from "./AIContext";

interface ContextItem {
  title: string;
  content: string;
  lable:string;
}

type WriteProps = {
  chapter: {
    id: number;
    title: string;
    content: string;
  };
};

export default function Write({ chapter }: WriteProps) {
  const [article, setArticle] = useState<string>(chapter.content);
  const { aicontxt, setAicontxt } = useAiContxt();

  const handleAddContext = () => {
    const newItem: ContextItem = {
      title: `第${chapter.id}章 - ${chapter.title || "无标题章节"}`,
      content: article,
      lable:'article'
    };
    setAicontxt([...aicontxt, newItem]);
    console.log('添加contxt',newItem);
  };

  return (
    <Container>
      <Row className="p-3 mb-3 border border-secondary rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
        <Col><h2 className="mb-3">{'第'+chapter.id+'章 -'+(chapter.title || "无标题章节")}</h2></Col>
      </Row>
      <Row>
        <Col>
          <Button variant="light" onClick={handleAddContext}>添加为上下文</Button>
        </Col>
      </Row>
      <Row>
        <textarea
          onChange={(e) => setArticle(e.target.value)}
          value={article}
          className="w-100"
          style={{minHeight:'100vh'}}
        />
      </Row>
    </Container>
  );
}