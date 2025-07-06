"use client";
import { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import ChatBox from "./ChatBox";
import CharacterSetting from "@/app/comp/CharacterSetting";
import ForeshadowingLibrary from "./ForeshadowingLibrary";
import Outline from "./Outline";
import Write from "./Write";
import axios from "axios";
import Inspiration from "../main/inspiration";
import { AIContxtProvider } from "./AIContext";
type chapter = {
  id:number;
  title:string;
  content:string;
};


export default function MailComponent() {
  const [status, setStatus] = useState<'write'|'fubi'|'sheding'|'dagang'|'inspiration'>('write');
  const [article, setArticle] = useState<chapter[]>([{id:1,title:'',content:''}]);
  const [current,setCurrent] =useState<number>(1);
  useEffect(()=> {
    axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/docs/batch?ids=1,2,3,4,5,6,7,8,9,10',{
    }).then(response => {
      if (response.data && Array.isArray(response.data)) {
        setArticle(response.data);
      } else {
        console.error("获取文章数据失败，数据格式不正确");
      }
    }).catch(error => {
      console.error("获取文章数据失败", error);
    })
  });

  const mockAiReply = async (message: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `AI Reply to: "${message}"`;
  };
  const [aiShow,setAiShow] = useState<boolean>(true);

  return (
    <AIContxtProvider> 
    <Link href="/">返回首页</Link>
    <Container className="bg-light p-4" fluid style={{ opacity: 0.95, boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' }}>
      <Row className="mb-4 align-items-start" style={{ minHeight: '100vh' }}>
        <Col lg={1} className="bg-white border-end p-3">
          <Row>
            <Col>
              <div
                onClick={() => {setStatus('write')}}
                className={`w-100 btn btn-primary text-truncate my-2 py-3 ${status === 'write' ? 'active' : ''}`} style={{ borderRadius: '10px' }}
              >
                写作
                <i className="bi bi-inbox ms-2"></i>
              </div>
              <div
                onClick={() => {setStatus('dagang')}}
                className={`w-100 btn btn-primary text-truncate my-2 py-3 ${status === 'dagang' ? 'active' : ''}`} style={{ borderRadius: '10px' }}
              >
                大纲
                <i className="bi bi-inbox ms-2"></i>
              </div>
              <div
                onClick={() => setStatus('fubi')}
                className={`w-100 btn btn-primary text-truncate my-2 py-3 ${status === 'fubi' ? 'active' : ''}`} style={{ borderRadius: '10px' }}
              >
                伏笔库
                <i className="bi bi-send ms-2"></i>
              </div>
              <div
                onClick={() => setStatus('sheding')}
                className={`w-100 btn btn-primary text-truncate my-2 py-3 ${status === 'sheding' ? 'active' : ''}`} style={{ borderRadius: '10px' }}
              >
                设定集
                <i className="bi bi-file-earmark-text ms-2"></i>
              </div>
              <div
                onClick={() => setStatus('inspiration')}
                className={`w-100 btn btn-primary text-truncate my-2 py-3 ${status === 'inspiration' ? 'active' : ''}`} style={{ borderRadius: '10px' }}
              >
                灵感库
                <i className="bi bi-file-earmark-text ms-2"></i>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              {article.map((item, index) => (
                <div
                  key={index}
                  className={`w-100 btn btn-light text-truncate my-2 py-3 ${status === 'write' ? 'active' : ''}`}
                  style={{ borderRadius: '10px', cursor: 'pointer' }}
                  onClick={() => {setStatus('write');setCurrent(index+1)}}
                >
                  {item.title || `章节 ${index + 1}`}
                </div>
              ),)}
            </Col>
          </Row>
        </Col>
        <Col className="bg-white p-4 border rounded-3">
          {status === 'write' && <Write chapter={article[current-1]} />}
          {status === 'dagang' && <Outline />}
          {status === 'sheding' && <CharacterSetting />}
          {status === 'fubi' && <ForeshadowingLibrary />}
          {status === 'inspiration' && <Inspiration />}
        </Col>
        <Col lg={1}>
          <Button variant="light" style={{height:'100vh'}} onClick={()=>setAiShow(!aiShow)}>{aiShow?'>':'<'}</Button>
        </Col>
        <Col style={{display:aiShow?'block':'none'}}>
          <ChatBox onSend={mockAiReply} />
        </Col>
      </Row>
    </Container>
    </AIContxtProvider>
  );

}