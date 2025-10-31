"use client"
import { GetToken } from "@/services/auth-service";
import ListCard from "./list-card";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PostService } from "@/services/posts-service";
import Link from "next/link";

const PostContainer = () => {
    const [token, setToken] = useState<string | null>(null)
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [recordsData, setRecordsData] = useState([]);
    const [search, setSearch] = useState('');
    const postsService = PostService;
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['posts', page, pageSize, debouncedSearch],
        queryFn: () => postsService.list({ page, per_page: pageSize, search: debouncedSearch }),
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        (async () => {
            const token = await GetToken();
            setToken(token);
        })();
    }, []);

    useEffect(() => {
        if (data) {
            setRecordsData(data.data);
        }
    }, [data]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <div className="max-w-7xl mx-auto p-3">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-bordered w-full max-w-xs"
                        value={search} onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="select select-bordered"
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        <option selected={pageSize === 10} value="10">10 per page</option>
                        <option selected={pageSize === 20} value="20">20 per page</option>
                        <option selected={pageSize === 50} value="50">50 per page</option>
                    </select>
                </div>

                {token && <Link href="/posts/create" className="btn">Add</Link>}
            </div>
            <ListCard isloading={isLoading} data={data?.data} />
            {data?.meta?.last_page > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="join">
                        <button
                            className="join-item btn"
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                        >
                            «
                        </button>
                        {data?.meta?.last_page && [...Array(data.meta.last_page)].map((_, index) => (
                            <button
                                key={index + 1}
                                className={`join-item btn ${page === index + 1 ? 'btn-active' : ''}`}
                                onClick={() => setPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="join-item btn"
                            onClick={() => setPage(prev => Math.min(data?.meta?.last_page || prev, prev + 1))}
                            disabled={page === data?.meta?.last_page}
                        >
                            »
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostContainer;