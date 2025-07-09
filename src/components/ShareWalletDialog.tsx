
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Share2, Trash2, Users } from 'lucide-react';
import { useShareWallet, useSharedWallets, useRemoveSharedAccess } from '@/hooks/useSharedWallets';

interface ShareWalletDialogProps {
  walletId: string;
  walletName: string;
}

export const ShareWalletDialog = ({ walletId, walletName }: ShareWalletDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const { data: sharedAccess } = useSharedWallets(walletId);
  const shareWallet = useShareWallet();
  const removeAccess = useRemoveSharedAccess();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) return;

    try {
      await shareWallet.mutateAsync({ walletId, userEmail: userEmail.trim() });
      setUserEmail('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleRemoveAccess = async (sharedWalletId: string) => {
    await removeAccess.mutateAsync(sharedWalletId);
  };

  const userAccess = sharedAccess?.filter(access => access.role === 'user') || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Bagikan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Bagikan Dompet
          </DialogTitle>
          <DialogDescription>
            Bagikan dompet "{walletName}" dengan user lain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share Form */}
          <form onSubmit={handleShare} className="space-y-3">
            <div>
              <Label htmlFor="userEmail">Email atau Nama User</Label>
              <Input
                id="userEmail"
                type="text"
                placeholder="Masukkan email atau nama"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={shareWallet.isPending}
            >
              {shareWallet.isPending ? 'Membagikan...' : 'Bagikan Dompet'}
            </Button>
          </form>

          {/* Current Shared Access */}
          {userAccess.length > 0 && (
            <div className="space-y-3">
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">User yang Memiliki Akses</h4>
                <div className="space-y-2">
                  {userAccess.map((access) => (
                    <div key={access.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">User ID: {access.user_id.slice(0, 8)}...</p>
                          <Badge variant="secondary" className="text-xs">
                            {access.role}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAccess(access.id)}
                        disabled={removeAccess.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {userAccess.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Belum ada user yang memiliki akses</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
