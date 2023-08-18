const express = require('express');
const cors = require('cors');
const app = express();

const pg = require("pg");
const { Client } = pg;

const port = 3000;

let client = undefined;

app.use(cors());
app.use(express.json());


const createTable = async (client) => { 
    await client.query(`CREATE TABLE IF NOT EXISTS events
        (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        eventTitle VARCHAR(1000) NOT NULL,
        eventDate DATE NOT NULL,
        eventTime TIME,
        eventLocation VARCHAR(1000),
        eventLink VARCHAR(1000),
        eventHours BIGINT,
        eventDescription VARCHAR(2000),
        contactEmail VARCHAR(255)
        );`
    )
  };

app.listen(port, () => {
    console.log("Server started on" + " " + port);
    

    client = new Client({
        connectionString: 'postgres://uniquered:j66oRKRLmut8QTqFynrzNspP0ybZcPKa@dpg-cjfkgnvut75s7390k060-a.ohio-postgres.render.com/eventsdatabase',
        ssl: {
            rejectUnauthorized: false
        }
      });
      
      client.connect((err) => {
        if (err) {
            console.error(err);
            throw err;
        }
        console.log("Connected!");

        createTable(client);
      });
});


app.get("/health", (req, res) => {
    try {
        res.json("Healthy!!!");
    } catch (error) {
        console.error(error.message);
    }
});

//ADMIN ROUTES//

//CREATE EVENT
app.post("/", async(req, res) => {
    try {
        const {title, date, time, location, link, hours, description, email} = req.body;
        const newEvent = await client.query("INSERT INTO events(eventtitle, eventdate, eventtime, eventlocation, eventlink, eventhours, eventdescription, contactemail) VALUES($1, $2, $3, $4, $5, $6, $7, $8)", [title, date, time, location, link, hours, description, email]);

        res.json(newEvent.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

//GET ALL EVENTS
app.get("/", async(req, res) => {
    try {
        const allEvents = await client.query("SELECT * FROM events ORDER BY eventdate");

        res.json(allEvents.rows);
    } catch (error) {
        console.error(error.message);
    }
});

//GET ONE EVENT
app.get("/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const event = await client.query("SELECT * FROM events WHERE id = $1", [id]);

        res.json(event.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

//EDIT EVENT
app.put("/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {title, date, time, location, link, hours, description, email} = req.body;
        const editEvent = await client.query("UPDATE events SET eventtitle = $1, eventdate = $2, eventtime = $3, eventlocation = $4, eventlink = $5, eventhours = $6, eventdescription = $7, contactemail = $8 WHERE id = $9", [title, date, time, location, link, hours, description, email, id]);
        
        res.json("Updated!");
    } catch (error) {
        console.error(error.message);
    }
});

//DELETE EVENT
app.delete("/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const deleteEvent = await client.query("DELETE FROM events WHERE id = $1", [id]);

        res.json("Deleted!");
    } catch (error) {
        console.error(error.message);
    }
});