'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const router = useRouter();
    const params = useParams();
    const token = params.token; // <- on récupère le token de l'URL
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post(`http://192.168.183.6:8000/api/password/reset-password/${token}`, {
                password,
            });

            if (response.status === 200) {
                setSuccessMessage(response.data.message);
                setPassword(''); // reset le champ après succès
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
                        <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
}