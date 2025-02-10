
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import { supabase } from './src/lib/supabase';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  return (
    <NavigationContainer>
      {session ? <Text>Bienvenue ! (Ajoute ton AppNavigator ici)</Text> : <AuthNavigator />}
    </NavigationContainer>
  );
}
