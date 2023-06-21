const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const notlar = require('./notlar');
const bodyParser = require("body-parser");
const vt = require('./vt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", express.static('public'));
app.use('/notlar', notlar);
//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

let istemciUrlSozluk = {}

wss.on('connection', (ws, req) => {

    let urlID = req.url.replace('/', '');
    if (istemciUrlSozluk.hasOwnProperty(urlID)) {
        let aktifListe = istemciUrlSozluk[urlID].filter(i => i.readyState === WebSocket.OPEN);
        aktifListe.push(ws);
        istemciUrlSozluk[urlID] = aktifListe;
    } else {
        vt.kontrol(urlID)
            .then(notVarmi => {
                if (notVarmi) {
                    istemciUrlSozluk[urlID] = [ws]
                } else {
                    ws.close();
                }
            })
            .catch(hata => { 
                ws.close()
                console.log(hata);
            });
    }

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        let mesaj = message.toString()
        let belirtici = mesaj.substring(0, 2)

        if (belirtici === "01") {
            let urlID = mesaj.substring(2, 13);
            let metin = mesaj.substring(13);
            vt.guncelle(urlID, metin);
            if (istemciUrlSozluk.hasOwnProperty(urlID)) {
                istemciUrlSozluk[urlID]
                    .filter(i => i.readyState === WebSocket.OPEN && i !== ws)
                    .forEach(i => i.send(metin, { binary: false }))
            }
        }

    });
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});