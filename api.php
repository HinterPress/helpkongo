<?php
include_once('conf/connect.php');

header("Access-Control-Allow-Origin: *");

$post = json_decode(file_get_contents("php://input"));

if (isset($post->user)) {
    $data = [
        'name' => isset($post->name) ? $post->name : '',
        'lastname' => isset($post->lastname) ? $post->lastname : '',
        'level' => isset($post->level) ? $post->level : 0,
        'countanswer' => isset($post->questions) ? $post->questions : 0,
        'answtrue' => isset($post->success) ? $post->success : 0,
        'answfalse' => isset($post->wrong) ? $post->wrong : 0,
        'time' => isset($post->time) ? $post->time : 0,
        'date' => date('Y/m/d'),
        'ip' => getUserIP()
    ];
    $userId = insertData($data);


    foreach ($post->errorList[0] as $errorList) {
        questionProblem(['question' => $errorList, 'userid' => (int) $userId]);
    }
    echo json_encode(['error_code' => 0, 'error_text' => '']);
}

function questionProblem($data)
{
    global $conn;
    $query = "INSERT INTO questionproblem (question, user_id) VALUES (:question, :userid)";
    $insertData = $conn->prepare($query);
    $insertData->execute($data);
    echo json_encode(['error_code' => 0, 'error_text' => '']);
}


function insertData($data)
{
    global $conn;
    $query = "INSERT INTO users (name, lastname, level, countanswer, answtrue, answfalse, time, date, ip) VALUES (:name, :lastname, :level, :countanswer, :answtrue, :answfalse, :time, :date, :ip)";
    $insertData = $conn->prepare($query);
    $insertData->execute($data);
    $userId = $conn->lastInsertId();
    return $userId;
}

if (isset($_GET['getRating'])) {
    getRating();
}

function getRating()
{
    global $conn;
    $stmt = $conn->query("SELECT * FROM users ORDER BY level, time DESC");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['data' => $result, 'error_code' => 0, 'error_text' => '']);
}


function getUserIP()
{
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if (isset($_SERVER['HTTP_X_CLUSTER_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'];
    else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if (isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}
