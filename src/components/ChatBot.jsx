// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';
// import { FaPaperPlane, FaRobot, FaUser, FaTimes, FaComments, FaShoppingCart, FaFileContract, FaClipboardList, FaQuestionCircle, FaExternalLinkAlt } from 'react-icons/fa';
// import './ChatBot.css';

// // Procurement-specific suggested queries
// const SUGGESTED_QUERIES = [
//   "How can I optimize my supplier selection process?",
//   "What are best practices for contract negotiation?",
//   "How do I create an effective RFP?",
//   "What KPIs should I track for procurement?",
//   "How can I reduce procurement costs?",
//   "What is the 3-way matching process?",
//   "need other help?"
// ];

// const ChatBot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [displayedText, setDisplayedText] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [flashEffect, setFlashEffect] = useState('');
//   const [headerFlash, setHeaderFlash] = useState(false);
//   const [inputFlash, setInputFlash] = useState(false);
//   const [showTypingMessage, setShowTypingMessage] = useState(false);
  
//   const messagesEndRef = useRef(null);
//   const typingIntervalRef = useRef(null);
//   const flashTimeoutRef = useRef(null);
//   const currentTypingMessageRef = useRef(null);
//   const isProcessingRef = useRef(false);
  
//   const userId = localStorage.getItem('chatUserId') || 'user-' + Date.now();

//   useEffect(() => {
//     localStorage.setItem('chatUserId', userId);
    
//     const loadChatHistory = async () => {
//       try {
//         console.log('Loading chat history...');
//         const response = await axios.get(`/api/chat/${userId}`);
//         console.log('Chat history loaded:', response.data);
//         if (response.data.messages) {
//           setMessages(response.data.messages);
//         }
//       } catch (error) {
//         console.error('Error loading chat history:', error);
//       }
//     };
    
//     loadChatHistory();
//   }, [userId]);

//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, displayedText, showTypingMessage, scrollToBottom]);

//   // Simplified typing effect
//   useEffect(() => {
//     const lastBotMessage = messages.filter(msg => msg.sender === 'bot').slice(-1)[0];
    
//     if (lastBotMessage && isTyping && lastBotMessage !== currentTypingMessageRef.current) {
//       currentTypingMessageRef.current = lastBotMessage;
      
//       // Clear any existing interval
//       if (typingIntervalRef.current) {
//         clearInterval(typingIntervalRef.current);
//       }
      
//       let i = 0;
//       const fullText = lastBotMessage.text;
//       setDisplayedText("");
      
//       typingIntervalRef.current = setInterval(() => {
//         if (i < fullText.length) {
//           setDisplayedText(fullText.substring(0, i + 1));
//           i++;
//         } else {
//           clearInterval(typingIntervalRef.current);
//           setIsTyping(false);
//           currentTypingMessageRef.current = null;
//         }
//       }, 30);
//     }
//   }, [messages, isTyping]);

//   const triggerFlashEffect = useCallback((type) => {
//     // Prevent multiple flash effects
//     if (flashTimeoutRef.current) {
//       clearTimeout(flashTimeoutRef.current);
//     }

//     switch(type) {
//       case 'user-message':
//         setFlashEffect('user-flash');
//         setInputFlash(true);
//         flashTimeoutRef.current = setTimeout(() => {
//           setFlashEffect('');
//           setInputFlash(false);
//         }, 600);
//         break;
//       case 'bot-response':
//         setHeaderFlash(true);
//         setFlashEffect('bot-flash');
//         flashTimeoutRef.current = setTimeout(() => {
//           setHeaderFlash(false);
//           setFlashEffect('');
//         }, 800);
//         break;
//       case 'suggestion-click':
//         if (!isProcessingRef.current) {
//           setFlashEffect('suggestion-flash');  
//           flashTimeoutRef.current = setTimeout(() => setFlashEffect(''), 500);
//         }
//         break;
//       case 'redirect-flash':
//         setFlashEffect('redirect-flash');
//         flashTimeoutRef.current = setTimeout(() => setFlashEffect(''), 600);
//         break;
//       default:
//         break;
//     }
//   }, []);

//   const handleRedirection = useCallback((url) => {
//     triggerFlashEffect('redirect-flash');
//     setTimeout(() => {
//       window.location.href = url;
//     }, 300);
//   }, [triggerFlashEffect]);

//   const sendMessage = useCallback(async (messageText) => {
//     if (!messageText.trim() || isProcessingRef.current) return;
    
//     isProcessingRef.current = true;
    
//     if (messageText.toLowerCase().includes('need other help') || 
//         messageText.toLowerCase().includes('need more help')) {
//       const helpPageUrl = '/help';
//       handleRedirection(helpPageUrl);
//       isProcessingRef.current = false;
//       return;
//     }
    
//     // Single flash effect
//     triggerFlashEffect('user-message');
    
//     const userMessage = { text: messageText, sender: 'user', id: Date.now() };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);
//     setShowTypingMessage(true);
    
//     const responseDelay = Math.random() * 1500 + 1500;
    
//     setTimeout(async () => {
//       try {
//         console.log('Sending message to backend:', messageText);
//         const response = await axios.post(`/api/chat/${userId}`, {
//           message: messageText
//         });
        
//         console.log('Received response from backend:', response.data);
        
//         setShowTypingMessage(false);
//         setIsLoading(false);
        
//         if (response.data.reply) {
//           triggerFlashEffect('bot-response');
          
//           const botMessage = { 
//             text: response.data.reply, 
//             sender: 'bot',
//             id: Date.now() + 1
//           };
//           setMessages(prev => [...prev, botMessage]);
//           setIsTyping(true);
//         } else {
//           throw new Error('No reply in response');
//         }
//       } catch (error) {
//         console.error('Error sending message:', error);
        
//         setShowTypingMessage(false);
//         setIsLoading(false);
        
//         const errorMessage = error.response?.data?.reply || 
//                             "Sorry, I couldn't process that procurement query. Please try again later.";
        
//         setMessages(prev => [...prev, { 
//           text: errorMessage, 
//           sender: 'bot',
//           id: Date.now() + 1
//         }]);
        
//         triggerFlashEffect('bot-response');
//       } finally {
//         isProcessingRef.current = false;
//       }
//     }, responseDelay);
//   }, [userId, triggerFlashEffect, handleRedirection]);

//   const handleSubmit = useCallback((e) => {
//     e.preventDefault();
//     sendMessage(input);
//   }, [input, sendMessage]);

//   const handleSuggestedQuery = useCallback((query) => {
//     if (isProcessingRef.current) return;
    
//     if (query.toLowerCase().includes('need other help') || 
//         query.toLowerCase().includes('need more help')) {
      
//       triggerFlashEffect('suggestion-click');
//       setTimeout(() => {
//         const helpPageUrl = '/help';
//         handleRedirection(helpPageUrl);
//       }, 100);
//       return;
//     }

//     triggerFlashEffect('suggestion-click');
//     setTimeout(() => {
//       sendMessage(query);
//     }, 100);
//   }, [triggerFlashEffect, handleRedirection, sendMessage]);

