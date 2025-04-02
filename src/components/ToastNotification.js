import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

/**
 * Component hiển thị thông báo Toast hiện đại
 * @param {Object} props - Props component
 * @param {string} props.type - Loại thông báo: 'success', 'error', 'info', 'warning'
 * @param {string} props.message - Nội dung thông báo
 * @param {number} props.duration - Thời gian hiển thị (ms)
 * @param {boolean} props.show - Trạng thái hiển thị
 * @param {function} props.onClose - Callback khi đóng
 */
const ToastNotification = ({ type = 'info', message, duration = 3000, show, onClose }) => {
  const [showToast, setShowToast] = useState(show);

  useEffect(() => {
    setShowToast(show);

    // Tự động đóng sau duration
    let timer;
    if (show) {
      timer = setTimeout(() => {
        setShowToast(false);
        if (onClose) onClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show, duration, onClose]);

  // Xác định biểu tượng dựa trên loại thông báo
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle text-success"></i>;
      case 'error':
        return <i className="fas fa-exclamation-circle text-danger"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle text-warning"></i>;
      case 'info':
      default:
        return <i className="fas fa-info-circle text-info"></i>;
    }
  };

  // Xác định background dựa trên loại thông báo
  const getBackground = () => {
    switch (type) {
      case 'success':
        return 'linear-gradient(145deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.1) 100%)';
      case 'error':
        return 'linear-gradient(145deg, rgba(247, 37, 133, 0.05) 0%, rgba(247, 37, 133, 0.1) 100%)';
      case 'warning':
        return 'linear-gradient(145deg, rgba(255, 158, 0, 0.05) 0%, rgba(255, 158, 0, 0.1) 100%)';
      case 'info':
      default:
        return 'linear-gradient(145deg, rgba(76, 201, 240, 0.05) 0%, rgba(76, 201, 240, 0.1) 100%)';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1070 }}>
      <Toast 
        show={showToast} 
        onClose={() => {
          setShowToast(false);
          if (onClose) onClose();
        }}
        className="modern-toast"
        style={{
          background: getBackground(),
          boxShadow: 'var(--shadow-md)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
        }}
      >
        <Toast.Header closeButton={true} style={{ background: 'transparent', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <span className="me-2">{getIcon()}</span>
          <strong className="me-auto">
            {type === 'success' && 'Thành công'}
            {type === 'error' && 'Lỗi'}
            {type === 'warning' && 'Cảnh báo'}
            {type === 'info' && 'Thông báo'}
          </strong>
          <small>vừa xong</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;