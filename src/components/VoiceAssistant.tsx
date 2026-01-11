import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import './speech-types';

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
  onSpeech: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export const VoiceAssistant = forwardRef<{ speak: (text: string) => void }, VoiceAssistantProps>(
  function VoiceAssistant({ onTranscript, onSpeech, isListening, setIsListening }, ref) {
  const { currentLanguage, t } = useLanguage();
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Language codes for speech recognition
  const speechLanguages = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
    te: 'te-IN'
  };

  useEffect(() => {
    // Check if speech recognition and synthesis are supported
    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const synthesis = window.speechSynthesis;
    
    if (recognition && synthesis) {
      setIsSupported(true);
      recognitionRef.current = new recognition();
      synthesisRef.current = synthesis;

      // Configure speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = speechLanguages[currentLanguage] || 'en-IN';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          onTranscript(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [currentLanguage, onTranscript, setIsListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.lang = speechLanguages[currentLanguage] || 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (synthesisRef.current && text) {
      // Cancel any ongoing speech
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLanguages[currentLanguage] || 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthesisRef.current.speak(utterance);
      onSpeech(text);
    }
  };

  // Expose speak function to parent component
  useImperativeHandle(ref, () => ({
    speak
  }));

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <MicOff size={16} />
        <span>{t('voiceNotSupported')}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Voice Input Button */}
      <motion.button
        onClick={isListening ? stopListening : startListening}
        className={`p-2 rounded-full transition-colors ${
          isListening 
            ? 'bg-red-500 text-white' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isListening ? t('listening') : t('voiceInput')}
      >
        <motion.div
          animate={isListening ? {
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{
            duration: 0.5,
            repeat: isListening ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          {isListening ? <Mic size={18} /> : <MicOff size={18} />}
        </motion.div>
      </motion.button>

      {/* Voice Output Button */}
      <motion.button
        onClick={isSpeaking ? stopSpeaking : undefined}
        className={`p-2 rounded-full transition-colors ${
          isSpeaking 
            ? 'bg-blue-500 text-white' 
            : 'bg-muted text-muted-foreground'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isSpeaking ? t('speaking') : t('voiceSupported')}
        disabled={!isSpeaking}
      >
        <motion.div
          animate={isSpeaking ? {
            scale: [1, 1.1, 1],
            opacity: [1, 0.7, 1]
          } : {}}
          transition={{
            duration: 0.3,
            repeat: isSpeaking ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          {isSpeaking ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </motion.div>
      </motion.button>

      {/* Status indicator */}
      {(isListening || isSpeaking) && (
        <motion.div
          className="flex items-center gap-1 text-xs"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${
              isListening ? 'bg-red-500' : 'bg-blue-500'
            }`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <span className="text-muted-foreground">
            {isListening ? t('listening') : t('speaking')}
          </span>
        </motion.div>
      )}
    </div>
  );
});