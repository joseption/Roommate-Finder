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
  //get the percentage of the progress bar in ratio of 6
  const Percentage = (QuestionsAnswered / TotalnumberOfquestions) * 100;
  let ratio = 0;
  if (Percentage < 10) {
    ratio = 10;
  }
  if (Percentage >= 10 && Percentage < 25) {
    ratio = 25;
  }
  if (Percentage >= 25 && Percentage < 50) {
    ratio = 50;
  }
  if (Percentage >= 50 && Percentage < 75) {
    ratio = 75;
  }
  if (Percentage >= 75 && Percentage < 100) {
    ratio = 85;
  }
  if (Percentage === 100) {
    ratio = 100;
  }

  return (
    <div
      className={`mx-auto w-4/5 rounded-full bg-gray-200 dark:bg-gray-700`}
      {...rest}
    >
      <div
        className={
          "rounded-full bg-yellow-500 p-2 text-center text-sm font-medium leading-none text-white"
        }
        style={{ width: `${ratio}%` }}
      >
        {Percentage}%
      </div>
    </div>
  );
}
