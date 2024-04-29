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

app.post('/class/enroll', (req, res) => {
    const { member_id, class_name, current_class } = req.body;
    if (current_class === class_name) {
        return res.status(400).json({ message: "New class is the same as current class" });
    }
    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction: ', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        const searchClass = "SELECT * FROM Class WHERE class_name = ?";
        db.query(searchClass, [class_name], (err, classResults) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error querying class: ', err);
                    res.status(500).json({ error: 'Internal server error' });
                });
            }
            if (classResults.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: 'No class found with that name' });
                });
            }
            const classInfo = classResults[0];
            if (classInfo.enrollment_count >= classInfo.capacity) {
                return db.rollback(() => {
                    res.status(400).json({ message: 'Class is at full capacity' });
                });
            }
            const changeClass = "UPDATE member SET class_name = ? WHERE member_id = ?";
            db.query(changeClass, [class_name, member_id], (err, updateResult) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error updating member: ', err);
                        res.status(500).json({ error: 'Internal server error' });
                    });
                }
                const updateNewClassEnrollment = "UPDATE Class SET enrollment_count = enrollment_count + 1 WHERE class_name = ?";
                db.query(updateNewClassEnrollment, [class_name], (err, newEnrollmentUpdateResult) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error updating new class enrollment: ', err);
                            res.status(500).json({ error: 'Internal server error' });
                        });
                    }
                    if (current_class) {
                        const decrementOldClassEnrollment = "UPDATE Class SET enrollment_count = enrollment_count - 1 WHERE class_name = ?";
                        db.query(decrementOldClassEnrollment, [current_class], (err, oldEnrollmentUpdateResult) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Error decrementing old class enrollment: ', err);
                                    res.status(500).json({ error: 'Internal server error' });
                                });
                            }
                            db.commit(err => {
                                if (err) {
                                    return db.rollback(() => {
                                        console.error('Error committing transaction: ', err);
                                        res.status(500).json({ error: 'Internal server error' });
                                    });
                                }
                                res.status(200).json({ message: 'Member enrolled in class successfully' });
                            });
                        });
                    } else {
                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Error committing transaction: ', err);
                                    res.status(500).json({ error: 'Internal server error' });
                                });
                            }
                            res.status(200).json({ message: 'Member enrolled in class successfully' });
                        });
                    }
                });
            });
        });
    });
});
app.post('/class/quit', (req, res) => {
    const { member_id, current_class } = req.body; // class_name is not needed

    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction: ', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const changeClass = "UPDATE member SET class_name = 'no_class' WHERE member_id = ?";
        db.query(changeClass, [member_id], (err, updateResult) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error quitting class: ', err);
                    res.status(500).json({ error: 'Internal server error' });
                });
            }

            if (current_class && current_class !== 'no_class') {
                const decrementOldClassEnrollment = "UPDATE Class SET enrollment_count = enrollment_count - 1 WHERE class_name = ?";
                db.query(decrementOldClassEnrollment, [current_class], (err, oldEnrollmentUpdateResult) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error decrementing old class enrollment: ', err);
                            res.status(500).json({ error: 'Internal server error' });
                        });
                    }
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Error committing transaction: ', err);
                                res.status(500).json({ error: 'Internal server error' });
                            });
                        }
                        res.status(200).json({ message: 'Member quit class successfully' });
                    });
                });
            } else {

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error committing transaction: ', err);
                            res.status(500).json({ error: 'Internal server error' });
                        });
                    }
                    res.status(200).json({ message: 'Member quit class successfully' });
                });
            }
        });
    });
});


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

