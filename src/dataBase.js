const { getData, setData, removeData } = require('./fireBase');

async function login(login, password, users, ws) {
    if(Object.keys(users).includes(login)) return 'user_logined';
    let response = '';
    const data = await getData(`Users/${login}`);
    if(data) {
        if(data.password === password) {
            users[login] = ws;
            console.log(`User ${login} is connected.\n`);
            response = `true`;
        }
        else {
            response = 'wrong_password'
        }
    } 
    else {
      response = 'missing_login';
    }
    return response;
}

async function loginAdmin(login, password, users, ws) {
    let response = '';
    const data = await getData(`Admin/${login}`);
    if(data) {
        if(data.password === password) {
            users[login] = ws;
            console.log(`Admin ${login} is connected.\n`);
            response = `true`;
        }
        else {
            response = 'wrong_password'
        }
    } 
    else {
      response = 'missing_login';
    }
    return response;
}

async function registration(login, password, institution, users, ws) {
    let response = '';
    if(await getData(`Users/${login}`)) {
      response = 'user_exists';
    }
    else {
      let updates = {};
      const id = Math.round(1000 - 0.5 + Math.random() * (9999 - 1000 + 1));
      updates[`Users/${login}/password`] = password;
      updates[`Users/${login}/institution`] = institution;
      updates[`Users/${login}/id`] = id;
      await setData(updates);
      response = 'true';
      users[login] = ws;
      console.log(`User ${login} is connected.\n`);
    }
    return response;
}
async function getDormitories() {
    let response = '';
    const dormitories = await getData(`Dormitories`);
    Object.keys(dormitories).forEach(dormitory => response += `${dormitory}\n`);
    return response.trim();
}

async function getBookingRequest() {
    let response = '';
    const requests = await getData(`BookingRequests`);
    Object.keys(requests).forEach(req => response += `${req}\n`);
    return response.trim();
}

async function getSettleRequest() {
    let response = '';
    const requests = await getData(`SettleRequests`);
    Object.keys(requests).forEach(req => response += `${req}\n`);
    return response.trim();
}

async function searchDormitories(search) {
    let response = '';
    const dormitories = await getData(`Dormitories`);
    Object.keys(dormitories).forEach(dormitories => {
        if(dormitories.toLowerCase().includes(search.toLowerCase())) response += `${dormitories}\n`;
    });
    return response.trim();
}

async function searchDormitoriesInstitut(institution) {
    let response = '';
    const dormitories = await getData(`Dormitories`);
    for(let name in dormitories) {
        if(dormitories[name].Institution.includes(institution)) response += `${name}\n`;
    }
    return response.trim();
}

async function getDormitoriesInfo(name) {
     let response = '';
     const dormitories = await getData(`Dormitories/${name}`);
     const { Institution, Number, Rooms, Street} = dormitories;
     response += `Інститути: ${Institution}\n`;
     response += `Номер гуртожитка: ${Number}\n`;
     response += `Кількість кімнат: ${Rooms}\n`;
     response += `Вулиця: ${Street}\n`;
     return response;
}

async function getBookingRequestInfo(login) {
    if(await getData(`BookingRequests/${login}`))
    {
        let response = '';
        const requests = await getData(`BookingRequests/${login}`);
        const { secondname, firstname, surename, name, room, phone, id, status} = requests;
        response += `Прізвище: ${secondname}\n`;
        response += `Імя: ${firstname}\n`;
        response += `По батькові: ${surename}\n`;
        response += `Гуртожиток: ${name}\n`;
        response += `Номер кімнати: ${room}\n`;
        response += `Телефон: ${phone}\n`;
        response += `ID: ${id}\n`;
        response += `Статус: ${status}`;
        return response;
    }
    else if (await getData(`SettleRequests/${login}`))
    {
        let response = '';
        const requests = await getData(`SettleRequests/${login}`);
        const { secondname, firstname, surename, name, room, phone, id, status} = requests;
        response += `Прізвище: ${secondname}\n`;
        response += `Імя: ${firstname}\n`;
        response += `По батькові: ${surename}\n`;
        response += `Гуртожиток: ${name}\n`;
        response += `Номер кімнати: ${room}\n`;
        response += `Телефон: ${phone}\n`;
        response += `ID: ${id}\n`;
        response += `Статус: ${status}`;
        return response;
    }
    else
    {
        let response = '';
        response += "пусто";
        return response;
    }
}

