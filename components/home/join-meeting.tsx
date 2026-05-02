"use client";

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {Button} from "@/components/ui/button";

type FormValues = {
  role: string;
};

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
          className="flex flex-col md:flex-row gap-10 items-end justify-start"
        >
          <FormField
            control={form.control}
            name="role"
            render={({field}) => (
              <FormItem>
                <FormLabel className="font-normal text-xs">
                  Select Interview Role
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="rounded-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Choose role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="react-developer">
                      React Developer
                    </SelectItem>
                    <SelectItem value="full-stack-developer">
                      Full Stack Developer
                    </SelectItem>
                    <SelectItem value="frontend-developer">
                      Frontend Developer
                    </SelectItem>
                    <SelectItem value="backend-developer">
                      Backend Developer
                    </SelectItem>
                    <SelectItem value="data-scientist">
                      Data Scientist
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button type="submit" className="hover:cursor-pointer md:w-full w-[90%] rounded-full">
            Start Your Interview
          </Button>
        </form>
      </Form>
    </div>
  );
}
