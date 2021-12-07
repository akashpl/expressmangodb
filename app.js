const express = require('express');
const mongoose = require('mongoose');
const port = 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
// regex
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[A-Za-z]/);
const regForphone = RegExp(/^[0-9]{10}/);
const regForage=RegExp(/^[0-9]{2}/);
// db connection
const db = "mongodb://localhost:27017/mongocrud";
const connect_db = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true });
        console.log("MongoDB Connected.");
    } catch (err) { console.log(err.message); }
}
connect_db();
// schema 
const UserData = require('./db/catagary');
// routes
// basic index page
app.get('/', (req, res) => { res.render('first'); });
// display users in table format.
app.get('/show', (req, res) => {
    UserData.find({}, (err, data) => {
        if (err) throw err;
        else { res.render('show', { users: data }); }
    });
});
// display add user form
app.get('/add', (req, res) => { res.render('add', { errors: {}, notification: "" }); });
// add user data to db
app.post("/add", (req, res) => {
    let uname = req.body.uname;
    let email = req.body.email;
    let phone = req.body.phone;
    let age   =req.body.age;
    let errors = { uname: "", email: "", phone: "", age:""}
    // regex validation
    if (!regForName.test(uname)) { errors.uname = "Enter Valid Name"; }
    if (!regForEmail.test(email)) { errors.email = "Enter Valid Email"; }
    if (!regForphone.test(phone)) { errors.phone = "Enter Valid no"; }
    if (!regForage.test(age)) { errors.age = "Enter Valid age"; }
    // if no errors send data else send errors.
    if (errors.uname === "" && errors.email === "" && errors.phone === ""&& errors.age==="") {
        let insertdata = new UserData({ uname: uname, email: email, phone: phone,age: age });
        insertdata.save((err) => {
            if (err) { res.render('add', { errors: errors, notification: "User Already Exist. Please Enter New User" }); }
            else { res.redirect('/show'); }
        });
    } else { res.render('add', { errors: errors, notification: "Please Enter Valid Data." }); }
});
// delete user
app.get("/deletedata/:id", (req, res) => {
    let id = req.params.id;
    UserData.deleteOne({ _id: id }, (err) => {
        if (err) throw err;
        else { res.redirect('/show'); }
    })
});
// render update form
app.get('/updateuser/:id', (req, res) => {
    let id = req.params.id;
    UserData.findOne({ _id: id }, (err, data) => {
        if (err) throw err;
        else { res.render('updateuser', { user: data, errors: {}, notification: "" }); }
    });
});
// update the user data
app.post("/update/:id", (req, res) => {
    let id = req.params.id;
    let uname = req.body.uname;
    let email = req.body.email;
    let phone = req.body.phone;
    let age   =req.body.age;
    let errors = { uname: "", email: "", phone: "", age:""}
    // regex validation
    if (!regForName.test(uname)) { errors.uname = "Enter Valid Name"; }
    if (!regForEmail.test(email)) { errors.email = "Enter Valid Email"; }
    if (!regForphone.test(phone)) { errors.phone = "Enter Valid no"; }
    if (!regForage.test(age)) { errors.age = "Enter Valid age"; }
    // if no errors send data else send errors.
    if (errors.uname === "" && errors.email === "" && errors.phone === "" && errors.age === "") {
        UserData.updateOne({ _id: id }, { $set: { uname: uname, email: email, phone: phone ,age:age} }, (err) => {
            if (err) throw err;
            else { res.redirect('/show'); }
        });
    } else {
        UserData.findOne({ _id: id }, (err, data) => {
            if (err) throw err;
            else { res.render('update', { user: data, errors: errors, notification: "Please Enter Valid Data." }); }
        });
    }
});
// host server
app.listen(port, (err) => {
    if (err) throw err;
    console.log(`App listening at http://localhost:${port}`)
});
