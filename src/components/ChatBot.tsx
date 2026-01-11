import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, User, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { VoiceAssistant } from './VoiceAssistant';
import { useLanguage } from './LanguageContext';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceAssistantRef = useRef<any>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: t('chatbotWelcome'),
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, t, messages.length]);

  // Context-aware responses based on current tab
  const getContextualResponse = (userMessage: string, tab: string): string => {
    const message = userMessage.toLowerCase();
    
    // Common rainwater harvesting responses
    if (message.includes('how') || message.includes('start') || message.includes('begin')) {
      switch (tab) {
        case 'assess':
          return 'To start your rainwater harvesting assessment, measure your rooftop area and enter your location details. The GIS measure button can help you get accurate dimensions automatically.';
        case 'ar':
          return 'Use our AR view to visualize different tank sizes and positions. Point your camera around your property to see how tanks would fit in your space.';
        case 'cost':
          return 'Explore cost estimates for different RWH systems. We provide detailed breakdowns including materials, installation, and potential subsidies available in your area.';
        case 'knowledge':
          return 'Browse our knowledge hub for comprehensive guides on rainwater harvesting techniques, maintenance tips, and success stories from your community.';
        default:
          return 'Start by going to the Assess tab to calculate your rainwater harvesting potential, then explore AR visualization and cost guidance.';
      }
    }

    if (message.includes('cost') || message.includes('price') || message.includes('money')) {
      return 'RWH system costs vary based on tank size and complexity. A basic 1000L system starts around ₹15,000-25,000. Check the Cost tab for detailed estimates and available government subsidies.';
    }

    if (message.includes('tank') || message.includes('storage')) {
      return 'Tank size depends on your rooftop area and rainfall. For a 100 sq.m roof in Bangalore, a 5000-8000L tank is typically recommended. Use our AR view to visualize placement options.';
    }

    if (message.includes('permit') || message.includes('approval') || message.includes('legal')) {
      return 'Most residential RWH systems under 10,000L capacity don\'t need special permits in Karnataka. However, check with your local municipal authority for specific regulations.';
    }

    if (message.includes('maintenance') || message.includes('clean') || message.includes('care')) {
      return 'Regular maintenance includes: cleaning gutters monthly, checking first-flush diverters, and tank cleaning every 6 months. The Knowledge Hub has detailed maintenance guides.';
    }

    if (message.includes('subsidy') || message.includes('government') || message.includes('scheme')) {
      return 'Karnataka offers subsidies up to ₹10,000 for residential RWH systems. BBMP provides additional incentives. Check the Cost section for current schemes and application procedures.';
    }

    if (message.includes('rain') || message.includes('water') || message.includes('collect')) {
      return 'Bangalore receives about 970mm annual rainfall. A 100 sq.m roof can collect approximately 75,000 liters annually. Use our assessment tool to calculate your specific potential.';
    }

    // Default helpful response
    return 'I can help you with rainwater harvesting questions! Ask me about costs, tank sizing, permits, maintenance, government subsidies, or how to get started with your RWH system.';
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    };

    const botResponse: Message = {
      id: `bot-${Date.now()}`,
      text: getContextualResponse(text.trim(), currentTab),
      isBot: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputText('');

    // Speak the bot response if voice assistant is available
    setTimeout(() => {
      if (voiceAssistantRef.current?.speak) {
        voiceAssistantRef.current.speak(botResponse.text);
      }
    }, 500);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputText(transcript);
    // Auto-send voice messages
    setTimeout(() => handleSendMessage(transcript), 500);
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
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Chat Window */}
          <motion.div
            className="relative w-full max-w-md h-[80vh] max-h-[600px]"
            initial={{ y: "100%", scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "100%", scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="h-full flex flex-col shadow-2xl border-primary/20">
              {/* Header */}
              <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Bot size={24} />
                    </motion.div>
                    <div>
                      <div>{t('chatbot')}</div>
                      <div className="text-xs opacity-90">JalTaraang Assistant</div>
                    </div>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-primary-foreground hover:bg-white/20"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {message.isBot && (
                          <motion.div
                            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0"
                            animate={{
                              scale: [1, 1.05, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            <Droplets size={16} />
                          </motion.div>
                        )}
                        
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl ${
                            message.isBot
                              ? 'bg-muted text-foreground rounded-bl-sm'
                              : 'bg-primary text-primary-foreground rounded-br-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>

                        {!message.isBot && (
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                            <User size={16} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input Area */}
              <div className="p-4 border-t border-border space-y-3">
                {/* Voice Assistant */}
                <VoiceAssistant
                  ref={voiceAssistantRef}
                  onTranscript={handleVoiceTranscript}
                  onSpeech={() => {}}
                  isListening={isListening}
                  setIsListening={setIsListening}
                />

                {/* Text Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('askQuestion')}
                    className="flex-1"
                    disabled={isListening}
                  />
                  <Button
                    onClick={() => handleSendMessage(inputText)}
                    disabled={!inputText.trim() || isListening}
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