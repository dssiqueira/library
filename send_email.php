<?php
header('Content-Type: application/json');

// Validar e sanitizar inputs
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$area = filter_input(INPUT_POST, 'area', FILTER_SANITIZE_STRING);
$details = filter_input(INPUT_POST, 'details', FILTER_SANITIZE_STRING);

// Validar campos obrigatórios
if (!$name || !$email || !$area || !$details) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios']);
    exit;
}

// Validar tamanho dos campos
if (strlen($name) > 50) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nome não pode ter mais que 50 caracteres']);
    exit;
}

if (strlen($email) > 50) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email não pode ter mais que 50 caracteres']);
    exit;
}

if (strlen($details) > 500) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Detalhes não podem ter mais que 500 caracteres']);
    exit;
}

// Validar formato do nome (apenas letras e espaços)
if (!preg_match("/^[A-Za-zÀ-ÿ\s]+$/", $name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nome deve conter apenas letras']);
    exit;
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

// Validar área
$valid_areas = ['Produto', 'Tecnologia', 'Marketing', 'C-Level', 'Negocios', 'Projetos'];
if (!in_array($area, $valid_areas)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Área inválida']);
    exit;
}

try {
    // Configurar cabeçalhos do email
    $to = 'handbook@dsiqueira.com';
    $subject = "Nova solicitação de ajuda - $area";
    
    // Criar mensagem HTML
    $message = "<html><body>";
    $message .= "<h2>Nova Solicitação de Ajuda</h2>";
    $message .= "<p><strong>Nome:</strong> " . htmlspecialchars($name) . "</p>";
    $message .= "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>";
    $message .= "<p><strong>Área:</strong> " . htmlspecialchars($area) . "</p>";
    $message .= "<p><strong>Detalhes:</strong><br>" . nl2br(htmlspecialchars($details)) . "</p>";
    $message .= "</body></html>";

    // Cabeçalhos para email HTML
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Debug info
    $debug_info = [
        'success' => false,
        'message' => '',
        'debug' => [
            'to' => $to,
            'subject' => $subject,
            'headers' => $headers,
            'php_version' => phpversion(),
            'server' => $_SERVER['SERVER_SOFTWARE'],
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ];

    // Enviar email
    if (mail($to, $subject, $message, $headers)) {
        $debug_info['success'] = true;
        $debug_info['message'] = 'Email enviado com sucesso';
        echo json_encode($debug_info);
    } else {
        $error = error_get_last();
        $debug_info['message'] = 'Falha ao enviar email';
        $debug_info['debug']['error'] = $error ? $error['message'] : 'Erro desconhecido';
        throw new Exception($debug_info['message']);
    }
} catch (Exception $e) {
    http_response_code(500);
    $debug_info['message'] = 'Erro ao enviar email: ' . $e->getMessage();
    $debug_info['debug']['exception'] = $e->getMessage();
    $debug_info['debug']['trace'] = $e->getTraceAsString();
    echo json_encode($debug_info);
}
