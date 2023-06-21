const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("D:\\veri\\sqlite\\notlar.db", (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }
})

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const ekle = (metin) => {
    const urlID = makeid(5) + '-' + makeid(5);
    return new Promise((resolve, reject) => {
        let sql = "insert into notlar (url_id, metin) values (?,?)"
        db.run(sql, [urlID, metin], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(urlID);
            }
        })
    })
}

const kontrol = (urlID) => {
    let sql = 'select count (*) adet from notlar where url_id = ?'
    return new Promise((resolve, reject) => {
        db.get(sql, [urlID], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row.adet === 1);
            }
        })
    })
}

const getir = (urlID) => {
    let sql = 'select metin from notlar where url_id = ?'
    return new Promise((resolve, reject) => {
        db.get(sql, [urlID], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row.metin);
            }
        })
    })
}

const guncelle = (urlID, metin) => {
    let sql = 'update notlar set metin = ? where url_id =?'
    return new Promise((resolve, reject) => {
        db.run(sql, [metin, urlID], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        })
    })
}

module.exports = { ekle, kontrol, getir, guncelle }