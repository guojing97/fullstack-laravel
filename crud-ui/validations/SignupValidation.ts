import * as yup from 'yup'


export const signUpSchema = yup.object().shape({
    name: yup
        .string()
        .required('Name is required')
        .max(60, 'Name must be at most 60 characters long'),
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup
        .string()
        .required('Password is required'),
    re_password: yup
        .string()
        .required('Repeat Password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
    occupation: yup
        .string()
        .required('Occupation is required')
        .max(50, 'Occupation must be at most 50 characters long'),
});