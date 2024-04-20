import React from 'react';

function formatJobDescription(description) {

  const formattedDescription = description
    .replace(/Requirements:/g, '\n\nRequirements:\n')
    .replace(/Estimated Salary:/g, '\n\nEstimated Salary:\n')
    .replace(/Please feel free/g, '\nPlease feel free');

  return formattedDescription.split('\n').map((line, index) => (
    <p key={index}>{line}</p> 
  ));
}


function JobDetailsModal({ isOpen, onClose, job }) {
  if (!isOpen || !job) return null;

  const formattedDescription = formatJobDescription(job.description);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
        onClose();
    }};

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>Close</button>
        <h2>Job Details</h2>
        <p><strong>Title:</strong> {job.title}</p>
        <p><strong>Company:</strong> {job.company}</p>
        <div><strong>Description:</strong> {formattedDescription}</div>
      </div>
    </div>
  );
}

export default JobDetailsModal;
