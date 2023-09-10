import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let exercises
export default class ExercisesDAO{
    static async injectDB(conn){
        if(exercises){
            return
        }
        try{
        //exercises = await conn.db(process.env.MOVIEREVIEWS_NS).collection('Fit_collec')
        exercises = await conn.db(process.env.MOVIEREVIEWS_NS).collection('exercises_new')
        
        }
        catch(e){
        console.error('unable to connect in ExercisesDAO:${e}')
        }
    }
//}

static async getExercises({
    filters = null,
    page = 0,
    exercisesPerPage = 20
    } = {}){

    let query
    
    if(filters){        
        if("name" in filters){
            query = {$text: {$search:filters['name']}}
        } else if ("groups" in filters && "equipments" in filters) {
            filters.groups = filters.groups.split(',')
            filters.equipments = filters.equipments.split(',')
            query = 
                {$and: [
                    {
                "group": { $in: filters.groups },
                "equipment": { $in: filters.equipments }
                }
                        ]}
   
            console.log("2.", query)
        
        }else if("groups" in filters){
            filters.groups = filters.groups.split(',')
            query = {"group":{$in:filters.groups}}
            console.log("2.",query)

        }else if("equipments" in filters){
            filters.equipments = filters.equipments.split(',')
            query = {"equipment":{$in:filters.equipments}}
            console.log("2.",query)
        }
        }

        let cursor
        try{
                cursor = await exercises.find(query).limit(exercisesPerPage).skip(exercisesPerPage * page)
                const exercisesList = await cursor.toArray()
                  // Shuffle the exercisesList
                //shuffle(exercisesList);
                const totalNumExercises = await exercises.countDocuments(query)
                return{exercisesList, totalNumExercises}
            }
            catch(e){
                console.error('3. Unable to issue find coomand, ${e}')
                return{exercisesList:[], totalNumExercises: 0}
            }
        }

        static async getGroups(){
            let groups = []
            try {
                groups = await exercises.distinct("group")
                return groups
            }catch(e){
                console.error('unable to get groups, '+e)
                return groups
            }
        }

        static async getEquipments(){
            let equipments = []
            try {
                equipments = await exercises.distinct("equipment")
                return equipments
            }catch(e){
                console.error('unable to get equipments, '+e)
                return equipments
            }
        }

        static async getExercisesbyId(id){
            try{return await exercises.aggregate([
                {
                    $match:{
                        _id: new ObjectId(id)
                    }
                },
                {$lookup:
                    {
                        from:'reviews',
                        localField:'_id',
                        foreignField:'exercises_id',
                        as:'reviews'
                    }}
            ]).next()
        }catch(e){
            console.error('something went wrong in getExerciseById: '+e)
            throw e
        }
        }
    }
