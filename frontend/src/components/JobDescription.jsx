import React from 'react';

const JobDescription = ({ content, setContent }) => {
  
  const handleClearText = () => {
    setContent(""); 
  };

  return (
    <div className="job-description-viewer">
      <button className="clear-text-button" onClick={handleClearText}>Close</button>
      <h4 className='job-description-label'>Job Description:</h4>      
      <textarea
        className="job-description-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}

export default JobDescription;
