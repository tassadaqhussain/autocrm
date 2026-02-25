import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

interface Props {
    token: string;
    invitation: { domain: string | null };
}

export default function Accept({ token, invitation }: Props) {
    const registerUrl = route('register') + '?invitation=' + encodeURIComponent(token);

    return (
        <GuestLayout>
            <Head title="Accept invitation" />
            <div className="space-y-6 text-center">
                <h1 className="text-xl font-semibold text-slate-900">You're invited</h1>
                <p className="text-sm text-slate-600">
                    Use the link below to complete your registration and join the organization.
                </p>
                <Link
                    href={registerUrl}
                    className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Complete registration
                </Link>
            </div>
        </GuestLayout>
    );
}
