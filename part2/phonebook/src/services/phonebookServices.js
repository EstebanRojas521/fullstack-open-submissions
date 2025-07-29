import axios from 'axios'
const baseUrl = 'api/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(`${baseUrl}/create`, newObject).then(res =>res.data)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/update/${id}`, newObject).then(res => res.data);
}

const deletePerson = (id) => {
  console.log('Deleting ID:', id, typeof id)
  return axios.delete(`${baseUrl}/delete/${id}`)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update,
  deletePerson: deletePerson, 
}