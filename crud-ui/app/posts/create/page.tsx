import PostDetailCard from "@/containers/posts/detail-card";
import FormContainer from "@/containers/posts/form-container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Post",
    description: "Create post page",
};



const CreatePage = () => {

    return (
        <div className="p-6">
            <FormContainer />
        </div>)
}

export default CreatePage;