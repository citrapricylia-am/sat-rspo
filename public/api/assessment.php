<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://sat-rspo.vercel.app'); // frontend Vercel
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
	$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
	$userId = intval($input['userId'] ?? 0);
	$stage = intval($input['stage'] ?? 0);
	$answers = $input['answers'] ?? [];
	$totalScore = intval($input['totalScore'] ?? 0);
	$maxScore = intval($input['maxScore'] ?? 0);
	$percentage = intval($input['percentage'] ?? 0);

	if (!$userId || !$stage || !$answers) {
		respond(['error' => 'Missing payload'], 400);
	}
	$answersJson = json_encode($answers, JSON_UNESCAPED_UNICODE);
	$stmt = $mysqli->prepare("INSERT INTO assessments (user_id, stage, answers_json, total_score, max_score, percentage) VALUES (?,?,?,?,?,?)");
	$stmt->bind_param('iisiii', $userId, $stage, $answersJson, $totalScore, $maxScore, $percentage);
	if (!$stmt->execute()) {
		respond(['error' => 'Save failed: ' . $stmt->error], 400);
	}
	respond(['ok' => true, 'id' => $stmt->insert_id]);
}

respond(['error' => 'Invalid request'], 404);
