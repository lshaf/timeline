<?php include("./src/core.php") ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Timeline</title>
    <link rel="stylesheet" href="./assets/style.css">
</head>
<body>
    <div id="app">
        <p-setting v-if="route == 'setting'"></p-setting>
        <p-list v-if="route == 'list'"></p-list>
        <p-view v-if="route == 'view'" :timeline="activeTimeline"></p-view>
        <p-form v-if="route == 'form'" :timeline="activeTimeline"></p-form>
        <div class="loading" v-if="isLoading">
            <div class="content">
                <span class="loader-anim"></span>
                Tunggu sebentar
            </div>
        </div>
    </div>
    <?php
        include "./src/pages/list.php";
        include "./src/pages/form.php";
        include "./src/pages/setting.php";
        include "./src/pages/view.php";
    ?>
    <script src="https://unpkg.com/vue@2.6.12/dist/vue.min.js"></script>
    <script src="https://unpkg.com/vuejs-datepicker"></script>
    <script src="./assets/js/helper.js?1"></script>
    <script src="./assets/js/setting.js?1"></script>
    <script src="./assets/js/view.js?1.1"></script>
    <script src="./assets/js/form.js?1"></script>
    <script src="./assets/js/list.js?1"></script>
    <script src="./assets/js/main.js?1"></script>
</body>
</html>