<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();
            error_log('✅ Base de datos conectada correctamente (console.log desde Laravel).');
        } catch (\Exception $e) {
            error_log('❌ Error al conectar con la base de datos: ' . $e->getMessage());
        }
    }
}
