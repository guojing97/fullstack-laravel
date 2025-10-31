"use client"
import { useEffect, useState } from "react";
import CardPost from "@/components/card/CardPost";
import { PostResponse } from "@/models/post_model";
import Link from "next/link";

const ListCard = (props: { isloading?: boolean, data?: PostResponse[] }) => {
    return <div>
        <>
            {props.isloading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, index) => (
                <div key={index} className="skeleton h-32 w-full"></div>
                ))}
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {props.data?.map((post, index) => (
                    <Link href={`/posts/${post.id}/update`}><CardPost
                        key={index}
                        source={post.cover ?? undefined}
                        title={post.title}
                        content={post.content}
                    /></Link>
                ))}
            </div>
            )}
        </>

    </div>;
};

export default ListCard;