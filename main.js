
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'george',
  password: 'pig',
  database: 'gps'
});

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

function insertData() {
  connection.connect();
  connection.query('CALL SP_INSERT_DATA (?,?,?,?,?,?,?,?);', [data.placa, data.latitud, data.longitud, data.rumbo, data.velocidad, data.evento, data.fecha, data.fechaemv], function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });
  connection.end();
}







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