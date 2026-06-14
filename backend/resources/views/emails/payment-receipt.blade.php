<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment receipt</title>
</head>
<body style="margin:0;background:#f6f1eb;color:#4d4841;font-family:Arial,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:28px 18px;">
        <div style="background:#fffdf9;border:1px solid #e8e3dc;border-radius:10px;overflow:hidden;">
            <div style="padding:24px 26px;background:#fbefec;border-bottom:1px solid #e8e3dc;">
                <p style="margin:0 0 6px;color:#b77b71;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Maison Glow</p>
                <h1 style="margin:0;color:#4d4841;font-size:26px;">Payment confirmed</h1>
                <p style="margin:10px 0 0;color:#817b73;font-size:14px;">Order {{ $order->order_number }}</p>
            </div>

            <div style="padding:24px 26px;">
                <p style="margin:0 0 18px;color:#4d4841;font-size:15px;line-height:1.5;">
                    Thank you for your order. Your payment was accepted and your receipt is below.
                </p>

                <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                    <tr>
                        <td style="padding:9px 0;color:#817b73;border-bottom:1px solid #e8e3dc;">Total paid</td>
                        <td style="padding:9px 0;text-align:right;color:#4d4841;font-weight:700;border-bottom:1px solid #e8e3dc;">${{ number_format((float) $order->total, 2) }}</td>
                    </tr>
                    @if ($payment)
                        <tr>
                            <td style="padding:9px 0;color:#817b73;border-bottom:1px solid #e8e3dc;">Transaction</td>
                            <td style="padding:9px 0;text-align:right;color:#4d4841;font-weight:700;border-bottom:1px solid #e8e3dc;">{{ $payment->transaction_reference }}</td>
                        </tr>
                        <tr>
                            <td style="padding:9px 0;color:#817b73;border-bottom:1px solid #e8e3dc;">Card</td>
                            <td style="padding:9px 0;text-align:right;color:#4d4841;font-weight:700;border-bottom:1px solid #e8e3dc;">{{ $payment->card_brand }} **** {{ $payment->card_last_four }}</td>
                        </tr>
                    @endif
                </table>

                <h2 style="margin:0 0 10px;color:#4d4841;font-size:17px;">Items</h2>
                @foreach ($order->items as $item)
                    <div style="display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid #e8e3dc;font-size:14px;">
                        <span>{{ $item->product_name }} x {{ $item->quantity }}</span>
                        <strong>${{ number_format((float) $item->line_total, 2) }}</strong>
                    </div>
                @endforeach

                <p style="margin:22px 0 0;color:#817b73;font-size:12px;line-height:1.5;">
                    Demo receipt: this project simulates payment confirmation for presentation purposes and does not charge real money.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
