"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@repo/auth/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL + "/admin",
    });

    if (err) {
      setError(err.message ?? "Erro ao criar conta.");
      setLoading(false);
      return;
    }

    router.push(process.env.NEXT_PUBLIC_BETTER_AUTH_URL + "/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-xl">
        <div className="card-body gap-4">
          <h1 className="card-title text-2xl font-bold">Criar conta</h1>

          {error && (
            <div role="alert" className="alert alert-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Nome</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">E-mail</span>
              </div>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Senha</span>
              </div>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Criar conta"
              )}
            </button>
          </form>

          <p className="text-center text-sm opacity-60">
            Já tem uma conta?{" "}
            <a href="/login" className="link link-primary">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
