const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
// Use this to communicate with database
const supabaseClient = require('@supabase/supabase-js');
// Use this to parse JSON body request
const body_parser = require('body-parser')
// Setting this to an output from the package
const { isValidStateAbbreviation } = require('usa-state-validator');

const app = express();
const port = 3000;

// Middleware
app.use(body_parser.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

// Keys
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);


app.get('/customer', async(req, res) => {
    console.log('Attempting to GET all customers!');
// Case sensititve; database table is "Customer"
    const { data, error } = await supabase.from('Customer').select();

    if (error) {
        console.log(`Error: ${error}`);
        res.statusCode = 400;
        res.send(error);
    }
    res.send(data);
});

// If posting request, take names and validate state
app.post('/customer', async(req, res) => {
    console.log('Adding Customer');
    console.log(req.body);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const state = req.body.state;

    if(!isValidStateAbbreviation(state)){
        console.error(`State: ${state}, is Invalid`);
        res.statusCode = 400;
        res.header('Content-type', 'application/json');
        var errorJson = {
            'message': `${state} is not a valid state.`
        };
        res.send(JSON.stringify(errorJson));
        return;
    }

    const {data, error} = await supabase
    .from('Customer')
    .insert({ customer_first_name: firstName, 
        customer_last_name: lastName, 
        customer_state: state
    })
    .select();

    if (error) {
        console.log(`Error: ${error}`),
        res.statusCode = 400;
        res.send(error);
    }

    res.send();
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

