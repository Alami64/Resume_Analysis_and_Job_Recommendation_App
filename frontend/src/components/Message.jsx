import React from 'react';

function formatChatbotMessage(content) {

  const blocks = content.split('\n');
  
  return blocks.map((block, index) => {
    
    const points = block.split(/(?=\d\. )/).filter(point => point.trim() !== '');
    
    return (
      <div key={index}>
        {points.map((point, subIndex) => (
          <p key={subIndex} style={{ marginBottom: '10px' }}>
            {point.trim()}
          </p>
        ))}
      </div>
    );
  });
}


function Message({ sender, content, timestamp }) {

  const formattedContent = sender === 'chatbot' ? formatChatbotMessage(content) : content;
  return (
    <div className={`message ${sender}`}>
      <p>{formattedContent}</p>
      {timestamp && <div className="timestamp">{timestamp}</div>}
    </div>
  );
}

export default Message;
