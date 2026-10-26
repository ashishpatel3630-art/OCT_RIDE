
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Images,
  Maximize2,
  X,
} from "lucide-react";

type GalleryCategory =
  | "All"
  | "Campus"
  | "Students"
  | "Infrastructure"
  | "Events"
  | "Transport";

type GalleryPhoto = {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  description: string;
  featured?: boolean;
};

/*
  ADD YOUR COLLEGE PHOTOS HERE.

  Put photos inside:
  public/images/gallery/

  Example:
  public/images/gallery/campus-main.jpg

  Then use:
  src: "/images/gallery/campus-main.jpg"

  Replace the sample URLs below with verified Oriental College photos.
*/

const photos: GalleryPhoto[] = [
  {
    id: 1,
    src: "/images/gallery/campus-main.jpg",
    alt: "Oriental College campus exterior",
    title: "The campus",
    category: "Campus",
    description: "A glimpse of the Oriental College campus.",
    featured: true,
  },
  {
    id: 2,
    src: "/images/gallery/students-campus.jpg",
    alt: "Students walking through campus",
    title: "Campus life",
    category: "Students",
    description: "Everyday moments across college life.",
  },
  {
    id: 3,
    src: "/images/gallery/academic-building.jpg",
    alt: "College academic building",
    title: "Learning spaces",
    category: "Infrastructure",
    description: "Spaces dedicated to learning and development.",
  },
  {
    id: 4,
    src: "/images/gallery/college-event.jpg",
    alt: "College event",
    title: "Campus events",
    category: "Events",
    description: "Memorable moments from college events.",
  },
  {
    id: 5,
    src: "/images/gallery/college-bus.jpg",
    alt: "College bus at campus",
    title: "The daily commute",
    category: "Transport",
    description: "The journey to and from campus.",
  },
  {
    id: 6,
    src: "/images/gallery/college-classroom.jpg",
    alt: "College classroom",
    title: "Inside the classroom",
    category: "Infrastructure",
    description: "Spaces for collaboration and learning.",
  },
  {
    id: 7,
    src: "/images/gallery/campus-greenery.jpg",
    alt: "Green campus surroundings",
    title: "Green corners",
    category: "Campus",
    description: "A quieter side of campus life.",
  },
  {
    id: 8,
    src: "/images/gallery/student-group.jpg",
    alt: "Students together on campus",
    title: "College community",
    category: "Students",
    description: "The people who make campus special.",
  },
  {
    id: 9,
    src: "/images/gallery/computer-lab.jpg",
    alt: "Computer laboratory",
    title: "Technology in action",
    category: "Infrastructure",
    description: "Technology and practical learning.",
  },
  {
    id: 10,
    src: "/images/gallery/college-celebration.jpg",
    alt: "College celebration",
    title: "Celebrating together",
    category: "Events",
    description: "Celebrations and campus memories.",
  },
  {
    id: 11,
    src: "/images/gallery/bus-stop.jpg",
    alt: "College transport pickup area",
    title: "Pickup points",
    category: "Transport",
    description: "The start of the daily college journey.",
  },
  {
    id: 12,
    src: "/images/gallery/college-library.jpg",
    alt: "College library",
    title: "The library",
    category: "Infrastructure",
    description: "A place to focus, read, and explore.",
  },
  {
    id: 13,
    src: "/images/gallery/campus-entrance.jpg",
    alt: "College entrance",
    title: "First impressions",
    category: "Campus",
    description: "The entrance to campus life.",
  },
  {
    id: 14,
    src: "/images/gallery/student-activities.jpg",
    alt: "Students participating in activities",
    title: "Beyond the classroom",
    category: "Students",
    description: "Learning and growing together.",
  },
  {
    id: 15,
    src: "/images/gallery/engineering-lab.jpg",
    alt: "Engineering laboratory",
    title: "Practical learning",
    category: "Infrastructure",
    description: "Turning ideas into practical experience.",
  },
  {
    id: 16,
    src: "/images/gallery/cultural-event.jpg",
    alt: "College cultural event",
    title: "Culture and creativity",
    category: "Events",
    description: "Creative expression across campus.",
  },
  {
    id: 17,
    src: "/images/gallery/bus-departure.jpg",
    alt: "College bus departure area",
    title: "Ready for the ride",
    category: "Transport",
    description: "College transport and daily routines.",
  },
  {
    id: 18,
    src: "/images/gallery/campus-courtyard.jpg",
    alt: "College courtyard",
    title: "Campus courtyard",
    category: "Campus",
    description: "A place to meet between classes.",
  },
  {
    id: 19,
    src: "/images/gallery/student-project.jpg",
    alt: "Students working on a project",
    title: "Ideas in progress",
    category: "Students",
    description: "Collaboration, projects, and discovery.",
  },
  {
    id: 20,
    src: "/images/gallery/seminar-hall.jpg",
    alt: "College seminar hall",
    title: "Ideas and conversations",
    category: "Infrastructure",
    description: "Spaces for talks and presentations.",
  },
  {
    id: 21,
    src: "/images/gallery/sports-day.jpg",
    alt: "College sports activity",
    title: "Campus energy",
    category: "Events",
    description: "Activities that bring students together.",
  },
  {
    id: 22,
    src: "/images/gallery/college-shuttle.jpg",
    alt: "College transport vehicle",
    title: "On the move",
    category: "Transport",
    description: "A closer look at the college commute.",
  },
  {
    id: 23,
    src: "/images/gallery/college-auditorium.jpg",
    alt: "College auditorium",
    title: "Gathering spaces",
    category: "Infrastructure",
    description: "Spaces for presentations and gatherings.",
  },
  {
    id: 24,
    src: "/images/gallery/campus-evening.jpg",
    alt: "College campus in the evening",
    title: "End of the day",
    category: "Campus",
    description: "The campus as the day winds down.",
  },
];

