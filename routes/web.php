<?php
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\VendaController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatusCaixaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()){
        return Redirect::route('dashboard');
        return Redirect::route('dashboard');
    }

    return Redirect::route('login');
    return Redirect::route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/pointOfSale', function () {
    return Inertia::render('PointOfSale');
})->middleware(['auth', 'verified'])->name('pointOfSale');

Route::get('/statusCaixa', [StatusCaixaController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('StatusCaixa');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

});

Route::middleware('guest')->group(function () {
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

});

Route::middleware('guest')->group(function () {
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
});

Route::get('/vendas', [VendaController::class, 'index'])->name('vendas.index');

require __DIR__.'/auth.php';
