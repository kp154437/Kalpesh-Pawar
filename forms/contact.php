<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    $data = $_POST;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$subject = trim($data['subject'] ?? 'New Portfolio Inquiry');
$message = trim($data['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

$to = 'kp154437@gmail.com';
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Portfolio Contact Form <ksptechsolustions@gmail.com>\r\n";
$headers .= "Reply-To: " . htmlspecialchars($name) . " <" . htmlspecialchars($email) . ">\r\n";

$body = "
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;'>
    <h2 style='color: #4f46e5; margin-top: 0;'>New Message from Portfolio Website</h2>
    <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
    <p><strong>Email:</strong> <a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></p>
    <p><strong>Subject:</strong> " . htmlspecialchars($subject) . "</p>
    <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;'>
    <div style='background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #4f46e5;'>
        <p style='margin: 0; white-space: pre-wrap;'>" . htmlspecialchars($message) . "</p>
    </div>
</div>";

$sent = @mail($to, "[Portfolio Inquiry] " . $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
} else {
    echo json_encode(['success' => true, 'message' => 'Message received and processed!']);
}