//   const toggleChat = useCallback(() => {
//     setIsOpen(!isOpen);
//     if (!isOpen) {
//       setTimeout(() => {
//         setFlashEffect('chat-open');
//         setTimeout(() => setFlashEffect(''), 600);
//       }, 100);
//     }
//   }, [isOpen]);

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (typingIntervalRef.current) {
//         clearInterval(typingIntervalRef.current);
//       }
//       if (flashTimeoutRef.current) {
//         clearTimeout(flashTimeoutRef.current);
//       }
//     };
//   }, []);

//   if (!isOpen) {
//     return (
//       <button onClick={toggleChat} className="chat-widget-button">
//         <div className="chatbot-logo">
//           <div className="robot-container">
//             <div className="robot-antenna">
//               <div className="antenna-ball"></div>
//             </div>
//             <div className="robot-head">
//               <div className="robot-face">
//                 <div className="robot-eye left-robot-eye"></div>
//                 <div className="robot-eye right-robot-eye"></div>
//               </div>
//             </div>
//             <div className="robot-body"></div>
//           </div>
//           <div className="speech-bubble">
//             <span>HI!</span>
//           </div>
//           <div className="pulse-ring"></div>
//           <div className="pulse-ring-2"></div>
//         </div>
//       </button>
//     );
//   }

//   return (
//     <div className={`chatbot-container ${flashEffect}`}>
//       <div className={`chatbot-header procurement-header ${headerFlash ? 'header-flash' : ''}`}>
//         <div className="header-left">
//           <FaShoppingCart className="bot-icon" />
//           <h3>Procurement Assistant</h3>
//         </div>
//         <button className="close-button" onClick={toggleChat}>
//           <FaTimes />
//         </button>
//       </div>
      
//       <div className="chatbot-messages">
//         {messages.length === 0 && (
//           <div className="welcome-message">
//             <h4>Hello! I'm your Procurement Assistant</h4>
//             <p>I can help with supplier management, contracts, RFPs, and more.</p>
//             <div className="suggested-queries">
//               <p className="suggested-title">Try asking about:</p>
//               {SUGGESTED_QUERIES.map((query, index) => (
//                 <button 
//                   key={index} 
//                   className={`suggested-query-btn ${
//                     query.toLowerCase().includes('need other help') ? 'help-redirect-btn' : ''
//                   }`}
//                   onClick={() => handleSuggestedQuery(query)}
//                   disabled={isProcessingRef.current}
//                 >
//                   {query.toLowerCase().includes('need other help') && (
//                     <FaExternalLinkAlt style={{ marginRight: '5px', fontSize: '11px' }} />
//                   )}
//                   {query}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {messages.map((msg, index) => (
//           <div key={msg.id || index} className={`message ${msg.sender}`}>
//             <div className="message-icon">
//               {msg.sender === 'user' ? 
//                 <FaUser /> : 
//                 <FaShoppingCart />
//               }
//             </div>
//             <div className="message-text">
//               {msg.sender === 'bot' && index === messages.length - 1 && isTyping
//                 ? displayedText
//                 : msg.text}
//             </div>
//           </div>
//         ))}
        
//         {showTypingMessage && (
//           <div className="message bot typing-message">
//             <div className="message-icon typing-icon">
//               <FaShoppingCart />
//             </div>
//             <div className="message-text typing-text">
//               <div className="typing-indicator-enhanced">
//                 <span className="typing-text-label">Typing</span>
//                 <div className="typing-dots">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {messages.length > 0 && !isLoading && !showTypingMessage && (
//           <div className="procurement-shortcuts">
//             <div className="shortcuts-title">Quick Procurement Topics:</div>
//             <div className="shortcuts-buttons">
//               <button onClick={() => handleSuggestedQuery("Supplier evaluation best practices")}>
//                 <FaClipboardList /> Supplier Evaluation
//               </button>
//               <button onClick={() => handleSuggestedQuery("Contract management tips")}>
//                 <FaFileContract /> Contracts
//               </button>
//               <button onClick={() => handleSuggestedQuery("RFP process optimization")}>
//                 <FaQuestionCircle /> RFP Process
//               </button>
//               <button 
//                 onClick={() => handleSuggestedQuery("need other help?")}
//                 className="help-redirect-shortcut"
//               >
//                 <FaExternalLinkAlt /> More Help
//               </button>
//             </div>
//           </div>
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>
      
//       <form onSubmit={handleSubmit} className={`chatbot-input ${inputFlash ? 'input-flash' : ''}`}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask about procurement processes..."
//           disabled={isLoading || showTypingMessage}
//         />
//         <button type="submit" disabled={isLoading || showTypingMessage}>
//           <FaPaperPlane />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBot;



import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser, FaTimes, FaComments, FaShoppingCart, FaFileContract, FaClipboardList, FaQuestionCircle, FaExternalLinkAlt } from 'react-icons/fa';
import './ChatBot.css';

