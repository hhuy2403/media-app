import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, ProgressBar, Row, Col } from 'react-bootstrap';
import { convertMedia } from '../services/api';

const MediaConverter = ({ onSuccess, onError }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [outputFormat, setOutputFormat] = useState('mp4');
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const [conversionType, setConversionType] = useState('normal');
    const [audioOptions, setAudioOptions] = useState({
        bitrate: '128',
        channels: 'stereo',
        sampleRate: '44100'
    });

    const videoFormats = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'];
    const audioFormats = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
    const imageFormats = ['jpg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'];

    // Cleanup URLs khi component unmount
    useEffect(() => {
        return () => {
            if (result) {
                if (result.convertedUrl) URL.revokeObjectURL(result.convertedUrl);
                if (result.downloadUrl) URL.revokeObjectURL(result.downloadUrl);
            }
        };
    }, [result]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setError('');
            setResult(null);

            // Determine file type and suggest appropriate output format
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

            if (videoFormats.includes(fileExtension)) {
                setOutputFormat('mp4');
                // Reset conversion type when selecting a new file
                setConversionType('normal');
            } else if (audioFormats.includes(fileExtension)) {
                setOutputFormat('mp3');
                setConversionType('normal');
            } else if (imageFormats.includes(fileExtension)) {
                setOutputFormat('png');
                setConversionType('normal');
            }
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
            setFile(droppedFile);
            setFileName(droppedFile.name);
            setError('');
            setResult(null);

            // Determine file type and suggest appropriate output format
            const fileExtension = droppedFile.name.split('.').pop().toLowerCase();

            if (videoFormats.includes(fileExtension)) {
                setOutputFormat('mp4');
                setConversionType('normal');
            } else if (audioFormats.includes(fileExtension)) {
                setOutputFormat('mp3');
                setConversionType('normal');
            } else if (imageFormats.includes(fileExtension)) {
                setOutputFormat('png');
                setConversionType('normal');
            }
        }
    };

    const handleFormatChange = (e) => {
        setOutputFormat(e.target.value);
    };

    const handleConversionTypeChange = (e) => {
        const type = e.target.value;
        setConversionType(type);
        
        // Khi chuyển sang chế độ extract audio, mặc định đầu ra là mp3
        if (type === 'extractAudio') {
            setOutputFormat('mp3');
        }
    };

    const handleAudioOptionChange = (e) => {
        const { name, value } = e.target;
        setAudioOptions(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Vui lòng chọn file để chuyển đổi');
            return;
        }

        // Kiểm tra nếu file đầu vào không phải là video khi chọn extract audio
        const fileExtension = fileName.split('.').pop().toLowerCase();
        if (conversionType === 'extractAudio' && !videoFormats.includes(fileExtension)) {
            setError('Chỉ có thể trích xuất âm thanh từ file video');
            return;
        }

        // Giả lập quá trình chuyển đổi với tiến trình
        setIsConverting(true);
        setProgress(0);

        // Giả lập tiến trình tăng dần
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 300);

        try {
            // Chuẩn bị các tùy chọn chuyển đổi
            const conversionOptions = {
                targetFormat: outputFormat
            };

            // Thêm tùy chọn audio nếu đang trích xuất âm thanh
            if (conversionType === 'extractAudio') {
                conversionOptions.extractAudio = true;
                conversionOptions.audioOptions = audioOptions;
            }

            // Gọi API chuyển đổi (mock)
            const response = await convertMedia(file, outputFormat, conversionOptions);

            // Cập nhật tiến trình lên 100% khi hoàn thành
            setProgress(100);

            // Hiển thị kết quả
            setResult({
                url: response.downloadUrl || response.convertedUrl,
                name: response.convertedFileName,
                type: conversionType === 'extractAudio' ? 'audio' : getMediaType()
            });

            setIsConverting(false);
            clearInterval(progressInterval);

            // Gọi callback thành công nếu được cung cấp
            if (onSuccess) {
                onSuccess(`Đã chuyển đổi thành công "${fileName}" sang ${conversionType === 'extractAudio' ? 'âm thanh' : outputFormat}`);
            }
        } catch (err) {
            const errorMessage = 'Có lỗi xảy ra khi chuyển đổi file: ' + err.message;
            setError(errorMessage);
            setIsConverting(false);
            clearInterval(progressInterval);

            // Gọi callback lỗi nếu được cung cấp
            if (onError) {
                onError(errorMessage);
            }
        }
    };

    const getMediaType = () => {
        if (videoFormats.includes(outputFormat)) {
            return 'video';
        } else if (audioFormats.includes(outputFormat)) {
            return 'audio';
        } else {
            return 'image';
        }
    };

    const renderFormatOptions = () => {
        if (!file) return null;

        const fileExtension = fileName.split('.').pop().toLowerCase();

        // Nếu đang ở chế độ trích xuất âm thanh, chỉ hiển thị các định dạng âm thanh
        if (conversionType === 'extractAudio') {
            return audioFormats.map(format => (
                <option key={format} value={format}>{format.toUpperCase()}</option>
            ));
        }

        // Nếu đang ở chế độ bình thường, hiển thị các định dạng tương ứng với loại file
        if (videoFormats.includes(fileExtension)) {
            return videoFormats.map(format => (
                <option key={format} value={format}>{format.toUpperCase()}</option>
            ));
        } else if (audioFormats.includes(fileExtension)) {
            return audioFormats.map(format => (
                <option key={format} value={format}>{format.toUpperCase()}</option>
            ));
        } else if (imageFormats.includes(fileExtension)) {
            return imageFormats.map(format => (
                <option key={format} value={format}>{format.toUpperCase()}</option>
            ));
        } else {
            return <option value="">Định dạng không được hỗ trợ</option>;
        }
    };

    // Kiểm tra xem file có phải là video không
    const isVideoFile = () => {
        if (!file) return false;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        return videoFormats.includes(fileExtension);
    };

    return (
        <Container className="form-container">
            <h2 className="mb-4">Chuyển đổi định dạng file media</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <div
                    className="file-upload-container mb-3"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <div>
                        {file ? (
                            <p className="mb-0">{fileName}</p>
                        ) : (
                            <>
                                <i className="fas fa-cloud-upload-alt fa-3x mb-2"></i>
                                <p className="mb-0">Kéo và thả file hoặc click để chọn</p>
                            </>
                        )}
                    </div>
                </div>

                {file && (
                    <>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>File đầu vào</Form.Label>
                                    <Form.Control type="text" value={fileName} disabled />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                {isVideoFile() && (
                                    <Form.Group>
                                        <Form.Label>Loại chuyển đổi</Form.Label>
                                        <Form.Select 
                                            value={conversionType} 
                                            onChange={handleConversionTypeChange}
                                        >
                                            <option value="normal">Chuyển đổi định dạng thông thường</option>
                                            <option value="extractAudio">Trích xuất âm thanh từ video</option>
                                        </Form.Select>
                                    </Form.Group>
                                )}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Định dạng đầu ra</Form.Label>
                                    <Form.Select 
                                        value={outputFormat} 
                                        onChange={handleFormatChange}
                                        disabled={conversionType === 'extractAudio'}
                                    >
                                        {renderFormatOptions()}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                {conversionType === 'extractAudio' && (
                                    <Form.Group>
                                        <Form.Label>Định dạng âm thanh</Form.Label>
                                        <Form.Select 
                                            value={outputFormat} 
                                            onChange={handleFormatChange}
                                        >
                                            {audioFormats.map(format => (
                                                <option key={format} value={format}>{format.toUpperCase()}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                            </Col>
                        </Row>

                        {conversionType === 'extractAudio' && (
                            <div className="advanced-options mb-4">
                                <h5 className="mb-3">Tùy chọn âm thanh</h5>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Bitrate</Form.Label>
                                            <Form.Select 
                                                name="bitrate"
                                                value={audioOptions.bitrate}
                                                onChange={handleAudioOptionChange}
                                            >
                                                <option value="64">64 kbps (Thấp)</option>
                                                <option value="128">128 kbps (Trung bình)</option>
                                                <option value="192">192 kbps (Tốt)</option>
                                                <option value="256">256 kbps (Rất tốt)</option>
                                                <option value="320">320 kbps (Cao)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Kênh</Form.Label>
                                            <Form.Select 
                                                name="channels"
                                                value={audioOptions.channels}
                                                onChange={handleAudioOptionChange}
                                            >
                                                <option value="mono">Mono (1 kênh)</option>
                                                <option value="stereo">Stereo (2 kênh)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tần số lấy mẫu</Form.Label>
                                            <Form.Select 
                                                name="sampleRate"
                                                value={audioOptions.sampleRate}
                                                onChange={handleAudioOptionChange}
                                            >
                                                <option value="22050">22.05 kHz</option>
                                                <option value="44100">44.1 kHz (CD)</option>
                                                <option value="48000">48 kHz (DVD)</option>
                                                <option value="96000">96 kHz (Cao cấp)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {isConverting && (
                            <div className="my-4">
                                <p>Đang chuyển đổi...</p>
                                <ProgressBar now={progress} label={`${progress}%`} />
                            </div>
                        )}

                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3"
                            disabled={!file || isConverting}
                        >
                            {isConverting ? 'Đang chuyển đổi...' : conversionType === 'extractAudio' ? 'Trích xuất âm thanh' : 'Chuyển đổi'}
                        </Button>
                    </>
                )}
            </Form>

            {result && (
                <Card className="mt-4 card-result">
                    <Card.Header>Kết quả chuyển đổi</Card.Header>
                    <Card.Body>
                        <Card.Title>{result.name}</Card.Title>
                        {result.type === 'video' ? (
                            <video controls width="100%" className="mt-3">
                                <source src={result.url} type={`video/${outputFormat}`} />
                                Trình duyệt của bạn không hỗ trợ video tag.
                            </video>
                        ) : result.type === 'audio' ? (
                            <div className="audio-container mt-3">
                                <audio controls className="w-100">
                                    <source src={result.url} type={`audio/${outputFormat}`} />
                                    Trình duyệt của bạn không hỗ trợ audio tag.
                                </audio>
                                <div className="audio-waveform mt-2" style={{ height: '60px', background: '#f5f5f5', borderRadius: '4px' }}>
                                    {/* Hiển thị waveform ở đây nếu cần */}
                                    <div className="audio-waveform-placeholder d-flex align-items-center justify-content-center h-100">
                                        <i className="fas fa-music me-2"></i> Âm thanh được trích xuất từ video
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <img src={result.url} alt="Converted" className="img-fluid mt-3" />
                        )}
                        
                        <div className="mt-4">
                            <Row>
                                <Col>
                                    {conversionType === 'extractAudio' && (
                                        <div className="mb-3">
                                            <h6>Thông tin âm thanh:</h6>
                                            <p className="mb-1"><small><strong>Bitrate:</strong> {audioOptions.bitrate} kbps</small></p>
                                            <p className="mb-1"><small><strong>Kênh:</strong> {audioOptions.channels === 'stereo' ? 'Stereo (2 kênh)' : 'Mono (1 kênh)'}</small></p>
                                            <p className="mb-1"><small><strong>Tần số lấy mẫu:</strong> {parseInt(audioOptions.sampleRate)/1000} kHz</small></p>
                                        </div>
                                    )}
                                </Col>
                                <Col className="text-end">
                                    <Button
                                        variant="success"
                                        onClick={() => {
                                            // Sử dụng window.open thay vì Link
                                            window.open(result.url, '_blank');
                                        }}
                                    >
                                        <i className="fas fa-download me-2"></i> Tải xuống
                                    </Button>
                                    
                                    {/* Thêm nút play/preview nếu cần */}
                                    {result.type === 'audio' && (
                                        <Button
                                            variant="outline-primary"
                                            className="ms-2"
                                            onClick={() => {
                                                const audioElement = document.querySelector('audio');
                                                if (audioElement) {
                                                    audioElement.play();
                                                }
                                            }}
                                        >
                                            <i className="fas fa-play me-2"></i> Phát
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
            )}
            
            {file && !isConverting && !result && (
                <div className="conversion-tips mt-4">
                    <h5>Mẹo chuyển đổi:</h5>
                    {isVideoFile() && (
                        <ul className="small text-muted">
                            <li>Bạn có thể trích xuất âm thanh từ video bằng cách chọn "Trích xuất âm thanh từ video".</li>
                            <li>Định dạng MP4 thường tương thích với hầu hết thiết bị và nền tảng.</li>
                            <li>Bitrate cao hơn sẽ cho chất lượng âm thanh tốt hơn nhưng kích thước file lớn hơn.</li>
                        </ul>
                    )}
                    {!isVideoFile() && (
                        <ul className="small text-muted">
                            <li>Chọn định dạng phù hợp với mục đích sử dụng của bạn.</li>
                            <li>Chuyển đổi có thể làm giảm chất lượng nếu chuyển từ định dạng nén sang định dạng khác.</li>
                        </ul>
                    )}
                </div>
            )}
        </Container>
    );
};

export default MediaConverter;