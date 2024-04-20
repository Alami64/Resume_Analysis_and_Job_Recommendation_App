import React, { useState, useRef, useEffect } from 'react';
import { useChat } from './ChatContext';
import { useFile } from './FileContext';
import Message from './Message';
import InputArea from './InputArea';
import axios from 'axios';

function ChatArea({ jobDescription }) {
  const { messages, addMessage } = useChat();
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);
  const { selectedFile } = useFile();
  const endOfMessagesRef = useRef(null);
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  const getCurrentTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleNewUserMessage = async (message) => {

    const newUserMessage = { content: message, sender: 'user', timestamp: getCurrentTimestamp() };
    
    addMessage(newUserMessage);


    const formData = new FormData();
    formData.append('message', JSON.stringify(newUserMessage));
    formData.append('chatHistory', JSON.stringify(messages));
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }
    if (isFirstMessage && selectedFile) {
      formData.append('file', selectedFile);

    }

 
    setIsChatbotTyping(true);

  
    try {
      const response = await axios.post('http://localhost:8000/query', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      addMessage({
        content: response.data.response,
        sender: 'chatbot',
        timestamp: getCurrentTimestamp()
      }); 
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the message to the server.');
    } finally {
      setIsChatbotTyping(false); 
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-area">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <Message 
            key={index} 
            sender={msg.sender} 
            content={msg.content} 
            timestamp={msg.timestamp} 
          />
        ))}
        {isChatbotTyping && <Message sender="chatbot" content="Generating a response..." />}
        <div ref={endOfMessagesRef} />
      </div>
      <InputArea onSendMessage={handleNewUserMessage} />
    </div>
  );  
}

export default ChatArea;