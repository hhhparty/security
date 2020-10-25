
-- Creating database
create database cheatsheet;

-- Viewing the databases
show databases;

-- using the database
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

create table department
(
    dept_number int,
    dept_name varchar(50),
    dept_location varchar(50),
    emp_id int,
    primary key(dept_number)                -- Setting primary key(2nd method)
);

-- veiwing tables in the selected database
show tables;

-- print the structure of the table
describe employee;
desc employee;
show columns in employee;

-- renaming of table
rename table employee to employee_table;
alter table employee_table rename to employee;

-- reanaming a column
alter table employee change column employee_id emp_id int;

-- add a constraint to column
alter table employee change column first_name first_name varchar(50) not null;

-- add column
alter table employee add column salary real;

-- drop a column
alter table employee drop column salary;

-- modify the datatype
alter table employee modify column salary int;

-- truncate a table
truncate employee;

-- drop table
drop table department;

-- drop database
drop database cheatsheet;