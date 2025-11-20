import { WidgetHeader } from "../components/widget-header";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  email: z.string().email("Invalid Email Address"),
});

type FormValues = z.infer<typeof formSchema>;

// Black & White Particle Component
const Particle = ({ delay }: { delay: number }) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
  });
  const isWhite = Math.random() > 0.5;
  const size = Math.random() * 4 + 2;

  useEffect(() => {
    const interval = setInterval(
      () => {
        setPosition({
          x: Math.random() * 100,
          y: Math.random() * 100,
        });
      },
      8000 + Math.random() * 4000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`absolute rounded-full ${isWhite ? "bg-white" : "bg-black"} opacity-20 blur-[1px]`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}%`,
        top: `${position.y}%`,
        transition: `all ${8 + Math.random() * 4}s ease-in-out`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
};

export const WidgetAuthScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionId = useSetAtom(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const createContactSession = useMutation(api.public.contactSessions.create);

  const onSubmit = async (values: FormValues) => {
    if (!organizationId) {
      return;
    }

    const metadata: Doc<"contactSessions">["metadata"] = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(","),
      platform: navigator.platform,
      vendor: navigator.vendor,
      screenResolution: `${screen.width} * ${screen.height}`,
      viewportSize: `${window.innerWidth} * ${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer || "direct",
      currentUrl: window.location.href,
    };

    const contactSessionId = await createContactSession({
      ...values,
      metadata,
      organizationId,
    });
    setContactSessionId(contactSessionId);
    setScreen("selection");
  };

  return (
    <div className="flex h-full flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Black & White Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle key={i} delay={i * 150} />
        ))}
      </div>

      {/* Header with Glass Effect */}
      <div className="relative backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-2xl z-10">
        <div className="flex flex-col justify-between gap-y-2.5 px-4 py-6">
          <h1 className="text-xl font-semibold tracking-tight text-white animate-in fade-in slide-in-from-top-4 duration-700">
            Hi there! 👋
          </h1>
          <p
            className="text-base font-medium text-white/60 animate-in fade-in slide-in-from-top-4 duration-700"
            style={{ animationDelay: "100ms" }}
          >
            Let&apos;s get you started
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex flex-1 flex-col gap-y-6 p-6 relative z-10 justify-center">
        {/* Glass Form Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-700">
          <Form {...(form as any)}>
            <form
              className="flex flex-col gap-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Name Field */}
              <FormField
                control={form.control as any}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <div className="relative group">
                        <Input
                          className="h-12 bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder:text-white/40 rounded-xl transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:bg-white/10 px-4"
                          placeholder="Enter your name"
                          type="text"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control as any}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <div className="relative group">
                        <Input
                          className="h-12 bg-white/5 backdrop-blur-xl border-white/10 text-white placeholder:text-white/40 rounded-xl transition-all duration-300 hover:border-white/20 focus:border-white/30 focus:bg-white/10 px-4"
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="mt-3 h-12 bg-gradient-to-br from-gray-300 to-gray-400 text-black font-semibold rounded-xl hover:from-gray-400 hover:to-gray-500 shadow-lg shadow-gray-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={form.formState.isSubmitting}
                size="lg"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Please wait...</span>
                  </div>
                ) : (
                  "Get Started"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Additional Info */}
        <div
          className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "200ms" }}
        >
          <p className="text-white/50 text-sm">
            We value your privacy and security
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-white/30"></div>
            <div className="h-1 w-1 rounded-full bg-white/50"></div>
            <div className="h-1 w-1 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
