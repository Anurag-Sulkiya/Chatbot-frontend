// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { FaPaperPlane, FaRobot, FaUser, FaTimes, FaComments, FaShoppingCart, FaFileContract, FaClipboardList, FaQuestionCircle } from 'react-icons/fa';
// import './ChatBot.css';

// // Procurement-specific suggested queries
// const SUGGESTED_QUERIES = [
//   "How can I optimize my supplier selection process?",
//   "What are best practices for contract negotiation?",
//   "How do I create an effective RFP?",
//   "What KPIs should I track for procurement?",
//   "How can I reduce procurement costs?",
//   "What is the 3-way matching process?"
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
//   const messagesEndRef = useRef(null);
//   const userId = localStorage.getItem('chatUserId') || 'user-' + Date.now();

//   useEffect(() => {
//     // Save user ID
//     localStorage.setItem('chatUserId', userId);
    
//     // Load chat history
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

//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, displayedText]);

//   // Typing effect when a new message arrives
//   useEffect(() => {
//     // Get the latest bot message
//     const lastBotMessage = messages.filter(msg => msg.sender === 'bot').slice(-1)[0];
    
//     if (lastBotMessage && isTyping) {
//       let i = 0;
//       const fullText = lastBotMessage.text;
      
//       // Reset displayed text
//       setDisplayedText("");
      
//       // Simulate typing with increasing speed as the message gets longer
//       const typingInterval = setInterval(() => {
//         if (i < fullText.length) {
//           setDisplayedText(prev => prev + fullText.charAt(i));
//           i++;
          
//           // Increase typing speed as the message progresses
//           if (i > 50) {
//             clearInterval(typingInterval);
//             const fasterInterval = setInterval(() => {
//               if (i < fullText.length) {
//                 setDisplayedText(prev => prev + fullText.charAt(i));
//                 i++;
//               } else {
//                 clearInterval(fasterInterval);
//                 setIsTyping(false);
//                 // Flash effect when typing is complete
//                 triggerFlashEffect('message-complete');
//               }
//             }, 10); // Much faster typing for the rest
//           }
//         } else {
//           clearInterval(typingInterval);
//           setIsTyping(false);
//           // Flash effect when typing is complete
//           triggerFlashEffect('message-complete');
//         }
//       }, 30); // Base typing speed
      
//       return () => {
//         clearInterval(typingInterval);
//       };
//     }
//   }, [messages, isTyping]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const triggerFlashEffect = (type) => {
//     switch(type) {
//       case 'user-message':
//         setFlashEffect('user-flash');
//         setInputFlash(true);
//         setTimeout(() => {
//           setFlashEffect('');
//           setInputFlash(false);
//         }, 600);
//         break;
//       case 'bot-response':
//         setHeaderFlash(true);
//         setFlashEffect('bot-flash');
//         setTimeout(() => {
//           setHeaderFlash(false);
//           setFlashEffect('');
//         }, 800);
//         break;
//       case 'message-complete':
//         setFlashEffect('complete-flash');
//         setTimeout(() => setFlashEffect(''), 400);
//         break;
//       case 'suggestion-click':
//         setFlashEffect('suggestion-flash');  
//         setTimeout(() => setFlashEffect(''), 500);
//         break;
//       default:
//         break;
//     }
//   };

//   const sendMessage = async (messageText) => {
//     if (!messageText.trim()) return;
    
//     // Trigger flash effect for user message
//     triggerFlashEffect('user-message');
    
//     // Add user message to UI immediately
//     const userMessage = { text: messageText, sender: 'user' };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);
    
//     try {
//       console.log('Sending message to backend:', messageText);
//       // Send to backend
//       const response = await axios.post(`/api/chat/${userId}`, {
//         message: messageText
//       });
      
//       console.log('Received response from backend:', response.data);
      
//       // Add bot response with typing effect
//       if (response.data.reply) {
//         // Trigger flash effect for bot response
//         triggerFlashEffect('bot-response');
        
//         const botMessage = { 
//           text: response.data.reply, 
//           sender: 'bot' 
//         };
//         setMessages(prev => [...prev, botMessage]);
//         setIsTyping(true);
//       } else {
//         throw new Error('No reply in response');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       console.error('Response data:', error.response?.data);
      
//       // Get the error message from the response if available
//       const errorMessage = error.response?.data?.reply || 
//                           "Sorry, I couldn't process that procurement query. Please try again later.";
      
//       setMessages(prev => [...prev, { 
//         text: errorMessage, 
//         sender: 'bot' 
//       }]);
      
//       // Flash effect for error
//       triggerFlashEffect('bot-response');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     sendMessage(input);
//   };

//   const handleSuggestedQuery = (query) => {
//     triggerFlashEffect('suggestion-click');
//     setTimeout(() => {
//       sendMessage(query);
//     }, 100);
//   };

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//     if (!isOpen) {
//       // Flash effect when opening chat
//       setTimeout(() => {
//         setFlashEffect('chat-open');
//         setTimeout(() => setFlashEffect(''), 600);
//       }, 100);
//     }
//   };

//   // Chat widget when closed
//   if (!isOpen) {
//     return (
//       <button onClick={toggleChat} className="chat-widget-button">
//         <div className="chatbot-logo">
//           <div className="bot-head">
//             <div className="bot-eyes">
//               <div className="eye left-eye"></div>
//               <div className="eye right-eye"></div>
//             </div>
//             <div className="bot-mouth"></div>
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
//                   className="suggested-query-btn"
//                   onClick={() => handleSuggestedQuery(query)}
//                 >
//                   {query}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender} ${
//             msg.sender === 'bot' && index === messages.length - 1 && isTyping ? 'typing-flash' : ''
//           }`}>
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
        
//         {isLoading && (
//           <div className="message bot loading loading-flash">
//             <div className="message-icon"><FaShoppingCart /></div>
//             <div className="message-text">
//               <div className="typing-indicator">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {messages.length > 0 && !isLoading && (
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
//         />
//         <button type="submit" disabled={isLoading}>
//           <FaPaperPlane />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBot;



import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser, FaTimes, FaComments, FaShoppingCart, FaFileContract, FaClipboardList, FaQuestionCircle } from 'react-icons/fa';
import './ChatBot.css';

// Procurement-specific suggested queries
const SUGGESTED_QUERIES = [
  "How can I optimize my supplier selection process?",
  "What are best practices for contract negotiation?",
  "How do I create an effective RFP?",
  "What KPIs should I track for procurement?",
  "How can I reduce procurement costs?",
  "What is the 3-way matching process?"
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
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem('chatUserId') || 'user-' + Date.now();

  useEffect(() => {
    // Save user ID
    localStorage.setItem('chatUserId', userId);
    
    // Load chat history
    const loadChatHistory = async () => {
      try {
        console.log('Loading chat history...');
        const response = await axios.get(`/api/chat/${userId}`);
        console.log('Chat history loaded:', response.data);
        if (response.data.messages) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    
    loadChatHistory();
  }, [userId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText]);

  // Typing effect when a new message arrives
  useEffect(() => {
    // Get the latest bot message
    const lastBotMessage = messages.filter(msg => msg.sender === 'bot').slice(-1)[0];
    
    if (lastBotMessage && isTyping) {
      let i = 0;
      const fullText = lastBotMessage.text;
      
      // Reset displayed text
      setDisplayedText("");
      
      // Simulate typing with increasing speed as the message gets longer
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText(prev => prev + fullText.charAt(i));
          i++;
          
          // Increase typing speed as the message progresses
          if (i > 50) {
            clearInterval(typingInterval);
            const fasterInterval = setInterval(() => {
              if (i < fullText.length) {
                setDisplayedText(prev => prev + fullText.charAt(i));
                i++;
              } else {
                clearInterval(fasterInterval);
                setIsTyping(false);
                // Flash effect when typing is complete
                triggerFlashEffect('message-complete');
              }
            }, 10); // Much faster typing for the rest
          }
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          // Flash effect when typing is complete
          triggerFlashEffect('message-complete');
        }
      }, 30); // Base typing speed
      
      return () => {
        clearInterval(typingInterval);
      };
    }
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerFlashEffect = (type) => {
    switch(type) {
      case 'user-message':
        setFlashEffect('user-flash');
        setInputFlash(true);
        setTimeout(() => {
          setFlashEffect('');
          setInputFlash(false);
        }, 600);
        break;
      case 'bot-response':
        setHeaderFlash(true);
        setFlashEffect('bot-flash');
        setTimeout(() => {
          setHeaderFlash(false);
          setFlashEffect('');
        }, 800);
        break;
      case 'message-complete':
        setFlashEffect('complete-flash');
        setTimeout(() => setFlashEffect(''), 400);
        break;
      case 'suggestion-click':
        setFlashEffect('suggestion-flash');  
        setTimeout(() => setFlashEffect(''), 500);
        break;
      default:
        break;
    }
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    
    // Trigger flash effect for user message
    triggerFlashEffect('user-message');
    
    // Add user message to UI immediately
    const userMessage = { text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      console.log('Sending message to backend:', messageText);
      // Send to backend
      const response = await axios.post(`/api/chat/${userId}`, {
        message: messageText
      });
      
      console.log('Received response from backend:', response.data);
      
      // Add bot response with typing effect
      if (response.data.reply) {
        // Trigger flash effect for bot response
        triggerFlashEffect('bot-response');
        
        const botMessage = { 
          text: response.data.reply, 
          sender: 'bot' 
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(true);
      } else {
        throw new Error('No reply in response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Response data:', error.response?.data);
      
      // Get the error message from the response if available
      const errorMessage = error.response?.data?.reply || 
                          "Sorry, I couldn't process that procurement query. Please try again later.";
      
      setMessages(prev => [...prev, { 
        text: errorMessage, 
        sender: 'bot' 
      }]);
      
      // Flash effect for error
      triggerFlashEffect('bot-response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedQuery = (query) => {
    triggerFlashEffect('suggestion-click');
    setTimeout(() => {
      sendMessage(query);
    }, 100);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Flash effect when opening chat
      setTimeout(() => {
        setFlashEffect('chat-open');
        setTimeout(() => setFlashEffect(''), 600);
      }, 100);
    }
  };

  // Chat widget when closed
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
                  className="suggested-query-btn"
                  onClick={() => handleSuggestedQuery(query)}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender} ${
            msg.sender === 'bot' && index === messages.length - 1 && isTyping ? 'typing-flash' : ''
          }`}>
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
        
        {isLoading && (
          <div className="message bot loading loading-flash">
            <div className="message-icon"><FaShoppingCart /></div>
            <div className="message-text">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        {messages.length > 0 && !isLoading && (
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
          placeholder="Ask about procurement processes..."
        />
        <button type="submit" disabled={isLoading}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatBot;