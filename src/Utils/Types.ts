export interface UserContextType {
    isAdmin: Boolean;
    setIsAdmin: (isAdmin: boolean) => void;
    username: string | null;
    setUsername: (username: string) => void;
}