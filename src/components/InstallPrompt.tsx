import { useState, useEffect } from 'react'
import { useTranslation } from '../hooks/useTranslation'

// Interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function InstallPrompt() {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true
    if (isInstalled) return

    // Handler to capture the install prompt event
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show the customized install prompt
      setShowPrompt(true)
    }

    // Handler to detect when the app is successfully installed
    const installedHandler = () => {
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  // Function to trigger the installation flow
  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We've used the prompt, so we can't use it again, discard it
    setDeferredPrompt(null)
    setShowPrompt(false)

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }
  }

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setShowPrompt(false)
      setIsExiting(false)
    }, 300)
  }

  // If the prompt shouldn't be shown, render nothing
  if (!showPrompt && !isExiting) return null

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal - Centered */}
      <div className={`relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 border border-gray-100 ${isExiting ? 'scale-95' : 'scale-100 animate-fade-in-up'}`}>

        {/* Header Enhancement with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-20 transform -skew-y-6 origin-top-left"></div>

          <div className="relative z-10 mx-auto w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <h3 className="relative z-10 text-xl font-bold text-white tracking-tight">
            {t('pwa.install_title') || 'Install App'}
          </h3>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t('pwa.install_desc') || 'Get the best experience with offline access, notifications, and faster loading speeds.'}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>{t('pwa.install_btn')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </button>

            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 text-gray-500 font-medium hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors text-sm"
            >
              {t('common.close') || 'Maybe Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
