"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode
} from 'react';


// 定义上下文类型
type Contxt = {
  title: string;
  content: string;
  lable: string;
};

const UserContext = createContext<{ aicontxt: Contxt[]; setAicontxt: React.Dispatch<React.SetStateAction<Contxt[]>> }>({
  aicontxt: [],
  setAicontxt: () => {}
});

export const useAiContxt = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('必须在UserInfoProvider中使用useUserInfo');
  }
  return context;
};

export const AIContxtProvider = ({ children }: { children: ReactNode }) => {
  const [aicontxt, setAicontxt] = useState<Contxt[]>([]);
  return (
    <UserContext.Provider value={{ aicontxt, setAicontxt }}>
      {children}
    </UserContext.Provider>
  );
};