'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUp, Paperclip, X } from 'lucide-react';
import Image from "next/image";

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
  const [chatBackground, setChatBackground] = useState<'default' | 'white'>('default');
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
              <Image
                src="/icon.png"
                alt="People Icon"
                width={64} // setara dengan w-16 (16 * 4px)
                height={64} // setara dengan h-16 (16 * 4px)
                className="object-contain"
                loading="lazy"
              />
            </div>

            <p className="text-gray-600 mb-6">
              Halo, senang bertemu denganmu! Pilih opsi dibawah untuk memulai sesi bersama Coach:
            </p>

            <div className="space-y-3 mb-6 w-full max-w-xs mx-auto">
              {/* Option 1: Start Training */}
              <button
                onClick={() => {
                  setHasStartedChat(true);
                  setChatBackground('white');
                  setMessages([{
                    id: Date.now(),
                    text: "Siap! Sebelum aku susun latihan khusus buat kamu, aku perlu beberapa data dulu ya:\n\n🧍 Nama lengkap:\n📍 Tempat & tanggal lahir:\n⚖️ Berat badan (kg):\n📏 Tinggi badan (cm):",
                    isCoach: true,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  }]);
                }}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-medium py-3 px-6 rounded-full transition-colors duration-200"
              >
                1. Kita mulai latihan
              </button>

              {/* Option 2: Weekly Training Target */}
              <button
                onClick={() => {
                  setHasStartedChat(true);
                  setChatBackground('white');
                  setMessages([{
                    id: Date.now(),
                    text: "Aku akan buatkan latihan mingguan untukmu. Tolong beri data dasar dulu:\n\n🧍 Nama lengkap:\n📍 Tempat & tanggal lahir:\n⚖️ Berat badan (kg):\n📏 Tinggi badan (cm):",
                    isCoach: true,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  }]);
                }}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-medium py-3 px-6 rounded-full transition-colors duration-200"
              >
                2. Kamu mau latihan target mingguan
              </button>

              {/* Option 3: Venting */}
              <button
                onClick={() => {
                  setHasStartedChat(true);
                  setChatBackground('white');
                  setMessages([{
                    id: Date.now(),
                    text: "Silakan ceritakan apa yang sedang kamu rasakan...",
                    isCoach: true,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  }]);
                }}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-medium py-3 px-6 rounded-full transition-colors duration-200"
              >
                3. Curhat dulu
              </button>
            </div>

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

  const handleSendMessage = () => {
    if (inputMessage.trim() || attachment) {
      // Add user message
      const userMessage: Message = {
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

      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setAttachment(null);
      setAttachmentPreview(null);
      setHasStartedChat(true);

      // Generate coach response
      setTimeout(() => {
        // Check if we should respond based on last coach message
        if (messages.length > 0) {
          const lastCoachMessage = messages[messages.length - 1];

          if (lastCoachMessage.isCoach) {
            let coachResponse: Message;

            if (lastCoachMessage.text.includes("data dulu ya")) {
              // Response for training start
              coachResponse = {
                id: Date.now() + 1,
                text: generateTrainingResponse(inputMessage),
                isCoach: true,
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              };
            }
            else if (lastCoachMessage.text.includes("latihan mingguan")) {
              // Response for weekly training
              coachResponse = {
                id: Date.now() + 1,
                text: generateWeeklyTrainingResponse(inputMessage),
                isCoach: true,
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              };
            }
            else if (lastCoachMessage.text.includes("sedang kamu rasakan")) {
              // Response for venting
              coachResponse = {
                id: Date.now() + 1,
                text: generateVentingResponse(inputMessage),
                isCoach: true,
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              };
            } else {
              // Default to random sports question
              const unansweredQuestions = sportsQuestions.filter(q =>
                !messages.some(m => m.text === q)
              );

              const availableQuestions = unansweredQuestions.length > 0
                ? unansweredQuestions
                : sportsQuestions;

              const randomIndex = Math.floor(Math.random() * availableQuestions.length);
              coachResponse = {
                id: Date.now() + 1,
                text: availableQuestions[randomIndex],
                isCoach: true,
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              };
            }

            setMessages(prev => [...prev, coachResponse]);
            return;
          }
        }

        // Fallback to random sports question if no specific context
        const unansweredQuestions = sportsQuestions.filter(q =>
          !messages.some(m => m.text === q)
        );

        const availableQuestions = unansweredQuestions.length > 0
          ? unansweredQuestions
          : sportsQuestions;

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const coachResponse: Message = {
          id: Date.now() + 1,
          text: availableQuestions[randomIndex],
          isCoach: true,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, coachResponse]);
      }, 1500);
    }
  };

  // Helper functions for generating responses
  const generateTrainingResponse = (input: string) => {
    const name = input.split('\n')[0] || 'Teman';
    return `Terima kasih, Jono 🙌

📋 Profil Latihan Kamu:
• Usia: 21 tahun (Prime Development Age)
• Postur: 190cm/70kg (Ideal untuk CB/ST)
• Kategori: High Performance U-21
• Potensi Posisi: 
  - CB: Physical dominance ala Virgil van Dijk
  - ST: Target man gaya Erling Haaland
  - DM: Deep playmaker seperti Sergio Busquets

🔍 Analisis Fisik:
• Strength: 7/10 (Butuh lebih banyak upper body)
• Speed: 8/10 (Akselerasi bagus untuk posturmu)
• Agility: 6/10 (Perlu improvement)

🔥 LATIHAN KHUSUS HARI INI (90 menit):

1. Dynamic Warm-up (20 menit):
   • Jogging + high knees + butt kicks (5 menit)
   • Mobility drills:
     - Hip opener 2x10 reps
     - Shoulder rotation 2x10
   • Activation:
     - Plank 45 detik x 3
     - Bodyweight squats 2x15

2. Technical Session (45 menit):
   • CB Focus:
     - Aerial duel drill (10x crossing)
     - Long passing accuracy (20x 30m pass)
   • ST Focus:
     - Hold-up play (5x shielding)
     - Finishing first touch (10x volley)

3. Tactical Play (20 menit):
   • Small-sided game 7v7
   • Posisi khusus:
     - Build-up dari belakang
     - Transisi cepat

4. Cool Down (5 menit):
   • Static stretching
   • Breathing exercise

🍗 NUTRISI HARIAN:
Pre-training: Pisang + almond butter
Post-training: Nasi merah + dada ayam + brokoli
Snack: Greek yogurt + whey protein

📝 Catatan Pelatih:
"Pemain dengan posturmu sering sukses sebagai ball-playing defender. 
Latihan ekstra: 30 menit passing setiap sore ala David Alaba";

📆 Jadwal Latihan Minggu Ini:

Senin: Recovery & Tactical
Selasa: Double Pivot Training
Rabu: Sprint & Strength
Kamis: Skema Serangan
Jumat: Video Analysis
Sabtu: Game Simulation
Minggu: Refleksi & Recovery`;
  };

  const generateWeeklyTrainingResponse = (input: string) => {
    return `📅 PROGRAM MINGGUAN JONO (U-21 High Performance)

🔬 Berdasarkan data:
• TB: 190cm | BB: 70kg
• Usia: 21 tahun
• Fase: Competitive Season

🎯 FOKUS MINGGU INI:
1. Tactical Discipline
2. Aerial Dominance
3. Recovery Management

📆 SENIN - Recovery Session
• Morning: Yoga + foam rolling (60 menit)
• Evening: Pool recovery session

⚽ SELASA - Tactical Day
• 09:00: Video analysis (Studi kasus Van Dijk)
• 11:00: Positional play drills
• 15:00: Small-sided games

🏋️ RABU - Physical Day
• Strength training:
  - Deadlift 3x8 (80% 1RM)
  - Pull-ups 3x10
• Plyometrics:
  - Box jumps 4x8

🎯 KAMIS - Position-Specific
• CB Session:
  - Aerial duel mastery
  - Long passing accuracy
• ST Session:
  - Target man play
  - First-time finishing

📊 JUMAT - Analysis Day
• Match video review
• Individual feedback session
• Mental preparation

⚽ SABTU - Match Simulation
• Full 11v11 practice
• Focus on:
  - Defensive organization
  - Set-piece situations

🧘 MINGGU - Active Recovery
• Light jogging + stretching
• Nutrition planning
• Mental relaxation

💡 SPECIAL NOTE:
"Pemain dengan posturmu butuh 8-12 minggu untuk adaptasi penuh ke level profesional. 
Fokus pada konsistensi!"`;
  };

  const generateVentingResponse = (input: string) => {
    return `Aku dengar semua keluh kesahmu... 💛

Tahu nggak? Kisahmu mengingatkanku pada banyak pemain hebat:

• Jamie Vardy - Ditolak akademi usia 16, akhirnya jadi top scorer Premier League
• Ian Wright - Baru mulai serius di usia 22, jadi legenda Arsenal
• Luca Toni - Puncak karir justru di usia 30-an

Yang membuat mereka berbeda:
1. Mental "Never Give Up"
2. Disiplin latihan mandiri
3. Percaya pada proses

🚀 SARAN KHUSUS UNTUKMU:

1. Buat jurnal latihan harian (seperti yang dilakukan CR7 muda)
2. Cari liga amatir berkualitas untuk pengalaman match
3. Latihan spesifik 2 jam/hari:
   • Pagi: Technical work
   • Sore: Physical training

🔥 KATA MOTIVASI:
"Batu sandungan sering jadi batu loncatan. 
Yang penting tetap jalan, meski pelan."

Aku akan selalu disini untuk membantumu berkembang, Jono!`;
  };

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
                Apa yang bisa ku bantu hari ini?
              </h2>
            </div>

            {/* 3 tombol opsi di atas input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => {
                  setHasStartedChat(true);
                  setChatBackground('white');
                  setMessages([{
                    id: Date.now(),
                    text: "Siap! Sebelum aku susun latihan khusus buat kamu, aku perlu beberapa data dulu ya:\n\n🧍 Nama lengkap:\n📍 Tempat & tanggal lahir:\n⚖️ Berat badan (kg):\n📏 Tinggi badan (cm):",
                    isCoach: true,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  }]);
                }}
                className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 font-medium py-2 px-4 rounded-full transition-colors duration-200"
              >
                1. Kita mulai latihan
              </button>

              <button
                onClick={() => {
                  setHasStartedChat(true);
                  setChatBackground('white');
                  setMessages([{
                    id: Date.now(),
                    text: "Aku akan buatkan latihan mingguan untukmu. Tolong beri data dasar dulu:\n\n🧍 Nama lengkap:\n📍 Tempat & tanggal lahir:\n⚖️ Berat badan (kg):\n📏 Tinggi badan (cm):",
                    isCoach: true,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  }]);
                }}
                className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 font-medium py-2 px-4 rounded-full transition-colors duration-200"
              >
                2. Target mingguan
              </button>

              <button
                onClick={() => {
                  setHasStartedChat(true);
                  setChatBackground('white');
                  setMessages([{
                    id: Date.now(),
                    text: "Silakan ceritakan apa yang sedang kamu rasakan...",
                    isCoach: true,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  }]);
                }}
                className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 font-medium py-2 px-4 rounded-full transition-colors duration-200"
              >
                3. Curhat dulu
              </button>
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

            {/* input chat tetap di bawah tombol */}
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

      <div className={`flex-1 overflow-y-auto px-10 py-6 ${chatBackground === 'white' ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="space-y-2 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isCoach ? 'justify-start' : 'justify-end'} px-4`}
            >
              <div
                className={`max-w-[90%] px-4 py-3 rounded-2xl ${message.isCoach
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