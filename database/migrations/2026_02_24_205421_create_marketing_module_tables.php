<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Influencers
        Schema::create('marketing_influencers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('handle')->nullable(); // Social media handle
            $table->string('platform')->nullable(); // Instagram, TikTok, etc.
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('Active');
            $table->timestamps();
        });

        // Lead Sources (Source Management)
        Schema::create('marketing_lead_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g. Facebook Ads, Google Ads, WhatsApp Official
            $table->string('channel'); // Digital, Offline, Social, Messaging
            $table->string('tracking_number')->nullable(); // For call/WhatsApp tracking
            $table->json('attribution_rules')->nullable(); // How to identify this source
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Campaign Budgets & Expenses
        Schema::create('marketing_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->foreignId('campaign_id')->nullable()->constrained('campaigns')->onDelete('set null');
            $table->string('title');
            $table->decimal('amount', 12, 2);
            $table->date('expense_date');
            $table->string('category')->nullable(); // Ad Spend, Influencer Fee, Production, etc.
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Media & Creatives
        Schema::create('marketing_creatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinic_id')->constrained()->onDelete('cascade');
            $table->foreignId('campaign_id')->nullable()->constrained('campaigns')->onDelete('set null');
            $table->string('name');
            $table->string('type'); // Image, Video, Carousel, Text
            $table->string('url');
            $table->string('thumbnail_url')->nullable();
            $table->string('status')->default('Active');
            $table->timestamps();
        });

        // Update Campaigns table
        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('channel')->nullable()->after('type'); // Ads, WhatsApp, Influencer, Referral, Offline
            $table->foreignId('assigned_manager_id')->nullable()->after('clinic_id')->constrained('users')->onDelete('set null');
        });

        // Update Leads table for Attribution
        Schema::table('leads', function (Blueprint $table) {
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_term')->nullable();
            $table->string('utm_content')->nullable();
            $table->string('attribution_method')->nullable(); // UTM, Tracking Number, Direct
            $table->foreignId('influencer_id')->nullable()->constrained('marketing_influencers')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropForeign(['influencer_id']);
            $table->dropColumn(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'attribution_method', 'influencer_id']);
        });

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropForeign(['assigned_manager_id']);
            $table->dropColumn(['channel', 'assigned_manager_id']);
        });

        Schema::dropIfExists('marketing_creatives');
        Schema::dropIfExists('marketing_expenses');
        Schema::dropIfExists('marketing_lead_sources');
        Schema::dropIfExists('marketing_influencers');
    }
};
