import { postData, getData, putData } from '../utils/requestUtils'

export const createUser = (user) => {
    //getUsers('https://p99test.fly.dev/v1/users')
    postData('/v1/users/create', {user})
    .then((data) => {
    console.log(data); // JSON data parsed by `data.json()` call
    });
}

export const getUser = () => {
    return getData(`/v1/users/`)
}

export const updateUser = (user) => {
    return putData('/v1/users/update/', user)
}