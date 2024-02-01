DROP PROCEDURE IF EXISTS create_past_date;
   DELIMITER $$  
CREATE PROCEDURE create_past_date()
   BEGIN
      SET @a = 0;
      CREATE TABLE IF NOT EXISTS past_dates 
      (	ID int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
   		past_date varchar(20) NOT NULL);
      TRUNCATE past_dates;
      INSERT INTO past_dates (past_date) VALUES (curdate());
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -1 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -2 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -3 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -4 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -5 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -6 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -7 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -8 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -9 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -10 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -11 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -12 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -13 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -14 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -15 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -16 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -17 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -18 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -19 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -20 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -21 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -22 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -23 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -24 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -25 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -26 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -27 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -28 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -29 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -30 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -31 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -32 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -33 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -34 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -35 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -36 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -37 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -38 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -39 DAY));
      INSERT INTO past_dates (past_date) VALUES (DATE_ADD(curdate(), INTERVAL -40 DAY));
END $$

call create_past_date();