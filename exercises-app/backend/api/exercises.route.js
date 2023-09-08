import express from 'express'
import ExercisesController from './exercises.controller.js'
//import ReviewsController from './reviews.controller.js'

const router = express.Router()

//router.route('/').get((req,res) => res.send('hello world'))

router.route('/').get(ExercisesController.apiGetExercises)
router.route("/id/:id").get(ExercisesController.apiGetExerciseById)
router.route('/groups').get(ExercisesController.apiGetGroups)
router.route('/equipments').get(ExercisesController.apiGetEquipments)

//router
//    .route("/review")
//    .post(ReviewsController.apiPostReview)
//    .put(ReviewsController.apiUpdateReview)
//    .delete(ReviewsController.apiDeleteReview)

export default router
