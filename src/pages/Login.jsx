import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 bg-cream">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-white p-8 md:p-10 rounded-sm shadow-luxury">
          <div className="text-center mb-8">
            <Link to="/" className="font-display text-3xl text-gold tracking-wider">VJS</Link>
            <h1 className="font-display text-2xl mt-4 mb-2">Welcome Back</h1>
            <p className="font-sans text-sm text-luxury-gray">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" size={18} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email Address"
                required
                className="input-field pl-12"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                required
                className="input-field pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-gray hover:text-gold transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 font-sans text-luxury-gray cursor-pointer">
                <input type="checkbox" className="accent-gold" />
                Remember me
              </label>
              <a href="#" className="font-sans text-gold hover:underline">Forgot password?</a>
            </div>
            <button type="submit" className="btn-gold w-full">Sign In</button>
          </form>

          <p className="text-center mt-6 font-sans text-sm text-luxury-gray">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
