"use client";
import { PostService } from "@/services/posts-service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";


type DetailProps = {
    id: string;
}

const PostDetailCard = ({ id }: DetailProps) => {
    const detail = useQuery({
        queryKey: ['post_detail', id],
        queryFn: () => {
            if (!id) throw new Error('Invalid post id');
            return PostService.show(Number(id));
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
    });


    const renderSkeleton = () => (
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 bg-gray-200 animate-pulse" />
            <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4 mb-4">
                    <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
                    <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse mt-2 sm:mt-0" />
                </div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-4 bg-gray-200 rounded animate-pulse ${i === 1 ? 'w-5/6' : i === 2 ? 'w-4/6' : ''}`}
                        />
                    ))}
                </div>
                <div className="border-t pt-4 mt-6 flex justify-between">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100 flex justify-center p-4 sm:p-6 lg:p-10">
            {detail.isLoading ? renderSkeleton() : (
                <div className="card bg-base-100 w-96 shadow-sm">
                    <figure>
                        <img
                            src={detail.data?.data.cover ?? 'https://via.placeholder.com/400x200?text=No+Image'}
                            alt={detail.data?.data.title} />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{detail.data?.data.title}</h2>
                        <span className="text-sm">{detail.data?.data.create_date}</span>
                        <span className="text-sm">{detail.data?.data.is_published == 1 ? 'published' : 'draft'}</span>
                        <p>{detail.data?.data.content}</p>
                       
                    </div>
                </div>
            )}
        </div>
    );


}

export default PostDetailCard;

