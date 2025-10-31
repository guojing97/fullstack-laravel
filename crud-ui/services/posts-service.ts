import api from "@/lib/axios";
import { PostRequest } from "@/models/post_model";

export const PostService = {
    list: async (payload: GlobalInterface) => {
        const response = await api.get(`/posts`, { params: payload });
        return response.data;
    },
    show: async (id: number) => {
        try {
            const response = await api.get(`/posts/${id}`);
            return response.data;
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || 'Failed to fetch post data';
            throw new Error(errorMessage);
        }
    },
    store: async (payload: PostRequest) => {
        try {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const todayStr = `${yyyy}-${mm}-${dd}`;

            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('content', payload.content);
            formData.append('is_published', String(payload.is_published || 0));
            formData.append('create_date', payload.create_date || todayStr);
            if (payload.cover) {
                formData.append('cover', payload.cover); // must match your backend field name
            }

            const response = await api.post(`/posts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || 'Failed to add post';
            throw new Error(errorMessage);
        }
    },
    update: async (payload: PostRequest, id: number) => {
        try {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const todayStr = `${yyyy}-${mm}-${dd}`;

            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('content', payload.content);
            formData.append('is_published', String(payload.is_published || 0));
            formData.append('create_date', payload.create_date || todayStr);
            if (payload.cover) {
                formData.append('cover', payload.cover); // must match your backend field name
            }

            const response = await api.post(`/posts/${id}?_method=put`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || 'Failed to update post';
            throw new Error(errorMessage);
        }
    },
    destroy: async (id: number) => {
        const response = await api.delete(`/posts/${id}`);
        return response.data
    }
}