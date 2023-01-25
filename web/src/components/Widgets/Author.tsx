import Link from "next/link";
interface Props {
  authorName: string;
  className?: string;
}

export default function Author({ authorName, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <p className={"truncate"}>
        <Link
          href={`/profile/${encodeURI(authorName)}`}
          className={
            "inline text-inherit transition duration-200 ease-out hover:text-indigo-700 focus-visible:outline-none dark:hover:text-indigo-300"
          }
          onClick={(e) => e.stopPropagation()}
        >
          <b>{authorName}</b>
        </Link>
      </p>
    </div>
  );
}
