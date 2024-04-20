import React, { createContext, useContext, useState, useEffect } from 'react';

const FileContext = createContext();

export const useFile = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isPDF, setIsPDF] = useState(false);
  const [extractedKeywords, setExtractedKeywords] = useState('');

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);
      setIsPDF(selectedFile.type === 'application/pdf'); 
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedFile]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  return (
    <FileContext.Provider value={{ selectedFile, handleFileSelect, fileUrl, isPDF, setIsPDF, extractedKeywords, setExtractedKeywords }}>
      {children}
    </FileContext.Provider>
  );
};