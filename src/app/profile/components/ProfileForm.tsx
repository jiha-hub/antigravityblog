'use client'

import { useActionState } from 'react'
import { updateProfile } from '../actions'
import { ProfileState } from '../actions'

const AVATAR_OPTIONS = [
    '🧑‍💻', '👩‍💻', '🧑‍🎨', '👨‍🎨', '🧑‍🔬', '👩‍🔬',
    '🧑‍🏫', '👨‍🏫', '🧑‍💼', '👩‍💼', '🦸', '🦹',
    '🐱', '🐶', '🦊', '🐼', '🐨', '🐸',
    '🌟', '🔥', '💡', '🚀', '🎯', '⚡',
]

const JOB_OPTIONS = [
    '프론트엔드 개발자', '백엔드 개발자', '풀스택 개발자',
    'AI/ML 엔지니어', '데이터 사이언티스트', 'DevOps 엔지니어',
    'UI/UX 디자이너', '기획자 / PM', '학생', '기타',
]

interface ProfileFormProps {
    initialData: {
        full_name: string | null
        job: string | null
        avatar_url: string | null
    } | null
}

const initialState: ProfileState = { message: null, error: false }

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const [state, formAction] = useActionState(updateProfile, initialState)
    const currentAvatar = initialData?.avatar_url || '🧑‍💻'

    return (
        <form action={formAction} className="space-y-8">
            {/* 상태 메시지 */}
            {state.message && (
                <div className={`rounded-xl px-4 py-3 text-sm font-medium ${state.error
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                    {state.message}
                </div>
            )}

            {/* 아이콘 선택 */}
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300">
                    프로필 아이콘
                </label>
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 border border-border text-4xl">
                        {currentAvatar}
                    </div>
                    <p className="text-xs text-slate-500">아래에서 아이콘을 선택하세요</p>
                </div>
                <div className="grid grid-cols-8 gap-2 sm:grid-cols-12">
                    {AVATAR_OPTIONS.map((emoji) => (
                        <label key={emoji} className="cursor-pointer">
                            <input
                                type="radio"
                                name="avatar_url"
                                value={emoji}
                                defaultChecked={currentAvatar === emoji}
                                className="sr-only peer"
                            />
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xl transition-all hover:bg-slate-700 peer-checked:bg-primary-blue peer-checked:ring-2 peer-checked:ring-blue-400">
                                {emoji}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* 닉네임 */}
            <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-semibold text-slate-300">
                    닉네임 <span className="text-red-400">*</span>
                </label>
                <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    defaultValue={initialData?.full_name || ''}
                    placeholder="사용할 닉네임을 입력하세요"
                    required
                    maxLength={30}
                    className="w-full rounded-xl border border-border bg-slate-900/50 px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-slate-500 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                />
            </div>

            {/* 직업군 */}
            <div className="space-y-2">
                <label htmlFor="job" className="block text-sm font-semibold text-slate-300">
                    직업군
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {JOB_OPTIONS.map((job) => (
                        <label key={job} className="cursor-pointer">
                            <input
                                type="radio"
                                name="job"
                                value={job}
                                defaultChecked={initialData?.job === job}
                                className="sr-only peer"
                            />
                            <div className="flex items-center justify-center rounded-xl border border-border bg-slate-900/50 px-3 py-2.5 text-xs font-medium text-slate-400 transition-all hover:border-blue-500/50 hover:text-slate-200 peer-checked:border-primary-blue peer-checked:bg-primary-blue/10 peer-checked:text-blue-300">
                                {job}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className="w-full rounded-xl bg-primary-blue py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-primary-blue-hover active:scale-95"
            >
                저장하기
            </button>
        </form>
    )
}
