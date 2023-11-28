const express = require('express');
const cors = require("cors");
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});
app.get("/about", (req, res) => {
	res.sendFile(__dirname + "/public/about.html");
});
app.get("/contact", (req, res) => {
	res.sendFile(__dirname + "/public/contact.html");
});
app.get("/policies", (req, res) => {
	res.sendFile(__dirname + "/public/policies.html");
});
app.get("/projects", (req, res) => {
	res.sendFile(__dirname + "/public/projects.html");
});
app.get("/construction", (req, res) => {
	res.sendFile(__dirname + "./public/projects/construction.html");
});
app.get("/engineering", (req, res) => {
	res.sendFile(__dirname + "/public/projects/engineering.html");
});
app.get("/procurement", (req, res) => {
	res.sendFile(__dirname + "/public/projects/procurement.html");
});
app.get("/projectmgt", (req, res) => {
	res.sendFile(__dirname + "/public/projects/projectmgt.html");
});
app.listen(port, () => {
	  console.log(`Example app listening on port ${port}`)
});
