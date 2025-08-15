import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { RegisterCredentials } from '../types';

const schema = yup.object({
    name: yup.string().trim().required('Tên là bắt buộc'),
    email: yup.string().trim().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: yup
        .string()
        .required('Mật khẩu là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/[A-Z]/, 'Phải chứa ít nhất 1 chữ in hoa')
        .matches(/[a-z]/, 'Phải chứa ít nhất 1 chữ thường')
        .matches(/[0-9]/, 'Phải chứa ít nhất 1 chữ số')
        .matches(/[@$!%*?&]/, 'Phải chứa ít nhất 1 ký tự đặc biệt'),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref('password')], 'Xác nhận mật khẩu không khớp')
        .required('Xác nhận mật khẩu là bắt buộc'),
}).required();

const RegisterForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterCredentials>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: RegisterCredentials) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await apiService.register(data);
            login(response.token, response.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-center text-3xl font-bold">Đăng ký tài khoản</h2>

                {error && <div className="bg-red-50 p-3 text-red-700 rounded">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            {...register('name')}
                            placeholder="Tên"
                            className={`w-full border p-2 rounded ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="Email"
                            className={`w-full border p-2 rounded ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="Mật khẩu"
                            className={`w-full border p-2 rounded ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <div>
                        <input
                            {...register('password_confirmation')}
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            className={`w-full border p-2 rounded ${errors.password_confirmation ? 'border-red-300' : 'border-gray-300'}`}
                        />
                        {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
