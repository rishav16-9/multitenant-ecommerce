import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

const MAX_RATING = 5;
const MIN_RATING = 0;

interface StarRatingProps {
  rating: number;
  classNmae?: string;
  iconClassName?: string;
  text?: string;
}
export const StarRating = ({
  rating,
  classNmae,
  iconClassName,
  text,
}: StarRatingProps) => {
  const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));
  return (
    <div className={cn("flex items-center gap-1", classNmae)}>
      {Array.from({ length: MAX_RATING }).map((_, index) => (
        <StarIcon
          key={index}
          className={cn(
            "size-4",
            index < safeRating ? "fill-black" : "",
            iconClassName
          )}
        />
      ))}
      {text && <p>{text}</p>}
    </div>
  );
};
