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
        <p-list v-if="route == 'list'"></p-list>
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
    ?>
    <script src="https://unpkg.com/vue@2.6.12/dist/vue.min.js"></script>
    <script src="https://unpkg.com/vuejs-datepicker"></script>
    <script src="./assets/js/form.js"></script>
    <script src="./assets/js/list.js"></script>
    <script src="./assets/js/main.js"></script>
</body>
</html>