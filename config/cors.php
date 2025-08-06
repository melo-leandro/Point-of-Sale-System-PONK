<?php

return [

    'paths' => ['api/', 'sanctum/csrf-cookie', ''],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'], 

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

    'allowed_origins_patterns' => ['#^https://[a-zA-Z0-9-]+\.ngrok-free\.app$#'],

    'allowed_origins' => ['https://ca8827377df8.ngrok-free.app'],
];
