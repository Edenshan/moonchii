import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Volume2 } from 'lucide-react'

interface ResultScreenProps {
  sentence: {
    japanese: string
    english: string
    chinese: string
    learningWords: { word: string; english: string; chinese: string }[]
  }
  onTryAgain: () => void
  onNext: () => void
  language: 'en' | 'zh'
  onRemember: () => void
}

export default function ResultScreen({ sentence, onTryAgain, onNext, language, onRemember }: ResultScreenProps) {
  const [audioSupported, setAudioSupported] = useState(false);

  useEffect(() => {
    setAudioSupported('speechSynthesis' in window);
  }, []);

  const speak = (text: string, lang: 'ja-JP' | 'en-US' | 'zh-CN') => {
    if (audioSupported) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  const content = {
    en: {
      greatJob: "Great job!",
      vocabulary: "Vocabulary:",
      tryAgain: "Try Again",
      nextSentence: "Next Sentence",
      alreadyRemembered: "Already Remembered"
    },
    zh: {
      greatJob: "做得好！",
      vocabulary: "词汇：",
      tryAgain: "重试",
      nextSentence: "下一个句子",
      alreadyRemembered: "已记住"
    }
  }

  return (
    <div className="text-center max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-[var(--sakura-pink)]">{content[language].greatJob}</h2>
      <div className="mb-6 animate-scale-in">
        <Image
          src="/placeholder.svg?height=200&width=300"
          alt="Japanese scene"
          width={300}
          height={200}
          className="mx-auto rounded-lg shadow-md"
        />
      </div>
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <p className="text-2xl japanese-text">{sentence.japanese}</p>
          {audioSupported && (
            <Button onClick={() => speak(sentence.japanese, 'ja-JP')} variant="outline" size="sm" className="bg-[var(--sakura-pink)] text-[var(--zen-gray)]">
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-lg text-[var(--zen-gray)]">{language === 'en' ? sentence.english : sentence.chinese}</p>
      </div>
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-[var(--sakura-pink)]">{content[language].vocabulary}</h3>
        <ul>
          {sentence.learningWords.map(({ word, english, chinese }, index) => (
            <li key={index} className="text-lg mb-3 flex items-center justify-center space-x-2">
              <span><strong className="japanese-text">{word}</strong>: {language === 'en' ? english : chinese}</span>
              {audioSupported && (
                <Button onClick={() => speak(word, 'ja-JP')} variant="outline" size="sm" className="bg-[var(--sakura-pink)] text-[var(--zen-gray)]">
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center space-x-4">
        <Button onClick={onTryAgain} className="bg-[var(--sakura-pink)] text-[var(--zen-gray)]">{content[language].tryAgain}</Button>
        <Button onClick={onNext} className="bg-[var(--sakura-pink)] text-[var(--zen-gray)]">{content[language].nextSentence}</Button>
        <Button onClick={onRemember} className="bg-[var(--zen-gray)] text-[var(--paper-white)] hover:bg-[var(--sakura-pink)] hover:text-[var(--zen-gray)]">{content[language].alreadyRemembered}</Button>
      </div>
    </div>
  )
}

