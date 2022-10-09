import axios from 'axios'

const request = axios.create();

const fetchHouseholds = ({email, name, password}) => {
    return request.get('/api/households');
};

export default {
    fetchHouseholds,
}