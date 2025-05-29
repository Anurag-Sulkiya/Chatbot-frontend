// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';
// import { FaPaperPlane, FaRobot, FaUser, FaTimes, FaComments, FaShoppingCart, FaFileContract, FaClipboardList, FaQuestionCircle, FaExternalLinkAlt } from 'react-icons/fa';
// import './ChatBot.css';
// import logo from "../assets/Images/logo.png"

// // Backend configuration
// const BACKEND_CONFIG = {
//   baseURL: 'http://localhost:5000', // Change this to your backend URL
//   endpoints: {
//     chat: '/api/chat',
//     chatHistory: '/api/chat' // If you have separate endpoint for history
//   }
// };

// // Procurement-specific suggested queries
// const SUGGESTED_QUERIES = [
//   "Intake form",
//   "Supplier Onboarding",
//   "PO",
//   "CONTRACT",
//   "RFX",
//   "E-Auction",
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
//   const [connectionError, setConnectionError] = useState(false);
  
//   const messagesEndRef = useRef(null);
//   const typingIntervalRef = useRef(null);
//   const flashTimeoutRef = useRef(null);
//   const currentTypingMessageRef = useRef(null);
//   const isProcessingRef = useRef(false);
  
//   // Generate or retrieve user ID
//   const userId = localStorage.getItem('chatUserId') || 'user-' + Date.now();

//   // Configure axios with base URL
//   const apiClient = axios.create({
//     baseURL: BACKEND_CONFIG.baseURL,
//     timeout: 10000, // 10 second timeout
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   // Add request interceptor for logging
//   apiClient.interceptors.request.use(
//     (config) => {
//       console.log('API Request:', {
//         url: config.url,
//         method: config.method,
//         data: config.data
//       });
//       return config;
//     },
//     (error) => {
//       console.error('API Request Error:', error);
//       return Promise.reject(error);
//     }
//   );

//   // Add response interceptor for error handling
//   apiClient.interceptors.response.use(
//     (response) => {
//       console.log('API Response:', response.data);
//       setConnectionError(false);
//       return response;
//     },
//     (error) => {
//       console.error('API Response Error:', error);
//       setConnectionError(true);
//       return Promise.reject(error);
//     }
//   );

//   useEffect(() => {
//     localStorage.setItem('chatUserId', userId);
    
//     const loadChatHistory = async () => {
//       try {
//         console.log('Loading chat history for user:', userId);
//         // Adjust the endpoint based on your backend structure
//         const response = await apiClient.get(`${BACKEND_CONFIG.endpoints.chatHistory}/${userId}`);
//         console.log('Chat history loaded:', response.data);
        
//         if (response.data.messages) {
//           setMessages(response.data.messages);
//         }
//         setConnectionError(false);
//       } catch (error) {
//         console.error('Error loading chat history:', error);
//         setConnectionError(true);
//         // Don't show error for history loading failure - just start fresh
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
        
//         // Prepare request body according to your backend API format
//         const requestBody = {
//           message: messageText,
//           user_id: userId // Match your backend's expected format
//         };
        
//         // Make API call to your backend
//         const response = await apiClient.post(BACKEND_CONFIG.endpoints.chat, requestBody);
        
//         console.log('Received response from backend:', response.data);
        
//         setShowTypingMessage(false);
//         setIsLoading(false);
//         setConnectionError(false);
        
//         // Extract response text based on your backend response format
//         let botResponseText;
        
//         if (response.data.response) {
//           // Your backend returns { "response": "..." }
//           botResponseText = response.data.response;
//         } else if (response.data.reply) {
//           // Alternative format
//           botResponseText = response.data.reply;
//         } else {
//           throw new Error('No response text in backend reply');
//         }
        
//         if (botResponseText) {
//           triggerFlashEffect('bot-response');
          
//           const botMessage = { 
//             text: botResponseText, 
//             sender: 'bot',
//             id: Date.now() + 1,
//             // Store additional metadata if needed
//             intent: response.data.intent,
//             sub_intent: response.data.sub_intent
//           };
//           setMessages(prev => [...prev, botMessage]);
//           setIsTyping(true);
//         } else {
//           throw new Error('Empty response from backend');
//         }
//       } catch (error) {
//         console.error('Error sending message:', error);
        
//         setShowTypingMessage(false);
//         setIsLoading(false);
//         setConnectionError(true);
        
//         // Handle different types of errors
//         let errorMessage;
        
//         if (error.code === 'ECONNABORTED') {
//           errorMessage = "Request timed out. Please check your connection and try again.";
//         } else if (error.response) {
//           // Server responded with error status
//           errorMessage = error.response.data?.error || 
//                         error.response.data?.message || 
//                         `Server error: ${error.response.status}`;
//         } else if (error.request) {
//           // Network error
//           errorMessage = "Unable to connect to server. Please check your connection.";
//         } else {
//           // Other error
//           errorMessage = error.message || "An unexpected error occurred. Please try again.";
//         }
        
//         setMessages(prev => [...prev, { 
//           text: errorMessage, 
//           sender: 'bot',
//           id: Date.now() + 1,
//           isError: true
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
//       {/* Connection Status Indicator */}
//       {connectionError && (
//         <div className="connection-status error">
//           <span>⚠️ Connection issue - responses may be delayed</span>
//         </div>
//       )}
      
//       <div className={`chatbot-header procurement-header ${headerFlash ? 'header-flash' : ''}`}>
//         <div className="header-left">
//           {/* <FaShoppingCart className="bot-icon" /> */}
//           <img src={logo} alt="ProcMitra Logo" className="company-logo" />
//           <h3>ProcMitra Assistant</h3>
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
//           <div key={msg.id || index} className={`message ${msg.sender} ${msg.isError ? 'error-message' : ''}`}>
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
//           placeholder={connectionError ? "Connection issue - please try again..." : "Ask about procurement processes..."}
//           disabled={isLoading || showTypingMessage}
//         />
//         <button type="submit" disabled={isLoading || showTypingMessage}>
//           <FaPaperPlane/>
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBot;



// Updated ChatBot.jsx - Fix API Integration

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser, FaTimes, FaComments, FaShoppingCart, FaFileContract, FaClipboardList, FaQuestionCircle, FaExternalLinkAlt } from 'react-icons/fa';
import './ChatBot.css';
import logo from "../assets/Images/logo.png"

// Backend configuration
const BACKEND_CONFIG = {
  baseURL: 'http://localhost:5000',
  endpoints: {
    chat: '/api/chat',
  }
};

// Updated procurement-specific suggested queries aligned with backend intents
const SUGGESTED_QUERIES = [
  "Hi there!",
  "How to raise a PR?",
  "Vendor onboarding process", 
  "Dashboard overview",
  "Submit intake form",
  "Check PO status",
  "Search for suppliers",
  "Need other help?"
];

const ChatBot = () => {
  // All your existing state variables remain the same
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
  
  // User management - NEW ADDITIONS
  const [userName, setUserName] = useState('');
  const [userPermissions, setUserPermissions] = useState({});
  
  // Initialize user data
  useEffect(() => {
    // Get or set user name
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    } else {
      const defaultName = 'User'; // You can prompt user for name or get from login
      setUserName(defaultName);
      localStorage.setItem('userName', defaultName);
    }
    
    // Get or set user permissions
    const storedPermissions = localStorage.getItem('userPermissions');
    if (storedPermissions) {
      setUserPermissions(JSON.parse(storedPermissions));
    } else {
      // Default permissions - adjust based on your user roles
      const defaultPermissions = {
        "Intake form": { "Create": true, "View": true, "Edit": false },
        "Supplier Onboarding": { "Create": false, "View": true, "Approve": false },
        "PO": { "View": true, "Approve": false, "Edit": false },
        "CONTRACT": { "View": true, "Create": false },
        "RFX": { "View": true, "Create": false, "Approve": false },
        "E-Auction": { "View": true, "Create": false, "Edit": false }
      };
      setUserPermissions(defaultPermissions);
      localStorage.setItem('userPermissions', JSON.stringify(defaultPermissions));
    }
  }, []);
  
  // Configure axios with base URL
  const apiClient = axios.create({
    baseURL: BACKEND_CONFIG.baseURL,
    timeout: 10000,
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

  // All your existing useEffect hooks remain the same...
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText, showTypingMessage, scrollToBottom]);

  // Simplified typing effect - keep existing
  useEffect(() => {
    const lastBotMessage = messages.filter(msg => msg.sender === 'bot').slice(-1)[0];
    
    if (lastBotMessage && isTyping && lastBotMessage !== currentTypingMessageRef.current) {
      currentTypingMessageRef.current = lastBotMessage;
      
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

  // Keep all your existing triggerFlashEffect and handleRedirection functions...
  const triggerFlashEffect = useCallback((type) => {
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

  // UPDATED sendMessage function - MAIN FIX HERE
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
        console.log('User name:', userName);
        console.log('User permissions:', userPermissions);
        
        // FIXED: Send data in the format backend expects
        const requestBody = {
          message: messageText,
          name: userName,
          permissions: userPermissions
        };
        
        const response = await apiClient.post(BACKEND_CONFIG.endpoints.chat, requestBody);
        
        console.log('Received response from backend:', response.data);
        
        setShowTypingMessage(false);
        setIsLoading(false);
        setConnectionError(false);
        
        // Handle the backend response format
        let botResponseText;
        let botMessageData = {};
        
        if (response.data.success !== false) {
          // Successful response
          botResponseText = response.data.message;
          botMessageData = {
            text: botResponseText,
            sender: 'bot',
            id: Date.now() + 1,
            // Store all the rich data from backend
            intent: response.data.intent,
            sub_intent: response.data.sub_intent,
            hasPermission: response.data.hasPermission,
            steps: response.data.steps,
            tips: response.data.tips,
            features: response.data.features,
            navigation: response.data.navigation,
            type: response.data.type,
            permissions: response.data.permissions,
            isGeneralQuery: response.data.isGeneralQuery
          };
        } else {
          // Error response
          botResponseText = response.data.message || "I'm sorry, I couldn't process your request.";
          botMessageData = {
            text: botResponseText,
            sender: 'bot',
            id: Date.now() + 1,
            isError: true,
            type: 'error',
            info: response.data.info,
            requiredPermissions: response.data.requiredPermissions
          };
        }
        
        if (botResponseText) {
          triggerFlashEffect('bot-response');
          setMessages(prev => [...prev, botMessageData]);
          setIsTyping(true);
        } else {
          throw new Error('Empty response from backend');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        
        setShowTypingMessage(false);
        setIsLoading(false);
        setConnectionError(true);
        
        let errorMessage;
        
        if (error.code === 'ECONNABORTED') {
          errorMessage = "Request timed out. Please check your connection and try again.";
        } else if (error.response) {
          errorMessage = error.response.data?.message || 
                       `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = "Unable to connect to server. Please check your connection.";
        } else {
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
  }, [userName, userPermissions, triggerFlashEffect, handleRedirection]);

  // Keep all your existing handler functions...
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

  // Helper function to render rich message content
  const renderMessageContent = (msg, index) => {
    const isLastBotMessage = msg.sender === 'bot' && index === messages.length - 1;
    const displayText = isLastBotMessage && isTyping ? displayedText : msg.text;
    
    return (
      <div className="message-content">
        <div className="message-text">{displayText}</div>
        
        {/* Render steps if available */}
        {msg.sender === 'bot' && !isTyping && msg.steps && msg.steps.length > 0 && (
          <div className="message-steps">
            <h4>Steps:</h4>
            <ol>
              {msg.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        
        {/* Render tips if available */}
        {msg.sender === 'bot' && !isTyping && msg.tips && msg.tips.length > 0 && (
          <div className="message-tips">
            <h4>Tips:</h4>
            <ul>
              {msg.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Render features if available */}
        {msg.sender === 'bot' && !isTyping && msg.features && msg.features.length > 0 && (
          <div className="message-features">
            <h4>Features:</h4>
            <ul>
              {msg.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Render navigation button if available */}
        {msg.sender === 'bot' && !isTyping && msg.navigation && (
          <div className="message-navigation">
            <button 
              className="navigation-button"
              onClick={() => handleRedirection(msg.navigation.path)}
            >
              <FaExternalLinkAlt /> {msg.navigation.button_text}
            </button>
          </div>
        )}
        
        {/* Show permission info for access denied messages */}
        {msg.sender === 'bot' && msg.type === 'error' && msg.info && (
          <div className="message-info">
            <p><strong>Info:</strong> {msg.info}</p>
          </div>
        )}
        
        {/* Show required permissions */}
        {msg.sender === 'bot' && msg.requiredPermissions && (
          <div className="required-permissions">
            <p><strong>Required Permission:</strong> {msg.requiredPermissions.module} - {msg.requiredPermissions.action}</p>
          </div>
        )}
      </div>
    );
  };

  // Rest of your component remains exactly the same...
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
      {connectionError && (
        <div className="connection-status error">
          <span>⚠️ Connection issue - responses may be delayed</span>
        </div>
      )}
      
      <div className={`chatbot-header procurement-header ${headerFlash ? 'header-flash' : ''}`}>
        <div className="header-left">
          <img src={logo} alt="ProcMitra Logo" className="company-logo" />
          <h3>ProcMitra Assistant</h3>
        </div>
        <button className="close-button" onClick={toggleChat}>
          <FaTimes />
        </button>
      </div>
      
      <div className="chatbot-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h4>Hello {userName}! I'm your Procurement Assistant</h4>
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
            {renderMessageContent(msg, index)}
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
              <button onClick={() => handleSuggestedQuery("How to raise a PR?")}>
                <FaClipboardList /> Raise PR
              </button>
              <button onClick={() => handleSuggestedQuery("Check PO status")}>
                <FaFileContract /> PO Status
              </button>
              <button onClick={() => handleSuggestedQuery("Search for suppliers")}>
                <FaQuestionCircle /> Suppliers
              </button>
              <button 
                onClick={() => handleSuggestedQuery("Need other help?")}
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
          <FaPaperPlane/>
        </button>
      </form>
    </div>
  );
};

export default ChatBot;