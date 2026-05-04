"use client";

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import BasicDropdown from "@/components/ui/basic-dropdown";

import {Button} from "@/components/ui/button";

type FormValues = {
  role: string;
};

const ROLE_ITEMS = [
  { id: "react-developer", label: "React Developer" },
  { id: "full-stack-developer", label: "Full Stack Developer" },
  { id: "frontend-developer", label: "Frontend Developer" },
  { id: "backend-developer", label: "Backend Developer" },
  { id: "data-scientist", label: "Data Scientist" },
];

export default function JoinMeeting() {
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      role: "react-developer",
    },
  });

  function onSubmit(values: FormValues) {
    router.push(`/interview?role=${values.role}`);
  }

  return (
    <div className="flex w-full md:max-w-5xl mx-auto items-center justify-start">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-3 md:gap-8 items-center md:items-end justify-center md:justify-start w-full"
        >
          <FormField
            control={form.control}
            name="role"
            render={({field}) => (
              <FormItem className="w-full md:w-auto flex flex-col items-center md:items-start">
                <FormLabel className="font-normal text-xs text-center md:text-left px-1">
                  Select Your Role
                </FormLabel>
                <FormControl>
                  <BasicDropdown
                    items={ROLE_ITEMS}
                    label="Choose role"
                    defaultValue={field.value}
                    onChange={(item) => field.onChange(item.id.toString())}
                    className="w-[65%] sm:w-[250px] md:w-[200px] rounded-full [&>button]:rounded-full [&>button]:h-10"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="hidden md:block hover:cursor-pointer w-[65%] sm:w-[250px] md:w-auto rounded-full h-9 px-8 transition-transform active:scale-95"
          >
            Start Your Interview
          </Button>

          <Button
            type="submit"
            className="md:hidden hover:cursor-pointer w-[65%] sm:w-[250px] md:w-auto rounded-full h-9 px-8 transition-transform active:scale-95 bg-linear-to-t from-sky-700 via-sky-700 to-sky-500"
          >
            Start Your Interview
          </Button>
        </form>
      </Form>
    </div>
  );
}
