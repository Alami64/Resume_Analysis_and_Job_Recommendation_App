import React, { useState }  from 'react';
import JobDetailsModal from './JobDetailsModal';

function GridJobs({ data, onChatClick }) {

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const showJobDetails = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const columns = [
    { key: 'company', title: 'Company', className: 'grid-cell' },
    { key: 'title', title: 'Title', className: 'grid-cell bold-title' },
    {
      key: 'url',
      title: 'Link',
      className: 'grid-cell',
      render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">Apply</a>,
    },
    {
      key: 'actions',
      title: 'Actions',
      className: 'grid-cell',
      render: (item) => (
        <>
          <button className="info-button" title="Job Details" onClick={() => showJobDetails(item)}>ℹ️</button>
          <button className="chat-button" title="Chat with the job" onClick={() => onChatClick(item.description)}>💬</button>
        </>
      ),
    },
  ];

  return (
    <div className="grid-container">
      <JobDetailsModal isOpen={isModalOpen} onClose={closeModal} job={selectedJob} />
      <div className="grid-header">
        {columns.map((column) => (
          <div key={column.key} className={column.className}>
            {column.title}
          </div>
        ))}
      </div>
      {data.map((item, index) => (
        <div key={index} className="grid-row">
          {columns.map((column) => (
            <div key={column.key} className={column.className}>
              {column.render ? 
                column.key === 'url' ? column.render(item[column.key], item) : column.render(item)
                : item[column.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GridJobs;
