const ws = require('ws');
const { 
    login, 
    registration, 
    getDormitories,
    searchDormitories,
    searchDormitoriesInstitut,
    getDormitoriesInfo,
    getRooms,
    getId,
    getInstitut,
    addBooking,
    getBooking,
    cancelBooking,
    returnBusyRooms,
    getMyRoom,
    getDate,
    varifyInstitut
  } = require('./dataBase.js');

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
        resp = await registration(data.login, data.password, data.institution);
      }
      if(data.func === 'getDormitories') {
        resp = await getDormitories();
      }
      if(data.func === 'searchDormitories') {
        resp = await searchDormitories(data.search);
      }
      if(data.func === 'searchDormitoriesInstitut') {
        resp = await searchDormitoriesInstitut(data.institution);
      }
      if(data.func === 'getDormitoriesInfo') {
        resp = await getDormitoriesInfo(data.name);
      }
      if(data.func === 'getRooms') {
        resp = await getRooms(data.name);
      }
      if(data.func === 'getId') {
        resp = await getId(data.login);
      }
      if(data.func === 'getInstitut') {
        resp = await getInstitut(data.login);
      }
      if(data.func === 'addBooking') {
        resp = await addBooking(data.name, data.room, data.login, data.secondname, data.firstname, data.surename, data.phone, data.id, data.mark, data.date);
      }
      if(data.func === 'getBooking') {
        resp = await getBooking(data.login);
      }
      if(data.func === 'cancelBooking') {
        resp = await cancelBooking(data.login, data.room, data.name);
      }
      if(data.func === 'returnBusyRooms') {
        resp = await returnBusyRooms(data.name);
      }
      if(data.func === 'getMyRoom') {
        resp = await getMyRoom(data.login);
      }
      if(data.func === 'getDate') {
        resp = await getDate(data.login);
      }
      if(data.func === 'varifyInstitut') {
        resp = await varifyInstitut(data.institution, data.name);
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