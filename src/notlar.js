const express = require('express');
const vt = require('./vt');

const router = express.Router()

router.get('/:notID', (request, response) => {
    vt.kontrol(request.params.notID)
        .then(kontrol => {
            if (kontrol) {
                vt.getir(request.params.notID)
                    .then(metin => {
                        response.send(metin);
                    })
                    .catch(hata => {
                        response.status(400).send('hata oluştu:' + hata.message);
                    })
            } else {
                response.status(400).send('kayıt bulunamadı');
            }
        })
        .catch(hata => {
            response.status(400).send('hata oluştu:' + hata.message);
        })
})

router.post('', (request, response) => {
    if (request.body.metin) {
        vt.ekle(request.body.metin)
            .then(urlID => {
                response.send(urlID);
            })
            .catch(hata => {
                response.status(400).send('hata oluştu:' + hata.message);
            })
    } else { 
        response.end();
    }
})

module.exports = router;