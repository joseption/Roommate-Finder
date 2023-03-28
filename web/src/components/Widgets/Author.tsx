import Link from "next/link";
interface Props {
  authorName: string;
  className?: string;
}

export default function Author({ authorName, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <p className={"truncate"}>
        <b>{authorName}</b>
      </p>
    </div>
  );
}
