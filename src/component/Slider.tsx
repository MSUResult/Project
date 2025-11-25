"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { slides } from "../data/data";

interface Slide {
  id: number | string;
  name: string;
  rating: number;
  heading: string;
  text: string;
}

export default function InfiniteSlider() {
  const originalLength = slides.length;
  const extendedSlides: Slide[] = [...slides, ...slides, ...slides];

  const [currentIndex, setCurrentIndex] = useState(originalLength);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleItems, setVisibleItems] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w < 640) setVisibleItems(1);
      else if (w < 1024) setVisibleItems(2);
      else setVisibleItems(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getInitials = (name: string = ""): string =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase();

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((p) => p + 1);
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((p) => p - 1);
  }, [isTransitioning]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    if (currentIndex >= originalLength * 2) {
      setCurrentIndex(currentIndex - originalLength);
    } else if (currentIndex < originalLength) {
      setCurrentIndex(currentIndex + originalLength);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 4000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 px-4">
          <div>
            <h3 className="text-blue-600 font-semibold uppercase tracking-wide text-xs mb-2">
              Testimonials
            </h3>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              What our clients say
            </h1>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mt-5 md:mt-0">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white border border-gray-300 shadow hover:bg-blue-600 hover:text-white transition active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white border border-gray-300 shadow hover:bg-blue-600 hover:text-white transition active:scale-95"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden w-full">
          <div
            className="flex"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
              transition: isTransitioning
                ? "transform 500ms ease-in-out"
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / visibleItems}%` }}
              >
                <div className="bg-white p-7 rounded-2xl shadow border border-gray-200 h-full flex flex-col justify-between hover:shadow-lg transition">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow">
                      {getInitials(item.name)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground">
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

                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {item.heading}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
