import styles from './ReviewSummary.module.css'
import {
  AccuracyIcon,
  CleanlinessIcon,
  CheckInIcon,
  CommunicationIcon,
  Location,
  Value,
  AggregateRatingStarIcon,
} from '../../icons'
import RatingBar from '../RatingBar/RatingBar'
import { useTranslation } from 'react-i18next';

const ReviewSummary = ({
  totalAvgRating,
  totalReviewsCount,
  ratings: {
    cleanlinessAvgRating,
    accuracyAvgRating,
    checkInAvgRating,
    communicationAvgRating,
    locationAvgRating,
    valueAvgRating,
    starTotals,
  },
}) => {

  const { t } = useTranslation();

  const categories = [
    {
      title: t('product.cleanliness'),
      rating: cleanlinessAvgRating,
      Icon: CleanlinessIcon,
    },
    { title: t('product.accuracy'), rating: accuracyAvgRating, Icon: AccuracyIcon },
    { title: t('product.checkIn'), rating: checkInAvgRating, Icon: CheckInIcon },
    {
      title: t('product.communication'),
      rating: communicationAvgRating,
      Icon: CommunicationIcon,
    },
    { title: t('product.location'), rating: locationAvgRating, Icon: Location },
    { title: t('product.value'), rating: valueAvgRating, Icon: Value },
  ]

  const reviewText = t('product.reviews', { count: totalReviewsCount })

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span aria-hidden="true">
          <AggregateRatingStarIcon />
        </span>
        <div>
          <h2 className={styles.summary}>
            {totalAvgRating} &#183; {totalReviewsCount}{reviewText}
          </h2>
        </div>
      </header>
      <main className={styles.main}>
        <RatingBar starTotals={starTotals} title={t('product.overallRating')} />
        {categories.map(({ title, rating, Icon }) => (
          <div key={title} className={styles.ratingItem}>
            <div className={styles.ratingItemSummary}>
              <h3>{title}</h3>
              <p>{(rating ?? 0).toFixed(1)}</p>
            </div>
            <span aria-hidden="true">
              <Icon />
            </span>
          </div>
        ))}
      </main>
    </div>
  )
}

export default ReviewSummary
