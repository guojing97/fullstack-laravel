import PostDetailCard from "@/containers/posts/detail-card";
import FormContainer from "@/containers/posts/form-container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Update Post",
    description: "Update post page",
};


type Props = {
    params: { id: string };
};

const DetailPage = async ({ params }: Props) => {
    const { id } = await params;

    return (
        <div className="p-6">
            <FormContainer id={id} />
        </div>)
}

export default DetailPage;