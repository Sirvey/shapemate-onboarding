import React from "react";

/* -----------------------------
   Core Vitality Loader (ShapeMate Color Edition)
----------------------------- */

const VitalityLoader: React.FC<{ size?: number }> = ({ size = 150 }) => {
  const strokeWidth = size * 0.04;
  const center = size / 2;
  const radiusOuter = size * 0.45;
  const radiusInner = size * 0.32;

  const circOuter = 2 * Math.PI * radiusOuter;
  const circInner = 2 * Math.PI * radiusInner;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label="Loading health metrics"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          {/* ShapeMate Evergreen Gradient */}
          <linearGradient id="gradientOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1F3D2B" />
            <stop offset="100%" stopColor="#323232" />
          </linearGradient>

          {/* Inner gradient – subtle brand tint */}
          <linearGradient id="gradientInner" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7C7F82" />
            <stop offset="100%" stopColor="#1F3D2B" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost rings in brand-gray (#7C7F82) */}
        <circle
          cx={center}
          cy={center}
          r={radiusOuter}
          fill="none"
          stroke="#7C7F82"
          strokeWidth={strokeWidth / 2}
          opacity={0.25}
        />
        <circle
          cx={center}
          cy={center}
          r={radiusInner}
          fill="none"
          stroke="#7C7F82"
          strokeWidth={strokeWidth / 2}
          opacity={0.25}
        />

        {/* Outer spinning ring */}
        <g className="origin-center animate-[spin_3s_linear_infinite]">
          <circle
            cx={center}
            cy={center}
            r={radiusOuter}
            fill="none"
            stroke="url(#gradientOuter)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circOuter}
            strokeDashoffset={circOuter * 0.25}
            filter="url(#glow)"
            className="opacity-70"
          />
        </g>

        {/* Inner reverse spinning ring */}
        <g className="origin-center animate-[spin_4s_linear_infinite_reverse]">
          <circle
            cx={center}
            cy={center}
            r={radiusInner}
            fill="none"
            stroke="url(#gradientInner)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circInner}
            strokeDashoffset={circInner * 0.4}
            filter="url(#glow)"
            className="opacity-60"
          />
        </g>

        {/* Center breathing orb */}
        <g className="origin-center animate-breathe">
          <circle
            cx={center}
            cy={center}
            r={size * 0.12}
            fill="#FFFAFA"
            className="opacity-90"
          />
          <circle
            cx={center}
            cy={center}
            r={size * 0.05}
            fill="#1F3D2B"
            className="animate-pulse"
          />
        </g>
      </svg>

      {/* Ping effect (brand subtle) */}
      <div
        className="absolute inset-0 rounded-full animate-ping opacity-10 border border-[#1F3D2B] scale-75"
        style={{ animationDuration: "3s" }}
      />
      <div
        className="absolute inset-0 rounded-full animate-ping opacity-5 border border-[#7C7F82] scale-50"
        style={{ animationDuration: "3s", animationDelay: "0.5s" }}
      />

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.07); opacity: 1; }
        }
        .animate-breathe {
          animation: breathe 2.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

/* -----------------------------
   Status Message in Shapemate Colors
----------------------------- */

const StatusMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <h2
        key={message}
        className="text-lg font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#1F3D2B] to-[#323232] animate-[fadeIn_0.5s_ease-out]"
      >
        {message}
      </h2>

      <div className="flex gap-1 mt-2">
        <span className="w-1 h-1 bg-[#1F3D2B] rounded-full animate-[bounce_1s_infinite]" />
        <span
          className="w-1 h-1 bg-[#1F3D2B] rounded-full animate-[bounce_1s_infinite]"
          style={{ animationDelay: "0.2s" }}
        />
        <span
          className="w-1 h-1 bg-[#1F3D2B] rounded-full animate-[bounce_1s_infinite]"
          style={{ animationDelay: "0.4s" }}
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* -----------------------------
   Public LoadingBar Component
----------------------------- */

const LoadingBar: React.FC<{ message: string; size?: number }> = ({
  message,
  size = 150,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <VitalityLoader size={size} />
      <StatusMessage message={message} />
    </div>
  );
};

export default LoadingBar;
