import e from 'express'
import ExercisesDAO from '../dao/exercisesDAO.js'

export default class ExercisesController{

static async apiGetExercises(req,res,next){
        const exercisesPerPage = req.query.exercisesPerPage ? parseInt(req.query.exercisesPerPage):30
        const page = req.query.page ? parseInt(req.query.page):0

    const filters = {};
    // if (req.query.group) {
    //     filters.group = req.query.group;
    //     console.log("group exists:", filters.group)
    // }

    if (req.query.groups) {
        filters.groups = req.query.groups;
        console.log("1.groups exists:", filters.groups)
    }

    if (req.query.name) {
        filters.name = req.query.name;
        console.log("name exists:", filters.name)
    }
    if (req.query.equipments) {
        filters.equipments = req.query.equipments;
        console.log("equipments exists:", filters.equipments)
    }

    // const {exercisesList, totalNumExercises}= await ExercisesDAO.getExercises({filters, page, exercisesPerPage})
    // let response = {
    //     exercises: exercisesList,
    //     page: page,
    //     filters: filters,
    //     entries_per_page: exercisesPerPage,
    //     total_results: totalNumExercises,
    // }

    const { exercisesList, totalNumExercises } = await ExercisesDAO.getExercises({
        filters,
        page,
        exercisesPerPage,
    })
    console.log(filters)

    let response = {
        exercises: exercisesList,
        page: page,
        filters: filters,
        entries_per_page: exercisesPerPage,
        total_results: totalNumExercises,
    };

    res.json(response)
    }


static async apiGetExerciseById(req,res,next){
    try{
        let id = req.params.id || {}
        let exercise = await ExercisesDAO.getExercisesbyId(id)
        if(!exercise){
            res.status(404).json({error:"not found"})
            return
        }
        res.json(exercise)
    }catch(e){
        console.log('api, '+e)
        res.status(500).json({error:e})
    }
}

static async apiGetGroups(req,res,next){
    try{

        let propertyTypes = await ExercisesDAO.getGroups()
        res.json(propertyTypes)
        }catch(e){
        console.log('api, '+e)
        res.status(500).json({error:e})
    }
}

static async apiGetEquipments(req,res,next){
    try{

        let propertyTypes = await ExercisesDAO.getEquipments()
        res.json(propertyTypes)
        }catch(e){
        console.log('api, '+e)
        res.status(500).json({error:e})
    }
}

}
