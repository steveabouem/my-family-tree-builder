import axios from 'axios'

const request = axios.create();

const submitLoginForm = ({email, name, password}) => {
    return request.post('/login', {email, name, password});
};

const submitRegistrationForm = ({email, name, password}) => {
    return request.post('api/register', {email, name, password});
};

export default {
    submitLoginForm,
    submitRegistrationForm
}