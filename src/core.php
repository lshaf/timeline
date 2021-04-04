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
        file_put_contents($tl_list, '[]');
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

        $isUpdate = false;
        $cacheList = json_decode(file_get_contents($tl_list), true);
        foreach ($cacheList as $key => $tll) {
            if ($tll['id'] === $dt['id']) {
                $isUpdate = true;
                $cacheList[$key]['name'] = $dt['name'];
                break;
            }
        }

        if (!$isUpdate) {
            $cacheList[] = [
                'id' => $dt['id'],
                'name' => $dt['name'],
            ];
        }

        file_put_contents($fn, json_encode($dt));
        file_put_contents($tl_list, json_encode($cacheList));
        $result = [
            'success' => true,
            'message' => 'Success'
        ];
    } else if ($path == 'get/timeline') {
        $fn = $db_path . "/{$dt['id']}.json";
        if (!is_file($fn)) {
            $result['message'] = "ID is not valid.";
        } else {
            $result = [
                'success' => true,
                'message' => 'success',
                'data' => json_decode(file_get_contents($fn), true)
            ];
        }
    } else if ($path == 'get/timeline/list') {
        $result = [
            'success' => true,
            'message' => 'success',
            'data' => json_decode(file_get_contents($tl_list), true)
        ];
    } else if ($path == 'get/setting') {
        //
    } else if ($path == 'save/setting') {
        //
    }

    echo json_encode($result);
    exit;
}
?>
