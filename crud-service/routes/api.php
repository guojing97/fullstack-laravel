<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post("auth/signin", [\App\Http\Controllers\AuthController::class, "signIn"])->name('auth.signin');
Route::post("auth/signup", [\App\Http\Controllers\AuthController::class, "signUp"]);

Route::get('posts', [\App\Http\Controllers\PostController::class, 'index']);
Route::get('posts/{id}', [\App\Http\Controllers\PostController::class, 'show']);

Route::middleware(['jwt'])->group(function () {
    Route::prefix('posts')->group(function () {
        Route::post('/', [\App\Http\Controllers\PostController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\PostController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\PostController::class, 'destroy']);
    });
});
