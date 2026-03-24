-- Custom SQL migration file, put your code below! --
DELETE FROM "company";
DELETE FROM "customer";

INSERT INTO "company" ("id", "name", "businessId", "email", "industry") VALUES (1, 'Putki Pro Oy', 1000, 'info@putkipro.fi', default), (2, 'Putki Pro Oy', 2000, 'info@putkipro.fi', default);
INSERT INTO "customer" ("id", "name", "email", "description", "company_id") VALUES (1, 'Pekka Pekkanen', '', 'Ensimmäinen asiakas', 1), (2, 'Aino Aalto', '', 'Toinen asiakas', 1), (3, 'Bertta Baron', '', 'Kolmas asiakas', 2);
