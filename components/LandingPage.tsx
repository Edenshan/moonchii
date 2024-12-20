'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface LandingPageProps {
  onStart: () => void
  onLanguageChange: (lang: 'en' | 'zh') => void
}

export default function LandingPage({ onStart, onLanguageChange }: LandingPageProps) {
  const [language, setLanguage] = useState<'en' | 'zh'>('zh')
  const [showLanguageOptions, setShowLanguageOptions] = useState(false)

  const toggleLanguageOptions = () => {
    setShowLanguageOptions(!showLanguageOptions)
  }

  const changeLanguage = (lang: 'en' | 'zh') => {
    setLanguage(lang)
    onLanguageChange(lang)
    setShowLanguageOptions(false)
  }

  const content = {
    en: {
      title: "Image Observing Game",
      subtitle: "Make Learning Language Painless",
      indication: "*You have 7 seconds to observe an image, then you will complete a sentence that describes the image*",
      startButton: "Start Game",
      languageButton: "Language",
      english: "English",
      chinese: "中文"
    },
    zh: {
      title: "图像观察游戏",
      subtitle: "无痛学习语言",
      indication: "*你有7秒钟的时间观察图像，然后你将完成一个描述该图像的句子*",
      startButton: "开始游戏",
      languageButton: "语言",
      english: "English",
      chinese: "中文"
    }
  }

  return (
    <div className="min-h-screen bg-[var(--paper-white)] text-[var(--zen-gray)] flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <div className="relative">
          <Button 
            onClick={toggleLanguageOptions} 
            className="bg-gray-200 text-[var(--zen-gray)] hover:bg-gray-300 transition-colors duration-300"
          >
            {content[language].languageButton}
          </Button>
          {showLanguageOptions && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
              <Button 
                onClick={() => changeLanguage('en')} 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {content[language].english}
              </Button>
              <Button 
                onClick={() => changeLanguage('zh')} 
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {content[language].chinese}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full max-w-2xl animate-fade-in text-center">
        <h1 className="text-4xl font-bold mb-4 text-[var(--sakura-pink)]">
          {content[language].title}
        </h1>
        <p className="text-xl mb-8 text-[var(--zen-gray)]">
          {content[language].subtitle}
        </p>
        <Button 
          onClick={onStart}
          className="px-8 py-4 bg-[var(--sakura-pink)] text-[var(--zen-gray)] text-xl border-2 border-[var(--zen-gray)] hover:bg-[var(--zen-gray)] hover:text-[var(--sakura-pink)] transition-colors duration-300"
        >
          {content[language].startButton}
        </Button>
        <p className="text-sm mt-8 text-gray-500 max-w-md mx-auto">
          {content[language].indication}
        </p>
      </div>
    </div>
  )
}


