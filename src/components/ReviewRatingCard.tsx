import type { GoogleReviewItem } from '../data/renovareContent';

interface ReviewRatingCardProps {
  review: GoogleReviewItem;
  slot: number;
}

// Figma "card-rating": olive photo block with a star pill, real Google review text on the right
export function ReviewRatingCard({ review, slot }: ReviewRatingCardProps) {
  const stars = Math.max(0, Math.min(5, Math.round(review.rating)));

  return (
    <article className={`review-rating js-review-pop review-rating--slot-${slot}`}>
      <div className="review-rating__photo-wrap">
        <div className="review-rating__photo">
          <div className="review-rating__stars" role="img" aria-label={`${stars} de 5 estrelas`}>
            {Array.from({ length: stars }, (_, idx) => (
              <img key={idx} src="./assets/74dee.svg" alt="" width={11.1972} height={11.1972} />
            ))}
          </div>
        </div>
      </div>
      <div className="review-rating__body">
        <h3 className="review-rating__name">{review.author}</h3>
        <p className="review-rating__text">{review.comment}</p>
        <p className="review-rating__time">{review.relativeTime}</p>
      </div>
    </article>
  );
}
