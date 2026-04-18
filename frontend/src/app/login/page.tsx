"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Phone, Lock, ArrowRight, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const setupRecaptcha = () => {
    if (!recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha verified");
        }
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      setupRecaptcha();
      const appVerifier = recaptchaVerifier.current!;
      const formattedPhone = `+91${phoneNumber.replace(/\D/g, "")}`;
      
      if (formattedPhone.length !== 13) {
        throw new Error("invalidPhone");
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep("otp");
      speak("Enter the 6 digit code sent to your phone");
    } catch (err: any) {
      console.error(err);
      setError(err.message === "invalidPhone" ? t("invalidPhone") : t("networkError"));
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!confirmationResult) throw new Error("No confirmation result");
      await confirmationResult.confirm(otp);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(t("otpFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-section flex flex-col items-center justify-center p-4">
      {/* Recaptcha hidden container */}
      <div id="recaptcha-container"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden"
      >
        <div className="p-8 md:p-10">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-4xl">🌾</span>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-text-primary mb-3">
              {t("loginTitle")}
            </h1>
            <p className="text-text-secondary">
              {step === "phone" ? "Enter your phone to continue" : "Verification code sent to +91 " + phoneNumber}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.form 
                key="phone-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider ml-1">
                    {t("phoneLabel")}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <span className="text-text-primary font-bold border-r border-border pr-2">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.slice(0, 10))}
                      placeholder="98765-43210"
                      className="w-full bg-bg-highlight border-2 border-transparent focus:border-primary rounded-2xl py-4 pl-16 pr-4 text-xl font-bold text-text-primary outline-none transition-all placeholder:text-text-secondary/30"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || phoneNumber.length < 10}
                  className="w-full bg-primary-button hover:bg-primary text-white font-bold py-5 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      {t("sendOtp")}
                      <ArrowRight size={22} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-text-secondary uppercase tracking-wider ml-1">
                      {t("otpLabel")}
                    </label>
                    <button 
                      type="button"
                      onClick={() => setStep("phone")}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <ChevronLeft size={12} /> Change Number
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="······"
                      className="w-full bg-bg-highlight border-2 border-transparent focus:border-primary rounded-2xl py-5 px-4 text-3xl font-bold text-center tracking-[1rem] text-text-primary outline-none transition-all placeholder:text-text-secondary/20"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-profit hover:bg-profit/90 text-white font-bold py-5 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      {t("verifyOtp")}
                      <CheckCircle2 size={22} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-sm font-bold text-loss text-center bg-loss/10 p-3 rounded-xl"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Footer Info */}
      <p className="mt-8 text-xs text-text-secondary font-medium">
        SimpleKeth Security • AI Decision Intel
      </p>
    </div>
  );
}
