
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email wajib diisi";
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Format email tidak valid";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password wajib diisi";
  }
  if (password.length < 8) {
    return "Password minimal 8 karakter";
  }
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName} wajib diisi`;
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (phone && !/^[0-9]{10,15}$/.test(phone.replace(/[^0-9]/g, ''))) {
    return "Nomor telepon tidak valid";
  }
  return null;
};

export const validateAmount = (amount: string): string | null => {
  if (!amount.trim()) {
    return "Jumlah wajib diisi";
  }
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return "Jumlah harus lebih dari 0";
  }
  return null;
};
