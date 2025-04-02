// Bảng màu hiện đại cho ứng dụng
const theme = {
    colors: {
      primary: '#4361ee',        // Xanh dương đậm - màu chủ đạo
      secondary: '#3f37c9',      // Xanh tím - màu phụ
      accent: '#4cc9f0',         // Xanh biển nhạt - màu nhấn
      success: '#4CAF50',        // Xanh lá - thành công
      danger: '#f72585',         // Hồng đậm - lỗi/nguy hiểm
      warning: '#ff9e00',        // Cam - cảnh báo
      info: '#4cc9f0',           // Xanh nhạt - thông tin
      light: '#f8f9fa',          // Trắng xám nhạt
      dark: '#212529',           // Đen xám đậm
      muted: '#6c757d',          // Xám trung tính
      white: '#ffffff',          // Trắng
      black: '#000000',          // Đen
      
      // Gradient
      gradient: {
        primary: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
        secondary: 'linear-gradient(135deg, #f72585 0%, #b5179e 100%)',
        accent: 'linear-gradient(135deg, #4cc9f0 0%, #4361ee 100%)'
      },
      
      // Background
      background: {
        light: '#ffffff',
        dark: '#343a40',
        main: '#f8f9fa',
        card: '#ffffff',
        gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }
    },
    
    // Các biến về góc bo tròn
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      extraLarge: '24px',
      circle: '50%'
    },
    
    // Shadow
    shadows: {
      small: '0 2px 4px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.12)',
      large: '0 10px 15px rgba(0, 0, 0, 0.15)',
      extraLarge: '0 15px 25px rgba(0, 0, 0, 0.2)',
      inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    
    // Các biến về font
    typography: {
      fontFamily: {
        main: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        code: "'Fira Code', monospace"
      },
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        md: '1rem',       // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem',// 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem'     // 48px
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semiBold: 600,
        bold: 700
      }
    },
    
    // Spacing
    spacing: {
      xs: '0.25rem',    // 4px
      sm: '0.5rem',     // 8px
      md: '1rem',       // 16px
      lg: '1.5rem',     // 24px
      xl: '2rem',       // 32px
      '2xl': '2.5rem',  // 40px
      '3xl': '3rem'     // 48px
    },
    
    // Transitions
    transitions: {
      fast: '0.2s ease',
      medium: '0.3s ease',
      slow: '0.5s ease'
    },
    
    // Z-index
    zIndex: {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modal: 1050,
      popover: 1060,
      tooltip: 1070
    }
  };
  
  export default theme;