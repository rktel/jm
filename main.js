
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'george',
  password: 'pig',
  database: 'gps'
});
/*
const data = {
  placa: "KIS-925",
  latitud: "-19.9999",
  longitud: "-66.5555",
  rumbo: "91",
  velocidad: "80",
  evento: "AT",
  fecha: "2019-12-07 12:45:00",
  fechaemv: "2019-09-08 12:00:22"
}
*/
connection.connect();
function insertData(data) {
 
  connection.query('CALL SP_INSERT_DATA (?,?,?,?,?,?,?,?);', [data.placa, data.latitud, data.longitud, data.rumbo, data.velocidad, data.evento, data.fecha, getTimestamp()], function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });
 // connection.end();
}



const md5 = require('md5')
const request = require('request');

const URL = 'http://open.10000track.com/route/rest'
const METHOD_GET_TOKEN = 'jimi.oauth.token.get'
const APP_KEY = '8FB345B8693CCD0098C4E2C0422119CA'
const SIGN_METHOD = 'md5'
const API_VERSION = '1.0'
const FORMAT = 'json'
const USER_ID = 'jitrucha'
const USER_PWD_MD5 = '763ed3d8af027cffc8dff0608484eb79'
const EXPIRES_IN = '60'

const APP_SECRET = 'f39e7bc852324d9a80332fc7988279f3'

let accessToken = false
let refreshToken = false

const METHOD_GET_CHILD_LIST = 'jimi.user.child.list'
const METHOD_GET_DEVICE_LOCATION = 'jimi.user.device.location.list'
const METHOD_GET_DEVICE_LIST = 'jimi.user.device.list'
const METHOD_GET_LOCATION_DEVICES = 'jimi.device.location.get'

let subaccountList = []
let mtcVehicleList = []


let counterTrack = 0
let counterItems = 0
// INTERFACE - METHODS
const getLocationDevices = (vehicle) => {
    const { imei, vehicleNumber } = vehicle
   // console.log(imei, vehicleNumber)
    const access_token = accessToken
    const time = getTimestamp()
    const getSign = () => {
        let sign = [APP_SECRET, 'access_token' + access_token, 'app_key' + APP_KEY, 'format' + FORMAT, 'imeis' + imei, 'method' + METHOD_GET_LOCATION_DEVICES, 'sign_method' + SIGN_METHOD, 'timestamp' + time, 'v' + API_VERSION, APP_SECRET]
        sign = sign.join('')
        sign = md5(sign)
        sign = sign.toUpperCase()
        return sign
    }
    const locationDevicesOptions = {
        method: METHOD_GET_LOCATION_DEVICES,
        app_key: APP_KEY,
        timestamp: time,
        format: FORMAT,
        v: API_VERSION,
        sign_method: SIGN_METHOD,
        sign: getSign(),
        access_token: access_token,
        imeis: imei
    }
    request.post({ url: URL, form: locationDevicesOptions }, function (err, httpResponse, body) {
        if (body) {
            body = JSON.parse(body)
            if (body.code == 0) {
                //body.result[0].vehicleNumber = vehicleNumber
                //console.log(body.result[0])
                const data = {
                    placa: vehicleNumber,
                    latitud: body.result[0].lat,
                    longitud : body.result[0].lng,
                    rumbo: body.result[0].direction,
                    velocidad: body.result[0].speed,
                    evento: body.result[0].accStatus == '1' ? 'ER':'PA',
                    fecha: body.result[0].gpsTime
                }
                console.log(data)
                insertData(data)
            }

        }
    })
}

const getDeviceList = (target) => {
    const access_token = accessToken
    const time = getTimestamp()
    const getSign = () => {
        let sign = [APP_SECRET, 'access_token' + access_token, 'app_key' + APP_KEY, 'format' + FORMAT, 'method' + METHOD_GET_DEVICE_LIST, 'sign_method' + SIGN_METHOD, 'target' + target, 'timestamp' + time, 'v' + API_VERSION, APP_SECRET]
        sign = sign.join('')
        sign = md5(sign)
        sign = sign.toUpperCase()
        return sign
    }
    const deviceListOptions = {
        method: METHOD_GET_DEVICE_LIST,
        app_key: APP_KEY,
        timestamp: time,
        format: FORMAT,
        v: API_VERSION,
        sign_method: SIGN_METHOD,
        sign: getSign(),
        access_token: access_token,
        target: target
    }
    request.post({ url: URL, form: deviceListOptions }, function (err, httpResponse, body) {
        if (body) {

            body = JSON.parse(body)
            console.log(body)
            if (body.code == 0) {
                
                console.log('here')
                body.result.map(element => {
                    /** Verificar con algun campo para agregar vehiculo a la lista que retransmitira al MTC */
                    mtcVehicleList.push(element)
                })
                console.log('mtcVehicleList:',mtcVehicleList);
                
            }

        }
    })
}

const getDeviceLocation = () => {
    const access_token = accessToken
    const time = getTimestamp()
    const target = USER_ID
    const getSign = () => {
        let sign = [APP_SECRET, 'access_token' + access_token, 'app_key' + APP_KEY, 'format' + FORMAT, 'method' + METHOD_GET_DEVICE_LOCATION, 'sign_method' + SIGN_METHOD, 'target' + target, 'timestamp' + time, 'v' + API_VERSION, APP_SECRET]
        sign = sign.join('')
        sign = md5(sign)
        sign = sign.toUpperCase()
        return sign
    }
    const deviceLocationOptions = {
        method: METHOD_GET_DEVICE_LOCATION,
        app_key: APP_KEY,
        timestamp: time,
        format: FORMAT,
        v: API_VERSION,
        sign_method: SIGN_METHOD,
        sign: getSign(),
        access_token: access_token,
        target: target
    }
    request.post({ url: URL, form: deviceLocationOptions }, function (err, httpResponse, body) {
        body = JSON.parse(body)
        if (!err) {

            console.log(body); //[{account:'GEORGE'}]
        }
    })
}

const getChildList = () => {
    const access_token = accessToken
    const time = getTimestamp()
    const target = USER_ID
    const getSign = () => {
        let sign = [APP_SECRET, 'access_token' + access_token, 'app_key' + APP_KEY, 'format' + FORMAT, 'method' + METHOD_GET_CHILD_LIST, 'sign_method' + SIGN_METHOD, 'target' + target, 'timestamp' + time, 'v' + API_VERSION, APP_SECRET]
        sign = sign.join('')
        sign = md5(sign)
        sign = sign.toUpperCase()
        return sign
    }
    const childListOptions = {
        method: METHOD_GET_CHILD_LIST,
        app_key: APP_KEY,
        timestamp: time,
        format: FORMAT,
        v: API_VERSION,
        sign_method: SIGN_METHOD,
        sign: getSign(),
        access_token: access_token,
        target: target
    }

    request.post({ url: URL, form: childListOptions }, function (err, httpResponse, body) {
        if (body) {
            body = JSON.parse(body)
            if (body.code == 0 && body.result.length > 0) {
                // const subaccountList = body.result
                // console.log(subaccountList); //[{account:'GEORGE'}]
                subaccountList = []
                mtcVehicleList = []
                body.result.map(element => {
                    subaccountList.push(element.account)
                })
                console.log('subaccountList:',subaccountList)
            }
        }
    })
}
const getAccessToken = () => {
    const timestamp = getTimestamp()
    const signature = getSignature(timestamp)
    const accessTokenOptions = {
        method: METHOD_GET_TOKEN,
        app_key: APP_KEY,
        timestamp: timestamp,
        format: FORMAT,
        v: API_VERSION,
        sign_method: SIGN_METHOD,
        sign: signature,
        expires_in: EXPIRES_IN,
        user_id: USER_ID,
        user_pwd_md5: USER_PWD_MD5
    }
    request.post({ url: URL, form: accessTokenOptions }, function (err, httpResponse, body) {
        if (body) {
             body = JSON.parse(body)
             if (body.code == 0) {
                accessToken = body.result.accessToken
                refreshToken = body.result.refreshToken
                console.log(new Date().toISOString(),'accessToken:',accessToken)
            } else {
                accessToken = false
                refreshToken = false
            }
        }
    })
}

// HELP FUNCTION
const getTimestamp = () => {
    let date = new Date().toISOString()
    date = date.split('T')
    return date[0] + ' ' + date[1].split('.')[0]
}

const getSignature = (time) => {
    let sign = [APP_SECRET, 'app_key' + APP_KEY, 'expires_in' + EXPIRES_IN, 'format' + FORMAT, 'method' + METHOD_GET_TOKEN, 'sign_method' + SIGN_METHOD, 'timestamp' + time, 'user_id' + USER_ID, 'user_pwd_md5' + USER_PWD_MD5, 'v' + API_VERSION, APP_SECRET]
    sign = sign.join('')
    sign = md5(sign)
    sign = sign.toUpperCase()
    return sign
}

//------------- INIT 

setImmediate(_ => {
    //  getAccessToken()
})

let mainTimer = setInterval(_ => {
    counterTrack++
    counterItems++
    if (counterTrack == 1) {
        getAccessToken()
    }
    if (counterItems == 5) {
        if (accessToken) {
            getChildList()
        }
    }
    if (counterItems == 10) {
        if (accessToken) {
            subaccountList.map(account => {
                getDeviceList(account)
            })
        }
    }
    if (counterTrack == 15) {
        if (accessToken) {
            mtcVehicleList.map(vehicle => {
                getLocationDevices(vehicle)
            })
        }
    }
    if (counterTrack == 61) {
        counterTrack = 0
    }
    if (counterItems == 7201) {
        counterItems = 0
    }
}, 1000)



/**
 connection.query("CALL SP_INSERT_DATA ('ABC-584','-12.98767','-76.464646','360','67','RU', '2019-10-08 12:00:00', '2019-10-08 12:01:00');", function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

connection.query('SELECT * FROM data', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

connection.query('CALL SP_INSERT_DATA (`${data.placa}`,${data.latitud},${data.longitud},${data.rumbo},${data.velocidad},${data.evento},${data.fecha},${data.fechaemv});', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });


*/