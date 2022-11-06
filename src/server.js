const ws = require('ws');
const { 
  login, 
  registration, 
  getFilms,
  searchFilms,
  searchFilmsGenre,
  getFilmsInformation,
  getOrder,
  addOrder,
  getUserOrder,
  getOrderInformation,
  removeBooking
} = require('./database.js');


const port = process.env.PORT || 3000;
const wss = new ws.Server({
  port,
}, () => console.log(`Server started on ${port}\n`));

let users = {};

wss.on('connection', (ws) => {
  ws.onmessage = async req => {
    let resp = '';
    const data = JSON.parse(req.data);

    if(data.func === 'login') {
      resp = await login(data.login, data.password, users, ws);
    }
    if(data.func === 'registration') {
      resp = await registration(data.login, data.password);
    }
    if(data.func === 'getFilms') {
      resp = await getFilms();
    }
    if(data.func === 'searchFilms') {
      resp = await searchFilms(data.search);
    }
    if(data.func === 'searchFilmsGenre') {
      resp = await searchFilmsGenre(data.genre);
    }
    if(data.func === 'getFilmsInformation') {
      resp = await getFilmsInformation(data.name);
    }
    if(data.func === 'getOrder') {
      resp = await getOrder(data.name, data.date, data.time);
    }
    if(data.func === 'addOrder') {
      resp = await addOrder(data.login, data.name, data.date, data.time, data.places, data.type, data.price, data.phone, data.client);
    }
    if(data.func === 'getUserOrder') {
      resp = await getUserOrder(data.login);
    }
    if(data.func === 'getOrderInformation') {
      resp = await getOrderInformation(data.login, data.id);
    }
    if(data.func === 'removeBooking') {
      resp = await removeBooking(data.login, data.id);
    }
    console.log(output(data)); 
    console.log(`Respond:\n${resp}\n`);
    ws.send(resp);
  };

  ws.onclose = () => {
    const login = getLogin(users, ws);
    if(login) {
      delete users[login];
      console.log(`${login} is disconnected.\n`);
    }
  }
});

function output(data) {
  console.log('New request:');
  for(let key in data) {
    if(!data[key]) delete data[key]
  }
  return data;
}

function getLogin(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}