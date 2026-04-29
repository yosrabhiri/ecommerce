<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendOrderEmail implements ShouldQueue
{
    public function handle(OrderCreated $event): void
    {
        $order = $event->order->loadMissing('user');
        $email = $order->customer_email ?: $order->user?->email;

        if (! $email) {
            return;
        }

        Mail::raw(
            "Your order #{$order->order_number} was created successfully.\n\nTotal: {$order->total}\n\nThank you for your purchase.",
            function ($message) use ($order, $email) {
                $message->to($email)
                    ->subject("Order confirmation #{$order->order_number}");
            }
        );
    }
}
