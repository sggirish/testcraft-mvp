import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Floating Orbs */}
      <div className="orb-canvas">
        <div className="orb orb-pink" />
        <div className="orb orb-blue" />
        <div className="orb orb-purple" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="glass-card p-12 max-w-2xl w-full text-center space-y-8">
          <h1 className="text-6xl font-bold text-white">
            TestCraft
          </h1>
          <p className="text-xl text-white/80 max-w-md mx-auto">
            Visual test automation platform that makes testing accessible to everyone
          </p>
          
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href={ROUTES.LOGIN}
              className="glass-button px-8 py-3 font-medium text-white hover:text-white"
            >
              Login
            </Link>
            <Link
              href={ROUTES.SIGNUP}
              className="glass-button px-8 py-3 font-medium text-white hover:text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}