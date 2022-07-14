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
        'date' => date('Y/m/d')
    ];
    insertData($data);
}

function insertData($data)
{
    global $conn;
    $query = "INSERT INTO users (name, lastname, level, countanswer, answtrue, answfalse, time, date) VALUES (:name, :lastname, :level, :countanswer, :answtrue, :answfalse, :time, :date)";
    $insertData = $conn->prepare($query);
    $insertData->execute($data);
    echo json_encode(['error_code' => 0, 'error_text' => '']);
}
