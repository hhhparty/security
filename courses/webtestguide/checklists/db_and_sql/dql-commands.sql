
-- creating basic stuff to work on them
create database cheatsheet;
use cheatsheet;

create table employee
(
    employee_id int primary key,              -- Setting primary key(1st method)
    first_name varchar(50),
    last_name varchar(50),
    dept_number int,
    age int,
    salary real
);

insert into employee (employee_id, first_name, last_name, dept_number, age, salary) values (1, "Anurag", "Peddi", 1, 20, 93425.63);
insert into employee values (2, "Anuhya", "Peddi", 2, 40, 83425.63);
insert into employee values (3, "Vageesh", "Padigela", 3, 50, 83625.63);
insert into employee values (4, "Rishi", "Kumar", 5, 25, 83765.23);
insert into employee values (5, "Ashish", "Gupta", 4, 36, 103425.63);
insert into employee values (6, "Akash", "Pippera", 6, 71, 113425.63);

-- display table
select * from employee;

-- select only specified columns
select employee_id, first_name from employee;

-- select only few rows
select employee_id, first_name from employee where age > 25;