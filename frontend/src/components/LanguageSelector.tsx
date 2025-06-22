import React, { useState, useRef, useEffect } from 'react';
import { Globe2, ChevronDown, Check } from 'lucide-react';
import { Language } from '../types';

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-5 py-4 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 flex items-center justify-between group hover:scale-105"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-base font-bold text-gray-900">{selectedLang.flag} {selectedLang.name}</p>
            <p className="text-sm text-gray-500">{selectedLang.nativeName}</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 group-hover:text-gray-700 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-3 w-full bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl py-3 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="max-h-80 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-4 hover:bg-white/60 flex items-center space-x-4 transition-all duration-300 group
                  ${selectedLanguage === lang.code ? 'bg-blue-50/80 border-r-2 border-blue-500' : ''}`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1">
                    <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {lang.name}
                    </p>
                    <p className="text-sm text-gray-500">{lang.nativeName}</p>
                  </div>
                </div>
                {selectedLanguage === lang.code && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="px-5 py-4 border-t border-white/40">
            <p className="text-sm text-gray-500 text-center font-medium">
              Choose your preferred language for AI responses
            </p>
          </div>
        </div>
      )}
    </div>
  );
}