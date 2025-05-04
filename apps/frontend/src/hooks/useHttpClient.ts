import { useAuth } from '../contexts/AuthContext'
import { client } from './../api'


export const useHttpClient = () => {
    const { authClient, isAuthenticated } = useAuth();

    return isAuthenticated ? authClient : client;

}
