import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { translateFile } from '../services/api';

const FileTranslator = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const fileInputRef = useRef(null);

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

  const supportedFileTypes = ['txt', 'doc', 'docx', 'pdf', 'rtf', 'html', 'json', 'xml', 'md', 'csv'];

  // Xóa URL khi component unmount
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop().toLowerCase();
      
      if (!supportedFileTypes.includes(extension)) {
        setError(`Định dạng file không được hỗ trợ. Các định dạng hỗ trợ: ${supportedFileTypes.join(', ')}`);
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
      setTranslatedContent('');
      setDownloadUrl(null);
      loadFileContent(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const extension = droppedFile.name.split('.').pop().toLowerCase();
      
      if (!supportedFileTypes.includes(extension)) {
        setError(`Định dạng file không được hỗ trợ. Các định dạng hỗ trợ: ${supportedFileTypes.join(', ')}`);
        return;
      }
      
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setError('');
      setTranslatedContent('');
      setDownloadUrl(null);
      loadFileContent(droppedFile);
    }
  };

  const loadFileContent = (file) => {
    setIsFileLoading(true);
    setProgress(0);
    
    // Giả lập quá trình tải tệp với tiến trình
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    // Đọc nội dung file
    const reader = new FileReader();
    
    reader.onload = (e) => {
      clearInterval(interval);
      setProgress(100);
      setIsFileLoading(false);
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        setFileContent(e.target.result);
      } else {
        // Với các định dạng phức tạp hơn, hiển thị nội dung mẫu
        setFileContent('Đây là nội dung mẫu được trích xuất từ file. ' +
          'Trong ứng dụng thực tế, nội dung này sẽ được trích xuất đúng từ file của bạn ' +
          'bằng cách sử dụng API chuyên dụng cho từng loại file. ' +
          'Ví dụ: Đối với PDF có thể sử dụng pdf.js, đối với DOCX có thể sử dụng docx library.');
      }
    };
    
    reader.onerror = () => {
      clearInterval(interval);
      setIsFileLoading(false);
      setError('Có lỗi xảy ra khi đọc file.');
    };
    
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // Giả lập thời gian đọc với các file không phải text
      setTimeout(() => {
        reader.onload({ target: { result: '' } });
      }, 1000);
    }
  };

  const handleSourceLanguageChange = (e) => {
    setSourceLanguage(e.target.value);
  };

  const handleTargetLanguageChange = (e) => {
    setTargetLanguage(e.target.value);
  };

  const handleTranslate = async (e) => {
    e.preventDefault();
    
    if (!fileContent.trim()) {
      setError('Không có nội dung để dịch.');
      return;
    }

    setError('');
    setIsTranslating(true);
    setTranslatedContent('');
    setDownloadUrl(null);

    try {
      // Gọi API dịch file (mock)
      const result = await translateFile(file, sourceLanguage, targetLanguage);
      
      setTranslatedContent(result.translatedContent);
      setDownloadUrl(result.downloadUrl);
      
      if (sourceLanguage === 'auto') {
        setDetectedLanguage(result.detectedLanguage);
      }
      
      setIsTranslating(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi dịch nội dung file: ' + err.message);
      setIsTranslating(false);
    }
  };

  // Sửa hàm handleDownloadTranslation
const handleDownloadTranslation = () => {
    if (downloadUrl) {
      // Sử dụng window.open thay vì tạo và xóa thẻ a
      window.open(downloadUrl, '_blank');
      
      // Hoặc sử dụng cách an toàn hơn với thẻ a
      /*
      const a = document.createElement('a');
      const nameWithoutExt = fileName.split('.').slice(0, -1).join('.');
      const extension = fileName.split('.').pop();
      
      a.href = downloadUrl;
      a.download = `${nameWithoutExt}_${targetLanguage}.${extension}`;
      a.target = '_blank';
      a.style.display = 'none';
      
      // Thêm vào body, kích hoạt click, và để trình duyệt tự xử lý (không cần xóa)
      document.body.appendChild(a);
      a.click();
      
      // Xóa element sau một thời gian ngắn
      setTimeout(() => {
        try {
          if (document.body.contains(a)) {
            document.body.removeChild(a);
          }
        } catch (e) {
          console.warn('Error removing download element:', e);
        }
      }, 100);
      */
    }
  };

  return (
    <Container className="form-container">
      <h2 className="mb-4">Dịch file văn bản</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div 
        className="file-upload-container mb-4"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".txt,.doc,.docx,.pdf,.rtf,.html,.json,.xml,.md,.csv"
        />
        <div>
          {file ? (
            <p className="mb-0">{fileName}</p>
          ) : (
            <>
              <i className="fas fa-file-upload fa-3x mb-2"></i>
              <p className="mb-0">Kéo và thả file hoặc click để chọn</p>
              <small className="text-muted">
                Định dạng hỗ trợ: {supportedFileTypes.join(', ')}
              </small>
            </>
          )}
        </div>
      </div>
      
      {isFileLoading && (
        <div className="my-4">
          <p>Đang tải và xử lý file...</p>
          <ProgressBar now={progress} label={`${progress}%`} />
        </div>
      )}
      
      {fileContent && !isFileLoading && (
        <Form onSubmit={handleTranslate}>
          <Row className="mb-3">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Ngôn ngữ nguồn</Form.Label>
                <Form.Select 
                  value={sourceLanguage} 
                  onChange={handleSourceLanguageChange}
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
            <Col md={2}></Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Ngôn ngữ đích</Form.Label>
                <Form.Select 
                  value={targetLanguage} 
                  onChange={handleTargetLanguageChange}
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
          
          <Form.Group className="mb-3">
            <Form.Label>Nội dung file</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              value={fileContent} 
              readOnly 
              className="text-area"
            />
          </Form.Group>
          
          <div className="d-flex justify-content-center">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isTranslating || !fileContent.trim()}
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
              ) : 'Dịch file'}
            </Button>
          </div>
        </Form>
      )}
      
      {translatedContent && (
        <Card className="mt-4">
          <Card.Header>Kết quả dịch</Card.Header>
          <Card.Body>
            <Form.Group>
              <Form.Label>Nội dung đã dịch</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5} 
                value={translatedContent} 
                readOnly 
                className="text-area mb-3"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button 
                variant="success" 
                onClick={handleDownloadTranslation}
                disabled={!downloadUrl}
              >
                Tải xuống file đã dịch
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default FileTranslator;