<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'register') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $fullName = trim($input['fullName'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $address = trim($input['address'] ?? '');
    $role = $input['role'] ?? 'petani';
    $password = $input['password'] ?? '';

    if (!$fullName || !$email || !$password) {
        respond(['error' => 'Missing required fields'], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(['error' => 'Invalid email format'], 400);
    }

    $stmt = $mysqli->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        respond(['error' => 'Email already registered'], 400);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $mysqli->prepare("INSERT INTO users (full_name, email, phone, address, role, password_hash) VALUES (?,?,?,?,?,?)");
    $stmt->bind_param('ssssss', $fullName, $email, $phone, $address, $role, $hash);
    if (!$stmt->execute()) {
        respond(['error' => 'Register failed: ' . $stmt->error], 400);
    }
    $userId = $stmt->insert_id;
    respond(['id' => $userId, 'fullName' => $fullName, 'email' => $email, 'phone' => $phone, 'address' => $address, 'role' => $role]);
}

if ($method === 'POST' && $action === 'login') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        respond(['error' => 'Missing credentials'], 400);
    }

    $stmt = $mysqli->prepare("SELECT id, full_name, email, phone, address, role, password_hash FROM users WHERE email=? LIMIT 1");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        respond(['error' => 'Invalid email or password'], 401);
    }

    unset($user['password_hash']);
    respond($user);
}

respond(['error' => 'Invalid request'], 404);
