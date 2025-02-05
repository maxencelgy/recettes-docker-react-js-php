import React, { useState, useEffect } from 'react';

function App() {
    const [tab, setTab] = useState(0);
    const [recettes, setRecettes] = useState([]);
    const [users, setUsers] = useState([]);
    const [newRecipe, setNewRecipe] = useState({ nom: '', description: '' });
    const [newUser, setNewUser] = useState({ name: '', email: '' });

    useEffect(() => {
        fetchRecettes();
        fetchUsers();
    }, []);

    const fetchRecettes = async () => {
        try {
            const res = await fetch('http://localhost:8000');
            const data = await res.json();
            setRecettes(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des recettes', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/users');
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs', error);
        }
    };

    const handleAddRecipe = async () => {
        try {
            const res = await fetch('http://localhost:8000', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecipe)
            });
            const added = await res.json();
            if (!added.error) {
                setRecettes([...recettes, added]);
                setNewRecipe({ nom: '', description: '' });
            } else {
                console.error("Erreur :", added.error);
            }
        } catch (error) {
            console.error('Erreur lors de l’ajout de la recette', error);
        }
    };

    const handleDeleteRecipe = async (id) => {
        try {
            const res = await fetch(`http://localhost:8000/?id=${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!result.error) {
                setRecettes(recettes.filter(recipe => Number(recipe.id) !== Number(id)));
            } else {
                console.error("Erreur lors de la suppression :", result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la recette', error);
        }
    };

    const handleAddUser = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            const added = await res.json();
            if (!added.error) {
                setUsers([...users, added]);
                setNewUser({ name: '', email: '' });
            } else {
                console.error("Erreur :", added.error);
            }
        } catch (error) {
            console.error('Erreur lors de l’ajout de l’utilisateur', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!result.error) {
                setUsers(users.filter(user => Number(user.id) !== Number(id)));
                // Ne pas modifier l'état de l'onglet : reste sur le même onglet (Utilisateurs)
            } else {
                console.error("Erreur lors de la suppression :", result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l’utilisateur', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white py-4 shadow">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold">Recette App, Maxence Leguay</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="flex space-x-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${
                            tab === 0 ? "bg-blue-600 text-white" : "bg-white text-blue-600 border"
                        }`}
                        onClick={() => setTab(0)}
                    >
                        Recettes
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${
                            tab === 1 ? "bg-blue-600 text-white" : "bg-white text-blue-600 border"
                        }`}
                        onClick={() => setTab(1)}
                    >
                        Utilisateurs
                    </button>
                </div>

                {tab === 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Ajouter une Recette</h2>
                        <div className="mb-6 space-y-4 max-w-md">
                            <input
                                type="text"
                                placeholder="Nom"
                                className="w-full p-2 border rounded"
                                value={newRecipe.nom}
                                onChange={(e) => setNewRecipe({ ...newRecipe, nom: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                className="w-full p-2 border rounded"
                                value={newRecipe.description}
                                onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                            />
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={handleAddRecipe}
                            >
                                Ajouter Recette
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recettes.map((recipe, idx) => (
                                <div key={idx} className="p-4 bg-white rounded shadow flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{recipe.nom}</h3>
                                        <p className="text-sm text-gray-600">{recipe.description}</p>
                                    </div>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDeleteRecipe(recipe.id)}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 1 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Ajouter un Utilisateur</h2>
                        <div className="mb-6 space-y-4 max-w-md">
                            <input
                                type="text"
                                placeholder="Nom"
                                className="w-full p-2 border rounded"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 border rounded"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={handleAddUser}
                            >
                                Ajouter Utilisateur
                            </button>
                        </div>
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div key={user.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
