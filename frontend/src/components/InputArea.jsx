import React, { useState } from 'react'; 

function InputArea({ onSendMessage }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput(''); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-area">
      <textarea
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit">
        <span className='icon-container'>
            <img src="./send_icon.svg" alt="Send Icon" className="send-icon" width="16" height="16" />

        </span>
      </button>
    </form>
  );
}

export default InputArea;
