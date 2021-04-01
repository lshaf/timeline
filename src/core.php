<?php
session_start();
$currentTime = time();
$env = json_decode(file_get_contents(__DIR__ . "/env.json"), true);
function log_it($mode, $message) {
    $file = __DIR__ . "/logs/" . date("Ymd") . ".log";

    if (!is_file($file)) touch($file);
    $s_mode = str_pad($mode, 8, " ");
    $pad_user = str_pad("u:" . $_SERVER['PHP_AUTH_USER'], 10, " ");
    $message = preg_replace("/\s+/m", " ", $message);
    $format = date("H:i:s") . " {$s_mode} [{$pad_user}] {$message}\n";
    file_put_contents($file, $format, FILE_APPEND);
}

function pc_validate($user, $pass) {
    global $env;
    global $currentTime;

    $users = $env["access"] ?? [];
    $is_valid = isset($users[$user]) && ($users[$user] == $pass);
    if ($is_valid) {
        if (!isset($_SESSION['timeout'])) {
            log_it("LOGIN", "Login user {$user}");
            $_SESSION['timeout'] = $currentTime + 1800;
        }
            
        $is_valid = $currentTime <= $_SESSION['timeout'];
        if (!$is_valid) unset($_SESSION['timeout']);
    }

    return $is_valid;
};

if (!pc_validate($_SERVER['PHP_AUTH_USER'] ?? "", $_SERVER['PHP_AUTH_PW'] ?? "")) { 
    header('WWW-Authenticate: Basic realm="Store Realm"'); 
    header('HTTP/1.0 401 Unauthorized'); 
    die("Invalid Credential.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
}
?>
