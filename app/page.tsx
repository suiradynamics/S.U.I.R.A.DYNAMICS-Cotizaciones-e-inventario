import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
          S.U.I.R.A. Dynamics &nbsp;
          <code className="font-bold">Cotizaciones e Inventario</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-45 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:size-auto lg:bg-none">
          <span className="flex place-items-center gap-2 p-8 lg:p-0 font-semibold text-blue-600">
            Sistema Activo v1.0
          </span>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-300 before:w-480 before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-180 after:w-240 after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
            Gestión Inteligente de Inventario y Ventas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Control total de productos, servicios y generación de cotizaciones profesionales al instante.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-3 lg:text-left gap-8">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Inventario{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-gray-500`}>
            Control riguroso de stock, alertas de bajo inventario y clasificación de productos y servicios.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Cotizaciones{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-gray-500`}>
            Creación rápida de cotizaciones profesionales con cálculo de impuestos y envío directo.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Reportes{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-gray-500`}>
            Seguimiento de estados de cotizaciones (vistas, aprobadas, cerradas) y métricas clave.
          </p>
        </div>
      </div>
    </main>
  );
}
