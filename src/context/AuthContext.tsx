// קובץ הוק פיקטיבי (Mock) לטובת גרסת ה-Demo ללא שרת
export const useAuth = () => {
  return {
    user: { full_name: "Guest Reviewer", email: "guest@reviewer.com" },
    token: "mock-demo-token",
    isLoggedIn: true,
    login: async () => {},
    logout: () => {},
    signup: async () => {},
    deleteAccount: async () => {},
    editProfile: async () => {}
  };
};