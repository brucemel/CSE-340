-- Assignment 2 - SQL Queries

-- Task 1: Insert Tony Stark

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2: Update Tony Stark to Admin

UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Task 3: Delete Tony Stark

DELETE FROM account
WHERE account_id = 1;

-- Task 4: Update GM Hummer description

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Task 5: Inner Join - Sport category

SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Task 6: Update image paths

UPDATE inventory
SET
inv_img = REPLACE(inv_img, '/images/', '/images/vehicles'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
