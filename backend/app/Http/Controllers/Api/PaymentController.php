<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\PaymentReceiptMail;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Throwable;

class PaymentController extends Controller
{
    public function store(Request $request, Order $order): JsonResponse
    {
        $user = AuthController::userFromBearerToken($request);

        if (! $user || $order->user_id !== $user->id) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'Order is already paid.'], 422);
        }

        $data = $request->validate([
            'cardholder_name' => ['required', 'string', 'max:255'],
            'card_number' => ['required', 'string', 'max:30'],
            'expiry' => ['required', 'regex:/^(0[1-9]|1[0-2])\/\d{2}$/'],
            'cvc' => ['required', 'string', 'regex:/^\d{3,4}$/'],
        ]);

        $cardNumber = preg_replace('/\D+/', '', $data['card_number']);

        if (! $this->passesLuhn($cardNumber)) {
            throw ValidationException::withMessages([
                'card_number' => 'The card number is invalid.',
            ]);
        }

        [$month, $year] = explode('/', $data['expiry']);
        $expiresAt = now()->setDate(2000 + (int) $year, (int) $month, 1)->endOfMonth();

        if ($expiresAt->isPast()) {
            throw ValidationException::withMessages([
                'expiry' => 'The card is expired.',
            ]);
        }

        $order = DB::transaction(function () use ($order, $data, $cardNumber) {
            $order->payments()->create([
                'provider' => 'local_demo',
                'status' => 'paid',
                'amount' => $order->total,
                'currency' => 'USD',
                'transaction_reference' => 'PAY-'.now()->format('Ymd').'-'.strtoupper(str()->random(8)),
                'cardholder_name' => $data['cardholder_name'],
                'card_brand' => $this->cardBrand($cardNumber),
                'card_last_four' => substr($cardNumber, -4),
                'paid_at' => now(),
            ]);

            $order->forceFill([
                'status' => 'confirmed',
                'payment_status' => 'paid',
                'payment_method' => 'card',
            ])->save();

            return $order->load(['items', 'payments']);
        });

        $receiptEmail = $order->customer_email ?: $user->email;

        if ($receiptEmail) {
            try {
                Mail::to($receiptEmail)->send(new PaymentReceiptMail($order));
                $order->setAttribute('receipt_email', $receiptEmail);
                $order->setAttribute('receipt_sent', true);
            } catch (Throwable $exception) {
                Log::warning('Payment receipt email could not be sent.', [
                    'order_id' => $order->id,
                    'email' => $receiptEmail,
                    'error' => $exception->getMessage(),
                ]);

                $order->setAttribute('receipt_email', $receiptEmail);
                $order->setAttribute('receipt_sent', false);
            }
        }

        return response()->json([
            'message' => 'Payment accepted. Receipt email generated.',
            'order' => $order,
        ], 201);
    }

    private function passesLuhn(string $number): bool
    {
        if (strlen($number) < 12 || strlen($number) > 19) {
            return false;
        }

        $sum = 0;
        $double = false;

        for ($i = strlen($number) - 1; $i >= 0; $i--) {
            $digit = (int) $number[$i];

            if ($double) {
                $digit *= 2;
                $digit = $digit > 9 ? $digit - 9 : $digit;
            }

            $sum += $digit;
            $double = ! $double;
        }

        return $sum % 10 === 0;
    }

    private function cardBrand(string $number): string
    {
        return match (true) {
            str_starts_with($number, '4') => 'Visa',
            preg_match('/^5[1-5]/', $number) === 1 => 'Mastercard',
            preg_match('/^3[47]/', $number) === 1 => 'American Express',
            default => 'Card',
        };
    }
}
