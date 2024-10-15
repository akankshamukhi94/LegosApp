// server.js

/********************************************************************************
* WEB322 – Assignment 03
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: _____________Akanksha_________ Student ID: _____155514227_________ Date: ___30-09-24___________
*
* Published URL: https://legos-app.vercel.app/
*
********************************************************************************/
const express = require("express");
const legoData = require("./modules/legoSets");
const path = require("path");

const app = express();
const PORT = 3000;
//
// Define the static folder
app.use(express.static(path.join(__dirname, "public")));
app.set('views', __dirname + '/views');


// Initialize the sets array
legoData.initialize()
    .then(() => {
        // Define routes
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "home.html"));
        });

        app.get("/about", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "about.html"));
        });

        app.get("/lego/sets", (req, res) => {
            const theme = req.query.theme;
            if (theme) {
                legoData.getSetsByTheme(theme)
                    .then(sets => res.json(sets))
                    .catch(err => res.status(404).send(err));
            } else {
                legoData.getAllSets()
                    .then(sets => res.json(sets))
                    .catch(err => res.status(404).send(err));
            }
        });

        app.get("/lego/sets/:set_num", (req, res) => {
            const setNum = req.params.set_num;
            legoData.getSetByNum(setNum)
                .then(set => res.json(set))
                .catch(err => res.status(404).send(err));
        });

        // Custom 404 page
        app.use((req, res) => {
            res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize Lego data:", err);
    });