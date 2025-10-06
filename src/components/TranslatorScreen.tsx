import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Languages, 
  ArrowRightLeft,
  Volume2,
  Copy,
  Check
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TranslatorScreenProps {
  onBack: () => void;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

export function TranslatorScreen({ onBack }: TranslatorScreenProps) {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ja');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
  ];

  // Enhanced bidirectional translation dictionary
  const translations: { [key: string]: { [key: string]: string } } = {
    'hello': {
      'en': 'hello',
      'ja': 'こんにちは',
      'es': 'hola',
      'fr': 'bonjour',
      'de': 'hallo',
      'it': 'ciao',
      'pt': 'olá',
      'ru': 'привет',
      'zh': '你好',
      'ko': '안녕하세요',
      'ar': 'مرحبا',
      'hi': 'नमस्ते'
    },
    'thank you': {
      'en': 'thank you',
      'ja': 'ありがとう',
      'es': 'gracias',
      'fr': 'merci',
      'de': 'danke',
      'it': 'grazie',
      'pt': 'obrigado',
      'ru': 'спасибо',
      'zh': '谢谢',
      'ko': '감사합니다',
      'ar': 'شكرا',
      'hi': 'धन्यवाद'
    },
    'goodbye': {
      'en': 'goodbye',
      'ja': 'さようなら',
      'es': 'adiós',
      'fr': 'au revoir',
      'de': 'auf wiedersehen',
      'it': 'arrivederci',
      'pt': 'adeus',
      'ru': 'до свидания',
      'zh': '再见',
      'ko': '안녕히 가세요',
      'ar': 'وداعا',
      'hi': 'अलविदा'
    },
    'yes': {
      'en': 'yes',
      'ja': 'はい',
      'es': 'sí',
      'fr': 'oui',
      'de': 'ja',
      'it': 'sì',
      'pt': 'sim',
      'ru': 'да',
      'zh': '是的',
      'ko': '예',
      'ar': 'نعم',
      'hi': 'हाँ'
    },
    'no': {
      'en': 'no',
      'ja': 'いいえ',
      'es': 'no',
      'fr': 'non',
      'de': 'nein',
      'it': 'no',
      'pt': 'não',
      'ru': 'нет',
      'zh': '不',
      'ko': '아니요',
      'ar': 'لا',
      'hi': 'नहीं'
    },
    'please': {
      'en': 'please',
      'ja': 'お願いします',
      'es': 'por favor',
      'fr': 's\'il vous plaît',
      'de': 'bitte',
      'it': 'per favore',
      'pt': 'por favor',
      'ru': 'пожалуйста',
      'zh': '请',
      'ko': '제발',
      'ar': 'من فضلك',
      'hi': 'कृपया'
    },
    'excuse me': {
      'en': 'excuse me',
      'ja': 'すみません',
      'es': 'disculpe',
      'fr': 'excusez-moi',
      'de': 'entschuldigung',
      'it': 'scusa',
      'pt': 'com licença',
      'ru': 'извините',
      'zh': '对不起',
      'ko': '실례합니다',
      'ar': 'عفوا',
      'hi': 'क्षमा करें'
    },
    'i need help': {
      'en': 'i need help',
      'ja': '助けてください',
      'es': 'necesito ayuda',
      'fr': 'j\'ai besoin d\'aide',
      'de': 'ich brauche hilfe',
      'it': 'ho bisogno di aiuto',
      'pt': 'preciso de ajuda',
      'ru': 'мне нужна помощь',
      'zh': '我需要帮助',
      'ko': '도움이 필요합니다',
      'ar': 'أحتاج مساعدة',
      'hi': 'मुझे मदद चाहिए'
    },
    'how are you': {
      'en': 'how are you',
      'ja': 'お元気ですか',
      'es': '¿cómo estás?',
      'fr': 'comment allez-vous?',
      'de': 'wie geht es dir?',
      'it': 'come stai?',
      'pt': 'como você está?',
      'ru': 'как дела?',
      'zh': '你好吗？',
      'ko': '어떻게 지내세요?',
      'ar': 'كيف حالك؟',
      'hi': 'आप कैसे हैं?'
    },
    'where is': {
      'en': 'where is',
      'ja': 'どこですか',
      'es': 'dónde está',
      'fr': 'où est',
      'de': 'wo ist',
      'it': 'dov\'è',
      'pt': 'onde está',
      'ru': 'где находится',
      'zh': '在哪里',
      'ko': '어디입니까',
      'ar': 'أين',
      'hi': 'कहाँ है'
    },
    'friend': {
      'en': 'friend',
      'ja': '友達',
      'es': 'amigo',
      'fr': 'ami',
      'de': 'freund',
      'it': 'amico',
      'pt': 'amigo',
      'ru': 'друг',
      'zh': '朋友',
      'ko': '친구',
      'ar': 'صديق',
      'hi': 'दोस्त'
    },
    'good morning': {
      'en': 'good morning',
      'ja': 'おはよう',
      'es': 'buenos días',
      'fr': 'bonjour',
      'de': 'guten morgen',
      'it': 'buongiorno',
      'pt': 'bom dia',
      'ru': 'доброе утро',
      'zh': '早上好',
      'ko': '좋은 아침',
      'ar': 'صباح الخير',
      'hi': 'सुप्रभात'
    }
  };

  // Create reverse lookup map for bidirectional translation
  const reverseLookup: { [key: string]: string } = {};
  Object.keys(translations).forEach(englishKey => {
    Object.entries(translations[englishKey]).forEach(([langCode, translation]) => {
      if (langCode !== 'en') {
        reverseLookup[translation.toLowerCase()] = englishKey;
      }
    });
  });

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setLoading(true);
    
    // Simulate translation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lowerText = sourceText.toLowerCase().trim();
    let translation = '';
    
    // Try direct match first
    for (const [key, langTranslations] of Object.entries(translations)) {
      // Check if input matches source language translation
      const sourceTranslation = langTranslations[sourceLang]?.toLowerCase();
      if (sourceTranslation === lowerText) {
        translation = langTranslations[targetLang] || '';
        break;
      }
    }
    
    // Try partial match
    if (!translation) {
      for (const [key, langTranslations] of Object.entries(translations)) {
        const sourceTranslation = langTranslations[sourceLang]?.toLowerCase();
        if (sourceTranslation && lowerText.includes(sourceTranslation)) {
          translation = langTranslations[targetLang] || '';
          break;
        }
      }
    }
    
    // If no match found, provide simulated translation
    if (!translation) {
      const targetLangName = languages.find(l => l.code === targetLang)?.name || 'target language';
      const sourceLangName = languages.find(l => l.code === sourceLang)?.name || 'source language';
      
      translation = `[Simulated ${sourceLangName} to ${targetLangName} translation]\n\n"${sourceText}"\n\n→ Translation of "${sourceText}"`;
    }
    
    setTranslatedText(translation);
    setLoading(false);
  };

  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get common phrases based on source language
  const getCommonPhrases = () => {
    const phrases = [
      { key: 'hello', en: 'Hello' },
      { key: 'thank you', en: 'Thank you' },
      { key: 'goodbye', en: 'Goodbye' },
      { key: 'how are you', en: 'How are you?' },
      { key: 'i need help', en: 'I need help' },
      { key: 'where is', en: 'Where is...?' }
    ];

    return phrases.map(phrase => ({
      text: translations[phrase.key]?.[sourceLang] || phrase.en,
      translation: translations[phrase.key]?.[targetLang] || ''
    }));
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-emerald-100 to-teal-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-700 dark:to-teal-700 px-4 py-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">Translator</h1>
            <p className="text-emerald-100 text-sm">Universal Translation Service</p>
          </div>
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
        </div>

        {/* Translator's Message */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 relative">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white/90 dark:bg-gray-800/90 rotate-45"></div>
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-emerald-600 dark:bg-emerald-700 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Translator:</span> I'll help you communicate with anyone! Understanding different languages is essential for travelers!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Language Selection */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">From</label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleSwapLanguages}
              variant="ghost"
              size="sm"
              className="mt-6 bg-emerald-100 dark:bg-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-700 dark:text-emerald-300"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex-1">
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">To</label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Input Text Area */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 shadow-lg">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Enter text to translate</label>
          <Textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type or paste text here..."
            className="min-h-[120px] bg-white dark:bg-gray-700 dark:text-white border-emerald-300 dark:border-emerald-700 focus:border-emerald-500 dark:focus:border-emerald-500 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">{sourceText.length} characters</span>
            <Button
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim()}
              className="bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white"
            >
              <Languages className="w-4 h-4 mr-2" />
              {loading ? 'Translating...' : 'Translate'}
            </Button>
          </div>
        </Card>

        {/* Translated Text Area */}
        {translatedText && (
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Translation</label>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="min-h-[120px] bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{translatedText}</p>
            </div>
          </Card>
        )}

        {/* Common Phrases */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 shadow-lg">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Common Phrases</h3>
          <div className="grid grid-cols-2 gap-2">
            {getCommonPhrases().map((phrase, index) => (
              <Button
                key={index}
                onClick={() => setSourceText(phrase.text)}
                variant="outline"
                className="h-auto py-3 px-2 flex flex-col items-start bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:bg-gray-200 dark:active:bg-gray-700"
              >
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{phrase.text}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{phrase.translation}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Translator's Tip */}
        <Card className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 p-4 shadow-lg border-2 border-emerald-300 dark:border-emerald-700">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-600 dark:bg-emerald-700 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold">T</span>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-1">Translator's Tip</h4>
              <p className="text-emerald-800 dark:text-emerald-300 text-sm">
                Being able to communicate in any language opens doors to new adventures! Learn a few basic phrases before your travels!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}