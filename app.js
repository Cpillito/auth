//Required packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');




//Import to database
const dbconect = require('./config/database');

//inicializacion de los modulos que conformaran el APP
const app = express();
//Se definfen las rutas
const apiRouter = require('./routes/api_router');
const index_router = require('./routes/user');
//port to listen
const port = 5001;

//Use Middleware into the app//

//CORS Middleware
app.use(cors());

//Body Parser Middleware
app.use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))

//Passport Middleware
// app.use(passport.initialize());
// app.use(passport.session());
// require('./config/passport')(passport);

//Set static Folder
app.use(express.static(path.join(__dirname,'uploads')));

//load middleware
const verifyAuth = require('./middleware/auth')

//rutas importadas
app.use('/api',verifyAuth,apiRouter);
app.use('/',index_router);


//Index Route


//server up
app.listen(port,() => {
    console.log(`\x1b[34m Micro servicio corriendo por el puerto:\x1b[37m===>\x1b[33m [${port}]`);
});

