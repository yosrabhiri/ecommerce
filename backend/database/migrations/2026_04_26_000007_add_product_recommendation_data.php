<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('material')->nullable();
            $table->string('skin_type')->nullable();
            $table->string('skin_concern')->nullable();
            $table->string('occasion')->nullable();
            $table->json('product_tags')->nullable();
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('sku')->nullable()->unique();
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->timestamps();

            $table->index(['size']);
            $table->index(['color']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'material',
                'skin_type',
                'skin_concern',
                'occasion',
                'product_tags',
            ]);
        });
    }
};
