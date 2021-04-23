
-- creating basic stuff to work on them
create database cheatsheet;
use cheatsheet;

create table employees
(
    eid int primary key,
    fname varchar(20),
    lname varchar(20),
    salary real,
    joindate date,
    dept varchar(10),
    gender char
);

create table project
(
    pid int primary key,
    eid int,
    pname varchar(20)
);

alter table project add foreign key(eid) references employees(eid);

set foreign_key_checks = 0;

insert into employees values (1, "Vikas", "Ahlawat", 600000, "2013-02-15", "IT", "M");
insert into employees values (2, "nikita", "Jain", 530000, "2014-01-09", "HR", "F");
insert into employees values (3, "Ashish", "Kumar", 1000000, "2014-01-09", "IT", "M");
insert into employees values (4, "Nikhil", "Sharma", 480000, "2014-01-09", "HR", "M");
insert into employees values (5, "anish", "kadian", 500000, "2014-01-09", "Payroll", "M");

insert into project values (1, 1, "Task Track");
insert into project values (2, 1, "CLP");
insert into project values (3, 1, "Survey Management");
insert into project values (4, 2, "HR Management");
insert into project values (5, 3, "Task Track");
insert into project values (6, 3, "GRS");
insert into project values (7, 3, "DDS");
insert into project values (8, 4, "HR Management");
insert into project values (9, 6, "GL Management");

set foreign_key_checks = 1;

-- inner join
select e.fname, p.pname from employees as e inner join project as p on e.eid = p.eid;

-- outer join
select e.fname, p.pname from employees as e left outer join project as p on e.eid = p.eid
union
select e.fname, p.pname from employees as e right outer join project as p on e.eid = p.eid;

-- left outer join
select e.fname, p.pname from employees as e left outer join project as p on e.eid = p.eid;

-- right outer join
select e.fname, p.pname from employees as e right outer join project as p on e.eid = p.eid;