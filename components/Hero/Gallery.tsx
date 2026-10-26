"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Expand,
  Image as ImageIcon,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type GalleryItem = {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  rotation?: number;
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Campus Life",
    category: "Our Campus",
    image: "/images/oriental-college.jpg",
    description:
      "Discover the campus, spaces, and experiences that make college life special.",
  },
  {
    id: 2,
    title: "Learning Spaces",
    category: "Infrastructure",
    image: "/images/lib.jpg",
    description:
      "Explore the spaces designed to support learning, focus, and discovery.",
  },
  {
    id: 3,
    title: "Campus Moments",
    category: "Student Life",
    image: "/images/tiro.jpg",
    description:
      "A closer look at the everyday moments and memories of college life.",
    rotation: -90,
  },
  {
    id: 4,
    title: "The Ride",
    category: "Campus Transport",
    image: "/images/ride.jpg",
    description:
      "A better way to stay connected with your college commute.",
  },
  {
    id: 5,
    title: "Our Campus",
    category: "Campus",
    image: "/images/oriental-college.jpg",
    description:
      "Get familiar with the environment that brings our community together.",
  },
  {
    id: 6,
    title: "Knowledge Hub",
    category: "Library",
    image: "/images/lib.jpg",
    description:
      "A place for curiosity, knowledge, and a productive study routine.",
  },
  {
    id: 7,
    title: "College Memories",
    category: "Experiences",
    image: "/images/tiro.jpg",
    description:
      "Every journey through college brings a new experience to remember.",
    rotation: -90,
  },
  {
    id: 8,
    title: "Travel Together",
    category: "Transportation",
    image: "/images/ride.jpg",
    description:
      "Making daily campus travel simpler, more accessible, and convenient.",
  },
  {
    id: 9,
    title: "Campus Architecture",
    category: "Our Campus",
    image: "/images/oriental-college.jpg",
    description:
      "See more of the campus and the spaces where student life happens.",
  },
  {
    id: 10,
    title: "Study & Discover",
    category: "Learning",
    image: "/images/lib.jpg",
    description:
      "Explore the places that make learning part of everyday life.",
  },
  {
    id: 11,
    title: "Student Journey",
    category: "Campus Life",
    image: "/images/tiro.jpg",
    description:
      "The places, people, and moments that shape a student's journey.",
    rotation: -90,
  },
  {
    id: 12,
    title: "Everyday Commute",
    category: "OGI RIDE",
    image: "/images/ride.jpg",
    description:
      "Your everyday college commute, made easier with OGI RIDE.",
  },
];

const curvePattern = [
  "-translate-y-12",
  "-translate-y-6",
  "translate-y-4",
  "translate-y-12",
  "translate-y-4",
  "-translate-y-6",
];

