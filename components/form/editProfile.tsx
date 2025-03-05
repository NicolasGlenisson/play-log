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
import { editProfileSchema } from "@/lib/schemas/editProfileSchema";
import { editProfileFormAction } from "@/lib/user";
import { Loader2 } from "lucide-react";

interface EditProfileProps {
  email: string;
  username: string;
}
// Sign up form with form validation using Zod
export default function EditProfileForm(props: EditProfileProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { username, email } = props;
  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      email: email,
      username: username,
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("username", values.username);

    const result = await editProfileFormAction(formData);
    if (!result.success) {
      setErrorMessage(result.message);
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-8 p-6">
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

          <div className="flex justify-between items-center">
            {form.formState.isSubmitting ? (
              <Button disabled className="mt-10 w-full">
                <Loader2 className="animate-spin" />
                Submitting...
              </Button>
            ) : (
              <Button type="submit" className="mt-10 w-full">
                Edit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
