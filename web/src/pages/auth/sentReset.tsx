//page to show when the user has requested a password reset
import Link from "next/link";
import { useRouter } from "next/router";

export default function SentReset() {
  //get query string
  const router = useRouter();
  const { email } = router.query;
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white py-6 sm:py-12">
      <div className="max-w-xl px-5 text-center">
        <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
          Check your inbox
        </h2>
        <p className="mb-2 text-lg text-zinc-500">
          We are glad, that you’re with us ? We’ve sent you a verification link
          to the email address{" "}
          <span className="font-medium text-yellow-600">{email}</span>.
        </p>
        <Link
          href="/auth"
          className="mt-3 inline-block w-96 rounded bg-black px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20"
        >
          Go back to login →
        </Link>
      </div>
    </div>
  );
}
