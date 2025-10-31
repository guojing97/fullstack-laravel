import * as yup from 'yup';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

export const postSchema = yup.object().shape({
    title: yup
        .string()
        .required('Title is required')
        .max(50, 'Title must be at most 50 characters long'),
    is_published: yup
        .boolean()
        .required("published is required"),
    create_date: yup
        .date()
        .required("create date is required"),
    content: yup
        .string()
        .required('content is required')
        .max(100, 'Content must be at most 100 characters long'), // <- fixed label
    cover: yup
        .mixed()
        .nullable()
        .test('fileSize', 'File too large. Max 10MB.', value => {
            if (!value) return true;
            return value instanceof File && value.size <= MAX_FILE_SIZE;
        })
        .test('fileType', 'Unsupported file format. Use JPG, PNG, WEBP.', value => {
            if (!value) return true;
            return value instanceof File && SUPPORTED_FORMATS.includes(value.type);
        }),
});
