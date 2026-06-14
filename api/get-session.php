<?php
/**
 * get-session.php
 *
 * GET ?id=cs_... -> { payment_status, amount_total, currency, customer_email, plan_id }
 *
 * Used by success.html to confirm the payment actually completed before
 * showing the "Payment Complete" screen (prevents spoofing by visiting the
 * success URL directly).
 */
require __DIR__ . '/config.php';

$id = isset($_GET['id']) ? (string) $_GET['id'] : '';
if ($id === '' || !preg_match('/^cs_[A-Za-z0-9_]+$/', $id)) {
    gje_json(array('error' => 'Invalid session id'), 400);
}

if (gje_stripe_key() === '') {
    gje_json(array('mock' => true));
}

$res  = gje_stripe_request('GET', 'checkout/sessions/' . rawurlencode($id), null);
$data = $res['data'];

if ($res['code'] !== 200 || empty($data)) {
    gje_json(array('error' => 'Stripe error'), 502);
}

$email = null;
if (isset($data['customer_details']['email'])) {
    $email = $data['customer_details']['email'];
} elseif (isset($data['customer_email'])) {
    $email = $data['customer_email'];
}

gje_json(array(
    'payment_status' => isset($data['payment_status']) ? $data['payment_status'] : null,
    'amount_total'   => isset($data['amount_total']) ? $data['amount_total'] : null,
    'currency'       => isset($data['currency']) ? $data['currency'] : null,
    'customer_email' => $email,
    'plan_id'        => isset($data['metadata']['plan_id']) ? $data['metadata']['plan_id'] : null,
));