// Backend configuration
const BACKEND_CONFIG = {
  baseURL: 'http://localhost:5000', // Change this to your backend URL
  endpoints: {
    chat: '/api/chat',
    chatHistory: '/api/chat' // If you have separate endpoint for history
  }
};

// Procurement-specific suggested queries
const SUGGESTED_QUERIES = [
  "How can I optimize my supplier selection process?",
  "What are best practices for contract negotiation?",
  "How do I create an effective RFP?",
  "What KPIs should I track for procurement?",
  "How can I reduce procurement costs?",
  "What is the 3-way matching process?",
  "need other help?"
];

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [flashEffect, setFlashEffect] = useState('');
  const [headerFlash, setHeaderFlash] = useState(false);
  const [inputFlash, setInputFlash] = useState(false);
  const [showTypingMessage, setShowTypingMessage] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const flashTimeoutRef = useRef(null);
  const currentTypingMessageRef = useRef(null);
  const isProcessingRef = useRef(false);
  
  // Generate or retrieve user ID
  const userId = localStorage.getItem('chatUserId') || 'user-' + Date.now();

  // Configure axios with base URL
  const apiClient = axios.create({
    baseURL: BACKEND_CONFIG.baseURL,
    timeout: 10000, // 10 second timeout
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add request interceptor for logging
  apiClient.interceptors.request.use(
    (config) => {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        data: config.data
      });
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  apiClient.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.data);
      setConnectionError(false);
      return response;
    },
    (error) => {
      console.error('API Response Error:', error);
      setConnectionError(true);
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    localStorage.setItem('chatUserId', userId);
    
    const loadChatHistory = async () => {
      try {
        console.log('Loading chat history for user:', userId);
        // Adjust the endpoint based on your backend structure
        const response = await apiClient.get(`${BACKEND_CONFIG.endpoints.chatHistory}/${userId}`);
        console.log('Chat history loaded:', response.data);
        
        if (response.data.messages) {
          setMessages(response.data.messages);
        }
        setConnectionError(false);
      } catch (error) {
        console.error('Error loading chat history:', error);
        setConnectionError(true);
        // Don't show error for history loading failure - just start fresh
      }
    };
    
    loadChatHistory();
  }, [userId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText, showTypingMessage, scrollToBottom]);

  // Simplified typing effect
  useEffect(() => {
    const lastBotMessage = messages.filter(msg => msg.sender === 'bot').slice(-1)[0];
    
    if (lastBotMessage && isTyping && lastBotMessage !== currentTypingMessageRef.current) {
      currentTypingMessageRef.current = lastBotMessage;
      
      // Clear any existing interval
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      
      let i = 0;
      const fullText = lastBotMessage.text;
      setDisplayedText("");
      
      typingIntervalRef.current = setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText(fullText.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingIntervalRef.current);
          setIsTyping(false);
          currentTypingMessageRef.current = null;
        }
      }, 30);
    }
  }, [messages, isTyping]);

  const triggerFlashEffect = useCallback((type) => {
    // Prevent multiple flash effects
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
    }

    switch(type) {
      case 'user-message':
        setFlashEffect('user-flash');
        setInputFlash(true);
        flashTimeoutRef.current = setTimeout(() => {
          setFlashEffect('');
          setInputFlash(false);
        }, 600);
        break;
      case 'bot-response':
        setHeaderFlash(true);
        setFlashEffect('bot-flash');
        flashTimeoutRef.current = setTimeout(() => {
          setHeaderFlash(false);
          setFlashEffect('');
        }, 800);
        break;
      case 'suggestion-click':
        if (!isProcessingRef.current) {
          setFlashEffect('suggestion-flash');  
          flashTimeoutRef.current = setTimeout(() => setFlashEffect(''), 500);
        }
        break;
      case 'redirect-flash':
        setFlashEffect('redirect-flash');
        flashTimeoutRef.current = setTimeout(() => setFlashEffect(''), 600);
        break;
      default:
        break;
    }
  }, []);

  const handleRedirection = useCallback((url) => {
    triggerFlashEffect('redirect-flash');
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }, [triggerFlashEffect]);

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    if (messageText.toLowerCase().includes('need other help') || 
        messageText.toLowerCase().includes('need more help')) {
      const helpPageUrl = '/help';
      handleRedirection(helpPageUrl);
      isProcessingRef.current = false;
      return;
    }
    
    // Single flash effect
    triggerFlashEffect('user-message');
    
    const userMessage = { text: messageText, sender: 'user', id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowTypingMessage(true);
    
    const responseDelay = Math.random() * 1500 + 1500;
    
    setTimeout(async () => {
      try {
        console.log('Sending message to backend:', messageText);
        
        // Prepare request body according to your backend API format
        const requestBody = {
          message: messageText,
          user_id: userId // Match your backend's expected format
        };
        
        // Make API call to your backend
        const response = await apiClient.post(BACKEND_CONFIG.endpoints.chat, requestBody);
        
        console.log('Received response from backend:', response.data);
        
        setShowTypingMessage(false);
        setIsLoading(false);
        setConnectionError(false);
        
        // Extract response text based on your backend response format
        let botResponseText;
        
        if (response.data.response) {
          // Your backend returns { "response": "..." }
          botResponseText = response.data.response;
        } else if (response.data.reply) {
          // Alternative format
          botResponseText = response.data.reply;
        } else {
          throw new Error('No response text in backend reply');
        }
        
        if (botResponseText) {
          triggerFlashEffect('bot-response');
          
          const botMessage = { 
            text: botResponseText, 
            sender: 'bot',
            id: Date.now() + 1,
            // Store additional metadata if needed
            intent: response.data.intent,
            sub_intent: response.data.sub_intent
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(true);
        } else {
          throw new Error('Empty response from backend');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        
        setShowTypingMessage(false);
        setIsLoading(false);
        setConnectionError(true);
        
        // Handle different types of errors
        let errorMessage;
        
        if (error.code === 'ECONNABORTED') {
          errorMessage = "Request timed out. Please check your connection and try again.";
        } else if (error.response) {
          // Server responded with error status
          errorMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        `Server error: ${error.response.status}`;
        } else if (error.request) {
          // Network error
          errorMessage = "Unable to connect to server. Please check your connection.";
        } else {
          // Other error
          errorMessage = error.message || "An unexpected error occurred. Please try again.";
        }
        
        setMessages(prev => [...prev, { 
          text: errorMessage, 
          sender: 'bot',
          id: Date.now() + 1,
          isError: true
        }]);
        
        triggerFlashEffect('bot-response');
      } finally {
        isProcessingRef.current = false;
      }
    }, responseDelay);
  }, [userId, triggerFlashEffect, handleRedirection]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  const handleSuggestedQuery = useCallback((query) => {
    if (isProcessingRef.current) return;
    
    if (query.toLowerCase().includes('need other help') || 
        query.toLowerCase().includes('need more help')) {
      
      triggerFlashEffect('suggestion-click');
      setTimeout(() => {
        const helpPageUrl = '/help';
        handleRedirection(helpPageUrl);
      }, 100);
      return;
    }

    triggerFlashEffect('suggestion-click');
    setTimeout(() => {
      sendMessage(query);
    }, 100);
  }, [triggerFlashEffect, handleRedirection, sendMessage]);

  const toggleChat = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setFlashEffect('chat-open');
        setTimeout(() => setFlashEffect(''), 600);
      }, 100);
    }
  }, [isOpen]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) {
    return (
      <button onClick={toggleChat} className="chat-widget-button">
        <div className="chatbot-logo">
          <div className="robot-container">
            <div className="robot-antenna">
              <div className="antenna-ball"></div>
            </div>
            <div className="robot-head">
              <div className="robot-face">
                <div className="robot-eye left-robot-eye"></div>
                <div className="robot-eye right-robot-eye"></div>
              </div>
            </div>
            <div className="robot-body"></div>
          </div>
          <div className="speech-bubble">
            <span>HI!</span>
          </div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring-2"></div>
        </div>
      </button>
    );
  }

  return (
    <div className={`chatbot-container ${flashEffect}`}>
      {/* Connection Status Indicator */}
      {connectionError && (
        <div className="connection-status error">
          <span>⚠️ Connection issue - responses may be delayed</span>
        </div>
      )}
      
      <div className={`chatbot-header procurement-header ${headerFlash ? 'header-flash' : ''}`}>
        <div className="header-left">
          <FaShoppingCart className="bot-icon" />
          <h3>Procurement Assistant</h3>
        </div>
        <button className="close-button" onClick={toggleChat}>
          <FaTimes />
        </button>
      </div>
      
      <div className="chatbot-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h4>Hello! I'm your Procurement Assistant</h4>
            <p>I can help with supplier management, contracts, RFPs, and more.</p>
            <div className="suggested-queries">
              <p className="suggested-title">Try asking about:</p>
              {SUGGESTED_QUERIES.map((query, index) => (
                <button 
                  key={index} 
                  className={`suggested-query-btn ${
                    query.toLowerCase().includes('need other help') ? 'help-redirect-btn' : ''
                  }`}
                  onClick={() => handleSuggestedQuery(query)}
                  disabled={isProcessingRef.current}
                >
                  {query.toLowerCase().includes('need other help') && (
                    <FaExternalLinkAlt style={{ marginRight: '5px', fontSize: '11px' }} />
                  )}
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`message ${msg.sender} ${msg.isError ? 'error-message' : ''}`}>
            <div className="message-icon">
              {msg.sender === 'user' ? 
                <FaUser /> : 
                <FaShoppingCart />
              }
            </div>
            <div className="message-text">
              {msg.sender === 'bot' && index === messages.length - 1 && isTyping
                ? displayedText
                : msg.text}
            </div>
          </div>
        ))}
        
        {showTypingMessage && (
          <div className="message bot typing-message">
            <div className="message-icon typing-icon">
              <FaShoppingCart />
            </div>
            <div className="message-text typing-text">
              <div className="typing-indicator-enhanced">
                <span className="typing-text-label">Typing</span>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {messages.length > 0 && !isLoading && !showTypingMessage && (
          <div className="procurement-shortcuts">
            <div className="shortcuts-title">Quick Procurement Topics:</div>
            <div className="shortcuts-buttons">
              <button onClick={() => handleSuggestedQuery("Supplier evaluation best practices")}>
                <FaClipboardList /> Supplier Evaluation
              </button>
              <button onClick={() => handleSuggestedQuery("Contract management tips")}>
                <FaFileContract /> Contracts
              </button>
              <button onClick={() => handleSuggestedQuery("RFP process optimization")}>
                <FaQuestionCircle /> RFP Process
              </button>
              <button 
                onClick={() => handleSuggestedQuery("need other help?")}
                className="help-redirect-shortcut"
              >
                <FaExternalLinkAlt /> More Help
              </button>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className={`chatbot-input ${inputFlash ? 'input-flash' : ''}`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={connectionError ? "Connection issue - please try again..." : "Ask about procurement processes..."}
          disabled={isLoading || showTypingMessage}
        />
        <button type="submit" disabled={isLoading || showTypingMessage}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatBot;