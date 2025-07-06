"use client";
import { useState, useEffect } from "react";

interface Dagang {
  title: string;
  story: string;
  children: Dagang[];
}

const Outline = () => {
  const initialOutline: Dagang[] = [
    { 
      title: "大纲标题",
      story: "大纲故事内容",
      children: []
    },
    { 
      title: "大纲标题2",
      story: "大纲故事内容2",
      children: []
    },
    { 
      title: "大纲标题3",
      story: "大纲故事内容3",
      children: [
        { 
          title: "子大纲标题1",
          story: "子大纲故事内容1",
          children: []
        },
        { 
          title: "子大纲标题2",
          story: "子大纲故事内容2",
          children: []
        }
      ]
    }
  ];
  const [outline, setOutline] = useState<Dagang[]>(initialOutline);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOutline, setEditedOutline] = useState<Dagang[]>(initialOutline);

  useEffect(() => {
    if (!isEditing) {
      setEditedOutline(outline);
    }
  }, [outline, isEditing]);

  const handleEditClick = () => {
    console.log('开始编辑整个大纲');
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    console.log('保存整个大纲:', editedOutline);
    setOutline(editedOutline);
    setIsEditing(false);
    // 这里可以添加保存大纲到后端的逻辑
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

  const updateNestedItem = (item: Dagang, path: number[], key: 'title' | 'story', value: string): Dagang => {
    if (path.length === 0) {
      return {
        ...item,
        [key]: value
      };
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
      if(newOutline.length===0) {alert('大纲不可为空');return prev;}
      return newOutline;
    });
  };

  const handleAddSiblingClick = (path: number[]) => {
    const newOutline = [...editedOutline];
    let parentLevel = newOutline;
    
    // 遍历到父级层级
    for (let i = 0; i < path.length - 1; i++) {
      parentLevel = parentLevel[path[i]].children;
    }
    
    const index = path[path.length - 1];
    parentLevel.splice(index + 1, 0, {
      title: "新大纲项",
      story: "",
      children: []
    });
    setEditedOutline(newOutline);
  };

  const handleAddChildClick = (path: number[]) => {
    const newOutline = [...editedOutline];
    let currentLevel = newOutline;
    
    for (let i = 0; i < path.length; i++) {
      currentLevel = currentLevel[path[i]].children;
    }
    
    currentLevel.push({
      title: "新子大纲项",
      story: "",
      children: []
    });
    setEditedOutline(newOutline);
  };

  const renderOutline = (items: Dagang[], level = 0, path: number[] = []) => {
    return (
      <ul style={{ listStyleType: 'none', paddingLeft: `${level * 30}px`, position: 'relative' }}>
        {items.map((item, index) => {
          const currentPath = path.concat([index]);
          // 确保 item 存在且 children 属性存在
          const itemChildren = item && item.children ? item.children : [];
          return (
            <li key={index} style={{ position: 'relative' }}>
              {level > 0 && (
                <div style={{ position: 'absolute', left: '-20px', top: '0', bottom: '0', borderLeft: '2px solid #666' }} />
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isEditing ? (
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
                  
                  <button
                    onClick={() => handleAddSiblingClick(currentPath)}
                    className="btn btn-light me-2"
                    style={{ marginRight: '5px' }}
                  >
                    添加同级
                  </button>
                  <button
                    onClick={() => handleAddChildClick(currentPath)}
                    className="btn btn-light"
                    style={{ marginRight: '5px' }}
                  >
                    添加子级
                  </button>
                  <button
                    onClick={() => handleDeleteClick(currentPath)}
                    className="btn btn-light"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
                {isEditing ? (
                  <textarea
                    value={item.story}
                    onChange={(e) => handleStoryChange(currentPath, e.target.value)}
                    placeholder="故事内容"
                    style={{ width: '100%', marginTop: '10px' }} // 添加样式使文本域自适应
                  />
                ) : (
                  <p className="text-muted fs-6 mb-3">{item.story}</p>
                )}
              </div>
              {itemChildren.length > 0 && renderOutline(itemChildren, level + 1, currentPath)}
            </li>);
        })}
      </ul>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        {isEditing ? (
          <button onClick={handleSaveClick} className="btn btn-primary">
            <i className="bi bi-save"></i> 保存大纲
          </button>
        ) : (
          <button onClick={handleEditClick} className="btn btn-light">
            <i className="bi bi-pencil-square"></i> 编辑大纲
          </button>
        )}
      </div>
      {renderOutline(editedOutline)}
    </div>
  );
};

export default Outline;