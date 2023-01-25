import SelectableChip from "../Inputs/SelectableChip";
interface Props {
  styles: string[];
  selectedStyles: string[];
  className?: string;
}

export default function ProfileTags({
  styles,
  selectedStyles,
  className = "",
}: Props) {
  //#region Handlers

  //#endregion

  return (
    <ul
      className={`flex list-none flex-wrap justify-center gap-2 sm:gap-4 ${className}`}
    >
      {styles.map((style) => (
        <li key={style}>
          <SelectableChip
            label={style}
            selected={selectedStyles.includes(style)}
            onSelect={(style, selected) => {}}
            className={"bg-yellow-700 disabled:pointer-events-none"}
          />
        </li>
      ))}
    </ul>
  );
}
