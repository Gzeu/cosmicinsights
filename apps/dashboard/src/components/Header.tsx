import React from 'react';
import { useGetLoginInfo, useLogout } from '@multiversx/sdk-dapp/hooks';
import {
  ExtensionLoginButton,
  WebWalletLoginButton,
  WalletConnectLoginButton,
  LedgerLoginButton,
} from '@multiversx/sdk-dapp/UI';
import { Brain, Zap, Shield } from 'lucide-react';

const Header = () => {
  const { isLoggedIn, address } = useGetLoginInfo();
  const { logout } = useLogout();

  const truncateAddress = (addr: string) => 
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                GPZ-94
              </h1>
              <p className="text-xs text-gray-400 -mt-1">AI Smart Contracts</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#dashboard" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
            <Zap className="w-4 h-4" />
            <span>Dashboard</span>
          </a>
          <a href="#policies" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
            <Shield className="w-4 h-4" />
            <span>Policies</span>
          </a>
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm text-gray-300">
                  {truncateAddress(address)}
                </span>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  Connected
                </span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={() => logout('/')}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <span className="text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <ExtensionLoginButton
                callbackRoute="/"
                loginButtonText="Extension"
                className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 hover:text-blue-300 font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              />
              <WebWalletLoginButton
                callbackRoute="/"
                loginButtonText="Web Wallet"
                className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/50 text-gray-400 hover:text-gray-300 font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm hidden sm:block"
              />
              <WalletConnectLoginButton
                callbackRoute="/"
                loginButtonText="WC"
                className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 hover:text-purple-300 font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isLoggedIn && (
        <div className="md:hidden border-t border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="#dashboard" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm">
                <Zap className="w-4 h-4" />
                <span>Dashboard</span>
              </a>
              <a href="#policies" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm">
                <Shield className="w-4 h-4" />
                <span>Policies</span>
              </a>
            </div>
            <span className="text-xs text-gray-400">
              {truncateAddress(address)}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;