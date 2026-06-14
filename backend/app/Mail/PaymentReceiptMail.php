<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentReceiptMail extends Mailable
{
    use Queueable, SerializesModels;

    public Order $order;

    public ?Payment $payment;

    public function __construct(Order $order)
    {
        $this->order = $order->loadMissing(['items', 'payments']);
        $this->payment = $this->order->payments->sortByDesc('created_at')->first();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Payment receipt for order {$this->order->order_number}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payment-receipt',
        );
    }
}
