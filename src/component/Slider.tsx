"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { slides } from "../data/data";

export default function InfiniteSlider() {

  const originalLength = slides.length;
  const extendedSlides = [...slides, ...slides, ...slides];

  // Start in the middle set
  const [currentIndex, setCurrentIndex] = useState(originalLength);

  // Controls whether the slide movement is animated or instant (for resetting)
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Responsive: How many cards to show?
  const [visibleItems, setVisibleItems] = useState(3);

  // --- Resize Logic ---
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w < 640) {
        setVisibleItems(1); // Mobile: 1 card
      } else if (w < 1024) {
        setVisibleItems(2); // Tablet: 2 cards (As requested)
      } else {
        setVisibleItems(3); // Desktop: 3 cards
      }
    };

    // Initial call
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Helpers ---
  const getInitials = (name) =>
    (name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase();

  // --- Navigation ---
  const handleNext = useCallback(() => {
    if (isTransitioning) return; // Prevent spam clicking
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  // --- The Infinite Loop Magic (Transition End) ---
  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    // If we've scrolled past the last "real" item into the end clones...
    if (currentIndex >= originalLength * 2) {
      // Teleport back to the start of the middle set
      setCurrentIndex(currentIndex - originalLength);
    }
    // If we've scrolled past the first "real" item into the start clones...
    else if (currentIndex < originalLength) {
      // Teleport forward to the end of the middle set
      setCurrentIndex(currentIndex + originalLength);
    }
  };

  // --- Auto-play (Optional, remove if unwanted) ---
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 px-4">
          <div>
            <h3 className="text-blue-600 font-bold uppercase tracking-wide text-sm mb-2">
              Testimonials
            </h3>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              What our clients say
            </h1>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 group"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 group"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div className="overflow-hidden relative w-full">
          <div
            className="flex"
            style={{
              // Move the track based on current index.
              // The % to move is 100 / visibleItems per slide.
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
              // Only animate if we aren't teleporting
              transition: isTransitioning
                ? "transform 500ms ease-in-out"
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((item, index) => {
              // Unique key using both ID and actual index to handle duplicates cleanly
              const uniqueKey = `${item.id}-${index}`;

              return (
                <div
                  key={uniqueKey}
                  className="flex-shrink-0 px-3" // Padding creates the "Gap" between cards
                  style={{ width: `${100 / visibleItems}%` }} // Dynamic width based on breakpoints
                >
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-between hover:shadow-md transition-shadow">
                    {/* Card Content */}
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0">
                          {getInitials(item.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < item.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill={i < item.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1">
                        {item.heading}
                      </h2>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base line-clamp-4">
                        {item.text}
                      </p>
                    </div>

                 
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
