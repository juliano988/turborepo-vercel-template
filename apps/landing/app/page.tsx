import { ThemeToggleDaisyUI } from "@repo/ui";

export default function Page() {
  return (
    <main className="bg-base-100 text-base-content relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_color-mix(in_oklab,var(--color-primary)_22%,transparent),transparent_32%),radial-gradient(circle_at_bottom_right,_color-mix(in_oklab,var(--color-secondary)_18%,transparent),transparent_30%)]" />
      <div className="from-base-200/80 absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b to-transparent" />

      <div className="fixed top-4 right-4 z-20 sm:top-6 sm:right-6">
        <ThemeToggleDaisyUI />
      </div>

      <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="badge badge-outline badge-lg px-4 py-4 text-xs font-semibold tracking-[0.28em] uppercase">
              Template · Landing
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-black tracking-tight text-balance sm:text-5xl lg:text-7xl">
                Uma landing que converte melhor em qualquer tela.
              </h1>
              <p className="text-base-content/70 mx-auto max-w-2xl text-base leading-8 sm:text-lg lg:mx-0">
                Apresente seu produto com uma estrutura mais forte, CTAs claros
                e uma vitrine visual que continua leve, rápida e pronta para
                SEO.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <a href="/app" className="btn btn-primary btn-lg sm:min-w-40">
                Abrir App
              </a>
              <a href="/login" className="btn btn-outline btn-lg sm:min-w-40">
                Entrar
              </a>
              <a href="/docs" className="btn btn-ghost btn-lg sm:min-w-40">
                Ver Docs
              </a>
            </div>

            <div className="grid gap-4 text-left sm:grid-cols-3">
              <div className="border-base-300/70 bg-base-100/70 rounded-2xl border p-4 shadow-sm backdrop-blur">
                <p className="text-3xl font-bold">+120%</p>
                <p className="text-base-content/65 mt-1 text-sm">
                  Mais clareza na proposta principal acima da dobra.
                </p>
              </div>
              <div className="border-base-300/70 bg-base-100/70 rounded-2xl border p-4 shadow-sm backdrop-blur">
                <p className="text-3xl font-bold">3 CTAs</p>
                <p className="text-base-content/65 mt-1 text-sm">
                  Jornada principal, login e documentação sem ruído.
                </p>
              </div>
              <div className="border-base-300/70 bg-base-100/70 rounded-2xl border p-4 shadow-sm backdrop-blur">
                <p className="text-3xl font-bold">100%</p>
                <p className="text-base-content/65 mt-1 text-sm">
                  Adaptada para mobile, tablet e desktop com contraste melhor.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-primary/10 absolute inset-0 scale-95 rounded-[2rem] blur-3xl" />
            <div className="border-base-300/70 bg-base-100/85 relative rounded-[2rem] border p-5 shadow-2xl backdrop-blur sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-base-content/45 text-sm font-semibold tracking-[0.24em] uppercase">
                    Visão Geral
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Seu ecossistema pronto
                  </h2>
                </div>
                <a href="/admin" className="btn btn-sm btn-outline">
                  BackOffice
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-base-200 rounded-2xl p-5">
                  <p className="text-primary text-sm font-semibold">
                    Experiência
                  </p>
                  <p className="mt-3 text-xl font-bold">
                    Hero forte, texto enxuto e ação imediata.
                  </p>
                  <p className="text-base-content/65 mt-3 text-sm leading-6">
                    O conteúdo principal fica legível no mobile e ganha presença
                    no desktop sem depender de excesso de texto.
                  </p>
                </div>
                <div className="bg-neutral text-neutral-content rounded-2xl p-5">
                  <p className="text-secondary-content/80 text-sm font-semibold">
                    Performance
                  </p>
                  <p className="mt-3 text-xl font-bold">
                    Estrutura simples para iterar rápido.
                  </p>
                  <p className="text-neutral-content/75 mt-3 text-sm leading-6">
                    Sem componentes pesados: só composição, contraste e layout.
                  </p>
                </div>
                <div className="border-base-300 rounded-2xl border border-dashed p-5 sm:col-span-2">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base-content/45 text-sm font-semibold tracking-[0.2em] uppercase">
                        Próximo passo
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        Conecte este bloco a prova social, pricing ou demo.
                      </p>
                    </div>
                    <a href="/register" className="btn btn-secondary">
                      Criar conta
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
