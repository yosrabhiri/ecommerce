<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('provider')->default('local');
            $table->string('status')->default('pending');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('transaction_reference')->unique();
            $table->string('cardholder_name')->nullable();
            $table->string('card_brand')->nullable();
            $table->string('card_last_four', 4)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
