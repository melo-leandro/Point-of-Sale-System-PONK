<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Redirecionar página inicial para login
Route::get('/', function () {
    return redirect()->route('login');
});

// Apenas tela de login
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
