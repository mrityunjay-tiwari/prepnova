import InterviewPage from "@/components/interview/interview-page";
import {auth} from "@/utils/auth";
import {redirect} from "next/navigation";
import {getStreamToken} from "../actions/stream";

export default async function InterviewMainPage() {
  const user = await auth();
  if (!user) redirect("/signin");
  const token = await getStreamToken(user.user?.id || "");

  return (
    <div>
      <InterviewPage
        userId={user.user?.id || ""}
        userName={user.user?.name || "You"}
        userToken={token}
      />
    </div>
  );
}