async function getRooms(name) {
    let response = 0;
    const dormitories = await getData(`Dormitories/${name}`);
    const { Rooms} = dormitories;
    response += Rooms;
    return response;
}
async function getId(login) {
    let response = '';
    const loginUser = await getData(`Users/${login}`);
    const { id} = loginUser;
    response += id;
    return response;
}
async function getInstitut(login) {
    let response = '';
    const loginUser = await getData(`Users/${login}`);
    const { institution} = loginUser;
    response += institution;
    return response;
}

async function getBooking(login) {
    let response = '';
    if (await getData(`Booking/${login}`))
    {
        const booking = await getData(`Booking/${login}`);
        const { date, secondname, firstname, surename, name, room, phone, id, status} = booking;
        response += `Статус: ${status}\n`;
        response += `Дата виселення: ${date}\n`;
        response += `Прізвище: ${secondname}\n`;
        response += `Імя: ${firstname}\n`;
        response += `По батькові: ${surename}\n`;
        response += `Гуртожиток: ${name}\n`;
        response += `Номер кімнати: ${room}\n`;
        response += `Телефон: ${phone}\n`;
        response += `ID: ${id}`;
        return response;
    }
    else{
        response = 'none';
        return response;
    }
}
async function cancelBooking(login, room) {
    if (await getData(`Booking/${login}/status`) == "Бронювання підтвердженне!")
    {
        let namedorm = await getData(`Booking/${login}/name`)
        console.log(namedorm);
        console.log(await getData(`Booking/${login}/status`));
        await removeData(`Booking/${login}`);
        await removeData(`Booking/${namedorm}/${room}`);
        return 'true';
    }
    else if(await getData(`Booking/${login}/status`) == "Поселення підтвердженне!"){
        return 'false';
    }else{
        return "Кімната відсутня";
    }
}

async function cancelRequest(login) {
    if (await getData(`BookingRequests/${login}`))
    {
        await removeData(`BookingRequests/${login}`);
        return "true";
    }
    else if (await getData(`SettleRequests/${login}`))
    {
        await removeData(`SettleRequests/${login}`);
        return "true";
    }
}

async function getStatus(login) {
    if (await getData(`BookingRequests/${login}`))
    {
        return "Бронювання";
    }
    else if (await getData(`SettleRequests/${login}`))
    {
        return "Поселення";
    }
}

async function acceptRequest(login, date) {
    if (await getData(`BookingRequests/${login}`))
    {
        let updates = {};
        const requests = await getData(`BookingRequests/${login}`);
        const { secondname, firstname, surename, name, room, phone, id} = requests;
        updates[`Booking/${login}/name`] = name;
        updates[`Booking/${login}/room`] = room;
        updates[`Booking/${login}/secondname`] = secondname;
        updates[`Booking/${login}/firstname`] = firstname;
        updates[`Booking/${login}/surename`] = surename;
        updates[`Booking/${login}/phone`] = phone;
        updates[`Booking/${login}/id`] = id;
        updates[`Booking/${login}/date`] = date;
        updates[`Booking/${login}/status`] = "Бронювання підтвердженне!";
        updates[`Booking/${name}/${room}`] = id;
        await setData(updates);
        await removeData(`BookingRequests/${login}`);
    }
    else if (await getData(`SettleRequests/${login}`))
    {
        let updates = {};
        const requests = await getData(`SettleRequests/${login}`);
        const { secondname, firstname, surename, name, room, phone, id} = requests;
        updates[`Booking/${login}/name`] = name;
        updates[`Booking/${login}/room`] = room;
        updates[`Booking/${login}/secondname`] = secondname;
        updates[`Booking/${login}/firstname`] = firstname;
        updates[`Booking/${login}/surename`] = surename;
        updates[`Booking/${login}/phone`] = phone;
        updates[`Booking/${login}/id`] = id;
        updates[`Booking/${login}/date`] = date;
        updates[`Booking/${login}/status`] = "Поселення підтвердженне!";
        updates[`Booking/${name}/${room}`] = id;
        await setData(updates);
        await removeData(`SettleRequests/${login}`);
    }
}

