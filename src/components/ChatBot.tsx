import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, User, Droplets, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { VoiceAssistant } from './VoiceAssistant';
import { useLanguage } from './LanguageContext';

// --- CONFIGURATION ---
// ⚠️ PASTE YOUR GROQ API KEY HERE (starts with gsk_...)
// Get one for free at: https://console.groq.com/keys
const GROQ_API_KEY = ""; 

// Groq Endpoint
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
}

export function ChatBot({ isOpen, onClose, currentTab }: ChatBotProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceAssistantRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        text: t("Hello! I'm your JALTARAANG assistant. I'm powered by Llama AI. Ask me about RWH!"),
        isBot: true,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, t, messages.length]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      // 2. PREPARE PAYLOAD FOR GROQ
      // We use the latest Llama 3.3 model which is currently supported
      const payload = {
        model: "llama-3.3-70b-versatile", 
        messages: [
          {
            role: "system",
            content: `You are an expert on Rainwater Harvesting (RWH) for the JALTARAANG platform.
            Your answers should be helpful, short, and accurate.
            Context: User is on the "${currentTab}" tab.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      };

      // 3. CALL GROQ API
      const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();

      // Extract text from Groq response structure
      const botText = data.choices[0]?.message?.content || "I couldn't generate a response.";

      // 4. Add Bot Message
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        text: botText.trim(),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);

      if (voiceAssistantRef.current?.speak) {
        voiceAssistantRef.current.speak(botText);
      }

    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        text: `Error: ${error.message}. Please check your API key.`,
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputText(transcript);
    setTimeout(() => handleSendMessage(transcript), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-md h-[80vh] max-h-[600px]"
            initial={{ y: "100%", scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "100%", scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="h-full flex flex-col shadow-2xl border-primary/20">
              <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bot size={24} />
                    <div>
                      <div>{t('chatbot')}</div>
                      <div className="text-xs opacity-90">Powered by Llama 3.3</div>
                    </div>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={onClose} className="text-primary-foreground hover:bg-white/20">
                    <X size={20} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {message.isBot && (
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0">
                            <Droplets size={16} />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl ${
                            message.isBot
                              ? 'bg-muted text-foreground rounded-bl-sm'
                              : 'bg-primary text-primary-foreground rounded-br-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        </div>
                        {!message.isBot && (
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                            <User size={16} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {isProcessing && (
                      <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                            <Droplets size={16} />
                          </div>
                          <div className="bg-muted p-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-xs text-muted-foreground">Llama is thinking...</span>
                          </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <div className="p-4 border-t border-border space-y-3">
                <VoiceAssistant
                  ref={voiceAssistantRef}
                  onTranscript={handleVoiceTranscript}
                  onSpeech={() => {}}
                  isListening={isListening}
                  setIsListening={setIsListening}
                />
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('askQuestion')}
                    className="flex-1"
                    disabled={isListening || isProcessing}
                  />
                  <Button
                    onClick={() => handleSendMessage(inputText)}
                    disabled={!inputText.trim() || isListening || isProcessing}
                    className="shrink-0"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}