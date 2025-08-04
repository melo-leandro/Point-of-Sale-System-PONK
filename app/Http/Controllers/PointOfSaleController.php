<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PointOfSaleController extends Controller
{
    public function index()
    {

        return Inertia::render('PointOfSale', [
            
        ]);
    }
}
