"use client"
import { showToast } from "@/lib/toast";
import { LoginInput, SignupRequest } from "@/models/auth_model"
import { GetToken, SigninService, SignupService } from "@/services/auth-service";
import { signInSchema } from "@/validations/SigninValidation";
import { signUpSchema } from "@/validations/SignupValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query"
import { redirect, RedirectType, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const SignupContainer = () => {
    const router = useRouter();


    useEffect(() => {
        (async () => {
            const token = await GetToken();
            if (token) {
                router.replace('/');
            }
        })();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupRequest>({
        resolver: yupResolver(signUpSchema),
    })

    const mutation = useMutation({
        mutationFn: (data: SignupRequest) => SignupService(data),
        onSuccess: () => window.location.href = '/',
        onError: (err: any) => {
            const msg = err?.response?.data?.message || err.message || 'Login failed'
            showToast(msg, 'error')

        },
    })

    const onSubmit = (data: SignupRequest) => {
        mutation.mutate(data)
    }

    return <div>
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign up to your account
                        </h1>
                        <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="Password">Name</label>
                                </div>
                                <div className="relative text-white-dark">
                                    <input id="Name"  {...register('name')} type="text" placeholder="Name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="Username">Email</label>
                                <div className="relative text-white-dark">
                                    <input id="Username" {...register('email')} type="email" placeholder="Administrator" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="Password">Occupation</label>
                                </div>
                                <div className="relative text-white-dark">
                                    <input id="Occupation"  {...register('occupation')} type="text" placeholder="Occupation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                {errors.occupation && (
                                    <p className="text-sm text-red-500 mt-1">{errors.occupation.message}</p>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="Password">Password</label>
                                </div>
                                <div className="relative text-white-dark">
                                    <input id="Password"  {...register('password')} type="password" placeholder="Password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="Password">Re Password</label>
                                </div>
                                <div className="relative text-white-dark">
                                    <input id="Password"  {...register('re_password')} type="password" placeholder="Password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                {errors.re_password && (
                                    <p className="text-sm text-red-500 mt-1">{errors.re_password.message}</p>
                                )}
                            </div>

                            <button type="submit" disabled={mutation.isPending} className="rounded-md font-semibold btn btn-primary !mt-6 w-full border-0 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                {mutation.isPending && (
                                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-4 h-4 ltr:mr-3 rtl:ml-3 inline-block align-middle"></span>
                                )}
                                {mutation.isPending ? 'Logging in...' : 'Sign Un'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>;
}

export default SignupContainer;