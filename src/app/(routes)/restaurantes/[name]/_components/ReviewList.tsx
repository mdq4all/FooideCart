import { Review } from "@/types"
import { Rating } from "@smastrom/react-rating"
import moment from "moment"
import Image from "next/image"

const ReviewList = ({ reviews }: {
    reviews: Review[] | null
}) => {

    return (reviews && reviews.length > 0 ? (
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
            {reviews && reviews.map((review) => (
                <div key={review.id} className="flex gap-5 items-center border rounded-lg p-2">
                    <Image src={review.profileImage}
                        width={50}
                        height={50}
                        alt={`image profile ${review.userName}`}
                        className="rounded-full" />
                    <div>
                        <h2 className="capitalize font-bold">{review.userName}</h2>
                        <Rating
                            style={{ maxWidth: 100 }}
                            value={review.star}
                            isDisabled={true} />
                        <h2 className="text-gray-500 text-sm">{review.reviewText} at {moment(review.publishedAt).format('DD-MMM-yyyy')}</h2>
                    </div>
                </div>
            ))}
        </div> ) : (
            <div className="h-32 bg-slate-300 p-6 rounded-md">
                <h2 className="text-xl text-primary font-bold">No review yet</h2>
            </div>
        )
    )
}

export default ReviewList
