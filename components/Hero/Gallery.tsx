"use client";

import React from "react";
import Image from "next/image";

const galleryItems = [
{
id: "01",
title: "The OCT Campus",
category: "CAMPUS LIFE",
image: "/images/oriental-college.jpg",
className: "md:col-span-2 md:row-span-2",
},
{
id: "02",
title: "A Place to Learn",
category: "ACADEMICS",
image: "/images/bus-01.jpg",
className: "",
},
{
id: "03",
title: "Student Life",
category: "COMMUNITY",
image: "/images/bus-02.jpg",
className: "",
},
{
id: "04",
title: "The Journey Together",
category: "OCT RIDE",
image: "/images/bus-03.jpg",
className: "md:col-span-2",
},
];

export default function Gallery() {
return ( <section
   id="gallery"
   className="bg-white px-5 py-20 text-slate-950 sm:px-8 sm:py-28 lg:px-14"
 > <div className="mx-auto max-w-[1400px]">
{/* Section Heading */} <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end"> <div className="max-w-2xl"> <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
Life at Oriental </p>


        <h2 className="text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          More than a
          <br />
          <span className="text-slate-400">daily commute.</span>
        </h2>
      </div>

      <p className="max-w-md text-sm leading-7 text-slate-500 sm:text-base">
        Every college day is a new journey. Discover the spaces,
        people, and experiences that make campus life special.
      </p>
    </div>

    {/* Gallery Grid */}
    <div className="grid auto-rows-[250px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[240px] md:grid-cols-4 md:gap-5 lg:auto-rows-[280px]">
      {galleryItems.map((item) => (
        <article
          key={item.id}
          className={`group relative isolate overflow-hidden rounded-2xl bg-slate-100 ${item.className}`}
        >
          {/* Image */}
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Neutral Overlay */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-black/5 transition-opacity duration-300 group-hover:from-black/90" />

          {/* Top Number */}
          <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/10 text-xs font-semibold text-white backdrop-blur-sm">
            {item.id}
          </div>

          {/* Text */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
              {item.category}
            </p>

            <div className="flex items-end justify-between gap-3">
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                {item.title}
              </h3>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17 17 7M7 7h10v10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>

    {/* Bottom Note */}
    <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs leading-6 text-slate-500">
        One campus. Countless journeys. A connected OCT community.
      </p>

      <a
        href="/find"
        className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-950 transition-colors hover:text-slate-500"
      >
        Explore bus routes
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  </div>
</section>


);
}
