let express = require('express');
let app = express();

app.use(express.static('./dist'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.get('origin'));
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  return next();
});

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let solc = require('solc');

app.post('/solc', (req, res) => {
  let code = req.body.code;
  let output = solc.compile(code, 1);
  return res.status(200).send(output);
});

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("APPMAN APPMAN APPMAN", PORT);
});
