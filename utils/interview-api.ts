export const INTERVIEW_API_BASE_URL =
  (
    process.env.INTERVIEW_API_BASE_URL ||
    process.env.NEXT_PUBLIC_INTERVIEW_API_BASE_URL ||
    ""
  ).replace(/\/$/, "");

export function buildInterviewApiUrl(path: string) {
  return `${INTERVIEW_API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
