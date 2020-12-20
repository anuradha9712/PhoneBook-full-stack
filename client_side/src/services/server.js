import axios from 'axios'
// const baseUrl = 'http://localhost:9000/api'
const baseUrl = '/api'


const getAll = () => {
    return axios.get(baseUrl)
}
  
const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const deleteEntry =(id) =>{
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id,newObject)=>{
    return axios.put(`${baseUrl}/${id}`,newObject)
}


export default {getAll, create, deleteEntry,update}