<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        try {
            $data = Post::select('id', 'title', 'content', 'cover', 'user_id', 'is_published', 'create_date');

            if (request('search')) {
                $search = request('search');
                $data->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%");
                });
            }

            $perPage = request()->get("per_page") ?? 10;
            $data = $data->orderBy('create_date', 'asc')->paginate($perPage);

            // Make Collection URL for photo
            $data->getCollection()->transform(function ($item) {
                if ($item->cover) {
                    $item->cover = URL::to($item->cover); // turns /storage/... into full URL
                }
                return $item;
            });
            return response()->json($data, Response::HTTP_OK);
        } catch (\Throwable $th) {
            Log::error('Error fetching posts: ' . $th->getMessage());
            return response()->json(['message' => 'Failed to fetch posts'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        try {
            $post = Post::select(
                'posts.id',
                'posts.title',
                'posts.content',
                'posts.cover',
                'posts.user_id',
                'posts.is_published',
                'posts.create_date',
                'users.name as author_name',
            )
                ->where('posts.id', $id)
                ->leftJoin('users', 'users.id', '=', 'posts.user_id')
                ->first();

            if (!$post) {
                return response()->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
            }

            if ($post->cover) {
                $post->cover = URL::to($post->cover); // turns /storage/... into full URL
            }

            return response()->json([
                'message'   => 'success payload data',
                'data'      => $post,
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            Log::error('Error fetching asset details: ' . $th->getMessage());
            return response()->json(['message' => 'Failed to fetch post'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = Validator::make($request->all(), [
                'title'          => 'required|string|max:200|unique:posts,title',
                'content'        => 'required|string',
                'cover'          => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
                'is_published'   => 'boolean',
                'create_date'    => 'nullable|date',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors'  => $validatedData->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            DB::beginTransaction();

            $data = new Post();

            $data->title = $request->title;
            $data->content = $request->content;
            $data->user_id = $request->user()->id;
            $data->is_published = $request->is_published ?? false;
            $data->create_date = $request->create_date ?? null;

            // Only store the icon if file is uploaded
            if ($request->hasFile('cover')) {
                $path = $request->file('cover')->store('uploads/posts', 'public');
                $data->cover = Storage::url($path);
            }

            $data->save();

            DB::commit();

            return response()->json([
                'message' => 'Success to create',
            ], Response::HTTP_CREATED);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error save posts: ' . $e->getMessage() . ' file : ' . $e->getFile() . ' line : ' . $e->getLine());
            return response()->json(['message' => 'Failed to create posts'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $response = null;

        try {
            $validatedData = Validator::make($request->all(), [
                'title'          => 'required|string|max:200|unique:posts,title,' . $id,
                'content'        => 'required|string',
                'cover'          => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
                'is_published'   => 'boolean',
                'create_date'    => 'nullable|date',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors'  => $validatedData->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            DB::beginTransaction();

            $data = Post::findOrFail($id);

            if ($request->hasFile('cover')) {
                if ($data->cover && Storage::disk('public')->exists(str_replace('/storage/', '', $data->cover))) {
                    // Hapus file lama
                    Storage::disk('public')->delete(str_replace('/storage/', '', $data->cover));
                }

                // Upload baru
                $path = $request->file('cover')->store('uploads/posts', 'public');
                $data->cover = Storage::url($path);
            }

            $data->id = $id;
            $data->title = $request->title;
            $data->content = $request->content;
            $data->is_published = $request->is_published ?? $data->is_published;
            $data->create_date = $request->create_date ?? $data->create_date;
            $data->save();

            DB::commit();

            return response()->json([
                'message'   => 'success to update',
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            Log::error('Error found category: ' . $e->getMessage());
            return response()->json(['message' => 'Posts not found'], Response::HTTP_NOT_FOUND);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error fetching category: ' . $th->getMessage());
            return response()->json(['message' => 'Failed to update posts'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $data = Post::findOrFail($id);
            if ($data->cover && Storage::disk('public')->exists(str_replace('/storage/', '', $data->cover))) {
                // Hapus file lama
                Storage::disk('public')->delete(str_replace('/storage/', '', $data->cover));
            }
            $data->delete();

            return response()->json([
                'message' => 'success to delete',
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Error delete site: ' . $e->getMessage());
            return response()->json(['message' => 'Post not found'], Response::HTTP_NOT_FOUND);
        } catch (\Throwable $th) {
            Log::error('Error deleting role: ' . $th->getMessage());
            return response()->json(['message' => 'Failed to delete post'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
