'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookie from 'js-cookie';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://192.168.183.6:8000/api/password/forgot-password', { email });

            if (response.status === 200) {
                setSuccessMessage(response.data.message); // <- ici on affiche le message
            }
        } catch (err) {
            setError("Une erreur est survenue. Veuillez réessayer.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Réinitialiser le mot de passe</h1>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Affichage des messages */}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg ${loading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'} text-white font-semibold`}
                    >
                        {loading ? 'En cours...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    );
};