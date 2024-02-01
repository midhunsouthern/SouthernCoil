ALTER TABLE sc_db2.drawing_images ADD order_type SMALLINT NOT NULL;
ALTER TABLE sc_db2.drawing_images ADD draw_type varchar(25) NOT NULL;
ALTER TABLE sc_db2.drawing_images CHANGE created_dt created_dt datetime DEFAULT current_timestamp() NOT NULL AFTER draw_type;
ALTER TABLE sc_db2.drawing_images ADD order_serial_ref int NULL;
ALTER TABLE sc_db2.drawing_images MODIFY COLUMN order_serial_ref VARCHAR(100) DEFAULT NULL NULL;
