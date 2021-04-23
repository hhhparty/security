
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

-- complete insert (1st method)
insert into employee (employee_id, first_name, last_name, dept_number, age, salary) values (1, "Anurag", "Peddi", 1, 20, 93425.63);

-- complete insert (2nd method)
insert into employee values (2, "Anuhya", "Peddi", 2, 20, 83425.63);

-- insert partially
insert into employee (employee_id, first_name) values (3, "Vageesh");

-- updating all rows
update employee set salary = 1.1 * salary;

-- updating a specified row
update employee set salary = 1.2 * salary where employee_id = 1;

-- delete a specified row
delete from employee where employee_id = 2;

-- delete all rows
delete from employee;