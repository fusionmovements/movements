import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO{
    static async injectDB(conn){
        if(reviews){
            return
        }
        try{
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection('reviews')
        }
        catch(e){
            console.error('unable to establish connection handle in reviewsDAO:${e}')
        }
    }

    static async addReview(movieId, user, review, date){
        try{
            const reviewDoc = {
                name: userInfo.name,
                user_id: userInfo._id,
                date: date,
                review: review,
                movie_id: new ObjectId(movieId)
            }
            return await reviews.insertOne(reviewDoc)
            }
            catch(e){
                console.error('unable to post addreview: '+e)
                return { error:e}
            }
    }

    static async updateReview(reviewId, userId, review, date){
        try{
            const updateResponse = await reviews.updateOne(
                {user_id:userId,_id: new ObjectId(reviewId)},
                {$set:{review:review,date:date}}
            )
            return UpdateResponse
            }
            catch(e){
                console.error('unable to update review: '+e)
                return {error:e}
            }
    }

    static async deleteReview(reviewId, userId){
        try{
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId),
                user_id:userId,
            })
            return deleteResponse
        }
        catch(e){
            console.error('unable to delete review:${e}')
            return {error: e}
        }
    }
}