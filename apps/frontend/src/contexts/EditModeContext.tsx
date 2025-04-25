import { createContext, FunctionComponent, PropsWithChildren, useContext, useState } from 'react';

type EditModeContextType = {
  isEditMode: boolean;
  enableEditMode: () => void;
  disableEditMode: () => void;
  toggleEditMode: () => void;
};

const defaultEditModeContext: EditModeContextType = {
  isEditMode: false,
  enableEditMode: () => {},
  disableEditMode: () => {},
  toggleEditMode: () => {},
};

const EditModeContext = createContext<EditModeContextType>(defaultEditModeContext);

export const useEditModeContext = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditModeContext must be used within an EditModeProvider');
  }
  return context;
};

export const EditModeProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const enableEditMode = () => setIsEditMode(true);
  const disableEditMode = () => setIsEditMode(false);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  return (
    <EditModeContext.Provider value={{ 
      isEditMode, 
      enableEditMode, 
      disableEditMode,
      toggleEditMode 
    }}>
      {children}
    </EditModeContext.Provider>
  );
};