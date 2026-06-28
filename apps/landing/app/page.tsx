import { ThemeToggleDaisyUI } from "@repo/ui";

export default function Home() {
  return (
    <>
      <div className="fixed top-4 right-4">
        <ThemeToggleDaisyUI />
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-sm font-medium tracking-widest uppercase opacity-50">
            Template · Landing
          </p>
          <h1 className="text-5xl font-bold tracking-tight">
            Sua landing page
          </h1>
          <p className="text-lg opacity-60 max-w-md mx-auto">
            Aqui vai o conteúdo de marketing. Otimizado para SEO, rápido por
            padrão.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL}/app`}
              className="btn btn-primary"
            >
              Abrir App
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_ADMIN_URL}/admin`}
              className="btn btn-outline"
            >
              Ver BackOffice
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs`}
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
