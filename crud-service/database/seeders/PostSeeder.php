<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::insert([
            [
                "title"         => "First Post",
                "content"       => "This is the content of the first post.",
                "cover"         => "/posts/cover1.webp",
                "user_id"       => 1,
                "is_published" => true,
                "create_date"  => "2023-01-15",
            ],
            [
                "title"         => "Second Post",
                "content"       => "This is the content of the second post.",
                "cover"         => "/posts/cover2.webp",
                "user_id"       => 1,
                "is_published" => false,
                "create_date"  => "2023-02-20",
            ],
        ]);
    }
}
