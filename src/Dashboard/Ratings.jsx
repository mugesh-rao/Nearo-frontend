import React from 'react';
import Rating from '@mui/material/Rating';

const Ratings=({ popularityData })=> {
  const avgReviewStars = parseFloat(popularityData?.avg_review_stars) || 0;

  return (
    <Rating
      name="half-rating-read"
      value={Math.round(avgReviewStars * 5) / 5} // Round to one decimal place
      precision={0.2}
      readOnly={true}
    />
  );
}
export default Ratings

