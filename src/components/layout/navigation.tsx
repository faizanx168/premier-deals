"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Menu, 
  X, 
  Home, 
  Building2, 
  MapPin, 
  User, 
  LogOut,
  Settings,
  Heart,
  Bell,
  ChevronDown,
  Plus,
  UserCheck
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Navigation() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/properties?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
    setIsUserMenuOpen(false)
  }

  const userRole = (session?.user as { role?: string })?.role
  const isAdmin = userRole === 'ADMIN'
  const isRealtor = userRole === 'REALTOR'

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}  
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/logo.png" 
              alt="Premier Deals" 
              width={100} 
              height={100}
              className="w-15 h-15 object-contain"
            />
            <span className="text-xl font-bold text-gray-900"></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/properties" 
              className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center"
            >
              <Building2 className="w-4 h-4 mr-1" />
              Buy
            </Link>
            <Link 
              href="/properties?type=rent" 
              className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center"
            >
              <Home className="w-4 h-4 mr-1" />
              Rent
            </Link>
            <Link 
              href="/properties?type=land" 
              className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Land
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search properties, neighborhoods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary"
              />
            </form>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium">
                    {session.user?.name}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                      {userRole && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                          {userRole}
                        </span>
                      )}
                    </div>
                    
                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                      )}
                      
                      <Link
                        href="/favorites"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-3" />
                        Favorites
                      </Link>
                      
                      <Link
                        href="/notifications"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Bell className="w-4 h-4 mr-3" />
                        Notifications
                      </Link>
                      
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Admin/Realtor Actions */}
            {(isAdmin || isRealtor) && (
              <Link href="/admin-properties">
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search properties, neighborhoods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary"
            />
          </form>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/properties" 
                className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Buy
              </Link>
              <Link 
                href="/properties?type=rent" 
                className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4 mr-2" />
                Rent
              </Link>
              <Link 
                href="/properties?type=land" 
                className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Land
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile User Section */}
              <div className="pt-4 border-t border-gray-200">
                {status === 'loading' ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-full rounded"></div>
                ) : session ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {session.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500">{session.user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {isAdmin && (
                        <Link
                          href="/dashboard"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                      )}
                      
                      <Link
                        href="/favorites"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-3" />
                        Favorites
                      </Link>
                      
                      <Link
                        href="/profile"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>

                    {(isAdmin || isRealtor) && (
                      <Link
                        href="/admin-properties"
                        className="flex items-center px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Plus className="w-4 h-4 mr-3" />
                        Add Property
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 