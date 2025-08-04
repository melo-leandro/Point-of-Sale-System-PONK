<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Caixa;

class UserObserver
{
    public function created(User $user)
    {
        try{
            DB::beginTransaction();
            $caixa = Caixa::create([
                'user_id' => $user->id,
                'aberto' => false,
                'saldo_inicial' => 0
            ]);

            $user->update(['caixa_id' => $caixa->id]);

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            logger()->error('Falha ao criar caixa para usuário: ' . $e->getMessage());
            $user->delete();
            throw $e;
        }
    }
}
