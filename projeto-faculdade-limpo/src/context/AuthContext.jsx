import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config.js';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState([]);
  const [togglingFavoriteId, setTogglingFavoriteId] = useState(null); 
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async (uid) => {
      setIsFavoritesLoading(true);
      const userDocRef = doc(db, 'users', uid); 
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && docSnap.data().favorites) {
          setFavorites(docSnap.data().favorites);
        } else {
          setFavorites([]); 
        }
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
        setFavorites([]);
      }
      setIsFavoritesLoading(false);
    };
    
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchFavorites(user.uid);
      } else {
        setFavorites([]);
        setIsFavoritesLoading(false);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const toggleFavorite = async (bartenderId) => {
    if (!currentUser) return; // Não faz nada se não estiver logado

    setTogglingFavoriteId(bartenderId); // Ativa o loading para este card
    const userDocRef = doc(db, 'users', currentUser.uid);
    const isCurrentlyFavorite = favorites.includes(bartenderId);

    try {
      if (isCurrentlyFavorite) {
        // Remove
        await updateDoc(userDocRef, {
          favorites: arrayRemove(bartenderId)
        });
        setFavorites(prev => prev.filter(id => id !== bartenderId));
      } else {
        await setDoc(userDocRef, 
          { favorites: arrayUnion(bartenderId) },
          { merge: true }
        );
        setFavorites(prev => [...prev, bartenderId]);
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
      
    }
    
    setTogglingFavoriteId(null); 
  };

  const value = {
    currentUser,
    loading,
    favorites,
    isFavoritesLoading,
    toggleFavorite,
    togglingFavoriteId
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}