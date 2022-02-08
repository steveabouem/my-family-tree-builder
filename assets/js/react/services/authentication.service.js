import axios from 'axios'

const request = axios.create();

const submitLoginForm = ({email, name, password}) => {
    request.post('api/login', {email, name, password});
};

const submitRegistrationForm = ({email, name, password}) => {
    request.post('api/register', {email, name, password});
};

export default {
    submitLoginForm,
    submitRegistrationForm
}