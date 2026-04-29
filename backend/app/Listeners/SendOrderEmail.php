<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendOrderEmail implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderCreated $event): void
    {
        $order = $event->order;

        Mail::raw(
            "Votre commande #{$order->order_number} a été créée avec succès.\n\nTotal: {$order->total}€\n\nMerci pour votre achat !",
            function ($message) use ($order) {
                $message->to($order->customer_email)
                        ->subject("Confirmation de commande #{$order->order_number}");
            }
        );
    }
}
