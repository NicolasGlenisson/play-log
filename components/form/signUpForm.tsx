"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/custom/buttons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/custom/input";
import { signUpSchema } from "@/lib/schemas/signUpSchema";
import { onSubmitSignUpAction } from "@/lib/action";
import { Loader2 } from "lucide-react";

// Sign up form with form validation using Zod
export default function SignUpForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);

    const result = await onSubmitSignUpAction(formData);
    if (!result.success) {
      setErrorMessage(result.message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-xl p-6 bg-[#FDFAE0] rounded-2xl shadow-lg mt-10 flex-col space-y-6"
      >
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          {form.formState.isSubmitting ? (
            <Button disabled className="mt-10 w-full">
              <Loader2 className="animate-spin" />
              Submitting...
            </Button>
          ) : (
            <Button type="submit" className="mt-10 w-full">
              Sign Up
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
