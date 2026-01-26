import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any) => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

// ✅ Uses Environment Variable (Not hardcoded)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState({ firstName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      if (!credentialResponse.credential) {
        throw new Error("Google token not received");
      }

      // Send the Google Token to your Backend
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google Authentication failed");
      }

      // Save user & token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.result));

      if (onLoginSuccess) onLoginSuccess(data.result);
      onClose();
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(err.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };
  // ----------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // 1. Forgot Password
      if (mode === 'forgot') {
        const response = await fetch(`${API_URL}/api/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setSuccessMsg("Reset link sent! Please check your inbox.");
        return;
      }

      // 2. Sign In / Sign Up
      const endpoint = mode === 'signin' ? 'signin' : 'signup';
      const response = await fetch(`${API_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.firstName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.result));

      if (onLoginSuccess) onLoginSuccess(data.result);
      onClose();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'forgot') return 'Reset Password';
    return mode === 'signin' ? 'Welcome Back' : 'Create Account';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#0F0F1E]/80 backdrop-blur-sm" />

        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#16162A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"><X size={20} /></button>

          <div className="p-8 pt-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{getTitle()}</h2>
            </div>

            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">{error}</div>}
            {successMsg && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">{successMsg}</div>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#6366f1]" size={18} />
                  <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="Full Name" className="w-full bg-[#0B0B15] border border-white/10 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#6366f1] transition-all" required />
                </div>
              )}
              
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#6366f1]" size={18} />
                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="name@email.com" className="w-full bg-[#0B0B15] border border-white/10 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#6366f1] transition-all" required />
              </div>

              {mode !== 'forgot' && (
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#6366f1]" size={18} />
                  <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-[#0B0B15] border border-white/10 text-white rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:border-[#6366f1] transition-all" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              {mode === 'signin' && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }} className="text-xs text-[#6366f1] hover:underline">Forgot password?</button>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:opacity-90 disabled:opacity-50 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>{mode === 'forgot' ? 'Send Reset Link' : (mode === 'signin' ? 'Sign In' : 'Create Account')} <ArrowRight size={18} /></>}
              </button>
            </form>

            {/* --- GOOGLE BUTTON --- */}
            {mode !== 'forgot' && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#16162A] text-gray-500">Or continue with</span></div>
                </div>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google Login Failed")}
                    theme="filled_black"
                    shape="pill"
                    width="250"
                  />
                </div>
              </>
            )}

            <div className="mt-6 text-center text-sm text-gray-400">
              {mode === 'forgot' ? (
                 <button onClick={() => { setMode('signin'); setError(''); setSuccessMsg(''); }} className="flex items-center justify-center gap-2 mx-auto text-white font-medium hover:text-[#6366f1] transition-colors"><ArrowLeft size={16} /> Back to Log In</button>
              ) : (
                <>{mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccessMsg(''); }} className="text-white font-medium hover:underline">{mode === 'signin' ? 'Sign up' : 'Log in'}</button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};