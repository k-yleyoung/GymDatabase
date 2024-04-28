const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
//create connection with mysql database

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password", // put password here
    database: "GymDB"
})

// Handle a connection error
db.connect(err => {
    if(err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('MySQL Database connected...');
});

//write api to get data from database

app.get('/member/get', (req, res)=>{
    const sql = "SELECT * FROM member";
    db.query(sql, (err, data)=>{
        if (err) return res.json(err);
        return res.json(data);
    })
})


app.get('/employee/get', (req, res)=>{
    const sql = "SELECT * FROM Employee";
    db.query(sql, (err, data)=>{
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.delete('/employee/delete/:name', (req,res)=>{
    const name = req.params.name;
    const fireEmp = "DELETE FROM Employee WHERE name = ?";
    db.query(fireEmp, [name], (err, result)=>{
        if (err){
            console.error('Error Firing Employee');
            return res.status(500).json({error: 'Internal server error'});
        }
        if (result.affectedRows === 0){
            return res.status(404).json({message: 'No member found with that ID'});
        }
        res.status(200).json({message: 'Member deleted successfully'});
    })
})

app.delete('/member/delete/:member_id', (req, res) => {
    const member_id = req.params.member_id;
    const deleteRow = "DELETE FROM member WHERE member_id = ?";
    db.query(deleteRow, [member_id], (err, result) => {
        if (err) {
            console.error('Error deleting member: ', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No member found with that ID' });
        }
        res.status(200).json({ message: 'Member deleted successfully' });
    });
});

app.post('/member/add', (req, res) => {
    const { name, dob, street, city, state, zipcode, phone, start_date, class_name, monthly_fee} = req.body;
    const addRow = `
        INSERT INTO member (name, dob, street, city, state, zipcode, phone, monthly_fee, start_date, class_name, age)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TIMESTAMPDIFF(YEAR, ?, CURDATE()));
    `;
    db.query(addRow, [name, dob, street, city, state, zipcode, phone, monthly_fee, start_date, class_name, dob], (err, result) => {
        if (err) {
            console.error('Error adding member: ', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ message: 'Member added successfully', memberId: result.insertId });
    });
});

app.get('/', (req, res)=> {
    return res.json("From Backend Side")
})

app.listen(8081, ()=>{
    console.log("listening");
})