const categories: GalleryCategory[] = [
  "All",
  "Campus",
  "Students",
  "Infrastructure",
  "Events",
  "Transport",
];

function PhotoImage({
  photo,
  priority = false,
}: {
  photo: GalleryPhoto;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [photo.src]);

  if (failed) {
    return (
      <div className="flex h-full min-h-48 w-full flex-col items-center justify-center gap-3 bg-neutral-100 p-5 text-center text-neutral-500">
        <Camera size={28} strokeWidth={1.4} />
        <span className="text-xs leading-5">
          Add photo:
          <br />
          <code className="break-all">{photo.src}</code>
        </span>
      </div>
    );
  }

  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
      onError={() => setFailed(true)}
    />
  );
}

export default function BottomGallery() {
  const reduceMotion = useReducedMotion();

  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>("All");
  const [selectedPhotoId, setSelectedPhotoId] =
    useState<number | null>(null);

  const filteredPhotos = useMemo(
    () =>
      activeCategory === "All"
        ? photos
        : photos.filter(
            (photo) => photo.category === activeCategory
          ),
    [activeCategory]
  );

  const selectedIndex = filteredPhotos.findIndex(
    (photo) => photo.id === selectedPhotoId
  );

  const selectedPhoto =
    selectedIndex >= 0 ? filteredPhotos[selectedIndex] : null;

  const closeLightbox = useCallback(() => {
    setSelectedPhotoId(null);
  }, []);

  const showPrevious = useCallback(() => {
    if (selectedIndex < 0 || filteredPhotos.length < 2) return;

    const previousIndex =
      (selectedIndex - 1 + filteredPhotos.length) %
      filteredPhotos.length;

    setSelectedPhotoId(filteredPhotos[previousIndex].id);
  }, [selectedIndex, filteredPhotos]);

  const showNext = useCallback(() => {
    if (selectedIndex < 0 || filteredPhotos.length < 2) return;

    const nextIndex = (selectedIndex + 1) % filteredPhotos.length;

    setSelectedPhotoId(filteredPhotos[nextIndex].id);
  }, [selectedIndex, filteredPhotos]);

  useEffect(() => {
    if (selectedPhotoId === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedPhotoId, closeLightbox, showPrevious, showNext]);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="overflow-hidden bg-white px-5 py-20 text-neutral-950 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
              <Images size={14} />
              The Oriental experience
            </span>

            <h2
              id="gallery-heading"
              className="mt-6 text-4xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-5xl lg:text-7xl"
            >
              More than a campus.
              <br />
              <span className="text-neutral-400">
                A place to grow.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
              Explore the spaces, people, activities, and everyday
              journeys that make up life at Oriental College of
              Technology, Bhopal.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-neutral-200 px-4 py-3 md:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <Camera size={19} />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">
                {photos.length.toString().padStart(2, "0")}
              </p>
              <p className="text-xs text-neutral-500">
                Gallery slots
              </p>
            </div>
          </div>
        </motion.div>

        {/* Category filters */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-3 [scrollbar-width:thin]">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            const count =
              category === "All"
                ? photos.length
                : photos.filter(
                    (photo) => photo.category === category
                  ).length;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                }`}
              >
                {category}
                <span
                  className={`text-xs ${
                    isActive ? "text-neutral-300" : "text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery grid */}
        <motion.div
          layout
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.button
                key={photo.id}
                type="button"
                layout
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 14 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.3,
                  delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.2),
                }}
                onClick={() => setSelectedPhotoId(photo.id)}
                aria-label={`View photo: ${photo.title}`}
                className={`group relative block w-full overflow-hidden rounded-2xl bg-neutral-100 text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-4 ${
                  photo.featured && activeCategory === "All"
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    photo.featured && activeCategory === "All"
                      ? "aspect-[16/9] sm:aspect-[2/1]"
                      : "aspect-[4/3]"
                  }`}
                >
                  <PhotoImage
                    photo={photo}
                    priority={index < 2}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
                      {photo.category}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                    <div className="min-w-0 translate-y-1 transition-transform duration-300 group-hover:translate-y-0">
                      <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                        {photo.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/75">
                        {photo.description}
                      </p>
                    </div>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-neutral-950 transition-transform duration-300 group-hover:rotate-45">
                      <Maximize2 size={17} />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom note */}
        <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-neutral-500">
            Showing {filteredPhotos.length}{" "}
            {filteredPhotos.length === 1 ? "photo" : "photos"}.
            Select any image to view it larger.
          </p>

          <a
            href="#contact"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold transition-colors hover:text-neutral-500"
          >
            Have campus photos to share?
            <ArrowDownRight size={16} />
          </a>
        </div>
      </div>

      {/* Image lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            key="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image viewer"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeLightbox();
              }
            }}
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close image viewer"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8 sm:top-8"
            >
              <X size={21} />
            </button>

            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-8"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8"
            >
              <ChevronRight size={22} />
            </button>

            <motion.div
              key={selectedPhoto.id}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2 }}
              className="relative flex max-h-[88vh] w-full max-w-6xl flex-col"
            >
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-neutral-900">
                <div className="relative h-[55vh] min-h-[260px] w-full sm:h-[70vh]">
                  <PhotoImage photo={selectedPhoto} />
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 pt-5 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/50">
                    {selectedPhoto.category}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                    {selectedPhoto.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                    {selectedPhoto.description}
                  </p>
                </div>

                <span className="shrink-0 pt-1 text-sm tabular-nums text-white/60">
                  {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                  {String(filteredPhotos.length).padStart(2, "0")}
                </span>
              </div>

              <div className="mt-4 flex justify-center gap-3 sm:hidden">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white"
                >
                  <ArrowLeft size={15} />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white"
                >
                  Next
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
