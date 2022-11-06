
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, child, get, update, remove } = require ('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyCTQAVkYCL_bDosHF2Z_SUxb97AefjzcaM",
    authDomain: "ipz-1-lys.firebaseapp.com",
    databaseURL: "https://ipz-1-lys-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ipz-1-lys",
    storageBucket: "ipz-1-lys.appspot.com",
    messagingSenderId: "16475881803",
    appId: "1:16475881803:web:8ae932afc8c7deea7d68ce"
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