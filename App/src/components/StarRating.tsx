import React, { useMemo, useState } from 'react'
import { Rating } from 'react-simple-star-rating'

export function StarRating() {
    const [rating, setRating] = useState(0) // initial rating value

    // Catch Rating value
    const handleRating = (rate: number) => {
        setRating(rate / 20)
        // other logic
    }

    return (
        <div className='App'>
            <Rating /* onClick={handleRating} */ size={20} ratingValue={rating} allowHalfIcon={true} fillColor="rgb(19,25,88)" /* Available Props */ />
        </div>
    )
}

// For more Usage: https://www.npmjs.com/package/react-simple-star-rating