CREATE DATABASE IF NOT EXISTS GymDB;

USE GymDB;

CREATE TABLE GymDB.Class(
class_name VARCHAR(50) PRIMARY KEY,
duration INT,
capacity INT,
instructor_name VARCHAR(50),
enrollment_count INT
);


CREATE TABLE GymDB.member(
member_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(50),
dob DATE,
age INT,
street VARCHAR(100),
city VARCHAR (100),
state VARCHAR (100),
zipcode INT,
phone VARCHAR(10),
monthly_fee DECIMAL (10,2),
start_date DATE,
class_name VARCHAR(50),
FOREIGN KEY (class_name) REFERENCES GymDB.Class(class_name)
);

CREATE TABLE GymDB.Gym(
name VARCHAR(50) PRIMARY KEY,
street VARCHAR(50),
city VARCHAR(50),
STATE VARCHAR(50),
zipcode INT
);



CREATE TABLE Employee(
Emp_id INT PRIMARY KEY AUTO_INCREMENT,
Name VARCHAR(50)
);


INSERT INTO Class (class_name, duration, capacity, instructor_name, enrollment_count) VALUES
('Yoga', 60, 25, 'Alice Johnson', 20),
('Pilates', 45, 20, 'Bob Smith', 18),
('Zumba', 50, 30, 'Carol White', 25),
('CrossFit', 70, 15, 'Dave Brown', 10),
('Kickboxing', 60, 20, 'Eve Black', 15),
('Meditation', 30, 15, 'Frank Gray', 10),
('no_class', 0, 1000, 'None', 0);


INSERT INTO Gym (name, street, city, STATE, zipcode) VALUES
('Downtown Fitness', '123 Main St', 'Metropolis', 'NY', 10001);

INSERT INTO Employee (Name) VALUES
('John Doe'),
('Jane Smith'),
('Alice Johnson'),
('Bob Brown'),
('Eve White');

INSERT INTO Member (name, dob, age, street, city, state, zipcode, phone, monthly_fee, start_date, class_name) VALUES
('Alex Murphy', '1995-07-21', 28, '321 River Rd', 'Metropolis', 'NY', 10002, '5551234567', 30.00, '2024-04-28', 'Yoga'),
('Sarah Connor', '1980-09-19', 43, '587 Elm St', 'Metropolis', 'NY', 10003, '5552345678', 35.00, '2024-04-28', 'Pilates'),
('Rick Grimes', '1970-03-15', 53, '999 Maple Ave', 'Metropolis', 'NY', 10004, '5553456789', 40.00, '2024-04-28', 'no_class');

ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
