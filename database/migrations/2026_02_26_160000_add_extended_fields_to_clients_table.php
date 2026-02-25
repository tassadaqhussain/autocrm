<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            // Account details
            $table->string('salutation', 20)->nullable()->after('clinic_id');
            $table->string('country', 100)->nullable()->after('mobile');
            $table->string('gender', 20)->nullable()->after('country');
            $table->string('language', 50)->nullable()->after('gender');
            $table->string('client_category', 100)->nullable()->after('language');
            $table->string('client_sub_category', 100)->nullable()->after('client_category');
            $table->boolean('login_allowed')->default(false)->after('client_sub_category');
            $table->boolean('email_notifications')->default(true)->after('login_allowed');

            // Company details
            $table->string('company_name')->nullable()->after('email_notifications');
            $table->string('official_website')->nullable()->after('company_name');
            $table->string('tax_name')->nullable()->after('official_website');
            $table->string('gst_vat_number', 50)->nullable()->after('tax_name');
            $table->string('office_phone', 20)->nullable()->after('gst_vat_number');
            $table->string('city', 100)->nullable()->after('office_phone');
            $table->string('state', 100)->nullable()->after('city');
            $table->string('postal_code', 20)->nullable()->after('state');
            $table->foreignId('added_by_user_id')->nullable()->after('postal_code')->constrained('users')->nullOnDelete();
            $table->text('company_address')->nullable()->after('added_by_user_id');
            $table->text('shipping_address')->nullable()->after('company_address');
            $table->text('note')->nullable()->after('shipping_address');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropForeign(['added_by_user_id']);
            $table->dropColumn([
                'salutation',
                'country',
                'gender',
                'language',
                'client_category',
                'client_sub_category',
                'login_allowed',
                'email_notifications',
                'company_name',
                'official_website',
                'tax_name',
                'gst_vat_number',
                'office_phone',
                'city',
                'state',
                'postal_code',
                'added_by_user_id',
                'company_address',
                'shipping_address',
                'note',
            ]);
        });
    }
};

