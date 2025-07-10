
import { 
  Building, 
  Smartphone, 
  Wallet, 
  CreditCard, 
  Banknote,
  PiggyBank,
  Landmark,
  Phone
} from "lucide-react";

export const getWalletIcon = (type: string, name?: string) => {
  switch (type) {
    case 'bank':
      if (name?.toLowerCase().includes('bca')) return Building;
      if (name?.toLowerCase().includes('mandiri')) return Landmark;
      if (name?.toLowerCase().includes('bni')) return Building;
      if (name?.toLowerCase().includes('bri')) return Landmark;
      return Building;
    case 'e_wallet':
      if (name?.toLowerCase().includes('dana')) return Smartphone;
      if (name?.toLowerCase().includes('gopay')) return Phone;
      if (name?.toLowerCase().includes('ovo')) return Smartphone;
      if (name?.toLowerCase().includes('linkaja')) return Phone;
      if (name?.toLowerCase().includes('shopeepay')) return Smartphone;
      return Smartphone;
    case 'cash':
      return Banknote;
    case 'investment':
      return PiggyBank;
    default:
      return Wallet;
  }
};
