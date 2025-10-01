'use client'

import Layout from '../components/Layout'
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks'
import { Brain, Shield, Zap, Users, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const { isLoggedIn, address } = useGetLoginInfo()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-400">AI System Online</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              GPZ-94
            </span>
            <br className="md:hidden" />
            <span className="text-white"> AI Dashboard</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Revolutionary AI-powered smart contract system that interprets natural language 
            instructions and translates them into secure blockchain operations.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">94%</span>
            </div>
            <h3 className="font-semibold text-white mb-1">AI Confidence</h3>
            <p className="text-gray-400 text-sm">Average decision accuracy</p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">12</span>
            </div>
            <h3 className="font-semibold text-white mb-1">Active Policies</h3>
            <p className="text-gray-400 text-sm">Smart contracts monitored</p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-white">2.3s</span>
            </div>
            <h3 className="font-semibold text-white mb-1">Processing Time</h3>
            <p className="text-gray-400 text-sm">Average AI analysis speed</p>
          </div>
        </div>

        {/* Main Content */}
        {isLoggedIn ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Policy Manager */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">AI Policy Manager</h3>
                  <p className="text-gray-400 text-sm">Manage roles with AI assistance</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Admin Role</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
                  </div>
                  <p className="text-gray-400 text-sm">Full system access with AI validation</p>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Trader Role</span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Pending</span>
                  </div>
                  <p className="text-gray-400 text-sm">Trading operations with risk assessment</p>
                </div>
                
                <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 font-medium py-3 px-4 rounded-lg transition-all duration-200">
                  Create New Policy
                </button>
              </div>
            </div>

            {/* Natural Language Interface */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Natural Language Interface</h3>
                  <p className="text-gray-400 text-sm">Execute commands with plain English</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <textarea 
                    placeholder="Type your instruction here...\ne.g., 'Grant trader role to erd1user123 with 85% confidence'"
                    className="w-full bg-transparent text-white placeholder-gray-500 resize-none border-none outline-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>AI Parser Ready</span>
                </div>
                
                <button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 font-medium py-3 px-4 rounded-lg transition-all duration-200">
                  Process Instruction
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Login Prompt */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <Users className="w-10 h-10 text-blue-400" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-400">
                  Access the AI-powered smart contract dashboard by connecting your MultiversX wallet.
                </p>
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h4 className="font-semibold text-white mb-3">What you can do:</h4>
                <ul className="space-y-2 text-sm text-gray-400 text-left">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <span>Manage AI-enhanced smart contract roles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <span>Execute commands using natural language</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <span>Monitor security audits and AI recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <span>View real-time analytics and metrics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}