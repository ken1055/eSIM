# Stripe 決済セットアップ手順

このサイトは **レンタルサーバー上の PHP** で Stripe Checkout（ホスト型）決済を動かします。
Composer や SDK は不要で、StripeのREST APIを `api/config.php` のcURLヘルパーから直接呼びます。

請求通貨は **USD**。金額は `api/config.php` の `gje_plans()` にサーバー側で固定されており、
ブラウザから改ざんできません（セキュリティ上の重要ポイント）。

---

## 仕組み（フロー）

1. 入力画面（`checkout.html`）で「Continue to Secure Payment」
2. `js/checkout.js` が `api/create-checkout-session.php` を呼ぶ
3. PHPがStripeに Checkout Session を作成し、`url` を返す
4. ブラウザがStripeのホスト型決済ページへリダイレクト
5. 支払い成功 → `success.html?session_id=...` に戻る
6. `success.html` が `api/get-session.php` で支払い完了を確認し、完了画面を表示

> **キー未設定のうちは**、PHPが `{ "mock": true }` を返し、フロントは
> 従来どおりモック決済（実課金なし）で `success.html` に進みます。
> ローカルの静的プレビュー（PHPが動かない）でもモックにフォールバックします。

---

## 手順1：Stripeアカウントを作る（テストモード）

1. https://dashboard.stripe.com/register でアカウント作成（無料）
2. ログイン後、画面右上の **「テスト環境」(Test mode)** をオンにする
3. **Developers → API keys** を開く
   - **Secret key**（`sk_test_...`）→ サーバー専用。絶対に公開しない
   - Publishable key（`pk_test_...`）は今回の構成では不要です

> 本人確認・銀行口座の登録は、テスト決済では不要です（本番化のときだけ必要）。

---

## 手順2：シークレットキーをサーバーに設定する

`api/secrets.php` は **gitで追跡されません**（`.gitignore` 済み）。テンプレートからコピーして作成します。

```bash
cp api/secrets.example.php api/secrets.php
```

`api/secrets.php` を開き、テストキーを貼り付け:

```php
return array(
    // ↓ ダッシュボードでコピーした「sk_test_」で始まるテストキーを貼り付け
    'STRIPE_SECRET_KEY'     => 'ここにテストキーを貼る',
    'STRIPE_WEBHOOK_SECRET' => '', // 手順5で設定（任意）
);
```

> 環境変数 `STRIPE_SECRET_KEY` が使えるホストなら、そちらが優先されます。

---

## 手順3：サーバーにアップロード

`api/` フォルダ（`config.php` / `create-checkout-session.php` / `get-session.php` /
`webhook.php` / `.htaccess` / `secrets.php`）を、`index.html` と同じ階層にアップロードします。

```
（公開ディレクトリ）/
├── index.html
├── checkout.html
├── success.html
├── css/ js/ img/ ...
└── api/
    ├── config.php
    ├── create-checkout-session.php
    ├── get-session.php
    ├── webhook.php
    ├── .htaccess
    └── secrets.php   ← これだけは手動で作成・アップロード
```

**要件**: PHP（cURL拡張が有効。国内レンタルサーバーは標準で有効）。HTTPS推奨。

---

## 手順4：テスト決済で動作確認

1. サイトでプランを選び `checkout.html` へ進み、フォームを入力して送信
2. Stripeの決済ページにリダイレクトされる
3. テストカードで支払う:
   - カード番号 `4242 4242 4242 4242`
   - 有効期限：未来の任意の月年（例 12/34）／CVC：任意の3桁／郵便番号：任意
4. `success.html` に戻り、完了画面（実際の金額・メール）が表示されればOK
5. Stripeダッシュボード **Payments** に Test の支払いが記録されます

その他のテストカード: https://stripe.com/docs/testing

---

## 手順5（任意・推奨）：Webhook

決済完了をサーバーで確実に受け取り、将来 eSIM QR の自動発行・メール送信を行うための受け口です。

1. Stripe **Developers → Webhooks → Add endpoint**
2. URL: `https://あなたのドメイン/api/webhook.php`
3. イベント: `checkout.session.completed` を選択
4. 表示される **Signing secret**（`whsec_...`）を `api/secrets.php` の
   `STRIPE_WEBHOOK_SECRET` に設定
5. 現状 `webhook.php` は支払いをログに記録するだけ（QR発行はモック）。
   本番では `handle_checkout_completed()` 内のTODOに、eSIMプロバイダAPI連携と
   メール送信を実装します。

---

## 本番（ライブ）への切り替え

1. Stripeでアカウント有効化（事業者情報・銀行口座を登録）
2. **本番環境** の API keys（`sk_live_...`）を取得
3. `api/secrets.php` の `STRIPE_SECRET_KEY` を `sk_live_...` に差し替え
4. Webhookも本番用エンドポイントを作成し、`whsec_...` を更新
5. 価格（`api/config.php` の `gje_plans()`）が正しいか最終確認

> ⚠️ ライブキーでは実際に課金されます。まずは必ずテストモードで検証してください。

---

## 価格の編集

`api/config.php` の `gje_plans()` がサーバー側の正となる価格表です（USDの**セント**単位）。
表示価格（`js/checkout.js` / `index.html` の `data-jpy`）と整合させてください。

| plan id | 表示 | amount(セント) |
|---|---|---|
| city-10gb | $15.00 | 1500 |
| city-3gb | $12.00 | 1200 |
| city-unlim | $36.00 | 3600 |
| multi-10gb | $22.00 | 2200 |
| multi-3gb | $14.00 | 1400 |
| multi-unlim | $45.00 | 4500 |
