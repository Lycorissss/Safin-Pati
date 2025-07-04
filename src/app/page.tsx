'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUp, Paperclip, X } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isCoach: boolean;
  time: string;
  attachment?: {
    name: string;
    size: number;
    type: string;
  };
}

export default function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample sports consultation questions
  const sportsQuestions = [
    "Bagaimana meningkatkan kecepatan lari saya?",
    "Teknik dasar mengontrol bola yang baik seperti apa?",
    "Program latihan apa yang cocok untuk pemula?",
    "Bagaimana cara meningkatkan stamina untuk pertandingan 90 menit?",
    "Latihan khusus untuk meningkatkan shooting power?",
    "Bagaimana posisi tubuh yang benar saat heading bola?",
    "Apa saja nutrisi penting untuk pemain sepakbola?",
    "Bagaimana mengatasi nervous sebelum pertandingan penting?",
    "Latihan apa yang efektif untuk meningkatkan agility?",
    "Bagaimana cara memperbaiki teknik tackling yang aman?"
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setAttachmentPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = () => {
  if (inputMessage.trim() || attachment) {
    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      isCoach: false,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...(attachment && {
        attachment: {
          name: attachment.name,
          size: attachment.size,
          type: attachment.type
        }
      })
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage("");
    setAttachment(null);
    setAttachmentPreview(null);
    setHasStartedChat(true);
    
    setTimeout(() => {
      // Buat salinan array pertanyaan yang belum ditampilkan
      const unansweredQuestions = sportsQuestions.filter(q => 
        !messages.some(m => m.text === q)
      ); // <-- Added missing closing parenthesis here
      
      // Jika semua pertanyaan sudah ditampilkan, reset
      const availableQuestions = unansweredQuestions.length > 0 
        ? unansweredQuestions 
        : sportsQuestions;
      
      // Ambil pertanyaan random dari yang tersedia
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const coachResponse: Message = {
        id: Date.now(),
        text: availableQuestions[randomIndex],
        isCoach: true,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, coachResponse]);
    }, 1500);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Mobile view - shows welcome screen first
  if (isMobile && !hasStartedChat) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 font-sans">
        <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
          <h1 className="text-xl text-gray-900 text-center">
            Tanya Coach Sekarang!
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-full max-w-md mb-8 px-4 text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/Icon_People.png"
                alt="People Icon"
                loading="lazy"
                className="w-16 h-16 object-contain"
              />
            </div>

            <p className="text-gray-600 mb-6">
              Halo, senang bertemu denganmu! Tekan tombol "Mulai Chat" untuk memulai sesi bersama Coach dan dapatkan panduan latihan yang sesuai dengan kebutuhanmu. Siap jadi lebih hebat hari ini?
            </p>

            <button
              onClick={() => setHasStartedChat(true)}
              className="w-full max-w-xs mx-auto bg-[#FFB20E] hover:bg-[#e6a00c] text-black font-medium py-3 px-6 rounded-full transition-colors duration-200"
            >
              Mulai Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Web view - shows centered input when no messages
  if (!isMobile && messages.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 font-sans">
        <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
          <h1 className="text-xl text-gray-900 text-center">
            Tanya Coach Sekarang!
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h2 className="text-lg font-medium text-gray-800">
                Latihan apa yang lagi kamu fokusin hari ini?
              </h2>
            </div>

            {attachmentPreview && (
              <div className="mb-3 relative">
                <div className="bg-gray-100 p-3 rounded-lg inline-block max-w-xs">
                  {attachmentPreview.startsWith('data:image') ? (
                    <img 
                      src={attachmentPreview} 
                      alt="Preview" 
                      className="max-h-40 rounded-md"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Paperclip size={16} />
                      <span className="truncate max-w-xs">{attachment?.name}</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={removeAttachment}
                  className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <Paperclip size={20} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message Coach..."
                className="flex-1 py-3 px-2 focus:outline-none text-gray-800 placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() && !attachment}
                className="bg-[#FFB20E] hover:bg-[#e6a00c] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-2 my-1 transition-colors duration-200"
              >
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default chat view (after starting chat on mobile or after first message on web)
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
        <h1 className="text-xl text-gray-900 text-center">
          Tanya Coach Sekarang!
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-6 flex flex-col justify-end">
        <div className="space-y-2 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isCoach ? 'justify-start' : 'justify-end'} px-4`}
            >
              <div
                className={`max-w-[90%] px-4 py-3 rounded-2xl ${
                  message.isCoach
                    ? 'bg-white shadow-sm border border-gray-100 text-gray-800'
                    : 'bg-[#FFB20E] text-white'
                }`}
                style={{ minWidth: '120px' }}
              >
                {message.text && (
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}
                {message.attachment && (
                  <div className="mt-2 bg-white/20 p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Paperclip size={16} />
                      <span className="truncate">{message.attachment.name}</span>
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      {Math.round(message.attachment.size / 1024)} KB
                    </div>
                  </div>
                )}
                <div className={`text-xs mt-2 ${message.isCoach ? 'text-gray-500' : 'text-[#FFE8B6]'}`}>
                  {message.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-100 px-14 py-4">
        {attachmentPreview && (
          <div className="mb-3 relative">
            <div className="bg-gray-100 p-3 rounded-lg inline-block max-w-xs">
              {attachmentPreview.startsWith('data:image') ? (
                <img 
                  src={attachmentPreview} 
                  alt="Preview" 
                  className="max-h-40 rounded-md"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Paperclip size={16} />
                  <span className="truncate max-w-xs">{attachment?.name}</span>
                </div>
              )}
            </div>
            <button 
              onClick={removeAttachment}
              className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-full px-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <Paperclip size={20} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message Coach..."
            className="flex-1 py-3 px-2 bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() && !attachment}
            className="bg-[#FFB20E] hover:bg-[#e6a00c] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-2 my-1 transition-colors duration-200"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}