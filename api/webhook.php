<?php
/**
 * webhook.php — Stripe webhook receiver
 *
 * Verifies the Stripe-Signature header (when STRIPE_WEBHOOK_SECRET is set) and
 * acts on completed payments. Fulfillment (eSIM QR issuance + email) is mocked
 * for now — see the TODO in handle_checkout_completed().
 *
 * Configure in Stripe Dashboard → Developers → Webhooks, endpoint:
 *   https://YOUR-DOMAIN/api/webhook.php   (event: checkout.session.completed)
 */
require __DIR__ . '/config.php';

$payload = file_get_contents('php://input');
$secret  = gje_webhook_secret();

/** Verify the Stripe signature. Returns true/false. */
function gje_verify_stripe_signature($payload, $header, $secret, $tolerance = 300) {
    if ($header === '' || $secret === '') {
        return false;
    }
    $timestamp = null;
    $signatures = array();
    foreach (explode(',', $header) as $part) {
        $kv = explode('=', $part, 2);
        if (count($kv) !== 2) {
            continue;
        }
        if ($kv[0] === 't') {
            $timestamp = (int) $kv[1];
        } elseif ($kv[0] === 'v1') {
            $signatures[] = $kv[1];
        }
    }
    if ($timestamp === null || empty($signatures)) {
        return false;
    }
    if (abs(time() - $timestamp) > $tolerance) {
        return false;
    }
    $expected = hash_hmac('sha256', $timestamp . '.' . $payload, $secret);
    foreach ($signatures as $sig) {
        if (hash_equals($expected, $sig)) {
            return true;
        }
    }
    return false;
}

// When a signing secret is configured, reject anything that doesn't verify.
if ($secret !== '') {
    $header = isset($_SERVER['HTTP_STRIPE_SIGNATURE']) ? $_SERVER['HTTP_STRIPE_SIGNATURE'] : '';
    if (!gje_verify_stripe_signature($payload, $header, $secret)) {
        http_response_code(400);
        echo 'Invalid signature';
        exit;
    }
}

$event = json_decode($payload, true);
$type  = isset($event['type']) ? $event['type'] : '';

if ($type === 'checkout.session.completed') {
    $session = isset($event['data']['object']) ? $event['data']['object'] : array();
    handle_checkout_completed($session);
}

http_response_code(200);
echo 'ok';

function handle_checkout_completed($session) {
    $email   = isset($session['customer_details']['email']) ? $session['customer_details']['email'] : '';
    $planId  = isset($session['metadata']['plan_id']) ? $session['metadata']['plan_id'] : '';
    $amount  = isset($session['amount_total']) ? $session['amount_total'] : 0;

    // TODO (go live): fulfill the order here —
    //   1) Call your eSIM provider API to issue a real QR / activation code.
    //   2) Email the QR + setup guide to $email.
    //   3) Persist the order in your database keyed by the Stripe session id.
    error_log(sprintf('[GJE] Paid: plan=%s amount=%d email=%s', $planId, $amount, $email));
}
