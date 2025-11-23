CREATE TABLE IF NOT EXISTS License (
    ID INT NOT NULL AUTO_INCREMENT,
    product VARCHAR(100) NOT NULL,
    key_hash CHAR(64) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    max_activations INT DEFAULT 1 NOT NULL,
    expiry_date DATETIME NULL, 
    
    PRIMARY KEY (ID),
    UNIQUE KEY idx_key_hash (key_hash)
);