"use client";
import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useUserInfo } from "@/context/user"; 
import { getCookie } from "@/context/user";
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import Link from "next/link";
import ChatBox from "@/components/chatbox";
import CharacterSetting from "@/app/comp/CharacterSetting";
import ForeshadowingLibrary from "./ForeshadowingLibrary";

export default function MailComponent() {
  const { userInfo, setUserInfo } = useUserInfo(); 
  const [status, setStatus] = useState<'write'|'fubi'|'sheding'|'dagang'>('write');

  useEffect(() => {
    const userInfoCookie = getCookie('userInfo');
    if (!userInfoCookie && userInfo?.data) {
      setUserInfo('', {
        id: 0,
        username: '',
        password: null,
        emailAddress: '',
        telephone: '',
        createTime: '',
        systemWord: ''
      });
      window.location.reload();
    }
  }, [userInfo, setUserInfo]);

  const Write = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    

    const handleEditorChange = (newEditorState: EditorState) => {
      setEditorState(newEditorState);
    };

    return (
      <div className="p-3 mb-3 border border-secondary rounded-3" style={{ minHeight: '300px', backgroundColor: '#f8f9fa' }}>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="开始写作..."
        />
      </div>
    );
  }

  const Outline = () => {
    type dagang = {
      title: string;
      story: string;
      characters: string[];
      children: dagang[];
    };
    const initialOutline: dagang[] = [
      {
        title: "大纲标题",
        story: "大纲故事内容",
        characters: ["角色1", "角色2"],
        children: []
      },
      {
        title: "大纲标题2",
        story: "大纲故事内容2",
        characters: ["角色3", "角色4"],
        children: []
      },
      {
        title: "大纲标题3",
        story: "大纲故事内容3",
        characters: ["角色5", "角色6"],
        children: [
          {
            title: "子大纲标题1",
            story: "子大纲故事内容1",
            characters: ["子角色1", "子角色2"],
            children: []
          },
          {
            title: "子大纲标题2",
            story: "子大纲故事内容2",
            characters: ["子角色3", "子角色4"],
            children: []
          }
        ]
      }
    ]
    const [outline, setOutline] = useState<dagang[]>(initialOutline);
    const [editedPath, setEditedPath] = useState<number[] | null>(null);
    const [editedOutline, setEditedOutline] = useState<dagang[]>([]);

    useEffect(() => {
      setEditedOutline(outline);
    }, [outline]);

    const handleEditClick = (path: number[]) => {
      console.log('开始编辑大纲项:', path);
      setEditedPath(path);
    };

    const handleSaveClick = () => {
      if (editedPath) {
        console.log('保存大纲项:', editedPath, editedOutline);
        setOutline(editedOutline);
        setEditedPath(null);
        // 这里可以添加保存大纲到后端的逻辑
      }
    };

    const handleTitleChange = (path: number[], value: string) => {
      const newOutline = editedOutline.map((item, i) => {
        if (i === path[0]) {
          return updateNestedItem(item, path.slice(1), 'title', value);
        }
        return item;
      });
      setEditedOutline(newOutline);
    };

    const updateNestedItem = (item: dagang, path: number[], key: 'title' | 'story', value: string): dagang => {
      if (path.length === 0) {
        return { ...item, [key]: value };
      }
      return {
        ...item,
        children: item.children.map((child, i) =>
          i === path[0] ? updateNestedItem(child, path.slice(1), key, value) : child
        )
      };
    };

    const handleStoryChange = (path: number[], value: string) => {
      const newOutline = editedOutline.map((item, i) => {
        if (i === path[0]) {
          return updateNestedItem(item, path.slice(1), 'story', value);
        }
        return item;
      });
      setEditedOutline(newOutline);
    };

    const handleCharactersChange = (index: number, value: string[]) => {
      console.log(`修改角色索引 ${index} 为:`, value);
      const newOutline = [...editedOutline];
      newOutline[index].characters = value;
      setEditedOutline(newOutline);
    };

    const handleDeleteClick = (path: number[]) => {
      setEditedOutline(prev => {
        const newOutline = [...prev];
        let currentLevel = newOutline;
        
        // 遍历到目标层级的父级
        for (let i = 0; i < path.length - 1; i++) {
          currentLevel = currentLevel[path[i]].children;
        }
        
        // 删除指定项
        currentLevel.splice(path[path.length - 1], 1);
        return newOutline;
      });
    };

    const handleAddClick = (path: number[]) => {
      const newOutline = [...editedOutline];
      let currentLevel = newOutline;
      
      for (let i = 0; i < path.length; i++) {
        currentLevel = currentLevel[path[i]].children;
      }
      
      currentLevel.push({
        title: "新大纲项",
        story: "",
        characters: [],
        children: []
      });
      setEditedOutline(newOutline);
    };

    const renderOutline = (items: dagang[], level = 0, path: number[] = []) => {
      return (
        <ul style={{ listStyleType: 'none', paddingLeft: `${level * 30}px`, position: 'relative' }}>
          {items.map((item, index) => {
            const currentPath = path.concat([index]);
            const isCurrentItemEditing = arrayEquals(editedPath, currentPath);
            // 确保 item 存在且 children 属性存在
            const itemChildren = item && item.children ? item.children : [];
            return (
              <li key={index} style={{ position: 'relative' }}>
                {level > 0 && (
                  <div style={{ position: 'absolute', left: '-20px', top: '0', bottom: '0', borderLeft: '2px solid #666' }} />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isCurrentItemEditing ? (
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleTitleChange(currentPath, e.target.value)}
                        placeholder="标题"
                        style={{ flexGrow: 1, marginRight: '10px' }} // 添加样式使输入框自适应
                      />
                    ) : (
                      <h4 className="text-dark fs-5 mb-2">{item.title}</h4>
                    )}
                    {!isCurrentItemEditing && (
                      <button
                        onClick={() => handleEditClick(currentPath)}
                        className="btn btn-light me-2"
                        style={{ marginRight: '5px' }}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    )}
                    <button
                      onClick={() => handleAddClick(currentPath)}
                      className="btn btn-light"
                      style={{ marginRight: '5px' }}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(currentPath)}
                      className="btn btn-light"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  {isCurrentItemEditing ? (
                    <textarea
                      value={item.story}
                      onChange={(e) => handleStoryChange(currentPath, e.target.value)}
                      placeholder="故事内容"
                      style={{ width: '100%', marginTop: '10px' }} // 添加样式使文本域自适应
                    />
                  ) : (
                    <p className="text-muted fs-6 mb-3">{item.story}</p>
                  )}
                  {isCurrentItemEditing ? (
                    <input
                      type="text"
                      value={item.characters.join(', ')}
                      onChange={(e) =>
                        handleCharactersChange(index, e.target.value.split(', ').filter(Boolean))
                      }
                      placeholder="角色，用逗号分隔"
                      style={{ width: '100%', marginTop: '10px' }} // 添加样式使输入框自适应
                    />
                  ) : (
                    <p>角色: {item.characters.join(', ')}</p>
                  )}
                </div>
                {itemChildren.length > 0 && renderOutline(itemChildren, level + 1, currentPath)}
                {isCurrentItemEditing && (
                  <div className="mt-3">
                    <button onClick={handleSaveClick} className="btn btn-primary me-2 mt-3">
                      <i className="bi bi-save"></i>
                    </button>
                  </div>
                )}
              </li>);
          })}
        </ul>
      );
    }

    const arrayEquals = (a: number[] | null, b: number[]): boolean => {
      if (!a || a.length !== b.length) return false;
      return a.every((val, index) => val === b[index]);
    }

    return (
      <div>
        {renderOutline(editedOutline)}
      </div>
    );
  };
  const mockAiReply = async (message: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `AI Reply to: "${message}"`;
  };

  return (
    <> 
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
            </Col>
          </Row>
        </Col>
        <Col className="bg-white p-4 border rounded-3">
          {status === 'write' && <Write />}
          {status === 'dagang' && <Outline />}
          {status === 'sheding' && <CharacterSetting />}
          {status === 'fubi' && <ForeshadowingLibrary />}
        </Col>
        <Col>
          <ChatBox onSend={mockAiReply}/>
        </Col>
      </Row>
    </Container>
    </>
  );

}