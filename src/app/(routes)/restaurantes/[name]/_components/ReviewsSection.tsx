import { Business, Review } from "@/types"
import { Textarea } from "@/components/ui/textarea"
import { Rating } from '@smastrom/react-rating';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import GlobalApi from "@/app/_utils/GlobalApi";
import { toast } from "sonner";
import ReviewList from "./ReviewList";

type ApiResponse = {
    reviews: Review[]
}

const ReviewsSection = ({ restaurante }: {
    restaurante: Business | null
}) => {

    const [rating, setRating] = useState(0)
    const [reviewText, setReviewText] = useState<string>();
    const { user } = useUser()
    const [reviews, setReviews] = useState<Review[] | null>(null)

    useEffect(() => {
        getReviewsList()
    }, [restaurante]);

    const handleSubmit = () => {
        const data = {
            email: user?.primaryEmailAddress?.emailAddress || '',
            profileImage: user?.imageUrl || '',
            reviewText: reviewText || '',
            star: rating,
            userName: user?.fullName || '',
            restoSlug: restaurante?.slug || ''
        }
        GlobalApi.addNewReview(data).then((res) => {
            toast.success('Added review')
            getReviewsList()
            setRating(0)
            setReviewText('')
        }).catch(error => {
            toast.error('Sorry impossible add your review for the moment')
        })
    }

    const getReviewsList = () => {
        if (restaurante) {
            GlobalApi.getRestauranteReviews(restaurante?.slug).then((res) => {
                const apiResponse = res as ApiResponse;
                setReviews(apiResponse.reviews)
            })
        }
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 mt-10 gap-7">
            <div className="flex flex-col p-3 border shadow-md rounded-md h-[250px]">
                <div className="flex flex-col gap-3 mb-12">
                    <h2 className="font-bold text-lg">Add your review</h2>
                    <Rating style={{ maxWidth: 100 }} value={rating} onChange={setRating} />
                    <Textarea onChange={(e) => setReviewText(e.target.value)}
                        value={reviewText}
                        className="resize-none"
                    />
                </div>
                <Button
                    onClick={() => handleSubmit()}
                    disabled={rating === 0 || !reviewText}>
                    Submit
                </Button>
            </div>
            <div className="col-span-2">
                <ReviewList reviews={reviews} />
            </div>
        </div>
    )
}

export default ReviewsSection
