import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Tab, Tabs, Button } from 'react-bootstrap';
import './App.css';
import MediaConverter from './components/MediaConverter';
import TextTranslator from './components/TextTranslator';
import TextToSpeech from './components/TextToSpeech';
import FileTranslator from './components/FileTranslator';
import ToastNotification from './components/ToastNotification';

function App() {
  // State quản lý tab đang active
  const [key, setKey] = useState('media-converter');
  
  // State quản lý toast notification
  const [toast, setToast] = useState({
    show: false,
    type: 'info',
    message: '',
    duration: 3000
  });
  
  // State quản lý dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Hiệu ứng khi load trang
  const [isLoading, setIsLoading] = useState(true);
  
  // Hiển thị toast notification
  const showToast = (type, message, duration = 3000) => {
    setToast({
      show: true,
      type,
      message,
      duration
    });
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  };
  
  // Kiểm tra dark mode từ localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
    
    // Giả lập thời gian tải trang
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Hiển thị toast chào mừng
      showToast('info', 'Chào mừng đến với ứng dụng chuyển đổi và dịch!', 4000);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner">
          <i className="fas fa-sync-alt fa-spin"></i>
        </div>
        <h3>Đang tải ứng dụng...</h3>
      </div>
    );
  }

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Navbar */}
      <Navbar expand="lg" variant={isDarkMode ? 'dark' : 'dark'} className="navbar-modern">
        <Container>
          <Navbar.Brand href="/">
            <i className="fas fa-exchange-alt me-2"></i>
            Media Converter & Translator
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/" active>
                <i className="fas fa-home me-1"></i> Home
              </Nav.Link>
              <Nav.Link href="/about">
                <i className="fas fa-info-circle me-1"></i> About
              </Nav.Link>
              <Nav.Link href="https://github.com/yourusername/media-converter-app" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github me-1"></i> GitHub
              </Nav.Link>
              <Button 
                variant={isDarkMode ? 'light' : 'dark'} 
                size="sm" 
                className="ms-2 theme-toggle-btn"
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <div className="hero-content text-center">
            <h1 className="hero-title">Công cụ Chuyển đổi & Dịch</h1>
            <p className="hero-subtitle">
              Chuyển đổi định dạng media, dịch văn bản và file, chuyển văn bản thành giọng nói dễ dàng
            </p>
            <div className="hero-buttons mt-4">
              <Button 
                variant="light" 
                className="me-2 px-4 py-2 hero-btn"
                onClick={() => setKey('media-converter')}
              >
                <i className="fas fa-file-video me-2"></i>
                Bắt đầu chuyển đổi
              </Button>
              <Button 
                variant="outline-light" 
                className="px-4 py-2 hero-btn"
                onClick={() => showToast('info', 'Xem thêm hướng dẫn sử dụng tại trang About!', 4000)}
              >
                <i className="fas fa-question-circle me-2"></i>
                Hướng dẫn
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="main-content">
        <div className="tab-container">
          <Tabs
            id="controlled-tab"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-4 modern-tabs"
          >
            <Tab eventKey="media-converter" title={<><i className="fas fa-file-video me-2"></i>Chuyển đổi Media</>}>
              <MediaConverter onSuccess={(message) => showToast('success', message)} onError={(message) => showToast('error', message)} />
            </Tab>
            <Tab eventKey="text-translator" title={<><i className="fas fa-language me-2"></i>Dịch văn bản</>}>
              <TextTranslator onSuccess={(message) => showToast('success', message)} onError={(message) => showToast('error', message)} />
            </Tab>
            <Tab eventKey="text-to-speech" title={<><i className="fas fa-volume-up me-2"></i>Văn bản → Giọng nói</>}>
              <TextToSpeech onSuccess={(message) => showToast('success', message)} onError={(message) => showToast('error', message)} />
            </Tab>
            <Tab eventKey="file-translator" title={<><i className="fas fa-file-alt me-2"></i>Dịch file</>}>
              <FileTranslator onSuccess={(message) => showToast('success', message)} onError={(message) => showToast('error', message)} />
            </Tab>
          </Tabs>
        </div>
      </Container>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <h2 className="text-center mb-5 section-title">Tính năng nổi bật</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-exchange-alt"></i>
                </div>
                <h3>Chuyển đổi Media</h3>
                <p>Chuyển đổi giữa các định dạng video, audio và hình ảnh phổ biến.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-language"></i>
                </div>
                <h3>Dịch văn bản</h3>
                <p>Dịch văn bản giữa các ngôn ngữ với độ chính xác cao.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-volume-up"></i>
                </div>
                <h3>Text-to-Speech</h3>
                <p>Chuyển đổi văn bản thành giọng nói với nhiều ngôn ngữ khác nhau.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <h3>Dịch file</h3>
                <p>Dịch nội dung từ các file văn bản, PDF và nhiều định dạng khác.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center">
        <Container>
          <div className="footer-content">
            <p className="mb-0">© {new Date().getFullYear()} Media Converter & Translator App</p>
            <div className="social-icons mt-2">
              <a href="https://facebook.com" className="social-icon" aria-label="Facebook" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" className="social-icon" aria-label="Twitter" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://github.com" className="social-icon" aria-label="GitHub" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com" className="social-icon" aria-label="LinkedIn" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </Container>
      </footer>

      {/* Toast Notification */}
      <ToastNotification
        show={toast.show}
        type={toast.type}
        message={toast.message}
        duration={toast.duration}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}

export default App;