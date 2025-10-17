
import { SignIn } from "@clerk/nextjs";
import React from "react";

export const SignInView = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Full Page Background with Gradient & Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950 via-teal-900 to-slate-900"></div>

      {/* Animated Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/25 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Additional Floating Particles */}
      <div className="absolute top-20 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
      <div
        className="absolute bottom-40 left-1/3 w-2 h-2 bg-teal-400 rounded-full animate-ping"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-500 rounded-full animate-ping"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <SignIn
      routing="hash"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "backdrop-blur-2xl bg-gradient-to-br from-cyan-500/15 via-teal-500/10 to-cyan-600/15 rounded-3xl shadow-[0_8px_32px_0_rgba(20,184,166,0.37)] border-2 border-cyan-400/40 hover:border-cyan-400/70 hover:shadow-[0_8px_32px_0_rgba(20,184,166,0.5)] transition-all duration-500",
            headerTitle:
              "text-3xl font-bold bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg",
            headerSubtitle: "text-gray-200/90",
            socialButtonsBlockButton:
              "backdrop-blur-lg bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-2 border-cyan-400/50 hover:from-cyan-500/30 hover:to-teal-500/30 hover:border-cyan-300/70 text-white transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40",
            socialButtonsBlockButtonText:
              "text-white font-semibold drop-shadow-md",
            socialButtonsProviderIcon: "brightness-125 drop-shadow-lg",
            dividerLine:
              "bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent",
            dividerText:
              "text-cyan-200 font-semibold backdrop-blur-sm bg-cyan-500/10 px-3 rounded-full",
            formFieldLabel: "text-cyan-100 font-semibold drop-shadow-md",
            formFieldInput:
              "backdrop-blur-xl bg-white/15 border-2 border-cyan-400/40 text-white placeholder:text-gray-300/70 focus:bg-white/20 focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-300 rounded-2xl shadow-inner",
            formButtonPrimary:
              "backdrop-blur-sm bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 hover:from-cyan-400 hover:via-teal-400 hover:to-cyan-500 text-white font-bold shadow-[0_8px_24px_0_rgba(20,184,166,0.6)] hover:shadow-[0_8px_32px_0_rgba(20,184,166,0.8)] transition-all duration-300 rounded-2xl border-2 border-cyan-300/50",
            footerActionLink:
              "text-cyan-300 hover:text-cyan-200 font-bold transition-colors duration-300 hover:underline drop-shadow-md",
            identityPreviewText: "text-white font-medium",
            identityPreviewEditButton:
              "text-cyan-300 hover:text-cyan-200 font-semibold",
            formResendCodeLink:
              "text-cyan-300 hover:text-cyan-200 font-semibold transition-colors drop-shadow-md",
            otpCodeFieldInput:
              "backdrop-blur-xl bg-white/15 border-2 border-cyan-400/40 text-white focus:border-cyan-300/80 focus:ring-4 focus:ring-cyan-400/30 rounded-xl",
            formFieldInputShowPasswordButton:
              "text-cyan-200 hover:text-cyan-100 transition-colors",
            alertText: "text-cyan-50 font-medium",
            formFieldErrorText: "text-red-300 font-semibold drop-shadow-md",
            footer:
              "backdrop-blur-xl bg-gradient-to-t from-cyan-500/10 to-transparent rounded-b-3xl border-t-2 border-cyan-400/30",
            footerActionText: "text-gray-200/90",
            footerActionLink__signUp:
              "text-cyan-300 hover:text-cyan-200 font-bold drop-shadow-md",
            headerBackLink: "text-cyan-300 hover:text-cyan-200 font-semibold",
            headerBackIcon: "text-cyan-300",
            socialButtonsIconButton:
              "backdrop-blur-lg bg-cyan-500/20 border-2 border-cyan-400/50 hover:bg-cyan-500/30 hover:border-cyan-300/70 shadow-lg shadow-cyan-500/20",
          },
          variables: {
            colorPrimary: "#06b6d4",
            colorText: "white",
            colorTextSecondary: "#a5f3fc",
            borderRadius: "1rem",
            colorBackground: "transparent",
          },
        }}
      />
    </div>
  );
};
