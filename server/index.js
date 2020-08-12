const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require("bad-words");
const rateLimit = require('express-rate-limit');
// const MongoClient = require('mongodb').MongoClient;

const app = express();
const db = monk(process.env.MONGO_URI || 'localhost/meower');
const mews = db.get('mews');
const filter = new Filter();
// const uri = "mongodb+srv://Moewer:admin@cluster0.iexza.mongodb.net/moewer-db?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {useNewUrlParser: true});

app.use(cors());
app.use(express.json());

function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== '' &&
        mew.content && mew.content.toString().trim() !== ''
}

app.get('/', (request, response) => {

});

app.get('/mews', (request, response) => {
    // client.connect(err => {
    //     const collection = client.db("moewer-db").collection("mews");
    //
    //     // perform actions on the collection object
    //
    //
    //     client.close();
    // });

    mews
        .find()
        .then(mews => {
            response.json(mews);
        });
});

app.use(rateLimit({
    windowMs: 30 * 1000,
    max: 1
}));


app.post('/mews', (request, response) => {
    if (isValidMew(request.body)) {
        const mew = {
            name: filter.clean(request.body.name.toString()),
            content: filter.clean(request.body.content.toString()),
            created_date: new Date()
        };


        // client.connect(err => {
        //     const collection = client.db("moewer-db").collection("mews");
        //
        //     // perform actions on the collection object
        //
        //
        //     client.close();
        // });

        mews
            .insert(mew)
            .then(createdMew => {
                response.json(createdMew);
            });

        console.log(mew);
    } else {
        response.status(422);
        response.json({
            message: "Name and Content aren't valid!"
        })
    }
});

app.listen(5000, () => {
    console.log('listening on port 5000');
});
