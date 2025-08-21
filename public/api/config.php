<?php
// Basic MySQL config for XAMPP
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'rspo_db';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	exit(0);
}

function respond($data, $status = 200) {
	http_response_code($status);
	echo json_encode($data);
	exit;
}

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS);
if ($mysqli->connect_errno) {
	respond(['error' => 'DB connection failed: ' . $mysqli->connect_error], 500);
}

$mysqli->query("CREATE DATABASE IF NOT EXISTS `$DB_NAME` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
$mysqli->select_db($DB_NAME);

// Create tables if not exists
$mysqli->query("CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	full_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	phone VARCHAR(50) DEFAULT NULL,
	address VARCHAR(255) DEFAULT NULL,
	role ENUM('petani','manajer') NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS assessments (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	stage TINYINT NOT NULL,
	answers_json MEDIUMTEXT NOT NULL,
	total_score INT NOT NULL,
	max_score INT NOT NULL,
	percentage INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

?>
