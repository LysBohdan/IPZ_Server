const { getData, setData, removeData } = require('./firebase');

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
  
async function registration(login, password) {
    let response = '';
    if(await getData(`Users/${login}`)) {
      response = 'user_exists';
    }
    else {
      let updates = {};
      updates[`Users/${login}/password`] = password;
      await setData(updates);
      response = 'true';
    }
    return response;
}

async function getFilms() {
    let response = '';
    const films = await getData(`Films`);
    Object.keys(films).forEach(film => response += `${film}\n`);
    return response.trim();
}

async function searchFilms(search) {
    let response = '';
    const films = await getData(`Films`);
    Object.keys(films).forEach(film => {
        if(film.toLowerCase().includes(search.toLowerCase())) response += `${film}\n`;
    });
    return response.trim();
}

async function searchFilmsGenre(genre) {
    let response = '';
    const films = await getData(`Films`);
    for(let name in films) {
        if(films[name].genre.includes(genre)) response += `${name}\n`;
    }
    return response.trim();
}

async function getFilmsInformation(name) {
    let response = '';
    const film = await getData(`Films/${name}`);
    const { country, genre, director, actors, duration, description} = film;
    response += `Країна: ${country}\n`;
    response += `Жанр: ${genre}\n`;
    response += `Режисер: ${director}\n`;
    response += `Актори: ${actors}\n`;
    response += `Тривалість: ${duration}хв\n`;
    response += `Опис: ${description}`;
    return response;
}

async function getOrder(name, date, time,) {
    let response = '';
    const keyDate = date.replace(/\./g, '');
    const keyTime = time.replace(/\:/g, '');
    const order = await getData(`Order/${name}/${keyDate}/${keyTime}`);
    for(let place in order) response += `${place}-${order[place]}\n`;
    return response.trim();
}

async function addOrder(login, name, date, time, places, type, price, phone, client) {
    const keyDate = date.replace(/\./g, '');
    const keyTime = time.replace(/\:/g, '');
    let updates = {};
    places.split(' ').forEach(place => {
        updates[`Order/${name}/${keyDate}/${keyTime}/${place}`] = type;
    });
    await setData(updates);

    updates = {};
    const id = Math.round(1000 - 0.5 + Math.random() * (9999 - 1000 + 1));
    updates[`Users/${login}/Order/${id}`] = { name, date, time, places, type, price, phone, client };
    await setData(updates);
    return id;
}

async function removeBooking(login, id) {
    const booking = await getData(`Users/${login}/Order/${id}`);
    const { name, date, time, places } = booking;
    const keyDate = date.replace(/\./g, '');
    const keyTime = time.replace(/\:/g, '');
    const arr = places.split(' ');
    for(let place of arr) {
        await removeData(`Order/${name}/${keyDate}/${keyTime}/${place}`);
    }
    await removeData(`Users/${login}/Order/${id}`);
    return 'Бронювання скасовано!';
}

async function getUserOrder(login) {
    let response = '';
    const order = await getData(`Users/${login}/Order`);
    for(let id in order) {
        const { type } = order[id];
        response += type === 'paid' ? `Оплата - ${id}\n` : `Бронювання - ${id}\n`;
    }
    return response.trim();
}

async function getOrderInformation(login, id) {
    let response = '';
    const info = await getData(`Users/${login}/Order/${id}`);
    const { name, date, time, places, price, phone, client } = info;
    response += `Назва: ${name}\n`;
    response += `Дата: ${date}\n`;
    response += `Час: ${time}\n`;
    response += places.split(' ').length > 1 ? `Місця: ${places.replace(/\s/g, ', ')}\n` : `Місце: ${places}\n`;
    response += `Ціна: ${price} грн\n`;
    response += `Номер телефону: ${phone}\n`;
    response += `Ім'я та прізвище: ${client}`;
    return response;
}

module.exports = {
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
};
