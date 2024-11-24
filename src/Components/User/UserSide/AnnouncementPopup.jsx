import React, { useState, useEffect } from 'react';

const AnnouncementPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const hasSeenPopup = localStorage.getItem('announcement_seen');
      if (!hasSeenPopup) {
        setIsVisible(true);
      }
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('announcement_seen', 'true');
  };

  return (
    isVisible && (
      <div style={popupStyles.overlay}>
        <div style={popupStyles.container}>
          <p>
            <span style={{ color: '#FF0000', fontWeight: 'bold' }}>🚨 IMPORTANT ANNOUNCEMENT 🚨 </span>
            <span style={{ color: '#000000' }}>Due to an issue with WhatsApp, kindly: </span>
            <span style={{ color: '#007BFF', fontWeight: 'bold' }}> Call: </span>
            <span style={{ color: '#FF4500' }}>8669 646969</span> or <span style={{ color: '#FF4500' }}>8669 656969</span>.
            <span style={{ color: '#007BFF', fontWeight: 'bold' }}> For Deposits: </span>
            <span style={{ color: '#000000' }}>Use GPay or PhonePe to </span>
            <span style={{ color: '#28A745' }}>9226 492672</span>.
            <span style={{ color: '#FF0000', fontWeight: 'bold' }}> We apologize for the inconvenience caused.</span>
          </p>
          <button style={popupStyles.closeButton} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    )
  );
};

const popupStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    textAlign: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#FF4500',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AnnouncementPopup;

