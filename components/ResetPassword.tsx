import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

export const ResetPassword = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F1E] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#16162A] border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Create New Password</h2>
          <p className="text-gray-400 text-sm">Please enter your new secure password.</p>
        </div>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <p className="text-green-400 font-medium">Password updated successfully!</p>
            <p className="text-gray-500 text-sm mt-2">Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">{error}</div>}
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0B15] border border-white/10 text-white rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:border-[#6366f1] transition-all"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] py-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
            
            <button type="button" onClick={() => navigate('/')} className="w-full text-center text-gray-500 text-sm flex items-center justify-center gap-2 hover:text-white mt-4 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </button>
          </form>
        )}
      </div>
    </div>
  );
};