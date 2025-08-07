<?php
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Ponk\VendaController;
use App\Http\Controllers\Ponk\CaixaController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PointOfSaleController;
use App\Http\Controllers\StatusCaixaController;
use App\Http\Controllers\DashboardController;
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

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/pointOfSale', [PointOfSaleController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('pointOfSale');

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

Route::post('/vendas', [VendaController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('vendas.store');

Route::get('/caixas', [CaixaController::class, 'index'])->name('caixas.index');

Route::get('/caixas/{numeracao}', [CaixaController::class, 'show'])->name('caixa.show');

Route::post('/vendas/adicionar-item', [VendaController::class, 'adicionarItem'])
    ->middleware(['auth', 'verified'])
    ->name('vendas.adicionarItem');

Route::post('/pointOfSale/acoes/{acao}', [PointOfSaleController::class, 'acoesVenda'])
    ->name('pointOfSale.acoesVenda');

Route::get('/pointOfSale/acoes/{acao}', [PointOfSaleController::class, 'acoesVenda'])
    ->name('pointOfSale.acoesVendaGet');

Route::post('/statusCaixa/acoes/{acao}', [StatusCaixaController::class, 'acoesCaixa'])
    ->name('StatusCaixa.acoesCaixa');

    Route::get('/statusCaixa/pdf', [StatusCaixaController::class, 'gerarPdf'])
    ->name('statusCaixa.pdf');


require __DIR__.'/auth.php';
