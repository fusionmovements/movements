import axios from "axios";

class ExerciseDataService{
getAll(page=0){
    return axios.get(`http://backend-3s98.onrender.com/api/v1/exercises?page=${page}`)
}

get(id){
    return axios.get(`http://backend-3s98.onrender.com/api/v1/exercises/id/${id}`)
}

find(query,by){
    return axios.get(`http://backend-3s98.onrender.com/api/v1/exercises?${by}=${query}`)
}

find2(query1,by1,query2,by2){
    return axios.get(`http://backend-3s98.onrender.com/api/v1/exercises?${by1}=${query1}&${by2}=${query2}`)
}

//findTwo(query1,by1,query2,by2){}

// createReview(data){
//     return axios.post(`http://localhost:4000/api/v1/exercises/review`,data)
// }

// updateReview(data){
//     return axios.put(`http://localhost:4000/api/v1/exercises/review`,data)
// }

// deleteReview(id,userId){
//     return axios.delete(`http://localhost:4000/api/v1/exercises/review`,{data:{review_id:id,user_id:userId}})
// }

getGroups(){
    return axios.get(`http://backend-3s98.onrender.com/api/v1/exercises/groups`)
}

getEquipments(){
    return axios.get(`http://backend-3s98.onrender.comapi/v1/exercises/equipments`)
}



}

export default new ExerciseDataService()