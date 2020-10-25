
-- creating basic stuff to work on them
create database cheatsheet;
use cheatsheet;

create table city 
(
    id int primary key,
    name varchar(17),
    countrycode varchar(3),
    district varchar(20),
    population int
);

insert into city values (6, "Rotterdam", "NLD", "Zuid-Holland", 593321);
insert into city values (3878, "Scottsdale", "USA", "Arizona", 202705);
insert into city values (3965, "Corona", "USA", "California", 124966);
insert into city values (3973, "Concord", "USA", "California", 121780);
insert into city values (3977, "Cedar Rapids", "USA", "Iowa", 120758);
insert into city values (3982, "Coral Springs", "USA", "Florida", 117549);
insert into city values (4054, "Fairfield", "USA", "California", 92256);
insert into city values (4058, "Boulder", "USA", "Colorado", 91238);
insert into city values (4061, "Fall River", "USA", "Massachusetts", 90555);

-- begin transaction
start transaction;

-- create savepoint
savepoint sv_pt;

delete from city;       -- changing data in table

-- rollback
rollback to sv_pt;

-- releasing savepoint
release savepoint sv_pt;

-- commiting changes
commit;
