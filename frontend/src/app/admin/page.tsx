"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  // Vérifie si l'utilisateur est admin
  const checkAdmin = async () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.roles !== "admin") {
        router.push("/login");
      }
    } catch (err) {
      console.error("Erreur lors du décodage du token :", err);
      router.push("/login");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://192.168.183.6:8000/api/auth/users", {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Erreur fetch users :", err);
    }
  };

  const handleBan = async (id) => {
    await fetch(`http://192.168.183.6:8000/api/auth/ban/${id}`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchUsers(); // refresh
  };

  const handleUnban = async (id) => {
    await fetch(`http://192.168.183.6:8000/api/auth/unban/${id}`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchUsers(); // refresh
  };

  const handleDelete = async (id) => {
    await fetch(`http://192.168.183.6:8000/api/auth/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchUsers(); // refresh
  };

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Panneau d'administration</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="">
          <tr>
            <th className="p-2 border">Nom d'utilisateur</th>
            <th className="p-2 border">Rôle</th>
            <th className="p-2 border">Banni</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">{user.banned ? "Oui" : "Non"}</td>
              <td className="p-2 border space-x-2">
                {user.role !== "admin" ? (
                  !user.banned ? (
                    <button
                      onClick={() => handleBan(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Bannir
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnban(user._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Débannir
                    </button>
                  )
                ) : (
                  <span className="text-gray-400">Admin protégé</span>
                )}
                {user.role !== "admin" && (
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded"
                  >
                    Supprimer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}