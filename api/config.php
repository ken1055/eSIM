<?php
/**
 * config.php — Stripe configuration & helpers (no Composer / no SDK required)
 *
 * Talks to the Stripe REST API directly via cURL, so it runs on shared
 * rental servers (Xserver / Sakura / Lolipop, etc.) as long as PHP has the
 * cURL extension enabled (it almost always is).
 *
 * The secret key is NEVER committed. It is read from, in order:
 *   1) the STRIPE_SECRET_KEY environment variable, or
 *   2) api/secrets.php  (git-ignored; copy from api/secrets.example.php)
 */

/** Return the Stripe secret key, or '' when not configured yet. */
function gje_stripe_key() {
    $env = getenv('STRIPE_SECRET_KEY');
    if ($env !== false && $env !== '') {
        return $env;
    }
    $file = __DIR__ . '/secrets.php';
    if (is_file($file)) {
        $cfg = include $file;
        if (is_array($cfg) && !empty($cfg['STRIPE_SECRET_KEY'])) {
            return $cfg['STRIPE_SECRET_KEY'];
        }
    }
    return '';
}

/** Return the Stripe webhook signing secret, or '' when not configured. */
function gje_webhook_secret() {
    $env = getenv('STRIPE_WEBHOOK_SECRET');
    if ($env !== false && $env !== '') {
        return $env;
    }
    $file = __DIR__ . '/secrets.php';
    if (is_file($file)) {
        $cfg = include $file;
        if (is_array($cfg) && !empty($cfg['STRIPE_WEBHOOK_SECRET'])) {
            return $cfg['STRIPE_WEBHOOK_SECRET'];
        }
    }
    return '';
}

/**
 * Authoritative plan catalog. Prices are in USD *cents* and live ONLY on the
 * server, so the amount charged can never be tampered with from the browser.
 * Keys match the ?plan= ids used by checkout.html / js/checkout.js.
 */
function gje_plans() {
    return array(
        'city-3gb'    => array('name' => 'Japan eSIM — 3GB / 5 Days',        'amount' => 1200),
        'city-10gb'   => array('name' => 'Japan eSIM — 10GB / 10 Days',      'amount' => 1500),
        'city-unlim'  => array('name' => 'Japan eSIM — Unlimited / 30 Days', 'amount' => 3600),
        'multi-3gb'   => array('name' => 'Multi-Country eSIM — 3GB / 5 Days',        'amount' => 1400),
        'multi-10gb'  => array('name' => 'Multi-Country eSIM — 10GB / 10 Days',      'amount' => 2200),
        'multi-unlim' => array('name' => 'Multi-Country eSIM — Unlimited / 30 Days', 'amount' => 4500),
    );
}

/** Charge currency (ISO 4217, lowercase) for Stripe. */
function gje_currency() {
    return 'usd';
}

/** Send a JSON response and stop. */
function gje_json($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

/**
 * Call the Stripe REST API.
 *
 * @param string     $method 'GET' or 'POST'
 * @param string     $path   e.g. 'checkout/sessions'
 * @param array|null $params form params (nested arrays allowed)
 * @return array{code:int, body:string, data:array, error:string}
 */
function gje_stripe_request($method, $path, $params = null) {
    $key = gje_stripe_key();
    $ch  = curl_init('https://api.stripe.com/v1/' . $path);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, $key . ':');           // HTTP Basic: secret key as username
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Stripe-Version: 2024-06-20'));
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    if (strtoupper($method) === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params === null ? array() : $params));
    }

    $body  = curl_exec($ch);
    $code  = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    $data = json_decode($body, true);
    return array(
        'code'  => $code,
        'body'  => is_string($body) ? $body : '',
        'data'  => is_array($data) ? $data : array(),
        'error' => $error,
    );
}

/** Build the public site base URL (scheme + host + path to the site root). */
function gje_site_base_url() {
    $https  = (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    $scheme = $https ? 'https' : 'http';
    $host   = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
    // SCRIPT_NAME is like /api/create-checkout-session.php -> site root is its grandparent dir
    $root = isset($_SERVER['SCRIPT_NAME']) ? dirname(dirname($_SERVER['SCRIPT_NAME'])) : '';
    $root = rtrim(str_replace('\\', '/', $root), '/');
    if ($root === '/' || $root === '.') {
        $root = '';
    }
    return $scheme . '://' . $host . $root;
}
