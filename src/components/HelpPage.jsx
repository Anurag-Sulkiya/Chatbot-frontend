import React from 'react';
import { 
  FaBox, 
  FaUndo, 
  FaHome, 
  FaCrown, 
  FaCreditCard, 
  FaCog, 
  FaTablet, 
  FaShippingFast, 
  FaDollarSign, 
  FaMobileAlt, 
  FaWrench, 
  FaStore, 
  FaClipboardList, 
  FaShoppingCart, 
  FaUser, 
  FaDesktop, 
  FaQuestionCircle, 
  FaPlay,
  FaChevronRight
} from 'react-icons/fa';
import './HelpPage.css';

const HelpPage = () => {
  const quickActions = [
    {
      icon: <FaBox />,
      title: "Your Orders",
      subtitle: "Track packages",
      description: "Edit or cancel orders"
    },
    {
      icon: <FaUndo />,
      title: "Returns and Refunds",
      subtitle: "Return or exchange items",
      description: "Print return mailing labels"
    },
    {
      icon: <FaHome />,
      title: "Manage Addresses",
      subtitle: "Update your addresses",
      description: "Add address, landmark details"
    },
    {
      icon: <FaCrown />,
      title: "Manage Prime",
      subtitle: "View your benefits",
      description: "Membership details"
    },
    {
      icon: <FaCreditCard />,
      title: "Payment Settings",
      subtitle: "Add or edit payment methods",
      description: "Change expired debit or credit card"
    },
    {
      icon: <FaCog />,
      title: "Account Settings",
      subtitle: "Change your email or password",
      description: "Update login information"
    },
    {
      icon: <FaTablet />,
      title: "Digital Services and Device Support",
      subtitle: "Find device help and support",
      description: "Troubleshoot device issues"
    }
  ];

  const recommendedTopics = [
    "Recommended Topics",
    "Shipping & Delivery", 
    "Amazon Prime",
    "Payments & Pricing",
    "Amazon Pay",
    "Product Troubleshooting",
    "Amazon Bazaar",
    "Returns, Refunds, Replacement",
    "Ordering",
    "Managing Your Account",
    "Devices & Digital Services (D2S)",
    "More Help (D2S)",
    "Amazon Business",
    "Other Topics & More Help",
    "Self Service"
  ];

  const learnHowToLinks = [
    { text: "Tracking your Package", icon: <FaBox /> },
    { text: "Checking the Status of your Refund", icon: <FaDollarSign /> },
    { text: "Return Pick-up Issues", icon: <FaUndo /> },
    { text: "Returns and Replacements - FAQ", icon: <FaQuestionCircle /> },
    { text: "Shipping Speeds & Charges", icon: <FaShippingFast /> },
    { text: "Damaged and Defective Products - FAQ", icon: <FaWrench /> },
    { text: "Late Shipments", icon: <FaShippingFast /> },
    { text: "Cancelling an Item or Order", icon: <FaShoppingCart /> },
    { text: "Amazon Bazaar", icon: <FaStore /> },
    { text: "(available on Android Amazon shopping app only)", icon: <FaMobileAlt /> },
    { text: "Product Troubleshooting - FAQs", icon: <FaWrench /> },
    { text: "Self-service video library", icon: <FaPlay /> },
    { text: "Need more help", icon: <FaQuestionCircle /> }
  ];

  const tryItYourselfLinks = [
    { text: "Track your order", icon: <FaBox /> },
    { text: "Check the Status of your Refund", icon: <FaDollarSign /> },
    { text: "Change Your Language Preference", icon: <FaCog /> },
    { text: "Manage Your Returns", icon: <FaUndo /> },
    { text: "Sign Up for Amazon Prime", icon: <FaCrown /> },
    { text: "Using Amazon Pay balance", icon: <FaCreditCard /> },
    { text: "View Amazon Pay Transactions", icon: <FaClipboardList /> },
    { text: "Manage Your Payment Methods", icon: <FaCreditCard /> }
  ];

  return (
    <div className="help-page">
      <div className="help-container">
        <header className="help-header">
          <h1>Hi,What can we help you with?</h1>
        </header>

        <section className="quick-actions-section">
          <h2>Some things you can do here</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className="quick-action-card">
                <div className="action-icon">
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p className="action-subtitle">{action.subtitle}</p>
                  <p className="action-description">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="help-topics-section">
          <div className="help-topics-container">
            <div className="browse-topics">
              <h2>Browse Help Topics</h2>
              <div className="topics-sidebar">
                {recommendedTopics.map((topic, index) => (
                  <div 
                    key={index} 
                    className={`topic-item ${index === 0 ? 'active' : ''}`}
                  >
                    <span>{topic}</span>
                    {index === 0 && <FaChevronRight className="chevron-icon" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="help-content">
              <div className="help-section">
                <h3>Learn how to...</h3>
                <div className="help-links">
                  {learnHowToLinks.map((link, index) => (
                    <div key={index} className="help-link">
                      <span className="link-icon">{link.icon}</span>
                      <span className="link-text">{link.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="help-section">
                <h3>Try it Yourself</h3>
                <div className="help-links">
                  {tryItYourselfLinks.map((link, index) => (
                    <div key={index} className="help-link try-yourself-link">
                      <span className="link-icon">{link.icon}</span>
                      <span className="link-text">{link.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="search-section">
          <h2>Find more solutions</h2>
          <p className="search-subtitle">Type something like, "question about a charge"</p>
          <div className="search-container">
            <div className="search-box">
              <input 
                type="text" 
                placeholder=""
                className="search-input"
              />
              <button className="search-button">
                <FaQuestionCircle />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;