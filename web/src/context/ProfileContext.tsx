import { createContext, ReactNode, useContext, useState } from "react";

interface ProfileContextProps {
  profilePicture: string | null;
  setProfilePicture: (profilePicture: string | null) => void;
}

interface ProfileProviderProps {
  children: ReactNode;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(
  undefined
);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  return (
    <ProfileContext.Provider value={{ profilePicture, setProfilePicture }}>
      {children}
    </ProfileContext.Provider>
  );
};
