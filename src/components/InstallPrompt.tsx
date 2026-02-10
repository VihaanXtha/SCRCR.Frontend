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

  // If the prompt shouldn't be shown, render nothing
  if (!showPrompt) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-fade-in-up">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-shrink-0 bg-blue-50 p-3 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#e43f6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-gray-800">{t('pwa.install_title') || 'Install App'}</h3>
          <p className="text-sm text-gray-600">{t('pwa.install_desc') || 'Install our app for a better experience with offline access.'}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setShowPrompt(false)}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('common.close') || 'Later'}
          </button>
          <button 
            onClick={handleInstallClick}
            className="flex-1 sm:flex-none px-6 py-2 text-sm font-bold text-white bg-[#e43f6f] hover:bg-[#c6285b] rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
          >
            {t('pwa.install_btn') || 'Install'}
          </button>
        </div>
      </div>
    </div>
  )
}
