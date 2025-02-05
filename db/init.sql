-- db/init.sql
CREATE DATABASE IF NOT EXISTS recette_db;
USE recette_db;

CREATE TABLE IF NOT EXISTS recettes (
                                        id INT AUTO_INCREMENT PRIMARY KEY,
                                        nom VARCHAR(255) NOT NULL,
    description TEXT
    );

-- Insertion d'exemples
INSERT INTO recettes (nom, description) VALUES
                                            ('Tarte aux pommes', 'Une délicieuse tarte aux pommes maison'),
                                            ('Quiche lorraine', 'Une quiche classique de Lorraine');
