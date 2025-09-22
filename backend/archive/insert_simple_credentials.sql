-- Insert Simple Login Credentials for KandyPack
USE kandypack;

-- Clear existing data
DELETE FROM customer;
DELETE FROM admin;
DELETE FROM driver;
DELETE FROM assistant;

-- Insert simple admin credentials
INSERT INTO admin (admin_id, name, password) VALUES 
('admin', 'Administrator', '$2a$10$WN2439lvrlsMMIUsW8uEK.a/mIPy.gRSRZkUxRS0l/gFhcW/KNlUG');

-- Insert simple customer credentials  
INSERT INTO customer (customer_id, name, user_name, password, phone_no, city, address) VALUES
('CUST001', 'John Doe', 'john', '$2a$10$B2spRiWZOqYrA7k5VWgM4ufgwPXLPNL4Bi6h0VMKtjsTx/MHuJnPW', '0771234567', 'Colombo', '123 Main St'),
('CUST002', 'Jane Smith', 'jane', '$2a$10$5uyeDZmR9quFGqNO8gCCAe6NDkZeQkBhvK6kyNkFiegXGmWLUNiVe', '0772345678', 'Kandy', '456 Oak Ave'),
('CUST003', 'Bob Wilson', 'bob', '$2a$10$YyOWdWYUb0d0uuCwQhrGYekO4jFVTVmmH8LlTtDhGDTp4sOk.1jOS', '0773456789', 'Galle', '789 Pine Rd'),
('CUST004', 'Alice Brown', 'alice', '$2a$10$v1IGkDj22ppePpvRmyFUR.sU2rBQcXyzXLPo/EfEhzWmkE2b8qxoq', '0774567890', 'Negombo', '321 Cedar St');

-- Insert simple driver credentials
INSERT INTO driver (driver_id, name, user_name, password, phone_no, city) VALUES
('DRV001', 'Saman Perera', 'saman', '$2a$10$lguTZJwPKVL9gzc5l6fLVuU/ttDYLTLPKHzWKJ3MFRloaldogchxO', '0775678901', 'Colombo'),
('DRV002', 'Kamal Silva', 'kamal', '$2a$10$Jwd3JRh1Q1SGCmSWilrItuKbnRfYw.QG5HY.spqs9i8PGwzE2mO/q', '0776789012', 'Kandy'),
('DRV003', 'Nimal Fernando', 'nimal', '$2a$10$UgVGn3vs.hAofJng7EyVFuL6N9ypr5sNfC77O0lgUK0va2801eHii', '0777890123', 'Galle'),
('DRV004', 'Sunil Rathnayake', 'sunil', '$2a$10$jJJDxmmsRJ5g8nF0y.QeXOOjGJdCWE9g4bwNRgEXGzPQxDk/lZcgS', '0778901234', 'Negombo');

-- Insert simple assistant credentials
INSERT INTO assistant (assistant_id, name, user_name, password, phone_no, city) VALUES
('AST001', 'Priya Jayasinghe', 'priya', '$2a$10$WHwwjJc4xmJG6Ihi72ocveHzQ7kZ3pjR8kxYfL1E0rARulSzVr3sq', '0779012345', 'Colombo'),
('AST002', 'Chamara Wijesekara', 'chamara', '$2a$10$90YH8KRy/n2Sag.DDgVZh.YPznZe6YPbbgcuvCw7/C66UEJ/cF50K', '0770123456', 'Kandy'),
('AST003', 'Sanduni Mendis', 'sanduni', '$2a$10$M2ZQKu5cMll7JvC/OrDmLezODTzLWHfqSDkV5aENxfmqWlXHohK72', '0771234568', 'Galle'),
('AST004', 'Thilaka Kumari', 'thilaka', '$2a$10$gAdQBCLJRCvVLhwHTw/sd.b3GBduTxM/TOxdMuSwXoOjo/ru4sHdC', '0772345679', 'Negombo');

-- Verify the data was inserted
SELECT 'Admin accounts:' as info;
SELECT admin_id as username, name FROM admin;

SELECT 'Customer accounts:' as info;
SELECT user_name, name FROM customer;

SELECT 'Driver accounts:' as info;
SELECT user_name, name FROM driver;

SELECT 'Assistant accounts:' as info;
SELECT user_name, name FROM assistant;

SELECT 'Database updated with simple credentials!' as Status;