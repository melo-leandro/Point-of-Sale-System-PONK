<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Limpeza e validação do CPF
        $cpfLimpo = preg_replace('/[^0-9]/', '', $request->cpf ?? '');
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'admin' => 'sometimes|boolean',
        ]);

        // Validação customizada do CPF
        if (strlen($cpfLimpo) !== 11) {
            throw ValidationException::withMessages([
                'cpf' => __('CPF deve conter exatamente 11 dígitos')
            ]);
        }

        // Verificar se o CPF já existe
        if (User::where('cpf', $cpfLimpo)->exists()) {
            throw ValidationException::withMessages([
                'cpf' => __('Este CPF já está cadastrado')
            ]);
        }

        $user = User::create([
            'name' => $request->name,
            'cpf' => $cpfLimpo,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'admin' => $request->boolean('admin', false), // Usa o valor do checkbox, padrão false
        ]);

        event(new Registered($user));

        // Remover o login automático - o usuário admin não deve ser deslogado
        // Auth::login($user);

        return redirect(route('dashboard', absolute: false))->with('success', 'Usuário criado com sucesso!');
    }
}
