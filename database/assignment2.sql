-- step 1
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
)
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

-- step 2
UPDATE
 public.account 
SET 
account_type = 'Admin'
WHERE 
account_id = 1;

-- step 3
DELETE FROM public.account
WHERE account_id = 1;

--step 4
UPDATE public.inventory
SET 
inv_description = REPLACE(inv_description,'the small interiors','a huge interior')
WHERE
inv_id = 10;

--step 5
SELECT inv_make, inv_model, classification.classification_name
FROM public.inventory
INNER JOIN public.classification
ON inventory.classification_id = classification.classification_id
WHERE 
classification.classification_name = 'Sport';

--step 6
UPDATE public.inventory
SET
inv_image = REPLACE(inv_image,'images','images/vehicles'),
inv_thumbnail = REPLACE(inv_thumbnail,'images','images/vehicles');