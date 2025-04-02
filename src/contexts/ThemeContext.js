import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo Context cho Theme
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  showToast: () => {},
  toast: {
    show: false,
    type: 'info',
    message: '',
    duration: 3000,
  },
});

// Custom hook để sử dụng ThemeContext dễ dàng hơn
export const useTheme = () => useContext(ThemeContext);

// Provider Component
export const ThemeProvider = ({ children }) => {
  // State cho Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  // State cho Toast
  const [toast, setToast] = useState({
    show: false,
    type: 'info',
    message: '',
    duration: 3000,
  });

  // Toggle Dark Mode
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  // Hiển thị Toast
  const showToast = (type, message, duration = 3000) => {
    setToast({
      show: true,
      type,
      message,
      duration,
    });

    // Tự động ẩn Toast sau duration
    setTimeout(() => {
      setToast(prev => ({
        ...prev,
        show: false,
      }));
    }, duration);
  };

  // Áp dụng Dark Mode vào document
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Các giá trị được cung cấp bởi Provider
  const contextValue = {
    isDarkMode,
    toggleTheme,
    showToast,
    toast,
    closeToast: () => setToast(prev => ({ ...prev, show: false })),
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;