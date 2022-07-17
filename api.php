<?php
include_once('conf/connect.php');

header("Access-Control-Allow-Origin: *");

$post = json_decode(file_get_contents("php://input"));

if (isset($post->user)) {
    $data = [
        'name' => isset($post->name) ? strlen($post->name) < 11 ? $post->name : 'სახელი' : 'სახელი',
        'lastname' => isset($post->lastname) ? strlen($post->lastname) < 30 ? $post->lastname : 'გვარი' : 'გვარი',
        'level' => isset($post->level) ? $post->level : 0,
        'countanswer' => isset($post->questions) ? $post->questions : 0,
        'answtrue' => isset($post->success) ? $post->success : 0,
        'answfalse' => isset($post->wrong) ? $post->wrong : 0,
        'time' => isset($post->time) ? $post->time : 0,
        'date' => date('Y/m/d'),
        'ip' => getUserIP()
    ];
    $userId = insertData($data);
    if (isset($post->errorList[0])) {
        foreach ($post->errorList[0] as $errorList) {
            questionProblem(['question' => $errorList, 'userid' => (int) $userId]);
        }
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
    $stmt = $conn->query("SELECT name, lastname, level, answtrue, answfalse, time FROM users");
    $getData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($getData as $key => $value) {
        $time = $value['time'];
        $finTime = (int) explode(':', "$time", 2)[0] * 60 + (int) explode(':', "$time", 2)[1];
        $calcResult = ($value['answtrue'] - $value['answfalse']) / $finTime;
        $getData[$key]['sortResult'] = $calcResult;
        $getData[$key]['name'] = strip_tags($getData[$key]['name']);
        $getData[$key]['lastname'] = strip_tags($getData[$key]['lastname']);
    }
    array_multisort(array_column($getData, 'sortResult'), SORT_DESC, $getData);

    echo json_encode(['data' => $getData, 'error_code' => 0, 'error_text' => '']);
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
