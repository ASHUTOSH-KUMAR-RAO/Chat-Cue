import { WidgetHeader } from "../components/widget-header";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {api} from "@workspace/backend/_generated/api"
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
const formSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  email: z.string().email("Invalid Email Address"),
});

type FormValues = z.infer<typeof formSchema>;

// For Testing Purpose Only

const organizationId = "123"

export const WidgetAuthScreen = () => {
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
        return
        }

        const metadata :Doc<"contactSessions">["metadata"] = {
          userAgent:navigator.userAgent,
          language:navigator.language,
          languages:navigator.languages?.join(","),
          platform:navigator.platform,
          vendor:navigator.vendor,
          screenResolution:`${screen.width} * ${screen.height}`,
          viewportSize:`${window.innerWidth} * ${window.innerHeight}`,
          timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,
          timezoneOffset:new Date().getTimezoneOffset(),
          cookieEnabled:navigator.cookieEnabled,
          referrer:document.referrer || "direct",
          currentUrl:window.location.href

        }

        const contactSessionId = await createContactSession({
          ...values,
          metadata,
          organizationId
        })

        console.log({contactSessionId})
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2.5 px-4 py-6 bg-gradient-to-r from-background/50 to-transparent">
          <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text rounded-lg">
            Hi there ! 👋
          </h1>
          <p className="text-base font-medium text-muted-foreground/90">
            Let&apos;s get you started
          </p>
        </div>
      </WidgetHeader>

      <div className="flex flex-1 flex-col gap-y-4 p-4">
        <Form {...(form as any)}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-10 bg-background"
                      placeholder="Eg. Ashu rao"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-10 bg-background"
                      placeholder="Eg. ashu@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2" disabled={form.formState.isSubmitting} size="lg">
              Get Started
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
