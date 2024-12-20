import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, ArrowLeft, Volume2 } from 'lucide-react'
import { shuffle } from '@/utils/shuffle'
import Image from 'next/image'

interface GameBoardProps {
  sentence: {
    japanese: string
    english: string
    chinese: string
    base: string
    learningWords: { word: string; sound: string; english: string; chinese: string }[]
    characters: string[]
  }
  imageUrl: string
  onComplete: () => void
  onNext: () => void
  language: 'en' | 'zh'
  onRemember: () => void
}

export default function GameBoard({ sentence, imageUrl, onComplete, onNext, language, onRemember }: GameBoardProps) {
  const [currentSentence, setCurrentSentence] = useState(sentence.base.split('').map(char => char === '*' ? '' : char))
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [shuffledChars, setShuffledChars] = useState<Array<{ char: string; count: number }>>([])
  const [audioSupported, setAudioSupported] = useState(false)

  const characterCounts = useMemo(() => {
    return sentence.japanese.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [sentence.japanese])

  useEffect(() => {
    const initialChars = sentence.characters.map(char => ({ 
      char, 
      count: characterCounts[char] || 0 
    }))
    setShuffledChars(shuffle(initialChars))
    setAudioSupported('speechSynthesis' in window)
  }, [sentence, characterCounts])

  const handleCharacterClick = (char: string) => {
    const emptyIndex = currentSentence.findIndex(c => c === '')
    if (emptyIndex !== -1) {
      const newSentence = [...currentSentence]
      newSentence[emptyIndex] = char
      setCurrentSentence(newSentence)

      setShuffledChars(prev => 
        prev.map(c => 
          c.char === char 
            ? { ...c, count: c.count - 1 } 
            : c
        ).filter(c => c.count > 0)
      )
    }
  }

  const handleDelete = () => {
    for (let i = currentSentence.length - 1; i >= 0; i--) {
      if (currentSentence[i] !== '' && sentence.base[i] === '*') {
        const deletedChar = currentSentence[i]
        const newSentence = [...currentSentence]
        newSentence[i] = ''
        setCurrentSentence(newSentence)
        
        setShuffledChars(prev => 
          prev.some(c => c.char === deletedChar)
            ? prev.map(c => c.char === deletedChar ? { ...c, count: c.count + 1 } : c)
            : [...prev, { char: deletedChar, count: 1 }]
        )
        break
      }
    }
  }

  const handleSubmit = () => {
    if (currentSentence.join('') === sentence.japanese) {
      setFeedback('correct')
      setShowResult(true)
    } else {
      setFeedback('incorrect')
    }
  }

  const tryAgain = () => {
    setCurrentSentence(sentence.base.split('').map(char => char === '*' ? '' : char))
    setFeedback(null)
    setShowResult(false)
    const initialChars = sentence.characters.map(char => ({ 
      char, 
      count: characterCounts[char] || 0 
    }))
    setShuffledChars(shuffle(initialChars))
  }

  const handleShowResult = () => {
    setShowResult(true)
  }

  const handleNext = () => {
    onNext()
  }

  const speak = (text: string) => {
    if (audioSupported) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      speechSynthesis.speak(utterance)
    }
  }

  const content = {
    en: {
      submit: "Submit",
      correct: "Correct!",
      incorrect: "Incorrect",
      greatJob: "Great job! You've completed the sentence correctly.",
      tryAgain: "The sentence is not correct. Please try again or view the result.",
      tryAgainButton: "Try Again",
      showResult: "Show Result",
      result: "Result",
      learningWords: "Learning Words:",
      nextSentence: "Next Sentence",
      alreadyRemembered: "Already Remembered"
    },
    zh: {
      submit: "提交",
      correct: "正确！",
      incorrect: "不正确",
      greatJob: "做得好！你已经正确完成了句子。",
      tryAgain: "句子不正确。请重试或查看结果。",
      tryAgainButton: "重试",
      showResult: "显示结果",
      result: "结果",
      learningWords: "学习词汇：",
      nextSentence: "下一个句子",
      alreadyRemembered: "已记住"
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap items-center justify-center mb-6 relative">
        <div className="flex flex-wrap items-center justify-center p-4 bg-white rounded-lg shadow-md max-w-full">
          {currentSentence.map((char, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center text-2xl border-2 m-1 ${
                char === '' ? 'border-dashed border-gray-400' : 'border-solid border-gray-600'
              }`}
            >
              {char}
            </div>
          ))}
        </div>
        {!showResult && (
          <Button 
            onClick={handleDelete} 
            variant="outline" 
            className="p-2 bg-[var(--sakura-pink)] text-[var(--zen-gray)] mt-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
      </div>
      {!showResult && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {shuffledChars.map(({ char, count }, index) => (
              <Button
                key={`${char}-${index}`}
                onClick={() => handleCharacterClick(char)}
                className="text-2xl h-16 w-16 relative bg-[var(--sakura-pink)] text-[var(--zen-gray)] japanese-text animate-scale-in"
              >
                {char}
                {count > 1 && (
                  <span className="absolute top-0 right-0 bg-[var(--zen-gray)] text-[var(--paper-white)] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Button>
            ))}
          </div>
          {!feedback && (
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={handleSubmit} 
                className="px-8 py-2 bg-[var(--sakura-pink)] text-[var(--zen-gray)] border-2 border-[var(--zen-gray)] hover:bg-gray-100 transition-colors duration-300"
              >
                {content[language].submit}
              </Button>
            </div>
          )}
        </>
      )}
      {feedback && !showResult && (
        <Alert className={`mt-4 ${feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'} animate-fade-in`}>
          {feedback === 'correct' ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>{content[language].correct}</AlertTitle>
              <AlertDescription>
                {content[language].greatJob}
              </AlertDescription>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              <AlertTitle>{content[language].incorrect}</AlertTitle>
              <AlertDescription>
                {content[language].tryAgain}
              </AlertDescription>
            </>
          )}
        </Alert>
      )}
      {feedback === 'incorrect' && !showResult && (
        <div className="flex justify-center space-x-4 mt-4 animate-fade-in">
          <Button onClick={tryAgain} className="bg-[var(--sakura-pink)] text-[var(--zen-gray)]">{content[language].tryAgainButton}</Button>
          <Button onClick={handleShowResult} className="bg-[var(--sakura-pink)] text-[var(--zen-gray)]">{content[language].showResult}</Button>
        </div>
      )}
      {showResult && (
        <div className="mt-4 animate-fade-in">
          <Image
            src={imageUrl}
            alt="Sentence illustration"
            width={400}
            height={300}
            className="mx-auto mb-4 rounded-lg shadow-md"
          />
          <h2 className="text-2xl font-bold mb-4 text-[var(--sakura-pink)]">{content[language].result}</h2>
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <p className="text-xl japanese-text">{sentence.japanese}</p>
              {audioSupported && (
                <Button onClick={() => speak(sentence.japanese)} variant="outline" size="sm" className="bg-[var(--sakura-pink)] text-[var(--zen-gray)]">
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-lg">{language === 'en' ? sentence.english : sentence.chinese}</p>
          </div>
          <h3 className="text-xl font-bold mb-2">{content[language].learningWords}</h3>
          <ul className="mb-6">
            {sentence.learningWords.map(({ word, sound, english, chinese }, index) => (
              <li key={index} className="mb-2 flex items-center justify-center space-x-2">
                <span>
                  <strong className="japanese-text">{word}</strong> 
                  <span className="text-gray-500">({sound})</span>: {language === 'en' ? english : chinese}
                </span>
                {audioSupported && (
                  <Button onClick={() => speak(word)} variant="outline" size="sm" className="bg-[var(--sakura-pink)] text-[var(--zen-gray)]">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleNext} 
              className="px-8 py-2 bg-[var(--sakura-pink)] text-[var(--zen-gray)] border-2 border-[var(--zen-gray)] hover:bg-[var(--zen-gray)] hover:text-[var(--sakura-pink)] transition-colors duration-300"
            >
              {content[language].nextSentence}
            </Button>
            <Button 
              onClick={onRemember}
              className="px-8 py-2 bg-[var(--zen-gray)] text-[var(--paper-white)] hover:bg-[var(--sakura-pink)] hover:text-[var(--zen-gray)] transition-colors duration-300 border-2 border-[var(--zen-gray)]"
            >
              {content[language].alreadyRemembered}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


