<?php
/**
 * secrets.example.php — TEMPLATE (safe to commit)
 *
 * Setup:
 *   1) Copy this file to  api/secrets.php   (that name is git-ignored)
 *   2) Paste your Stripe keys below
 *
 * Prefer setting STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET as real
 * environment variables if your host supports it — env vars win over
 * this file. This file is the fallback for shared rental servers.
 *
 * NEVER commit api/secrets.php and NEVER expose the secret key to the browser.
 */
return array(
    // Test mode key starts with sk_test_... ; live mode with sk_live_...
    'STRIPE_SECRET_KEY'     => '',

    // From Stripe Dashboard → Developers → Webhooks (starts with whsec_...).
    // Optional until you set up the webhook endpoint.
    'STRIPE_WEBHOOK_SECRET' => '',
);
