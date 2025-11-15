'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code.trim()) {
      setError('Please enter a certificate code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Try to navigate to the verification page
      router.push(`/verify/${code}`)
    } catch (err) {
      setError('Failed to verify certificate')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10 border-b-2 border-red-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/kda-logo.svg" 
                alt="KDA Logo" 
                className="h-8 sm:h-10 w-auto"
              />
              <div>
                <div className="text-base sm:text-lg font-bold text-gray-900">KIGALI DEUTSCH ACADEMY</div>
                <div className="text-xs text-red-600 font-semibold">Certificate Verification</div>
              </div>
            </div>
            <a
              href="/admin/login"
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors font-semibold text-xs sm:text-sm"
            >
              Admin Login
            </a>
          </div>
        </div>
      </header>

      {/* Main Content - Full Screen Sections */}
      <main className="flex-1 flex flex-col">
        
        {/* SECTION 1: Introduction - Full Width */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-red-50">
          <div className="max-w-5xl mx-auto">
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              <div className="absolute top-20 right-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
              <div className="absolute -bottom-40 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            {/* Intro Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-red-100">
              {/* Header with Logo */}
              <div className="text-center mb-8 md:mb-12">
                <img 
                  src="/kda-logo.svg" 
                  alt="KDA Logo" 
                  className="h-16 sm:h-20 md:h-24 w-auto mx-auto mb-4 md:mb-6 drop-shadow-lg"
                />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                  <span className="text-gray-900">Kigali </span>
                  <span className="bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">Deutsch Academy</span>
                </h2>
                <div className="h-1.5 w-28 md:w-36 bg-gradient-to-r from-red-700 to-red-900 mx-auto rounded-full"></div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* About Section */}
                  <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 border border-red-200">
                    <h3 className="text-xl font-bold text-red-700 mb-3 flex items-center gap-2">
                      <span className="text-3xl">🎓</span>
                      Our Story
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      We are a <strong>leading German language school</strong> proudly serving Rwanda with exceptional education since our establishment. With <strong>5 years of expertise</strong> and a passion for teaching, we have transformed hundreds of students into confident German speakers.
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Location & Branches */}
                  <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-6 border border-red-200">
                    <h3 className="text-xl font-bold text-red-700 mb-3 flex items-center gap-2">
                      <span className="text-3xl">📍</span>
                      Our Presence
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Operating from <strong>two convenient branches</strong> across Kigali, serving hundreds of passionate students committed to mastering the German language and culture.
                    </p>
                    <div className="text-sm text-gray-600 italic">
                      🏢 Multiple locations for your convenience
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl p-5 text-center border-2 border-red-200">
                  <div className="text-4xl mb-2">🏫</div>
                  <div className="font-bold text-gray-900 text-lg">2 Branches</div>
                  <div className="text-sm text-gray-600">Across Kigali</div>
                </div>
                <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl p-5 text-center border-2 border-red-200">
                  <div className="text-4xl mb-2">📚</div>
                  <div className="font-bold text-gray-900 text-lg">5 Years</div>
                  <div className="text-sm text-gray-600">Excellence</div>
                </div>
                <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl p-5 text-center border-2 border-red-200">
                  <div className="text-4xl mb-2">🌍</div>
                  <div className="font-bold text-gray-900 text-lg">Rwanda</div>
                  <div className="text-sm text-gray-600">Based</div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Website CTA */}
                <div className="bg-gradient-to-r from-red-700 via-red-800 to-red-900 rounded-2xl p-6 text-white text-center">
                  <p className="mb-3 font-semibold text-lg">Want to learn more?</p>
                  <a
                    href="https://www.kigalideutchacademy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2.5 bg-white text-red-700 font-bold rounded-lg hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Visit Our Website
                  </a>
                  <p className="text-red-100 text-xs mt-2">www.kigalideutchacademy.com</p>
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-6 text-white text-center">
                  <p className="mb-3 font-semibold text-lg">📧 Get in Touch</p>
                  <p className="font-semibold text-lg">deutschconnectacademy@gmail.com</p>
                  <p className="text-gray-300 text-xs mt-2">We're here to help!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Verification - Full Width */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-gradient-to-b from-red-50 to-white">
          <div className="max-w-2xl mx-auto">
            {/* Verification Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-red-100">
              {/* Logo Section */}
              <div className="text-center mb-8 md:mb-10">
                <img 
                  src="/kda-logo.svg" 
                  alt="KDA Logo" 
                  className="h-16 sm:h-20 md:h-24 w-auto mx-auto mb-4 md:mb-5"
                />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  <span className="text-gray-900">KIGALI </span>
                  <span className="text-red-700">DEUTSCH</span>
                  <span className="text-gray-900"> ACADEMY</span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 font-semibold">Certificate Verification Portal</p>
              </div>

              {/* Description */}
              <div className="mb-8 text-center">
                <p className="text-gray-700 mb-2 text-base md:text-lg font-medium">
                  Verify your German language exam certificate
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  Enter the certificate code from your diploma or scan the QR code
                </p>
              </div>

              {/* Divider */}
              <div className="h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent mb-8 rounded-full"></div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input Field */}
                <div>
                  <label htmlFor="code" className="block text-sm md:text-base font-bold text-gray-900 mb-3">
                    Certificate Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="code"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase())
                        setError('')
                      }}
                      placeholder="e.g., ABC123456789"
                      className="w-full px-4 md:px-5 py-3 md:py-4 pr-12 border-2 border-red-300 rounded-xl focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition-all font-mono text-base md:text-lg bg-red-50 text-black placeholder-black placeholder-opacity-60"
                      disabled={loading}
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-100 border-l-4 border-red-600 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    <p className="text-base text-red-800 font-medium">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 md:py-4 bg-gradient-to-r from-red-700 to-red-900 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base md:text-lg transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Verify Certificate</span>
                    </>
                  )}
                </button>
              </form>

              {/* Info Section */}
              <div className="mt-10 pt-8 border-t-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">ℹ️ How to Use:</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex gap-3">
                    <div className="text-red-700 font-bold text-lg flex-shrink-0">1</div>
                    <div className="text-base">Your certificate code is printed on your diploma</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-red-700 font-bold text-lg flex-shrink-0">2</div>
                    <div className="text-base">Enter the code above (case-insensitive)</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-red-700 font-bold text-lg flex-shrink-0">3</div>
                    <div className="text-base">Your complete certificate information will be displayed</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t-2 border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  For inquiries, contact: <span className="font-bold text-gray-900">deutschconnectacademy@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 border-t-2 border-red-700">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm md:text-base">
          <p>© 2025 Kigali Deutsch Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
