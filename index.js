const supabaseClient = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const express = require('express');
const { isValidStateAbbreviation } = require('usa-state-validator');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
  res.sendFile('/public/Customers.html', { root: __dirname });
});

app.get('/customer', async (req, res) => {
  console.log('Attempting to GET all customers');
    // Case sensitive
  const { data, error } = await supabase.from('Customer').select();

  if (error) {
    console.log('Error');
    res.send(error);
  } else {
    res.send(data);
  }
});

app.post('/customer', async (req, res) => {
  console.log('Adding Customer');

  console.log(req.body);
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var state = req.body.state;

  if (!isValidStateAbbreviation(state)) {
    console.log(`State ${state} is Invalid`);
    res.statusCode = 400;
    res.header('Content-Type', 'application/json');
    var errorJson = {
      message: `${state} is not a Valid State`,
    };
    res.send(JSON.stringify(errorJson));
    return;
  }

  const { data, error } = await supabase
    .from('customer')
    .insert({
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_state: state,
    })
    .select();

  if (error) {
    console.log('Error');
    res.send(error);
  } else {
    res.send(data);
  }
});

app.listen(port, () => {
  console.log('APP IS ALIVEEE');
});