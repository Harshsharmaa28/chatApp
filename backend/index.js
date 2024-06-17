import express from "express"



const app = express();

app.use('/', (req, res) => {
    res.send('<h1>Hello, Server is Running</h1>');
});

app.listen(4000, () => {
    console.log("server is Running succesfully")
})