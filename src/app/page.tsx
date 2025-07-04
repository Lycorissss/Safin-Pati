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
  const [chatBackground, setChatBackground] = useState<'default' | 'white'>('default');
  const [selectedOption, setSelectedOption] = useState<'latihan' | 'mingguan' | 'curhat' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      // Handle response based on selected option
      if (selectedOption) {
        setTimeout(() => {
          let responseText = "";
          const coachMessagesCount = messages.filter(m => m.isCoach).length;

          if (selectedOption === 'latihan') {
            responseText = `Terima kasih, Jono 🙏\n\nDengan data:\n\nUsia kamu sekarang: 21 tahun (U-21)\n\nTinggi & berat: 190 cm / 70 kg — postur sangat ideal untuk posisi bek tengah, gelandang bertahan, atau bahkan penjaga gawang (jika refleks bagus).\n\n📅 Sekarang bulan Juli — di Program SPSSI 2025 ini masuk fase Peak Competition. Fokus latihan kita:\n\nTaktik tingkat lanjut (Strategy Game)\n\nKetahanan + pemulihan\n\nNutrisi elite athlete\n\nRefleksi batin & ketenangan mental\n\n📋 LATIHAN HARI INI – Fase Peak Competition (Juli)\nTujuan: Menajamkan kemampuan bertahan + transisi cepat (cocok untuk posisi bertahan)\n\n1. ⚡ Pemanasan Dinamis (10–12 menit)\nJogging ringan keliling lapangan (2–3 menit)\n\nDynamic stretching (leg swing, arm circle, hip opener)\n\nActivation drill: high knees, butt kicks, side shuffle\n\nSprint pendek 4×20 meter (60%)\n\n2. 🧠 Materi Inti – Tactical Defending & Transition\nA. Posisi Bertahan (1v1 – 2v2)\n\nDrill 1v1 di zona sempit (5x10m) – fokus jarak & timing tekel\n\nDrill 2v2 transisi cepat – begitu merebut bola, langsung serang mini goal\n\nVariasi dengan role: CB, CDM (simulasikan peranmu)\n\nB. Tactical Game – Compact & Cover\n\nGame 6v6 di setengah lapangan, 2 bek + 1 pivot harus saling cover\n\nFokus: komunikasi, tekanan saat bola masuk zona, dan build-up cepat setelah recovery\n\n3. 🏃‍♂️ Sprint & Recovery Drill\nSprint 30m × 4 (100%) dengan recovery jog 30 detik\n\nSprint zig-zag cone (5 titik) – fokus perubahan arah & koordinasi\n\nCool-down jog + static stretch (hamstring, groin, calf)\n\n🥗 Saran Nutrisi Hari Ini:\n\nPagi: Telur rebus + oatmeal + pisang\n\nSiang: Nasi merah + dada ayam + sayur hijau\n\nSore: Smoothie pisang + susu + kacang\n\nMalam: Protein ringan (tahu/tempe) + sayur + buah potong\n\n🪞 Refleksi Batin (Tulis Jawabanmu ya, Jono):\n\n"Di lapangan, aku paling merasa percaya diri saat..."\n\nBoleh kirim jawabannya kapan aja. Ini latihan bukan cuma buat badan, tapi juga buat jiwamu sebagai pemain profesional.\nKalau kamu mau latihan tambahan (keeper, heading, build-up, dll) atau program mingguan, bilang aja ya 🙌`;
          } else if (selectedOption === 'mingguan') {
            responseText = `Terima kasih, Jono 🙏\nDengan data kamu:\n\n🧑 Usia: 21 tahun (kategori U-20)\n\n📏 Postur: 190 cm / 70 kg — sangat ideal untuk posisi bek tengah, gelandang jangkar, atau kiper\n\n🎯 Fase SPSSI: High Performance & Leadership Mental\n\n🗓️ Bulan Juli = fase kompetisi tengah musim → fokus ke tactical execution, recovery, dan mental\n\nBerikut Target Latihan Mingguan untuk Jono (U-20, Juli 2025)\n\n📆 Minggu ke-1 Target (Senin–Minggu)\n🎯 Fokus Utama:\nTaktik Plan 4 (1-4-2-3-1): posisi pivot & duel udara\n\nPemulihan aktif + strength\n\nKepemimpinan & komunikasi lapangan\n\n🏋️‍♂️ Senin – Recovery & Light Tactical\nPemanasan: Mobility + band activation (15 menit)\n\nLatihan teknik: Passing bawah tekanan + body orientation\n\nGame situasi 5v2\n\nPendinginan: Stretching statis (10 menit)\n\n🥗 Nutrisi: Fokus buah & elektrolit (pisang, semangka, air kelapa)\n\n⚔️ Selasa – Taktik Plan 4: Double Pivot\nWarm-up: Dynamic + rondo 6v2\n\nLatihan inti:\n\nBuild-up dari belakang (CB–pivot–AM)\n\nPosisi & komunikasi pivot (zone & cover)\n\nPressure dan counter-pressing\n\nMini game 7v7\n\n🥗 Nutrisi: Telur rebus, roti gandum, ayam rebus\n\n🏃‍♂️ Rabu – Sprint & Strength\nSprint: 4x10m + 3x20m (maksimal)\n\nCore & upper body: Push-up, plank, TRX row\n\nLatihan lompat vertikal + heading (bola gantung)\n\n🥗 Nutrisi: Protein shake + nasi merah + dada ayam\n\n🎯 Kamis – Taktik & Skema Serangan\nLatihan skenario: Serangan dari sayap → support dari pivot\n\nUmpan diagonal + shooting dari second line\n\nFormasi mini 1-4-2-3-1 dalam ¾ lapangan\n\n🥗 Nutrisi: Oatmeal, pisang, telur dadar\n\n🧘 Jumat – Recovery & Video Analysis\nStretching + foam roll (20 menit)\n\nTonton ulang permainanmu (jika ada rekaman)\n→ Catat: posisi kamu saat transisi lawan\n\n🥗 Nutrisi ringan: Yogurt + kacang almond + sayur sup\n\n⚽ Sabtu – Game Simulation 11v11\nPerankan posisi kamu (CB atau DM)\n\nFokus ke:\n\nBuild-up & komando pressing\n\nDuel udara & first touch\n\nEvaluasi komunikasi antar lini\n\n🥗 Nutrisi: Karbohidrat cukup + minum banyak air\n\n🌟 Minggu – Refleksi Diri & Regenerasi\nTulis di buku/HP:\n"3 momen terbaikku minggu ini di lapangan adalah..."\n\nJalan kaki ringan / berenang / istirahat aktif\n\nSiapkan mental untuk minggu berikutnya\n\n🥗 Nutrisi: Smoothie buah, tahu/tempe, air putih\n\nKalau kamu mau aku sesuaikan posisimu lebih spesifik (CB, DM, kiper?), tinggal bilang ya 🙌\nAtau kalau kamu mau tantangan mingguan, aku siap buatin 💥`;
          } else if (selectedOption === 'curhat') {
            if (coachMessagesCount === 1) {
              responseText = `Terima kasih udah jujur cerita… Aku tahu ini pasti berat buat kamu. Keputusan seperti ini nggak gampang, apalagi kalau kamu sudah punya mimpi besar di sepakbola. Tapi aku mau bilang dulu: kamu nggak sendiri.\n\nKalau boleh aku tanya pelan-pelan ya…\n\nApakah kamu sudah bicara ke orang tua atau wali soal ini?\n\nApakah kamu ingin tetap lanjut latihan mandiri walaupun nggak bisa ikut sekolah resmi?\n\nApa yang paling kamu takutkan kalau kamu harus berhenti?\n\nAku nggak janji bisa langsung menyelesaikan semua, tapi aku bisa bantu cari jalan — entah dengan program latihan pribadi, semangat latihan mandiri, atau bahkan bantu kamu tulis surat motivasi kalau nanti ada beasiswa atau sponsor.\n\nKamu boleh gagal passing, tapi jangan gagal percaya bahwa kamu layak diperjuangkan.\n\nAku di sini, dan aku percaya sama kamu 💪\nKalau kamu siap, kita bisa susun plan latihan pribadi dulu buat kamu tetap berkembang. Mau?`;
            } else if (coachMessagesCount === 2) {
              responseText = `Terima kasih udah jawab dengan jujur. Aku bisa rasakan betapa dalamnya rasa kecewa kamu… Tapi kamu tahu nggak? Justru dari titik terendah ini, banyak pemain besar lahir. Bukan karena mereka nggak pernah jatuh, tapi karena mereka selalu bangkit — meski sendirian.\n\n💬 Aku bangga karena kamu tetap ingin lanjut latihan. Itu bukti bahwa kamu bukan hanya penggemar sepakbola, tapi seorang pejuang.\n\nSoal cita-cita… kita nggak harus selalu lewat jalan tol (sekolah bola resmi), kadang justru jalan kecil di pinggir kampung yang bawa kita ke tempat yang sama — asalkan kamu terus jalan.\n\nKalau kamu siap, aku mau bantu buatkan:\n\nLatihan mandiri (mingguan) sesuai umur dan posisimu.\n\nProgram sprint & teknik supaya kamu tetap berkembang.\n\nJurnal batin — biar kamu tetap kuat secara mental, walaupun latihan sendirian.`;
            }
          }

          const coachResponse: Message = {
            id: Date.now(),
            text: responseText,
            isCoach: true,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, coachResponse]);
        }, 1500);
      }
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
              Halo, senang bertemu denganmu! Pilih opsi dibawah untuk memulai sesi bersama Coach:
            </p>

            <div className="space-y-3 mb-6 w-full max-w-xs mx-auto">
              <button
                onClick={() => {
                  setSelectedOption('latihan');
                  setHasStartedChat(true);
                  setChatBackground('white');
                  setMessages([{
                    id: Date.now(),
                    text: "Siap! Sebelum aku susun latihan khusus buat kamu, aku perlu beberapa data dulu ya:\n\n🧍 Nama lengkap:\n📍 Tempat & tanggal lahir:\n⚖️ Berat badan (kg):\n📏 Tinggi badan (cm):\n\nSetelah itu, aku bakal sesuaikan programnya dengan usiamu, kondisi fisikmu, dan fase kompetisi bulan Juli ini.",
                    isCoach: true,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  }]);
                }}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-medium py-3 px-6 rounded-full transition-colors duration-200"
              >
                1. Kita mulai latihan
              </button>
              <button
                onClick={() => {
                  setSelectedOption('mingguan');
                  setHasStartedChat(true);
                  setChatBackground('white');
                  setMessages([{
                    id: Date.now(),
                    text: "Tentu aku mau bantu kamu latihan target mingguan 💪\nTapi sebelumnya aku perlu data dasar kamu dulu ya:\n\n🧍 Nama lengkap:\n📍 Tempat & tanggal lahir:\n⚖️ Berat badan (kg):\n📏 Tinggi badan (cm):\n\nSetelah itu, aku akan buatkan latihan mingguan sesuai umur kamu, postur tubuh, dan fase program SPSSI 2025. Kita bisa fokus ke:\n\n- Teknik individu (dribbling, passing, shooting)\n- Taktik tim (berdasarkan Plan 1–4)\n- Fisik & sprint\n- Mental & refleksi\n- Nutrisi harian pemain muda\n\nYuk isi dulu datanya 🙏",
                    isCoach: true,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  }]);
                }}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-medium py-3 px-6 rounded-full transition-colors duration-200"
              >
                2. Kamu mau latihan target mingguan
              </button>
              <button
                onClick={() => {
                  setSelectedOption('curhat');
                  setHasStartedChat(true);
                  setChatBackground('white');
                  setMessages([{
                    id: Date.now(),
                    text: "Silakan, aku siap mendengarkan kamu. Ceritakan saja apa yang kamu rasakan... apa yang lagi berat di hati atau pikiranmu sekarang?",
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

      <div className={`flex-1 overflow-y-auto px-10 py-6 ${chatBackground === 'white' ? 'bg-white' : 'bg-gray-50'}`}>
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