"use client"
import { showToast } from "@/lib/toast";
import { PostRequest } from "@/models/post_model";
import { GetToken } from "@/services/auth-service";
import { PostService } from "@/services/posts-service";
import { postSchema } from "@/validations/PostValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field, Formik, Form } from "formik";
import Link from "next/link";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PostDetailCard from "./detail-card";

type DetailProps = {
    id?: string;
}

const FormContainer = ({ id }: DetailProps) => {
    const router = useRouter();
    const token = GetToken()
    const [initialValue, setInitialValue] = useState<PostRequest>({
        title: '',
        content: '',
        is_published: false,
        create_date: '',
        cover: null,
    });

    const queryClient = useQueryClient();

    const detail = useQuery({
        queryKey: ['post_detail', id],
        queryFn: () => {
            if (!id) throw new Error('Invalid user id');
            return PostService.show(Number(id));
        },
        enabled: !!id,
    });
    const deleteData = useMutation({
        mutationFn: (id: number) => PostService.destroy(id),
        onSuccess: () => queryClient.invalidateQueries(),
    });

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure delete this data?',
            icon: 'warning',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteData.mutate(id);
                window.location.href = '/';
            }
        });
    };

    useEffect(() => {
        if (id && detail.isLoading) {
            Swal.fire({
                title: 'Loading...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        } else {
            Swal.close();
        }

        if (id) {
            if (detail.isError && detail.error) {
                Swal.close();
                const message = (detail.error as any)?.response?.data?.message || 'Failed to fetch data';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: message,
                }).then(() => {
                    window.location.href = '/';
                });
            } else if (detail.data) {
                setInitialValue(prev => ({
                    ...prev,
                    title: detail.data?.data.title,
                    content: detail.data?.data.content,
                    is_published: detail.data?.data.is_published,
                    create_date: detail.data?.data.create_date,
                    cover: null,
                }));
            }
        }

    }, [detail.data, detail.isError, detail.error, id]);

    const createOrUpdate = useMutation({
        mutationFn: (values: PostRequest) => {
            if (id) {
                return PostService.update(values, Number(id));
            }

            console.log(values);
            return PostService.store(values);
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: id ? 'updated successfully!' : 'created successfully!',
                timer: 1000,
                showConfirmButton: false,
            }).then(() => {
                window.location.href = '/';
            });
        },
        onError: (error: any) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops... !',
                text: error?.message || "An error occurred while saving.",
                timer: 1000,
                showConfirmButton: false,
            })
        },
    });

    if (!token) {
        return <PostDetailCard id={id || ''} />;
    }

    return (
        <div>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <Link href="/" className="btn btn-success ltr:ml-3 rtl:mr-3" >
                                Back
                            </Link>
                            <button onClick={()=>handleDelete(Number(id))} className="btn btn-secondary ltr:ml-3 rtl:mr-3" >
                                Delete
                            </button>
                            <Formik
                                enableReinitialize
                                initialValues={initialValue}
                                validationSchema={postSchema}
                                onSubmit={async (values) => {
                                    createOrUpdate.mutate(values);
                                }}>
                                {({ errors, submitCount, setFieldValue }) => (
                                    <Form>
                                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-5 mb-5">
                                            <div>
                                                <div className="mb-5">
                                                    <div className={submitCount ? (errors.title ? 'has-error' : 'has-success') : ''}>
                                                        <label htmlFor="name">Name <span className="text-red-500">*</span></label>
                                                        <Field
                                                            name="title"
                                                            type="text"
                                                            id="name"
                                                            placeholder="Enter Title"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        />
                                                        {submitCount ? errors.title ? (
                                                            <div className="text-danger mt-1">{errors.title}</div>
                                                        ) : (
                                                            <div className="text-success mt-1">Looks Good!</div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className={submitCount ? (errors.is_published ? 'has-error' : 'has-success') : ''}>
                                                        <label className="block text-sm font-medium mb-1">Publish ? <span className="text-red-500">*</span></label>
                                                        <Field name="is_published" as="select" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                            <option value="">Select</option>
                                                            <option value="1">Publish</option>
                                                            <option value="0">Draft</option>
                                                        </Field>
                                                        {submitCount ? errors.is_published ? (
                                                            <div className="text-danger mt-1">{errors.is_published}</div>
                                                        ) : (
                                                            <div className="text-success mt-1">Looks Good!</div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <div className={submitCount ? (errors.content ? 'has-error' : 'has-success') : ''}>
                                                        <label htmlFor="description">Description</label>
                                                        <Field
                                                            name="content"
                                                            as="textarea"
                                                            id="description"
                                                            placeholder="Enter Content"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        />
                                                        {submitCount ? errors.content ? (
                                                            <div className="text-danger mt-1">{errors.content}</div>
                                                        ) : (
                                                            <div className="text-success mt-1">Looks Good!</div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className={submitCount ? (errors.create_date ? 'has-error' : 'has-success') : ''}>
                                                        <label htmlFor="date">Date <span className="text-red-500">*</span></label>
                                                        <Field
                                                            name="create_date"
                                                            type="date"
                                                            id="date"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        />
                                                        {submitCount ? errors.create_date ? (
                                                            <div className="text-danger mt-1">{errors.create_date}</div>
                                                        ) : (
                                                            <div className="text-success mt-1">Looks Good!</div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className={submitCount ? (errors.cover ? 'has-error' : 'has-success') : ''}>
                                                        <label className="block text-sm font-medium mb-1">Cover</label>
                                                        <input
                                                            type="file"
                                                            accept=".png,.jpg,.jpeg,.webp"
                                                            onChange={(event) => {
                                                                const file = event.currentTarget.files?.[0] || null;
                                                                setFieldValue('cover', file);
                                                            }}

                                                        />
                                                        {submitCount ? errors.cover ? (
                                                            <div className="text-danger mt-1">{errors.cover}</div>
                                                        ) : (
                                                            <div className="text-success mt-1">Looks Good!</div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8 flex items-center justify-end">
                                            <button disabled={createOrUpdate.isPending} type="submit" className="btn btn-primary w-full">
                                                {createOrUpdate.isPending && (
                                                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 ltr:mr-3 rtl:ml-3 inline-block align-middle"></span>
                                                )}
                                                {createOrUpdate.isPending ? 'Saving...' : 'Save'}
                                            </button><br />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FormContainer;