const AUTO_SCROLL_SPEED = 55;
const CARD_SCROLL_DISTANCE = 360;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export default function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const segmentWidthRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const didDragRef = useRef(false);

  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    null
  );
  const [zoom, setZoom] = useState(1);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);

  const duplicatedItems = [...galleryItems, ...galleryItems];
  const selectedItem =
    selectedIndex !== null ? galleryItems[selectedIndex] : null;

  // Respect reduced-motion preferences.
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateMotionPreference = () => {
      setHasReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  // Measure the width of one complete set for seamless looping.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measureTrack = () => {
      const cards = track.querySelectorAll<HTMLElement>(
        "[data-gallery-card]"
      );

      if (cards.length > galleryItems.length) {
        segmentWidthRef.current =
          cards[galleryItems.length].offsetLeft -
          cards[0].offsetLeft;
      }
    };

    measureTrack();

    const observer = new ResizeObserver(measureTrack);
    observer.observe(track);

    window.addEventListener("resize", measureTrack);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureTrack);
    };
  }, []);

  // Smooth, continuous auto-scroll.
  useEffect(() => {
    const track = trackRef.current;

    if (
      !track ||
      isPaused ||
      isDragging ||
      selectedIndex !== null ||
      hasReducedMotion
    ) {
      previousTimeRef.current = null;

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      return;
    }

    const animate = (time: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = time;
      }

      const delta = Math.min(
        (time - previousTimeRef.current) / 1000,
        0.05
      );

      previousTimeRef.current = time;

      const segmentWidth = segmentWidthRef.current;

      if (segmentWidth > 0) {
        track.scrollLeft += AUTO_SCROLL_SPEED * delta;

        if (track.scrollLeft >= segmentWidth) {
          track.scrollLeft -= segmentWidth;
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      previousTimeRef.current = null;
    };
  }, [
    isPaused,
    isDragging,
    selectedIndex,
    hasReducedMotion,
  ]);

  // Keyboard controls for the full-screen viewer.
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
        setZoom(1);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex(
          (current) =>
            current === null
              ? null
              : (current + 1) % galleryItems.length
        );
        setZoom(1);
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex(
          (current) =>
            current === null
              ? null
              : (current - 1 + galleryItems.length) %
                galleryItems.length
        );
        setZoom(1);
      }

      if (event.key === "+" || event.key === "=") {
        setZoom((current) => Math.min(MAX_ZOOM, current + ZOOM_STEP));
      }

      if (event.key === "-") {
        setZoom((current) => Math.max(MIN_ZOOM, current - ZOOM_STEP));
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  const scrollCards = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    setIsPaused(true);

    track.scrollBy({
      left: CARD_SCROLL_DISTANCE * direction,
      behavior: "smooth",
    });
  }, []);

  const openImage = useCallback((index: number) => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }

    setSelectedIndex(index % galleryItems.length);
    setZoom(1);
  }, []);

  const closeViewer = useCallback(() => {
    setSelectedIndex(null);
    setZoom(1);
  }, []);

  const changeImage = useCallback((direction: -1 | 1) => {
    setSelectedIndex((current) => {
      if (current === null) return null;

      return (
        current + direction + galleryItems.length
      ) % galleryItems.length;
    });

    setZoom(1);
  }, []);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    isDraggingRef.current = true;
    didDragRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = track.scrollLeft;

    setIsDragging(true);
    setIsPaused(true);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!isDraggingRef.current) return;

    const track = trackRef.current;
    if (!track) return;

    const distance = event.clientX - dragStartXRef.current;

    if (Math.abs(distance) > 5) {
      didDragRef.current = true;
    }

    track.scrollLeft = dragStartScrollRef.current - distance;
  };

  const stopDragging = () => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const changeZoom = (amount: number) => {
    setZoom((current) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + amount))
    );
  };

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden bg-white py-20 text-black sm:py-28 lg:py-32"
    >
      {/* Subtle monochrome background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-36 top-36 h-72 w-72 rounded-full bg-gray-100/80 blur-3xl" />
        <div className="absolute -right-36 bottom-20 h-80 w-80 rounded-full bg-zinc-100/80 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(#000000 0.7px, transparent 0.7px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-4xl px-5 text-center sm:mb-20 sm:px-8">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.19em] text-black sm:text-sm">
            <ImageIcon className="h-4 w-4" />
            A glimpse of college life
          </div>

          <h2
            id="gallery-heading"
            className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.055em] text-black sm:text-5xl md:text-6xl lg:text-7xl"
          >
            More than a commute.
            <span className="mt-2 block text-black">
              A campus experience.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
            Explore the places, journeys, and everyday moments
            that make college life memorable. Get a glimpse of
            the world around OGI RIDE.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-black" />
              Campus life
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-500" />
              Student experiences
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-300" />
              College transport
            </span>
          </div>
        </div>

        {/* Gallery heading and controls */}
        <div className="mb-8 flex flex-col gap-5 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
              The gallery
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              Life in every frame.
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Drag to explore or select any image to view it.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPaused((current) => !current)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-300"
              aria-label={isPaused ? "Play gallery" : "Pause gallery"}
            >
              {isPaused ? (
                <Play className="h-4 w-4 fill-current" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
              <span>{isPaused ? "Play" : "Pause"}</span>
            </button>

            <button
              type="button"
              onClick={() => scrollCards(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-300"
              aria-label="Scroll gallery left"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollCards(1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:bg-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-300"
              aria-label="Scroll gallery right"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Infinite C-shaped gallery */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            stopDragging();
            setIsPaused(false);
          }}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (
              !event.currentTarget.contains(
                event.relatedTarget as Node | null
              )
            ) {
              setIsPaused(false);
            }
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent sm:w-20 lg:w-32"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-20 lg:w-32"
          />

          <div
            ref={trackRef}
            className={`gallery-track flex gap-5 overflow-x-auto overflow-y-hidden px-8 pb-16 pt-16 sm:gap-7 sm:px-20 sm:pb-24 sm:pt-24 lg:gap-8 lg:px-32 ${
              isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            onDragStart={(event) => event.preventDefault()}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              touchAction: "pan-x pan-y",
            }}
          >
            {duplicatedItems.map((item, index) => {
              const originalIndex = index % galleryItems.length;
              const curveClass = curvePattern[index % curvePattern.length];

              return (
                <button
                  key={`${item.id}-${index}`}
                  type="button"
                  data-gallery-card
                  onClick={() => openImage(originalIndex)}
                  className={`group relative w-[260px] flex-none self-start text-left transition-transform duration-700 ease-out sm:w-[300px] lg:w-[340px] ${curveClass} hover:z-20 hover:!translate-y-0 focus:z-20 focus:!translate-y-0 focus:outline-none`}
                  aria-label={`View image: ${item.title}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-gray-200 bg-gray-100 shadow-[0_12px_35px_rgba(0,0,0,0.07)] transition duration-500 group-hover:scale-[1.025] group-hover:border-black group-hover:shadow-[0_28px_70px_rgba(0,0,0,0.18)] group-focus-visible:ring-4 group-focus-visible:ring-gray-300 sm:rounded-[1.8rem]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      draggable={false}
                      sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 340px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      style={
                        item.rotation
                          ? {
                              transform: `rotate(${item.rotation}deg) scale(1.35)`,
                            }
                          : undefined
                      }
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white shadow-sm backdrop-blur-xl sm:text-[11px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <Expand className="h-4 w-4" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-300">
                        <span className="h-px w-6 bg-white" />
                        OGI RIDE
                      </div>

                      <h4 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {item.title}
                      </h4>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/75">
                        {item.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                        <span className="text-xs font-semibold text-white/90">
                          Explore image
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition duration-300 group-hover:rotate-45 group-hover:bg-black group-hover:text-white">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between px-1">
                    <span className="text-xs font-medium tracking-[0.15em] text-gray-400">
                      {String(originalIndex + 1).padStart(2, "0")}
                      <span className="mx-2 text-gray-300">/</span>
                      {String(galleryItems.length).padStart(2, "0")}
                    </span>

                    <div className="h-px w-12 bg-gray-200 transition-all duration-500 group-hover:w-20 group-hover:bg-black" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mx-5 mt-2 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:mx-8 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:mx-12">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gray-100 text-black">
              <Maximize2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-black">
                Every frame tells a story.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Select a card for the full-screen gallery experience.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedIndex(0);
              setZoom(1);
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 sm:self-auto"
          >
            Explore gallery
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 px-5 text-center text-xs text-gray-400 sm:text-sm">
          <span className="h-px w-8 bg-gray-200" />
          <span>Discover campus life with OGI RIDE</span>
          <span className="h-px w-8 bg-gray-200" />
        </div>
      </div>

      {/* Full-screen image viewer */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 backdrop-blur-xl sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${selectedItem.title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeViewer();
            }
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(#ffffff 0.7px, transparent 0.7px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative flex h-full max-h-[950px] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl sm:rounded-3xl">
            {/* Viewer toolbar */}
            <div className="relative z-20 flex flex-none items-center justify-between gap-3 border-b border-white/10 bg-neutral-950/95 px-4 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white text-black">
                  <ImageIcon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white sm:text-base">
                    {selectedItem.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {String(selectedIndex! + 1).padStart(2, "0")} of{" "}
                    {String(galleryItems.length).padStart(2, "0")}
                    <span className="mx-1.5">·</span>
                    {selectedItem.category}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeViewer}
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/20 hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                aria-label="Close image viewer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main image stage */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black">
              <button
                type="button"
                onClick={() => changeImage(-1)}
                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:left-5 sm:h-12 sm:w-12"
                aria-label="Previous image"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-12 sm:p-16">
                <div className="relative h-full w-full">
                  <Image
                    key={selectedItem.id}
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    priority
                    sizes="100vw"
                    draggable={false}
                    className="object-contain transition-transform duration-300 ease-out"
                    style={{
                      transform: `scale(${zoom}) rotate(${selectedItem.rotation ?? 0}deg)`,
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => changeImage(1)}
                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-white hover:text-black sm:right-5 sm:h-12 sm:w-12"
                aria-label="Next image"
              >
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Zoom controls */}
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-neutral-950/90 p-1.5 text-white shadow-xl backdrop-blur-xl sm:bottom-6">
                <button
                  type="button"
                  onClick={() => changeZoom(-ZOOM_STEP)}
                  disabled={zoom <= MIN_ZOOM}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>

                <span className="w-14 text-center text-xs font-semibold tabular-nums">
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  type="button"
                  onClick={() => changeZoom(ZOOM_STEP)}
                  disabled={zoom >= MAX_ZOOM}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>

                <span className="mx-1 h-5 w-px bg-white/15" />

                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="flex h-9 items-center gap-2 rounded-full px-3 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Description and thumbnail navigation */}
            <div className="relative z-20 flex flex-none flex-col gap-4 border-t border-white/10 bg-neutral-950/95 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm leading-6 text-gray-300">
                    {selectedItem.description}
                  </p>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Use your keyboard arrow keys to browse images.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Check className="h-3.5 w-3.5" />
                  {zoom === 1 ? "Original size" : "Reset view"}
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {galleryItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(index);
                      setZoom(1);
                    }}
                    className={`relative h-14 w-14 flex-none overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-16 ${
                      selectedIndex === index
                        ? "border-white opacity-100"
                        : "border-white/10 opacity-55 hover:border-white/50 hover:opacity-100"
                    }`}
                    aria-label={`View ${item.title}`}
                    aria-current={
                      selectedIndex === index ? "true" : undefined
                    }
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Browser fullscreen toggle */}
          <button
            type="button"
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement
                  .requestFullscreen()
                  .catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            className="absolute right-5 top-5 z-[110] hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-white hover:text-black lg:flex"
            aria-label="Toggle browser fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <style jsx>{`
        .gallery-track::-webkit-scrollbar {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-track {
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
