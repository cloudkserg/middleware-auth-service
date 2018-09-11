const request = require('request-promise');

const clientId = 'client';
const secret = 'secret';
const authPort = 8082;
const servicePort = 8083;




const main = async () => {
  const argv = process.argv;

  if (argv[2] == 'register') {
    const response = await request(`http://localhost:${authPort}/services`, {
      method: 'POST',
      json: {
        id: argv[3],
        secret: argv[4]
      }
    });
    console.log(`response=${JSON.stringify(response)}`);
  }

  if (argv[2] == 'token') {
    const response = await request(`http://localhost:${authPort}/tokens`, {
      method: 'POST',
      json: {
        id: argv[3],
        secret: argv[4],
        scopes: argv[5].split(',')
      }
    });

    console.log(`token=${response.token} \n refresh=${response.refreshToken}`);
  }

  if (argv[2] == 'refresh') {
    const response = await request(`http://localhost:${authPort}/tokens/refresh`, {
      method: 'POST',
      json: {
        token: argv[3]
      }
    });
    console.log(`token=${response.token}`);
  }

  if (argv[2] == 'do') {
    const response = await request(`http://localhost:${servicePort}/do`, {
      method: 'POST',
      json: true,
      headers: {
        'Authorization': 'Bearer ' + argv[3]
      }
    }).catch(e => { return e.message; });
    console.log(`response=${JSON.stringify(response)}`);
  }


  if (argv[2] == 'blacklist') {
    const response = await request(`http://localhost:${authPort}/tokens/blacklist`, {
      method: 'POST',
      json: {
        token: argv[3],
        blackToken: argv[4]
      }
    });
    console.log(`response=${JSON.stringify(response)}`);
  }

  if (argv[2] == 'user_token') {
    const response = await request(`http://localhost:${authPort}/user/tokens`, {
      method: 'POST',
      json: {
        token: argv[3],
        userId: argv[4],
        scopes: argv[5].split(',')
      }
    });
    console.log(`token=${response.token}`);
  }
};


main();