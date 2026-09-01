import { ImageResponse } from "next/og";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export const socialImageAlt =
  "onchain-ui — Copy-paste web3 components for shadcn apps";

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#02030a",
          color: "white",
          display: "flex",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at 75% 42%, rgba(96, 79, 255, 0.42), rgba(32, 117, 214, 0.18) 36%, rgba(2, 3, 10, 0) 68%)",
            display: "flex",
            inset: 0,
            position: "absolute",
          }}
        />
        <div
          style={{
            background:
              "linear-gradient(112deg, rgba(2, 3, 10, 0) 34%, rgba(76, 72, 222, 0.2) 51%, rgba(16, 117, 190, 0.22) 68%, rgba(2, 3, 10, 0) 82%)",
            display: "flex",
            height: 820,
            position: "absolute",
            right: -170,
            top: -170,
            transform: "rotate(-8deg)",
            width: 900,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "62px 66px 58px",
            position: "relative",
            width: 710,
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 25,
              fontWeight: 650,
              letterSpacing: "-0.02em",
            }}
          >
            <svg
              aria-hidden="true"
              height="40"
              viewBox="0 0 64 64"
              width="40"
            >
              <path
                d="M32 8L58 54H6L32 8Z"
                fill="none"
                stroke="#f7f8ff"
                strokeLinejoin="round"
                strokeWidth="5"
              />
              <path
                d="M24 38H40"
                fill="none"
                stroke="#f7f8ff"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <circle cx="24" cy="38" fill="#f7f8ff" r="3.2" />
              <circle cx="40" cy="38" fill="#f7f8ff" r="3.2" />
            </svg>
            <span style={{ marginLeft: 14 }}>onchain-ui</span>
          </div>

          <div
            style={{
              alignItems: "center",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 999,
              color: "rgba(255, 255, 255, 0.54)",
              display: "flex",
              fontSize: 16,
              marginTop: 72,
              padding: "8px 15px",
              width: 446,
            }}
          >
            <span
              style={{
                background: "#10b981",
                borderRadius: 999,
                display: "flex",
                height: 8,
                marginRight: 10,
                width: 8,
              }}
            />
            open source · shadcn registry · wagmi + viem
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 58,
              fontWeight: 600,
              letterSpacing: "-0.045em",
              lineHeight: 1.04,
              marginTop: 25,
            }}
          >
            <span>Copy-paste web3</span>
            <span>components for</span>
            <span>shadcn apps.</span>
          </div>

          <div
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              display: "flex",
              fontSize: 19,
              lineHeight: 1.45,
              marginTop: 24,
            }}
          >
            Wallet identity, tokens, chain context, and market UI primitives.
          </div>

          <div
            style={{
              color: "rgba(255, 255, 255, 0.36)",
              display: "flex",
              fontSize: 16,
              marginTop: "auto",
            }}
          >
            onchain-ui.dev
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            position: "absolute",
            right: 20,
            top: 0,
            width: 540,
          }}
        >
          <svg
            aria-hidden="true"
            height="470"
            viewBox="0 0 640 512"
            width="540"
          >
            <defs>
              <linearGradient id="og-mark" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#dbe4ff" />
                <stop offset="0.52" stopColor="#a8b8ff" />
                <stop offset="1" stopColor="#78c7ff" />
              </linearGradient>
              <filter id="og-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g
              fill="none"
              filter="url(#og-glow)"
              stroke="url(#og-mark)"
            >
              <path
                d="M320 56 535 430H105L320 56Z"
                strokeLinejoin="round"
                strokeWidth="15"
              />
              <path
                d="M248 309.5h144v13H248z"
                fill="#a9c8ff"
                stroke="none"
              />
              <circle cx="248" cy="316" fill="#c7d2fe" r="15" stroke="none" />
              <circle cx="392" cy="316" fill="#8bd4ff" r="15" stroke="none" />
            </g>
          </svg>
        </div>

        <div
          style={{
            border: "1px solid rgba(255, 255, 255, 0.07)",
            display: "flex",
            inset: 20,
            pointerEvents: "none",
            position: "absolute",
          }}
        />
      </div>
    ),
    socialImageSize,
  );
}
