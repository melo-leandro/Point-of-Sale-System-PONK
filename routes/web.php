<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;

// Redirecionar página inicial baseado no status de autenticação
Route::get('/', function () {
    return Auth::check() ? redirect()->route('blank') : redirect()->route('login');
});

// Rotas de autenticação (apenas para usuários não autenticados)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Rotas protegidas
Route::middleware('auth')->group(function () {
    Route::get('/blank', function () {
        return view('blank');
    })->name('blank');
    
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
