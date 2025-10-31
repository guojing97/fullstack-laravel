import PostDetailCard from "@/containers/posts/detail-card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Detalil Post",
    description: "Detail post page",
};


type Props = {
    params: { id: string };
};

const DetailPage = async ({ params }: Props) => {
    const { id } = await params;

    return (
        <div className="p-6">
            <PostDetailCard id={id} />
        </div>)
}

export default DetailPage;