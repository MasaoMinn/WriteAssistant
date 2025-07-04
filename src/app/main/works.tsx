import React from 'react';
import { Button } from 'react-bootstrap';

type work = {
    id: number;
    title: string;
    summary: string;
    content:string;
};
const WorkList: React.FC = () => {
  const sampleWorks:work[]= [
    {
      id: 1,
      title: "作品一",
      summary: "这是作品一的简介。",
      content: "这是作品一的详细内容。"
    },
    {
      id: 2,
      title: "作品二",
      summary: "这是作品二的简介。",
      content: "这是作品二的详细内容。"
    },
    {
      id: 3,
      title: "作品三",
      summary: "这是作品三的简介。",
      content: "这是作品三的详细内容。"
    },
  ]
  return (
    <div className="container mt-4">
      <h2>我的作品</h2>
      <div className="row">
        {sampleWorks.map((w: work) => (
          <div key={w.id} className="row-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{w.title}</h5>
                <p className="card-text">{w.summary}</p>
                <Button href={`./comp?id=${w.id}`} className="btn btn-primary">
                  写作
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkList;