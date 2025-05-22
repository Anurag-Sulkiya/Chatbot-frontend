// // import { useState } from 'react'
// // import ChatBot from "./components/ChatBot"
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //      <ChatBot/> 
// //     </>
// //   )
// // }

// // export default App



// import React from 'react';
// import './App.css';
// import ChatBot from './components/ChatBot';

// function App() {
//   return (
//     <div className="App">
//       {/* <header className="app-header">
//         <div className="container">
//           <h1>Welcome to My AI Assistant</h1>
//           <p>Ask me anything and I'll try to help!</p>
//         </div>
//       </header>
      
//       <main>
//         <div className="container">
//           <div className="features">
//             <div className="feature">
//               <h2>Instant Answers</h2>
//               <p>Get quick responses to your questions using advanced AI technology.</p>
//             </div>
//             <div className="feature">
//               <h2>24/7 Availability</h2>
//               <p>Our AI assistant is always available to help whenever you need it.</p>
//             </div>
//             <div className="feature">
//               <h2>Personalized Experience</h2>
//               <p>Your conversations are saved for a more personalized experience.</p>
//             </div>
//           </div>
//         </div>
//       </main>
      
//       <footer>
//         <div className="container">
//           <p>&copy; {new Date().getFullYear()} AI Assistant. All rights reserved.</p>
//         </div>
//       </footer> */}
      
//       {/* ChatBot component will appear as a widget */}
//       <ChatBot />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import './App.css';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="App">
      
      
      {/* ChatBot component will appear as a widget */}
      <ChatBot />
    </div>
  );
}

export default App;