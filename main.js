var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'george',
  password : 'pig',
  database : 'gps'
});

connection.connect();

connection.query('SELECT * FROM data', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

connection.end();

/**
 connection.query("CALL SP_INSERT_DATA ('ABC-584','-12.98767','-76.464646','360','67','RU', '2019-10-08 12:00:00', '2019-10-08 12:01:00');", function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
}); 
  
 
*/