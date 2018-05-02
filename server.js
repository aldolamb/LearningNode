var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var pg = require('pg')

// var pgConfig = 'postgres://postgres:oceansid@localhost:5432/ftc';
// var client = new pg.Client(pgConfig);
// client.connect();

var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

var dbUrl = 'mongodb://aldolamb:Looploop15@ds261429.mlab.com:61429/learning-node'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})


const client = new pg.Client(process.env.DATABASE_URL)
client.connect();

app.get('/messages', async (req, res) => {
    // Message.find({}, (err, messages) => {
    //     res.send(messages)
    // })

    // client.query('SELECT * FROM strain', (err, res) => {
    //     if (err) {
    //         console.log('there was an error')
    //     } else {
    //         console.log(res.rows[0])
    //     }
    // })

    // client.query('SELECT * FROM strain').then(results => {
    //
    //     console.log(res.rows[0])
    //     res.send(results);
    //
    // }).catch(err => {
    //     conole.log(err);
    // })

    try {
        let x = await client.query('SELECT * FROM strain');
        // console.log(x.rows);
        res.json(x.rows)
    } catch(e) {

    }
})

app.post('/messages', async (req, res) => {
    console.log('before')

    client.query('SELECT * from strain')
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack))

    // client.query('select * from strain', (err, res) => {
    //     console.log(err, res)
    // })
    // console.log('after')

    // var message = new Message(req.body)
    //
    // var savedMessage = await message.save()
    //
    // console.log('saved')
    //
    // var censored = Message.findOne({ message: 'badword' })
    //
    // if (censored)
    //     await Message.remove({ _id: censored.id })
    // else
    //     io.emit('message', req.body)
    //
    // res.sendStatus(200)

    // .catch((err) => {
    //     res.sendStatus(500)
    //     return console.error(err)
    // })
})

app.post('/reset', (req, res) => {
    mongoose.Collection("messages").remove({}, function (err, numberRemoved) {
        console.log("inside remove call back" + numberRemoved);
    });
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, (err) => {
    console.log('mongo db connection', err)
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})
