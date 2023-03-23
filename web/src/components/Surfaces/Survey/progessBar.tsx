interface Props {
  TotalnumberOfquestions: number;
  QuestionsAnswered: number;
  className?: string;
}

export default function ProgessBar({
  TotalnumberOfquestions,
  QuestionsAnswered,
  className = "",
  ...rest
}: Props) {
  const Percentage = Math.floor(
    (QuestionsAnswered / TotalnumberOfquestions) * 100
  );

  return (
    <div
      className={`mx-auto w-4/5 rounded-full bg-gray-200 dark:bg-gray-700`}
      {...rest}
    >
      <div
        className={
          "rounded-full bg-yellow-500 p-2 text-center text-sm font-medium leading-none text-white"
        }
        style={{ width: `${Percentage}%` }}
      >
        {Percentage}%
      </div>
    </div>
  );
}
