import { useState, type FormEvent } from 'react';
import { signIn, signUp } from '../lib/auth';

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const result = await signUp(email, password);

        if (result?.user) {
          setMessage('Usuário cadastrado com sucesso! Você já pode fazer login.');
        } else {
          setMessage('Cadastro realizado. Verifique seu e-mail para confirmar a conta.');
        }
      } else {
        await signIn(email, password);
        setMessage('Login realizado com sucesso!');
        onSuccess?.();
      }

      setEmail('');
      setPassword('');
    } catch (error: any) {
      setMessage(error.message || 'Erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-surface p-6 rounded-2xl shadow-lg border border-outline">
      <h2 className="text-xl font-bold mb-4 text-primary">Acesso ao sistema</h2>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className={`flex-1 py-2 rounded-xl font-semibold ${mode === 'signup' ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}
          onClick={() => setMode('signup')}
        >
          Cadastrar
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-xl font-semibold ${mode === 'signin' ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}
          onClick={() => setMode('signin')}
        >
          Entrar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-on-surface-variant">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-outline px-3 py-2 bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </label>

        <label className="block text-sm font-medium text-on-surface-variant">
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-outline px-3 py-2 bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-secondary px-4 py-3 text-white font-bold hover:bg-secondary-focus transition disabled:opacity-60"
        >
          {loading ? 'Aguarde...' : mode === 'signup' ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-on-surface-variant">{message}</p>
      )}
    </div>
  );
}
