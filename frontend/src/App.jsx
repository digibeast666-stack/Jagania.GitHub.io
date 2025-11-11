import React, { useState, useEffect } from 'react'
import PaymentButton from './components/PaymentButton'
import QuestionInput from './components/QuestionInput'
import AnswerDisplay from './components/AnswerDisplay'
import { Sparkles, Shield, Zap, Globe } from 'lucide-react'

function App() {
  const [sessionId, setSessionId] = useState(null)
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Check for successful payment on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionIdFromUrl = urlParams.get('session_id')
    
    if (sessionIdFromUrl) {
      setSessionId(sessionIdFromUrl)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handlePaymentSuccess = (newSessionId) => {
    setSessionId(newSessionId)
    setError('')
  }

  const handleQuestionSubmit = async (question) => {
    setIsLoading(true)
    setError('')
    setAnswer('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sessionId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()
      setAnswer(data.answer)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetSession = () => {
    setSessionId(null)
    setAnswer('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-caribbean-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-8 slide-up">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg mb-4">
            <div className="w-8 h-8 bg-caribbean-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="font-bold text-gray-800">Jogaina Pro</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Caribbean Business Advice
            <br />
            <span className="text-caribbean-600">for $0.01</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
            Get instant, actionable business guidance tailored for Caribbean entrepreneurs
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: Zap, text: 'Instant Answers', color: 'text-yellow-500' },
              { icon: Shield, text: 'Secure Payment', color: 'text-green-500' },
              { icon: Globe, text: 'Caribbean Focus', color: 'text-blue-500' },
              { icon: Sparkles, text: 'AI Powered', color: 'text-purple-500' }
            ].map(({ icon: Icon, text, color }, index) => (
              <div key={text} className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm font-medium text-gray-700">{text}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!sessionId ? (
            <div className="text-center slide-up">
              <div className="mb-6">
                <div className="text-6xl mb-4">🏝️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Get Started?</h2>
                <p className="text-gray-600 mb-6">
                  Pay $0.01 to unlock your personalized business consultation
                </p>
              </div>
              
              <PaymentButton 
                onSuccess={handlePaymentSuccess}
                onError={setError}
              />
              
              <div className="mt-6 text-xs text-gray-500">
                Powered by Stripe • Secure • No subscription
              </div>
            </div>
          ) : (
            <div className="slide-up">
              {!answer && !isLoading && (
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-4">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Payment Confirmed</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">What's Your Business Question?</h2>
                  <p className="text-gray-600">Ask anything about starting, growing, or managing your Caribbean business</p>
                </div>
              )}
              
              <QuestionInput 
                onSubmit={handleQuestionSubmit}
                isLoading={isLoading}
                hasAnswer={!!answer}
              />
              
              <AnswerDisplay 
                answer={answer}
                isLoading={isLoading}
              />
              
              {answer && (
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <button
                    onClick={resetSession}
                    className="text-caribbean-600 hover:text-caribbean-700 font-medium text-sm transition-colors"
                  >
                    Ask Another Question ($0.01)
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500">
          <p>Tailored for Trinidad, Jamaica, Barbados, and the entire Caribbean</p>
          <p className="mt-1">© 2024 Jogaina Pro • Built with AI</p>
        </footer>
      </div>
    </div>
  )
}

export default App
