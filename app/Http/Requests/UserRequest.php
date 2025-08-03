public function rules()
{
    return [
        'nome' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'pin' => 'nullable|string|size:4' // Se for PIN de 4 dígitos
    ];
}