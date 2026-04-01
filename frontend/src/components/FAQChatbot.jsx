import React, { useState, useEffect, useRef } from 'react';

const FAQChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const faqs = [
    {
      question: "How do I find project partners?",
      answer: "Head over to your Dashboard! You can browse through the list of registered students who are also looking for project teammates."
    },
    {
      question: "How do I update my profile?",
      answer: "Click on 'My Profile' in the sidebar, and hit 'Edit Profile'. Don't forget to link your GitHub so we can show off your live stats!"
    },
    {
      question: "What is Profile Completeness?",
      answer: "The Profile Completeness percentage carefully tracks how well you've filled out your information. Add more skills, roles, and availability to reach a full 100% and stand out!"
    },
    {
      question: "How do I show my GitHub stats?",
      answer: "Go to 'Edit Profile' and paste your valid GitHub username or full URL in the Social Links section. We will automatically generate live commits and repository charts!"
    },
    {
      question: "Can I change my Student ID/Email?",
      answer: "Currently, your university email and Student ID are strictly tied to your account upon registration to guarantee that all users are authentic students."
    },
    {
      question: "I forgot my password",
      answer: "While logged out, click 'Forgot Password' on the login screen. You will instantly receive a secure, 6-digit verification OTP to your registered university email to reset it."
    }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { sender: 'bot', text: "Hi there! 👋 I'm your ProMate Assistant. Choose a common question below, and I'll help you out!" }
      ]);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOptionClick = (faq) => {
    setMessages(prev => [...prev, { sender: 'user', text: faq.question }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: faq.answer }]);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, fontFamily: "'Sora', sans-serif" }}>
      {isOpen && (
        <div style={{ 
          width: '350px', 
          height: '480px', 
          backgroundColor: '#ffffff', 
          borderRadius: '16px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05)',
          display: 'flex', 
          flexDirection: 'column',
          marginBottom: '1rem',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          animation: 'chatBubbleAppear 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '1.5rem' }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ProMate Assistant</div>
                <div style={{ fontSize: '0.7rem', color: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span>
                  Online
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, opacity: 0.8 }}
              onMouseOver={(e) => e.currentTarget.style.opacity = 1}
              onMouseOut={(e) => e.currentTarget.style.opacity = 0.8}
            >
              &times;
            </button>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', 
                backgroundColor: msg.sender === 'user' ? '#2563eb' : '#ffffff',
                color: msg.sender === 'user' ? 'white' : '#1e293b',
                padding: '10px 14px',
                borderRadius: '12px',
                borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '2px' : '12px',
                maxWidth: '85%',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                border: msg.sender === 'bot' ? '1px solid #e2e8f0' : 'none'
              }}>
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: '12px', borderBottomLeftRadius: '2px', border: '1px solid #e2e8f0', display: 'flex', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'chatbotBlink 1.4s infinite both' }}></span>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'chatbotBlink 1.4s infinite both 0.2s' }}></span>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'chatbotBlink 1.4s infinite both 0.4s' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Options Area */}
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Frequently Asked</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {faqs.map((faq, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleOptionClick(faq)}
                  disabled={isTyping}
                  style={{ 
                    textAlign: 'left', 
                    padding: '8px 12px', 
                    backgroundColor: '#eff6ff', 
                    color: '#1d4ed8', 
                    border: '1px solid #bfdbfe', 
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: isTyping ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: isTyping ? 0.6 : 1
                  }}
                  onMouseOver={(e) => { if(!isTyping) e.currentTarget.style.backgroundColor = '#dbeafe' }}
                  onMouseOut={(e) => { if(!isTyping) e.currentTarget.style.backgroundColor = '#eff6ff' }}
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            transition: 'transform 0.2s',
            animation: 'chatBubbleAppear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          💬
        </button>
      )}
      
      <style>
        {`
          @keyframes chatbotBlink {
            0% { opacity: .2; }
            20% { opacity: 1; }
            100% { opacity: .2; }
          }
          @keyframes chatBubbleAppear {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default FAQChatbot;
