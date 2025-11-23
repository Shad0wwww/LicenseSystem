CREATE TABLE IF NOT EXISTS DeviceActivations (
    ID INT NOT NULL AUTO_INCREMENT,
    license_id INT NOT NULL, 
    device_identifier VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL, 
    activation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    PRIMARY KEY (ID),

    UNIQUE KEY idx_device_license (license_id, device_identifier), 

    FOREIGN KEY (license_id) REFERENCES License(ID) ON DELETE CASCADE
);