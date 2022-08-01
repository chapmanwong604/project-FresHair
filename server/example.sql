/* Insert these to create a new database and user in your PosgreSQL: */
CREATE USER freshair_user WITH PASSWORD '123456' SUPERUSER;
CREATE DATABASE freshair_db;

/* Login to your database "freshair_db" with password "123456": */
psql -U freshair_user -W -h localhost freshair_db;