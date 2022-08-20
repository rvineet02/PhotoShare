DROP DATABASE IF EXISTS photoshare;
CREATE DATABASE photoshare;
USE photoshare;

CREATE TABLE Users (
    user_id int4 AUTO_INCREMENT,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    gender varchar(255),
    hometown varchar(255),
    password varchar(255) NOT NULL,
    CONSTRAINT user_pk
      PRIMARY KEY (user_id)
);

CREATE TABLE Friends (
    friend1 int4,
    friend2 int4,
    CONSTRAINT friend1
      FOREIGN KEY (friend1)
      REFERENCES Users (user_id)
      ON DELETE CASCADE,
    CONSTRAINT friend2
      FOREIGN KEY (friend2)
      REFERENCES Users (user_id)
      ON DELETE CASCADE
);

CREATE TABLE Albums 
(
  album_id int4 AUTO_INCREMENT,
  user_id int4,
  album_name VARCHAR(255) NOT NULL,
  date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)
    REFERENCES Users (user_id)
    ON DELETE CASCADE,
  CONSTRAINT album_pk
    PRIMARY KEY (album_id)
);

CREATE TABLE Photos 
(
  photo_id int4 AUTO_INCREMENT,  
  album_id int4,
  caption VARCHAR(255) NOT NULL, 
  photo_location VARCHAR(255) NOT NULL,
  CONSTRAINT album_id
    FOREIGN KEY (album_id)
    REFERENCES Albums (album_id)
    ON DELETE CASCADE,
  CONSTRAINT photo_pk
    PRIMARY KEY (photo_id)
);

