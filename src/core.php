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
            $_SESSION['timeout'] = $currentTime + (6 * 3600);
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
    header("Content-Type: application/json");
    $post = json_decode(file_get_contents('php://input'), true);
    $db_path = dirname(__FILE__) . "/database";

    $dt = $post['data'] ?? [];
    $path = $post['path'] ?? '';
    $result = [
        'success' => false, 
        'message' => 'Invalid path',
        'data' => [
            'path' => $path, 
            'data' => $dt
        ],
    ];

    $tl_list = $db_path . "/list.json";
    if (!is_file($tl_list)) {
        touch($tl_list);
        file_put_contents($tl_list, '{}');
    }

    $setting_file = $db_path . "/setting.json";
    if (!is_file($setting_file)) {
        touch($setting_file);
        file_put_contents($setting_file, json_encode([
            'offDay' => [6,0],
            'holiday' => []
        ]));
    }

    if ($path == 'save/timeline') {
        $fn = $db_path . "/{$dt['id']}.json";
        if (!is_file($fn)) touch($fn);

        $cacheList = json_decode(file_get_contents($tl_list), true);
        $cacheList[$dt['id']] = $dt['name'];

        log_it("TIMELINE", "Updated timeline {$dt['id']}");
        file_put_contents($fn, json_encode($dt));
        file_put_contents($tl_list, json_encode($cacheList));
        $result = [
            'success' => true,
            'message' => 'Success',
            'data' => $dt
        ];
    } else if ($path == 'get/timeline') {
        $fn = $db_path . "/{$dt['id']}.json";
        if (!is_file($fn)) {
            $result['message'] = "ID is not valid.";
        } else {
            $result = [
                'success' => true,
                'message' => 'Success',
                'data' => json_decode(file_get_contents($fn), true)
            ];
        }
    } else if ($path == 'delete/timeline') {
        $fn = $db_path . "/{$dt['id']}.json";
        if (!is_file($fn)) {
            $result['message'] = "ID is not valid.";
        } else {
            $cacheList = json_decode(file_get_contents($tl_list), true);
            unset($cacheList[$dt['id']]);
            unlink($fn);

            file_put_contents($tl_list, json_encode($cacheList));
            $result = [
                'success' => true,
                'message' => 'Success',
                'data' => []
            ];
        }
    } else if ($path == 'get/timeline/list') {
        $result = [
            'success' => true,
            'message' => 'Success',
            'data' => json_decode(file_get_contents($tl_list), true)
        ];
    } else if ($path == 'get/setting') {
        $data = json_decode(file_get_contents($setting_file), true);
        $data['holiday'] = array_filter($data['holiday'], function($x) {
            $now = date("Y");
            $current = date("Y", strtotime($x));
            return ($current >= $now - 1) and ($current <= $now + 1);
        });
        $result = [
            'success' => true,
            'message' => 'Success',
            'data' => $data
        ];
    } else if ($path == 'save/setting') {
        $finalResult = [
            'offDay' => [6,0],
            'holiday' => $dt['holiday'] ?? []
        ];

        log_it("SETTING", "Updated setting");
        file_put_contents($setting_file, json_encode($finalResult));
        $result = [
            'success' => true,
            'message' => 'Success',
            'data' => $finalResult
        ];
    }

    echo json_encode($result);
    exit;
}
?>
