
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, child, get, update, remove } = require ('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyCQzDxMw-bIaW7xNhAH1iB6D2G_Ufgk_Vo",
  authDomain: "cinema-b16d2.firebaseapp.com",
  databaseURL: "https://cinema-b16d2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cinema-b16d2",
  storageBucket: "cinema-b16d2.appspot.com",
  messagingSenderId: "655281650638",
  appId: "1:655281650638:web:947c1525a47b00cd57c99f"
};

const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase(app));

async function getData(path) {
  return await get(child(dbRef, path)).then(data => data.exists() ? data.val() : '');
}
  
async function setData(updates) {
  return await update(dbRef, updates).then(() => true);
}

async function removeData(path) {
  const databaseRef = ref(getDatabase(app), path);
  return await remove(databaseRef).then(() => true);
}

module.exports = { getData, setData, removeData };