CREATE TABLE Comments
(
  comment_id int4 AUTO_INCREMENT,
  text VARCHAR(255) NOT NULL,
  date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id int4,
  photo_id int4,
  FOREIGN KEY (user_id)
    REFERENCES Users (user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (photo_id)
    REFERENCES Photos (photo_id)
    ON DELETE CASCADE,
  CONSTRAINT comment_pk
    PRIMARY KEY (comment_id)
);


CREATE TABLE Tags 
(
  tag_id int4 AUTO_INCREMENT,
  tag VARCHAR(255) NOT NULL UNIQUE,
  CONSTRAINT tag_pk
    PRIMARY KEY (tag_id)
);

CREATE TABLE Likes 
(
  user_id int4,
  photo_id int4,
  CONSTRAINT user_id
    FOREIGN KEY (user_id)
    REFERENCES Users (user_id)
    ON DELETE CASCADE,
  CONSTRAINT photo_id_likes
    FOREIGN KEY (photo_id)
    REFERENCES Photos (photo_id)
    ON DELETE CASCADE
);

CREATE TABLE TagToPhotos
(
  tag_id int4,
  photo_id int4,
  CONSTRAINT tag_id
    FOREIGN KEY (tag_id)
    REFERENCES Tags (tag_id)
    ON DELETE CASCADE,
  CONSTRAINT photo_id_tags
    FOREIGN KEY (photo_id)
    REFERENCES Photos (photo_id)
    ON DELETE CASCADE
);

-- CREATE USERS
INSERT INTO Users(first_name, last_name, email, date_of_birth, password)
VALUES ('Admin', 'One', 'admin1@bu.edu', '2001-01-1', '1234');

INSERT INTO Users(first_name, last_name, email, date_of_birth, password)
VALUES ('Admin', 'Two', 'admin2@bu.edu', '2001-01-1', '1234');

INSERT INTO Users(first_name, last_name, email, date_of_birth, password)
VALUES ('Admin', 'Three', 'admin3@bu.edu', '2001-01-1', '1234');

INSERT INTO Users(first_name, last_name, email, date_of_birth, password)
VALUES ('Admin', 'Four', 'admin4@bu.edu', '2001-01-1', '1234');

INSERT INTO Users(first_name, last_name, email, date_of_birth, password)
VALUES ('Guest', 'User', 'guest@bu.edu', '2001-01-1', 'GUESTIMPOSSIBLEPASSWORD');

-- CREATE RELATIONSHIPS
INSERT INTO Friends (friend1, friend2) VALUES (1,2);
INSERT INTO Friends (friend1, friend2) VALUES (2,1);
INSERT INTO Friends (friend1, friend2) VALUES (1,3);
INSERT INTO Friends (friend1, friend2) VALUES (3,1);
INSERT INTO Friends (friend1, friend2) VALUES (2,3);
INSERT INTO Friends (friend1, friend2) VALUES (3,2);

-- CREATE ALBUM WITH CAPTIONS, TAGS, LIKES AND COMMENTS (POST NUMBER 1)
INSERT INTO Albums (user_id, album_name) VALUES (1, 'Awesome Travel Moments');

INSERT INTO Photos (album_id, caption, photo_location) VALUES (1, "A beautiful beach with our friends #beach #summer", "image1.jpeg");
INSERT INTO Photos (album_id, caption, photo_location) VALUES (1, "Through the streets of Malta with my #friends during #summer", "image2.jpeg");
INSERT INTO Photos (album_id, caption, photo_location) VALUES (1, "The water is transparent! #loveSummer", "image3.jpeg");
INSERT INTO Photos (album_id, caption, photo_location) VALUES (1, "What an amazing trip", "image4.jpeg");
INSERT INTO Photos (album_id, caption, photo_location) VALUES (1, "WoooOOoOoOOoooo", "image5.jpeg");

INSERT INTO Tags (tag) VALUES ('beach');
INSERT INTO Tags (tag) VALUES ('summer');
INSERT INTO Tags (tag) VALUES ('friends');
INSERT INTO Tags (tag) VALUES ('loveSummer');

INSERT INTO TagToPhotos (tag_id, photo_id) VALUES (1, 1);
INSERT INTO TagToPhotos (tag_id, photo_id) VALUES (2, 1);
INSERT INTO TagToPhotos (tag_id, photo_id) VALUES (3, 2);
INSERT INTO TagToPhotos (tag_id, photo_id) VALUES (2, 2);
INSERT INTO TagToPhotos (tag_id, photo_id) VALUES (4, 3);

INSERT INTO Comments (user_id, photo_id, text) VALUES (2, 1, 'Beautiful! <3');
INSERT INTO Comments (user_id, photo_id, text) VALUES (2, 3, 'So much fun!');
INSERT INTO Comments (user_id, photo_id, text) VALUES (2, 5, 'Trippy...');
INSERT INTO Comments (user_id, photo_id, text) VALUES (3, 2, 'Wow!');
INSERT INTO Comments (user_id, photo_id, text) VALUES (3, 5, 'Circlesss');

INSERT INTO Likes (user_id, photo_id) VALUES (3,1);
INSERT INTO Likes (user_id, photo_id) VALUES (3,2);
INSERT INTO Likes (user_id, photo_id) VALUES (3,4);
INSERT INTO Likes (user_id, photo_id) VALUES (2,1);
INSERT INTO Likes (user_id, photo_id) VALUES (2,2);
INSERT INTO Likes (user_id, photo_id) VALUES (2,3);

-- CREATE ALBUM WITH CAPTIONS AND TAGS (POST NUMBER 2)
INSERT INTO Albums (user_id, album_name) VALUES (2, 'Vintage');

INSERT INTO Photos (album_id, caption, photo_location) VALUES (2, "Gray mountains. WOW! #hiking", "image6.jpeg");
INSERT INTO Photos (album_id, caption, photo_location) VALUES (2, "Gray valley... sick", "image7.jpeg");
INSERT INTO Photos (album_id, caption, photo_location) VALUES (2, "Beautiful mountains #summer", "image8.jpeg");
INSERT INTO Photos (album_id, caption, photo_location) VALUES (2, "Old pic", "image9.jpeg");
INSERT INTO Photos (album_id, caption, photo_location) VALUES (2, "Girl in a field #fields #green #sun", "image10.jpeg");

INSERT INTO Tags (tag) VALUES ('hiking');
INSERT INTO Tags (tag) VALUES ('fields');
INSERT INTO Tags (tag) VALUES ('green');
INSERT INTO Tags (tag) VALUES ('sun');

INSERT INTO TagToPhotos (tag_id, photo_id) VALUES (5, 6);
INSERT INTO TagToPhotos (tag_id, photo_id) VALUES (2, 8);
INSERT INTO TagToPhotos (tag_id, photo_id) VALUES (6, 10);
INSERT INTO TagToPhotos (tag_id, photo_id) VALUES (7, 10);
INSERT INTO TagToPhotos (tag_id, photo_id) VALUES (8, 10);
