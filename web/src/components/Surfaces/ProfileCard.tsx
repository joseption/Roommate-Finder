import { useState } from "react";

import Author from "../Widgets/Author";
// import ImageDialog from "../Dialogs/ImageDialog";
import Card from "./Card";
import CustomImage from "./CustomImage";

interface Props {
  id: string;
  src: string;
  bio: string | null;
  authorName: string;
  showDialog?: boolean;
  className?: string;
  tags?: string[];
}

export default function ProfileCard({
  src,
  bio,
  authorName,
  showDialog = true,
  className = "",
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    if (showDialog) {
      setIsDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card
        tabIndex={1}
        className={`group relative aspect-square cursor-pointer select-none overflow-hidden transition-all duration-200 ease-out 
        hover:shadow-2xl focus-visible:scale-90 focus-visible:ring-4 focus-visible:ring-indigo-800 focus-visible:ring-offset-4 sm:hover:scale-[103%] ${className}`}
        onClick={handleDialogOpen}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleDialogOpen();
          }
        }}
      >
        <CustomImage
          src={src}
          alt={bio ? bio : "No bio 🙃"}
          fill
          priority
          sizes={
            "(max-width: 600px) 40vw, (max-width: 1024px) 30vw, (max-width: 1650px) 22vw, 36rem"
          }
          containerClassName={"absolute"}
          className={
            "scale-[103%] sm:group-hover:scale-100 sm:group-hover:blur-sm sm:group-hover:brightness-[40%]"
          }
          style={{
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
        <div
          className={
            "relative hidden h-full flex-col justify-between p-3 text-slate-50 opacity-0 transition-all duration-200 ease-out group-hover:opacity-100 sm:flex sm:gap-2 lg:gap-4 lg:p-6"
          }
        >
          <p className={"text-center text-lg sm:line-clamp-2 md:line-clamp-3"}>
            {/* display alt message if no bio */}
            {bio ? bio : "No bio 🙃"}
          </p>
          <Author
            authorName={authorName ? authorName : "No Name 🙃"}
            className={"justify-center"}
          />
        </div>
      </Card>
      {/* pop up here */}
    </>
  );
}
