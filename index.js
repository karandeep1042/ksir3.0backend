const express = require('express');
const app = express();
const router = require('./Routes/MainRoutes');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const os = require('os');

require('dotenv').config();

app.use(expressLayouts);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        // maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(cors({
    // origin: 'http://localhost:3000',
    // origin: `http://192.168.1.5:3000`,
    origin: `http://192.168.1.2:3000`,
    methods: ["POST", "GET"],
    credentials: true
}));

app.use('/', router);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(4000, () => {
    console.log("Listening to port 4000");
});

function getWifiIPv4Address() {
    const networkInterfaces = os.networkInterfaces();

    for (const interfaceName in networkInterfaces) {
        const interfaceDetails = networkInterfaces[interfaceName];

        for (const detail of interfaceDetails) {
            if (
                detail.family === 'IPv4' && // Check for IPv4
                !detail.internal && // Exclude internal addresses (like 127.0.0.1)
                detail.address // Ensure address is valid
            ) {
                console.log(`IPv4 address: ${detail.address}`);
                // return detail.address;
            }
        }
    }
    return 'localhost';
}

getWifiIPv4Address();