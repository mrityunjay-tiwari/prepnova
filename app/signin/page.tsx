import {AuthButton} from "@/components/signin/sign-in-button";
import {signIn} from "@/utils/auth";

export default async function LoginPage() {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="max-w-92 m-auto h-fit w-full">
        <div className="p-6">
          <div>
            <h1 className="mb-0.5 mt-4 text-xl font-medium">
              Welcome to Prepnova.
            </h1>
            <p className="text-gray-700 dark:text-inherit">
              Login to get started
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", {redirectTo: "/dashboard"});
            }}
            className="mt-6"
          >
            <AuthButton />
          </form>
        </div>
      </div>
    </section>
  );
}
