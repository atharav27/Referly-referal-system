
export const generateReferralCode = () => {
    return 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };
  