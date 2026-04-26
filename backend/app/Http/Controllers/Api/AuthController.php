<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\User;
use App\Models\UserAuthToken;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'cart_token' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        $this->attachCart($user, $data['cart_token'] ?? null);

        return response()->json($this->authPayload($user), 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'cart_token' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::query()->where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        $this->attachCart($user, $data['cart_token'] ?? null);

        return response()->json($this->authPayload($user));
    }

    public function me(Request $request): JsonResponse
    {
        $user = self::userFromBearerToken($request);

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json(['user' => $this->userPayload($user)]);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->bearerToken();

        if ($token) {
            UserAuthToken::query()
                ->where('token_hash', hash('sha256', $token))
                ->delete();
        }

        return response()->json(['message' => 'Signed out.']);
    }

    public static function userFromBearerToken(Request $request): ?User
    {
        $token = $request->bearerToken();

        if (! $token) {
            return null;
        }

        $authToken = UserAuthToken::query()
            ->with('user')
            ->where('token_hash', hash('sha256', $token))
            ->where(function ($query) {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->first();

        if (! $authToken) {
            return null;
        }

        $authToken->forceFill(['last_used_at' => now()])->save();

        return $authToken->user;
    }

    private function authPayload(User $user): array
    {
        $plainToken = Str::random(80);

        $user->authTokens()->create([
            'name' => 'web',
            'token_hash' => hash('sha256', $plainToken),
        ]);

        return [
            'token' => $plainToken,
            'user' => $this->userPayload($user),
        ];
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
        ];
    }

    private function attachCart(User $user, ?string $cartToken): void
    {
        if (! $cartToken) {
            return;
        }

        Cart::query()
            ->where('token', $cartToken)
            ->update(['user_id' => $user->id]);
    }
}
