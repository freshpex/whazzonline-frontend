import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { signup } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';
import type { AuthRole } from '../types/auth';

type ContactMethod = 'email' | 'phone';
type SignupRole = Exclude<AuthRole, 'admin'>;

export function SignupPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<SignupRole>('customer');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const contactValue = contactMethod === 'email' ? email.trim() : phone.trim();
    if (!contactValue) {
      setError(`Enter your ${contactMethod === 'email' ? 'email address' : 'phone number'} to continue.`);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await signup({
        email: contactMethod === 'email' ? email.trim() : undefined,
        phone: contactMethod === 'phone' ? phone.trim() : undefined,
        password,
        role
      });
      setAuth(response);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">Choose email or phone, then create your account.</p>
      </div>

      {error ? <InlineAlert title={error} tone="error" /> : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Sign up with</label>
          <div className="grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setContactMethod('email')}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${contactMethod === 'email' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600'}`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setContactMethod('phone')}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${contactMethod === 'phone' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600'}`}
            >
              Phone
            </button>
          </div>
        </div>

        {contactMethod === 'email' ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-semibold">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+2348012345678"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Re-enter your password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Account type</label>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as SignupRole)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-slate-900">
          Log in
        </Link>
      </p>
    </section>
  );
}
