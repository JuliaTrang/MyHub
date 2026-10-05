const axios = require('axios');

async function test() {
  try {
    await axios.post('http://localhost:3001/api/auth/register', {
      username: '',
      email: 'not-an-email',
      password: 'short'
    });
  } catch (err) {
    console.log(JSON.stringify(err.response.data, null, 2));
  }
}
test();
