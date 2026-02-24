'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'

interface AuthFormProps {
    type: 'login' | 'signup'
    onSubmit: (formData: FormData) => Promise<void> | void
}

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-3 px-4 bg-primary-blue hover:bg-primary-blue-hover text-white font-semibold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
        >
            {pending ? <Loader2 className="animate-spin mr-2" size={20} /> : label}
        </button>
    )
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false)

    const title = type === 'login' ? '다시 오신 것을 환영합니다' : '계정 만들기'
    const subtitle = type === 'login'
        ? '계정에 접속하기 위해 정보를 입력해주세요'
        : '새로운 계정을 만들고 시작해보세요'
    const buttonLabel = type === 'login' ? '로그인' : '회원가입'
    const toggleText = type === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'
    const toggleLink = type === 'login' ? '회원가입' : '로그인'
    const toggleHref = type === 'login' ? '/signup' : '/login'

    return (
        <div className="w-full max-w-[480px] p-8 rounded-2xl glass-card flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-2 text-center">{title}</h1>
            <p className="text-slate-400 mb-8 text-center">{subtitle}</p>

            <form action={onSubmit} className="w-full space-y-6">
                {type === 'signup' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300" htmlFor="full_name">이름</label>
                        <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            placeholder="홍길동"
                            required
                            className="w-full px-4 py-3 rounded-lg input-field"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300" htmlFor="email">이메일</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        className="w-full px-4 py-3 rounded-lg input-field"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-300" htmlFor="password">비밀번호</label>
                        {type === 'login' && (
                            <Link href="#" className="text-xs text-primary-blue hover:underline">
                                비밀번호를 잊으셨나요?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-3 rounded-lg input-field pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <SubmitButton label={buttonLabel} />
            </form>

            <div className="mt-8 text-sm text-center">
                <span className="text-slate-400">{toggleText} </span>
                <Link href={toggleHref} className="text-primary-blue hover:underline font-medium">
                    {toggleLink}
                </Link>
            </div>
        </div>
    )
}
