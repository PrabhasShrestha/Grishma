const express = require('express'); 
const cors = require('cors');
const { sequelize, connectDB } = require('./db/database');
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

const PORT = process.env.PORT; 

app.use("/uploads", express.static("uploads"));



app.get("/", (req, res) => {
    res.send("backend is running");
});
app.use("/api/test", require("./route/testRoute"));
app.use("/api", require("./route/taskroute"));



const startServer = async () => {
    await connectDB();
    await sequelize.sync();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();


