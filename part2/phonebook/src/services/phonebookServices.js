import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject).then(res =>res.data)
}

const update = (id, newObject) => {
  console.log('Deleting ID:', id, typeof id)
  return axios.put(`${baseUrl}/${id}`, newObject).then(res => res.data);
}

const deletePerson = (id) => {
  console.log('Deleting ID:', id, typeof id)
  return axios.delete(`${baseUrl}/${id}`)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update,
  deletePerson: deletePerson, 
}