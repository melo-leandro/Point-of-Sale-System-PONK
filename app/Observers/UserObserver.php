<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Caixa;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserObserver
{
    public function created(User $user)
    {
        try {
            DB::beginTransaction();
            $caixa = Caixa::create([
                'user_id' => $user->id,
                'aberto' => true,
                'saldo_inicial' => 0,
                'status_alterado_em' => now('GMT-3')
            ]);

            DB::commit();
            Log::info("Caixa {$caixa->id} criado com sucesso para o usuário {$user->id}");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Falha ao criar caixa para usuário: ' . $e->getMessage());
            $user->delete();
            throw $e;
        }
    }
}
