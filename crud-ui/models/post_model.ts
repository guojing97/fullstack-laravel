
export interface PostRequest {
    title: string;
    content: string;
    is_published: boolean;
    create_date: string;
    cover: File | null;
}

export interface PostResponse {
    id: number;
    title: string;
    content: string;
    is_published: boolean;
    create_date: string;
    cover: string | null;
    user_id: number;
}