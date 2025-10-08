import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import Success from './components/Success'  // ← New import
import PasswordEntry from './components/PasswordEntry'
import ProtectedRoute from './components/ProtectedRoute'
import { useTheme } from 'next-themes'

function AppContent() {
  const { theme, setTheme } = useTheme()

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            Linklytics 🧬
          </h1>
          <div className="flex items-center gap-4">
            {localStorage.getItem('token') && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Welcome!</span>
                <Button variant="ghost" size="sm" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                  Logout
                </Button>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>
        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics/:shortCode" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/password/:shortCode" element={<PasswordEntry />} />  
            <Route path="/success/:shortCode" element={<ProtectedRoute><Success /></ProtectedRoute>} />  // ← New success route
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false} 
      themes={['light', 'dark']}
    >
      <AppContent />
    </ThemeProvider>
  )
}

export default App