async function getMyRoom(login) {
    let response = '';
    if (await getData(`Booking/${login}`))
    {
        const booking = await getData(`Booking/${login}`);
        const { room} = booking;
        response += room;
        return response;
    }
}

async function returnBusyRooms(name) {
    let response = '';
    if (await getData(`Booking/${name}`))
    {
        const rooms = await getData(`Booking/${name}`);
        Object.keys(rooms).forEach(room => response += `${room}\n`);
        return response.trim();
    }
    else{
        response = 'none';
        return response;
    } 
}

async function getDate(login) {
    let response = '';
    const dateBooking = await getData(`Booking/${login}`);
    const { date} = dateBooking;
    response += date;
    return response;
}

async function varifyInstitut(institution, name) {
    const dormitories = await getData(`Dormitories/${name}`);
        if(dormitories.Institution.includes(institution))
        {
            return "true";
        } 
        else{
            return "false";
        }
}

async function requestForBooking(name, room, login, secondname, firstname, surename, phone, id, mark) {
    if(await getData(`Booking/${login}`)) {
        response = 'booking_exists';
      }
      else if(await getData(`BookingRequests/${login}`))
      {
        response = 'booking_exists';
      }
      else if(await getData(`SettleRequests/${login}`))
      {
        response = 'booking_exists';
      }
      else if(mark == "Бронювання"){
        let updates = {};
        updates[`BookingRequests/${login}/name`] = name;
        updates[`BookingRequests/${login}/room`] = room;
        updates[`BookingRequests/${login}/secondname`] = secondname;
        updates[`BookingRequests/${login}/firstname`] = firstname;
        updates[`BookingRequests/${login}/surename`] = surename;
        updates[`BookingRequests/${login}/phone`] = phone;
        updates[`BookingRequests/${login}/id`] = id;
        updates[`BookingRequests/${login}/status`] = mark;
        await setData(updates);
        response = 'true';
      }
      else if(mark == "Поселення"){
        let updates = {};
        updates[`SettleRequests/${login}/name`] = name;
        updates[`SettleRequests/${login}/room`] = room;
        updates[`SettleRequests/${login}/secondname`] = secondname;
        updates[`SettleRequests/${login}/firstname`] = firstname;
        updates[`SettleRequests/${login}/surename`] = surename;
        updates[`SettleRequests/${login}/phone`] = phone;
        updates[`SettleRequests/${login}/id`] = id;
        updates[`SettleRequests/${login}/status`] = mark;
        await setData(updates);
        response = 'true';
      }
      return response;
}

async function BookingToSettle(login, date) {
    let response = '';
    if(await getData(`Booking/${login}`)){
        if(await getData(`Booking/${login}/status`) == "Кімната заброньованна") {
            let updates = {};
            updates[`Booking/${login}/status`] = "Ви поселенні";
            updates[`Booking/${login}/date`] = date;
            await setData(updates);
            response += 'true';
          }
          else{
            response += 'false';
          }
    }
    else{
        response += 'None';
    }
    return response;
}

module.exports = {
    login, 
    registration, 
    getDormitories,
    searchDormitories,
    searchDormitoriesInstitut,
    getDormitoriesInfo,
    getRooms,
    getId,
    getInstitut,
    getBooking,
    cancelBooking,
    returnBusyRooms,
    getMyRoom,
    getDate,
    varifyInstitut,
    BookingToSettle,
    loginAdmin,
    requestForBooking,
    getBookingRequest,
    getBookingRequestInfo,
    cancelRequest,
    getStatus,
    acceptRequest,
    getSettleRequest
};