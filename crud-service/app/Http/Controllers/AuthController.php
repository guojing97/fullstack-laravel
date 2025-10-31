<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    public function signIn(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            $ip = $request->ip();
            $key = 'login-attempt:' . Str::lower($request->email) . '|' . $ip;

            if (RateLimiter::tooManyAttempts($key, 5)) {
                $seconds = RateLimiter::availableIn($key);
                return response()->json([
                    'message' => "Too many attempts. Try again in $seconds seconds."
                ], Response::HTTP_TOO_MANY_REQUESTS);
            }

            RateLimiter::hit($key, 60); // Simpan upaya gagal untuk 60 detik

            $validator = Validator::make($credentials, [
                'email'     => 'required|string|email',
                'password'  => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message'   => 'Validation failed',
                    'errors'    => $validator->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            if ($token = JWTAuth::attempt($credentials)) {
                $user = $request->user();
                RateLimiter::clear($key);

                return response()->json([
                    'message'       => 'success login',
                    'data'          => $user,
                    'exp'           => JWTAuth::factory()->getTTL() * 60 * 24 * 7,
                    'token'         => $token,
                ], Response::HTTP_OK);
            }

            return response()->json(['message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        } catch (\Throwable $th) {
            Log::error('Error during login: ' . $th->getMessage());
            return response()->json(['message' => 'An error occurred'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function signUp(Request $request)
    {
        try {
            $validatedData = Validator::make($request->all(), [
                'name'          => 'required|string|max:60',
                'email'         => 'required|email|max:30|unique:users,email',
                'password'      => 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',
                're_password'   => 'required|same:password',
                'occupation'    => 'nullable|string|max:50',
            ]);

            if ($validatedData->fails()) {
                return response()->json(['message' => 'Validation failed', 'messages' => $validatedData->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->occupation = $request->occupation ?? null;
          
            $user->save();

            $token = JWTAuth::fromUser($user);

              return response()->json([
                    'message'       => 'success register',
                    'data'          => $user,
                    'exp'           => JWTAuth::factory()->getTTL() * 60 * 24 * 7,
                    'token'         => $token,
                ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            Log::error('Error creating user: ' . $th->getMessage());
            return response()->json(['message' => 'Failed to create user'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
