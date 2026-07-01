import { ThemeToggleDaisyUI } from "@repo/ui";

export default function Home() {
  return (
    <>
      <div className="fixed top-4 right-4">
        <ThemeToggleDaisyUI />
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-sm font-medium tracking-widest uppercase opacity-50">
            Template · Landing
          </p>
          <h1 className="text-5xl font-bold tracking-tight">
            Sua landing page
          </h1>
          <p className="mx-auto max-w-md text-lg opacity-60">
            Aqui vai o conteúdo de marketing. Otimizado para SEO, rápido por
            padrão.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <a
              href="/app"
              className="btn btn-primary"
            >
              Abrir App
            </a>
            <a
              href="/admin"
              className="btn btn-outline"
            >
              Ver BackOffice
            </a>
            <a
              href="/docs"
              className="btn btn-outline"
            >
              Ver Docs
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
