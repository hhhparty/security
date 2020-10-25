
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

-- sum function
select sum(population) from city group by population;

-- average function
select avg(population) from city group by population;

-- count function
select district, count(district) from city group by district;

-- maximum function
select max(population) from city group by population;

-- minimum function
select min(population) from city group by population;

-- standard deviation function
select stddev(population) from city group by population;

-- group concat function
select group_concat(population) from city group by population;