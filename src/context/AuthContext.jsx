import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config.js';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState([]);
  const [togglingFavoriteId, setTogglingFavoriteId] = useState(null); 
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        setIsFavoritesLoading(true);
        try {
       
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFavorites(data.favorites || []);
            setUserRole(data.role || null); 
          } else {
            setFavorites([]);
            setUserRole(null);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setFavorites([]);
          setUserRole(null);
        }
        setIsFavoritesLoading(false);
      } else {
        setFavorites([]);
        setUserRole(null);
        setIsFavoritesLoading(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const toggleFavorite = async (bartenderId) => {
    if (!currentUser) return; 

    setTogglingFavoriteId(bartenderId); 
    const userDocRef = doc(db, 'users', currentUser.uid);
    const isCurrentlyFavorite = favorites.includes(bartenderId);

    try {
      if (isCurrentlyFavorite) {
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
    userRole, 
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