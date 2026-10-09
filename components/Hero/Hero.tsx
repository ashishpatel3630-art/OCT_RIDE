"use client";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-slate-950">

      
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/oriental-college.jpg')",
        }}
      />

      
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/65"
      />

     
      <div className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-24 text-center sm:px-8">

        <div className="flex w-full flex-col items-center">

         
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            OCT Campus Transport
          </p>

          
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl lg:text-[88px]">
            Your campus.
            <br />
            <span className="text-blue-400">
              Your ride.
            </span>
          </h1>

          
          <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
            Find your college bus, check your route, and get where
            you need to go without the guesswork.
          </p>

         
          <div className="mt-9">
            <a
              href="#find-bus"
              className="group inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Find Your Bus

              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>
          </div>

        </div>
      </div>


      <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">

        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/35">
          Scroll
        </span>

        <div className="h-8 w-px bg-white/20">
          <div className="h-1/2 w-full animate-pulse bg-blue-400" />
        </div>

      </div>

    </section>
  );
}

