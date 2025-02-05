<?php
$host    = getenv('DB_HOST') ?: 'db';
$db      = getenv('DB_NAME') ?: 'recette_db';
$user    = getenv('DB_USER') ?: 'root';
$pass    = getenv('DB_PASS') ?: 'example';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

header('Content-Type: application/json');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM recettes");
        $recettes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($recettes);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

elseif ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['nom']) || !isset($input['description'])) {
        http_response_code(400);
        echo json_encode(["error" => "Les champs 'nom' et 'description' sont requis."]);
        exit;
    }

    try {
        $sql = "INSERT INTO recettes (nom, description) VALUES (:nom, :description)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nom'         => $input['nom'],
            ':description' => $input['description']
        ]);

        $id = $pdo->lastInsertId();

        echo json_encode([
            "id"          => $id,
            "nom"         => $input['nom'],
            "description" => $input['description']
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

elseif ($method === 'DELETE') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "L'ID est requis pour la suppression."]);
        exit;
    }
    $id = intval($_GET['id']);

    try {
        $sql = "DELETE FROM recettes WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Recette supprimée."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Recette non trouvée."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

else {
    http_response_code(405);
    echo json_encode(["error" => "Méthode HTTP non autorisée."]);
}
