import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { textToSpeech } from '../services/api';

const TextToSpeech = () => {
    const [text, setText] = useState('');
    const [voice, setVoice] = useState('vi-VN-Standard-A');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [usesWebAPI, setUsesWebAPI] = useState(false);
    const audioRef = useRef(null);

    const voices = [
        { id: 'vi-VN-Standard-A', name: 'Tiếng Việt - Nữ' },
        { id: 'vi-VN-Standard-B', name: 'Tiếng Việt - Nam' },
        { id: 'en-US-Standard-A', name: 'Tiếng Anh (Mỹ) - Nữ' },
        { id: 'en-US-Standard-B', name: 'Tiếng Anh (Mỹ) - Nam' },
        { id: 'en-GB-Standard-A', name: 'Tiếng Anh (Anh) - Nữ' },
        { id: 'en-GB-Standard-B', name: 'Tiếng Anh (Anh) - Nam' },
        { id: 'fr-FR-Standard-A', name: 'Tiếng Pháp - Nữ' },
        { id: 'fr-FR-Standard-B', name: 'Tiếng Pháp - Nam' }
    ];

    // Xóa audioUrl khi component unmount
    useEffect(() => {
        return () => {
            if (audioUrl && !usesWebAPI) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl, usesWebAPI]);

    const handleTextChange = (e) => {
        setText(e.target.value);
        setError('');
    };

    const handleVoiceChange = (e) => {
        setVoice(e.target.value);
    };

    const handleRateChange = (e) => {
        setRate(parseFloat(e.target.value));
    };

    const handlePitchChange = (e) => {
        setPitch(parseFloat(e.target.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!text.trim()) {
            setError('Vui lòng nhập văn bản để chuyển đổi thành giọng nói');
            return;
        }

        setError('');
        setIsGenerating(true);
        setAudioUrl(null);

        try {
            // Gọi API text-to-speech (mock)
            const result = await textToSpeech(text, voice, rate, pitch);

            setAudioUrl(result.audioUrl);
            setUsesWebAPI(result.usesBrowserAPI || false);

            // Nếu có audio ref và URL, load và phát audio
            if (audioRef.current && result.audioUrl && !result.usesBrowserAPI) {
                audioRef.current.src = result.audioUrl;
                audioRef.current.load();
                // Không tự động phát để tránh trải nghiệm người dùng không tốt
            }

            setIsGenerating(false);
        } catch (err) {
            setError('Có lỗi xảy ra khi chuyển đổi văn bản thành giọng nói: ' + err.message);
            setIsGenerating(false);
        }
    };

    return (
        <Container className="form-container">
            <h2 className="mb-4">Chuyển văn bản thành giọng nói</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Văn bản</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Nhập văn bản cần chuyển thành giọng nói"
                        className="text-area"
                    />
                </Form.Group>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Giọng đọc</Form.Label>
                            <Form.Select value={voice} onChange={handleVoiceChange}>
                                {voices.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Tốc độ đọc ({rate}x)</Form.Label>
                            <Form.Range
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={rate}
                                onChange={handleRateChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Độ cao giọng ({pitch})</Form.Label>
                            <Form.Range
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={pitch}
                                onChange={handlePitchChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-center mt-3">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isGenerating || !text.trim()}
                        className="px-4"
                    >
                        {isGenerating ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Đang tạo...
                            </>
                        ) : 'Tạo giọng nói'}
                    </Button>
                </div>
            </Form>

            {audioUrl && !isGenerating && (
                <Card className="mt-4">
                    <Card.Header>Kết quả</Card.Header>
                    <Card.Body>
                        {usesWebAPI ? (
                            <Alert variant="info">
                                Đã phát audio bằng Web Speech API của trình duyệt. Tính năng này chỉ hoạt động trên một số trình duyệt.
                                Trong ứng dụng thực tế, sẽ có file audio để tải xuống.
                            </Alert>
                        ) : (
                            <>
                                <audio ref={audioRef} controls className="w-100 mb-3">
                                    <source src={audioUrl} type="audio/mpeg" />
                                    Trình duyệt của bạn không hỗ trợ phát âm thanh.
                                </audio>
                                <div className="d-flex justify-content-end">
                                    <Button
                                        variant="success"
                                        onClick={() => {
                                            // Sử dụng window.open thay vì href download
                                            window.open(audioUrl, '_blank');
                                        }}
                                    >
                                        Tải xuống MP3
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default TextToSpeech;