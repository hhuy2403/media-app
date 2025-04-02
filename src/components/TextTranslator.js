import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { translateText } from '../services/api';

const TextTranslator = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');

  const languages = [
    { code: 'auto', name: 'Tự động nhận diện' },
    { code: 'en', name: 'Tiếng Anh' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'fr', name: 'Tiếng Pháp' },
    { code: 'de', name: 'Tiếng Đức' },
    { code: 'es', name: 'Tiếng Tây Ban Nha' },
    { code: 'it', name: 'Tiếng Ý' },
    { code: 'ja', name: 'Tiếng Nhật' },
    { code: 'ko', name: 'Tiếng Hàn' },
    { code: 'zh', name: 'Tiếng Trung' },
    { code: 'ru', name: 'Tiếng Nga' },
  ];

  const handleSourceLanguageChange = (e) => {
    setSourceLanguage(e.target.value);
  };

  const handleTargetLanguageChange = (e) => {
    setTargetLanguage(e.target.value);
  };

  const handleSourceTextChange = (e) => {
    setSourceText(e.target.value);
    setError('');
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
      
      setSourceText(translatedText);
      setTranslatedText('');
    } else {
      setError('Không thể hoán đổi khi nguồn là "Tự động nhận diện"');
    }
  };

  const handleTranslate = async (e) => {
    e.preventDefault();
    
    if (!sourceText.trim()) {
      setError('Vui lòng nhập văn bản để dịch');
      return;
    }

    setError('');
    setIsTranslating(true);

    try {
      // Gọi API dịch (mock)
      const result = await translateText(sourceText, sourceLanguage, targetLanguage);
      
      setTranslatedText(result.translatedText);
      
      // Hiển thị ngôn ngữ đã phát hiện nếu nguồn là 'auto'
      if (sourceLanguage === 'auto') {
        setDetectedLanguage(result.detectedLanguage);
      } else {
        setDetectedLanguage('');
      }
      
      setIsTranslating(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi dịch văn bản: ' + err.message);
      setIsTranslating(false);
    }
  };

  const handleCopyTranslation = () => {
    navigator.clipboard.writeText(translatedText);
    // Có thể thêm thông báo "Đã sao chép" ở đây
  };

  const handleClearText = () => {
    setSourceText('');
    setTranslatedText('');
    setError('');
    setDetectedLanguage('');
  };

  return (
    <Container className="form-container">
      <h2 className="mb-4">Dịch văn bản</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleTranslate}>
        <Row className="mb-3">
          <Col md={5}>
            <Form.Group>
              <Form.Label>Ngôn ngữ nguồn</Form.Label>
              <Form.Select 
                value={sourceLanguage} 
                onChange={handleSourceLanguageChange}
                className="language-selector"
              >
                {languages.map(lang => (
                  <option key={`source-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </Form.Select>
              {detectedLanguage && sourceLanguage === 'auto' && (
                <small className="text-muted">
                  Đã phát hiện: {languages.find(l => l.code === detectedLanguage)?.name || detectedLanguage}
                </small>
              )}
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-center justify-content-center">
            <Button 
              variant="outline-secondary"
              onClick={handleSwapLanguages}
              className="mt-4"
            >
              <i className="fas fa-exchange-alt"></i> Đổi
            </Button>
          </Col>
          <Col md={5}>
            <Form.Group>
              <Form.Label>Ngôn ngữ đích</Form.Label>
              <Form.Select 
                value={targetLanguage} 
                onChange={handleTargetLanguageChange}
                className="language-selector"
              >
                {languages.filter(lang => lang.code !== 'auto').map(lang => (
                  <option key={`target-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Văn bản gốc</Form.Label>
              <div className="position-relative">
                <Form.Control 
                  as="textarea" 
                  rows={6} 
                  value={sourceText} 
                  onChange={handleSourceTextChange} 
                  placeholder="Nhập văn bản cần dịch"
                  className="text-area"
                />
                {sourceText && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="position-absolute" 
                    style={{ top: '5px', right: '5px' }}
                    onClick={handleClearText}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Kết quả dịch</Form.Label>
              <div className="position-relative">
                <Form.Control 
                  as="textarea" 
                  rows={6} 
                  value={translatedText} 
                  readOnly 
                  placeholder="Bản dịch sẽ hiển thị ở đây"
                  className="text-area"
                />
                {translatedText && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="position-absolute" 
                    style={{ top: '5px', right: '5px' }}
                    onClick={handleCopyTranslation}
                    title="Sao chép"
                  >
                    <i className="fas fa-copy"></i>
                  </Button>
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
        
        <div className="d-flex justify-content-center mt-3">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isTranslating || !sourceText.trim()}
            className="px-4"
          >
            {isTranslating ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Đang dịch...
              </>
            ) : 'Dịch'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default TextTranslator;