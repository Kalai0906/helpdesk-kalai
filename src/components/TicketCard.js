import API from '../../utils/axios';

API.get('/tickets')      // calls http://localhost:5000/api/tickets
   .then(res => console.log(res.data))
   .catch(err => console.error(err));
