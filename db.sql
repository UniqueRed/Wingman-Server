CREATE DATABASE eventsDatabase;

CREATE TABLE events(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    eventTitle VARCHAR(1000) NOT NULL,
    eventDate DATE NOT NULL,
    eventTime TIME,
    eventLocation VARCHAR(1000),
    eventLink VARCHAR(1000),
    eventHours BIGINT,
    eventDescription VARCHAR(2000),
    contactEmail VARCHAR(255)
);