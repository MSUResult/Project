"use client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
export default function Accordian() {
  const [click, setClick] = useState([]);
  const items = [
    {
      Question: "What is the Virtual DOM in React?",
      Answer:
        "The Virtual DOM is a lightweight copy of the real browser DOM. React uses it to track changes in the UI.",
    },
    {
      Question: "What is the difference between State and Props?",
      Answer:
        "State: Data that belongs to a component and can change. Props: Data passed from parent to child and cannot be changed by the child.",
    },
    {
      Question: "What are React Hooks?",
      Answer:
        "Hooks are special functions that allow functional components to use features like state and lifecycle.",
    },
    {
      Question: "What is JSX and why do we use it?",
      Answer:
        "JSX (JavaScript XML) is a syntax that lets you write HTML-like code inside JavaScript.",
    },
    {
      Question: "What is useEffect() used for?",
      Answer:
        "useEffect() runs code when a component renders, updates, or unmounts.",
    },
  ];

  return (
    <main className="h-screen flex justify-center items-center bg-slate-400 gap-5 flex-col">
      <button className="bg-amber-500 p-3 px-4 text-white">
        Enable Multi Selection
      </button>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            className="bg-amber-950 text-white font-bold space-y-2 p-3 px-4 "
            key={index}
          >
            <div
              className="flex justify-between gap-3 items-center"
              onClick={() => setClick((prev) => [...prev, index])}
            >
              {item.Question}

              <FaPlus className="text-white" />
            </div>
            <div>
              {click.filter((item, ind) => item === index) ? item.Answer : ""}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
