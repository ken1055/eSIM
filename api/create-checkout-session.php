<?php
/**
 * create-checkout-session.php
 *
 * POST { planId, email, startDate } -> { url }   (redirect target on Stripe)
 *
 * When no secret key is configured yet, returns { mock: true } so the
 * frontend can keep using its built-in mock flow.
 */
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    gje_json(array('error' => 'Method not allowed'), 405);
}

$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = array();
}

$planId    = isset($input['planId']) ? (string) $input['planId'] : '';
$email     = isset($input['email']) ? trim((string) $input['email']) : '';
$startDate = isset($input['startDate']) ? (string) $input['startDate'] : '';

$plans = gje_plans();
if (!isset($plans[$planId])) {
    gje_json(array('error' => 'Invalid plan'), 400);
}

// Not configured yet -> let the browser run the mock flow.
if (gje_stripe_key() === '') {
    gje_json(array('mock' => true));
}

$plan    = $plans[$planId];
$baseUrl = gje_site_base_url();

$params = array(
    'mode'        => 'payment',
    'success_url' => $baseUrl . '/success.html?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url'  => $baseUrl . '/checkout.html?plan=' . rawurlencode($planId),
    'line_items'  => array(
        array(
            'quantity'   => 1,
            'price_data' => array(
                'currency'     => gje_currency(),
                'unit_amount'  => $plan['amount'],
                'product_data' => array('name' => $plan['name']),
            ),
        ),
    ),
    'metadata'    => array(
        'plan_id'    => $planId,
        'start_date' => $startDate,
    ),
);

if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $params['customer_email'] = $email;
}

$res  = gje_stripe_request('POST', 'checkout/sessions', $params);
$data = $res['data'];

if ($res['code'] >= 200 && $res['code'] < 300 && !empty($data['url'])) {
    gje_json(array('url' => $data['url']));
}

$detail = isset($data['error']['message']) ? $data['error']['message'] : $res['error'];
error_log('[GJE] Stripe create session failed: ' . $detail);
gje_json(array('error' => 'Stripe error', 'detail' => $detail), 502);
