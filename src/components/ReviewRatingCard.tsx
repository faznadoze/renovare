import type { GoogleReviewItem } from '../data/renovareContent';

interface ReviewRatingCardProps {
  review: GoogleReviewItem;
  slot: number;
  /** Joins the testimonials scroll reveal; off for cards animated elsewhere (hero) */
  revealOnScroll?: boolean;
  /** "figma": olive photo block (hero). "quiet": paper card for the testimonials section */
  variant?: 'figma' | 'quiet';
  className?: string;
}

const STAR_PATH =
  'M5.21828 1.17053C5.33799 0.802097 5.85922 0.802097 5.97894 1.17053L6.76579 3.59222C6.81933 3.75699 6.97287 3.86854 7.14612 3.86854H9.69243C10.0798 3.86854 10.2409 4.36427 9.92749 4.59197L7.86748 6.08866C7.72732 6.19049 7.66867 6.37099 7.7222 6.53576L8.50906 8.95745C8.62877 9.32588 8.20708 9.63225 7.89367 9.40455L5.83366 7.90786C5.6935 7.80603 5.50371 7.80603 5.36355 7.90786L3.30354 9.40455C2.99013 9.63225 2.56845 9.32588 2.68816 8.95745L3.47501 6.53576C3.52855 6.37099 3.4699 6.19049 3.32974 6.08866L1.26973 4.59197C0.95632 4.36427 1.11739 3.86854 1.50478 3.86854H4.0511C4.22434 3.86854 4.37789 3.75699 4.43143 3.59222L5.21828 1.17053Z';

// Figma "card-rating": olive photo block with a star pill, real Google review text on the right
export function ReviewRatingCard({
  review,
  slot,
  revealOnScroll = true,
  variant = 'figma',
  className,
}: ReviewRatingCardProps) {
  const stars = Math.max(0, Math.min(5, Math.round(review.rating)));
  const classes = [
    'review-rating',
    variant === 'quiet' && 'review-rating--quiet',
    revealOnScroll && 'js-review-pop',
    `review-rating--slot-${slot}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Quiet: the words lead; name, date and small olive stars sit above them
  if (variant === 'quiet') {
    return (
      <article className={classes}>
        <header className="review-quiet__head">
          <h3 className="review-quiet__author">{review.author}</h3>
          <span className="review-quiet__stars" role="img" aria-label={`${stars} de 5 estrelas`}>
            {Array.from({ length: stars }, (_, idx) => (
              <svg key={idx} viewBox="0 0 11.1972 11.1972" width="11" height="11" aria-hidden="true">
                <path d={STAR_PATH} fill="currentColor" />
              </svg>
            ))}
          </span>
        </header>
        <p className="review-quiet__quote">“{review.comment}”</p>
        <p className="review-quiet__time">{review.relativeTime} · Google</p>
      </article>
    );
  }

  return (
    <article className={classes}>
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
