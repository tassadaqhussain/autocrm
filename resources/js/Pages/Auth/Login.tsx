import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@crm.com',
        password: 'password',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen font-sans text-gray-900 antialiased">
            <Head title="Log in" />

            {/* Left Side: Illustration/Message */}
            <div className="relative hidden w-0 flex-1 lg:block">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/images/login-bg.png"
                    alt="CRM background"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex flex-col items-start justify-center px-16 text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight">CRM<span className="text-indigo-300">Auto</span></span>
                    </div>
                    <h1 className="text-5xl font-extrabold max-w-lg leading-tight mb-6">
                        Streamline your <span className="text-indigo-300 italic">clinic operations</span> with ease.
                    </h1>
                    <p className="text-xl text-indigo-50 max-w-md font-light leading-relaxed">
                        Experience the next generation of patient relationship management. Powerful, intuitive, and designed for growth.
                    </p>

                    <div className="mt-12 flex items-center gap-4 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/10">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} className="w-8 h-8 rounded-full border-2 border-indigo-900/50" src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                            ))}
                        </div>
                        <p className="text-sm font-medium text-indigo-100">Joined by 500+ clinic managers</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-32 bg-slate-50">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <ShieldCheck className="w-8 h-8 text-indigo-600" />
                        <span className="text-2xl font-bold text-gray-900">CRM Auto</span>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="font-medium text-indigo-600 hover:text-indigo-500">
                                Start your 14-day free trial
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        {status && (
                            <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-600 border border-green-100 animate-pulse">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email Address" className="text-gray-700 font-semibold mb-1" />
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="block w-full pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="name@clinic.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-semibold mb-1" />
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                                        >
                                            Forgot?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="block w-full pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all shadow-sm"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData(
                                            'remember',
                                            (e.target.checked || false) as false,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 font-medium cursor-pointer">
                                    Keep me signed in
                                </label>
                            </div>

                            <div>
                                <PrimaryButton
                                    className="group relative flex w-full justify-center rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
                                    disabled={processing}
                                >
                                    Log in
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer simple link */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} CRM Auto. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
