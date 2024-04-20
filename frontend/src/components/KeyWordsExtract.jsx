import React, { useState } from 'react';
import axios from 'axios';
import { useFile } from './FileContext';

function KeywordExtract() {
  const { selectedFile, extractedKeywords, setExtractedKeywords } = useFile();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('http://localhost:8000/resume_process/', formData);
        setExtractedKeywords(response.data);
      } catch (error) {
        console.error('Error extracting keywords:', error);
        alert('Error extracting keywords: ' + error.message);
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="keyword-extract">
      <h4>Keyword Extraction</h4>
      <button className="button" onClick={handleUpload} disabled={!selectedFile || isLoading}>
        {isLoading ? 'Processing...' : 'Extract Keywords'}
      </button>
      {extractedKeywords && (
        <textarea
          readOnly
          id="key-info-textarea"
          style={{ width: '100%', height: '700px', whiteSpace: 'pre-wrap' }}
          value={extractedKeywords.parsed_keywords}
        />
      )}
    </div>
  );
}

export default KeywordExtract;