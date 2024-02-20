import React, { 
  createContext, 
  useContext, 
  useState 
} from 'react';

const StateContext = createContext();

//* -------------------------------------------------------------------------- */
//*                                ThemeProvider                               */
//* -------------------------------------------------------------------------- */
export const ThemeProvider = ({ children }) => {
    
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const [currentMode, setCurrentMode] = useState('Light');
  const [currentColor, setCurrentColor] = useState('#03C9D7');    

  /* -------------------------------------------------------------------------- */
  /*                                   setMode                                  */
  /* -------------------------------------------------------------------------- */
  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };
  
  /* -------------------------------------------------------------------------- */
  /*                                  setColor                                  */
  /* -------------------------------------------------------------------------- */
  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider 
      value={{
        currentMode,
        setCurrentMode,
        currentColor,
        setCurrentColor,
        setMode, 
        setColor
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

