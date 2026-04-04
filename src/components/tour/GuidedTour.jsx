import { useState, useEffect } from "react";
import VaultLogo from "../VaultLogo";

const STEPS = [
  {
    icon: "sparkle",
    title: "Welcome to VaultIQ",
    desc: "This quick tour will show you a few hidden interactions that make the dashboard more powerful. It only takes 30 seconds.",
    gif: null,
  },
  {
    icon: "zoom",
    title: "Zoom the Balance Chart",
    desc: "On the Balance Trend chart, scroll your mouse wheel to zoom in and out. Then click and drag to pan left or right through time.",
    gif: "/tour/zoom-pan.gif",
  },
  {
    icon: "arrows",
    title: "Navigate Chart History",
    desc: "Use the arrow buttons on the Budget vs Actual chart to move between months and explore past financial history.",
    gif: "/tour/chart-navigate.gif",
  },
  {
    icon: "donut",
    title: "Donut Chart Hover",
    desc: "Hover over any slice of the Spending Donut chart. The center updates to show that category's details and other slices fade out.",
    gif: "/tour/donut-hover.gif",
  },
];

const ICONS = {
  sparkle: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-5 h-5"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2m0 14v2M3 12h2m14 0h2M5.636 5.636l1.414 1.414m9.9 9.9 1.414 1.414M5.636 18.364l1.414-1.414m9.9-9.9 1.414-1.414"
      />
    </svg>
  ),
  zoom: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-5 h-5"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <circle cx="11" cy="11" r="7" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M11 8v6M8 11h6"
      />
    </svg>
  ),
  // Step 3 — left and right chevrons
  arrows: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-5 h-5"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  // Step 4 — pie/chart circle
  donut: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-5 h-5"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.328l5.603 3.113z"
      />
    </svg>
  ),
  // Close button — X mark
  close: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  // Back button — left chevron
  arrowLeft: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  // Next button — right chevron
  arrowRight: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  // Done button — checkmark
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
};

const STORAGE_KEY = "vaultiq_tour_done";

export default function GuidedTour() {
  // Controls whether the modal is visible or not
  const [isOpen, setIsOpen] = useState(false);

  // Tracks which step we are on — 0 means first step
  const [currentStep, setCurrentStep] = useState(0);

  // On first render — if tour not done before, show it after a short delay
  useEffect(() => {
    const tourAlreadyDone = localStorage.getItem(STORAGE_KEY);
    if (!tourAlreadyDone) {
      // 800ms delay lets the dashboard render first before tour pops up
      setTimeout(() => setIsOpen(true), 800);
    }
  }, []);

  useEffect(() => {
    function handleReplay() {
      localStorage.removeItem(STORAGE_KEY); // done flag hata do
      setCurrentStep(0); // pehle step pe wapas
      setIsOpen(true); // modal kholo
    }

    window.addEventListener("vaultiq:replay-tour", handleReplay);

    // Cleanup — component unmount ho toh listener hata do
    return () =>
      window.removeEventListener("vaultiq:replay-tour", handleReplay);
  }, []);

  // Closes the modal and saves "done" in localStorage so it never shows again
  function closeTour() {
    setIsOpen(false);
    setCurrentStep(0);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  // Goes to next step. If already on last step, closes the tour.
  function goNext() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTour();
    }
  }

  // Goes back to the previous step
  function goBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  // Shortcut variables for current step data
  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  // Render nothing when tour is closed
  if (!isOpen) return null;

  return (
    // BACKDROP — covers full screen with a dark semi-transparent overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* MODAL CARD */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "tourPopIn 0.3s ease-out" }}
      >
        {/* Thin colored accent line at the very top of the card */}
        <div className="h-1 w-full bg-linear-to-r from-emerald-400 to-teal-500" />

        {/* HEADER — step counter on left, close button on right */}
        <div className="flex items-center justify-between px-6 pt-5">
          {/* Step counter with a small green dot */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500">
              {currentStep + 1} / {STEPS.length}
            </span>
          </div>

          {/* Close button — X icon */}
          <button
            onClick={closeTour}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Close tour"
          >
            {ICONS.close}
          </button>
        </div>

        {/* PROGRESS BAR — thin line that fills left to right as steps advance */}
        <div className="mx-6 mt-4 h-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-0.5 rounded-full bg-emerald-500 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* MAIN BODY */}
        <div className="px-6 pb-6 pt-5">
          {/* Icon + Title side by side */}
          <div className="flex items-center gap-3 mb-3">
            {/* Icon sits inside a small rounded square with a light green tint */}
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              {ICONS[step.icon]}
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
              {step.title}
            </h2>
          </div>

          {/* Description — indented to align under the title (not the icon) */}
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5 pl-12">
            {step.desc}
          </p>

          {/* GIF display — only rendered when this step has a gif path */}
          {step.gif ? (
            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-6">
              <img
                src={step.gif}
                alt={step.title}
                className="w-full object-cover"
                style={{ minHeight: "190px", backgroundColor: "#f9fafb" }}
              />
            </div>
          ) : (
            // Welcome step has no GIF — show a subtle dashed placeholder box
            <div
              className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center gap-3 mb-6"
              style={{ minHeight: "100px" }}
            >
              {/* VaultLogo — sirf welcome step pe dikhega */}
              <VaultLogo size={48} />
              <p className="text-xs text-gray-400 dark:text-gray-500 tracking-wide">
                Let us show you around
              </p>
            </div>
          )}

          {/* FOOTER BUTTONS */}
          <div className="flex items-center justify-between">
            {/* Left side — Back and Skip */}
            <div className="flex items-center gap-4">
              {/* Back button — only visible from step 2 onwards */}
              {currentStep > 0 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {ICONS.arrowLeft}
                  Back
                </button>
              )}

              {/* Skip — always visible, closes and marks done */}
              <button
                onClick={closeTour}
                className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Skip
              </button>
            </div>

            {/* Right side — Next or Done */}
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition-all shadow-md shadow-emerald-500/25"
            >
              {isLastStep ? (
                // Last step shows "Done" with a checkmark
                <>Done {ICONS.check}</>
              ) : (
                // All other steps show "Next" with a right arrow
                <>Next {ICONS.arrowRight}</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pop-in animation — modal scales up and fades in from slightly below */}
      <style>{`
        @keyframes tourPopIn {
          from { opacity: 0; transform: scale(0.93) translateY(14px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}
