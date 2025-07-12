
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Share2, Trash2, Users, User, Loader2 } from 'lucide-react';
import { useShareWallet, useSharedWallets, useRemoveSharedAccess } from '@/hooks/useSharedWallets';

interface ShareWalletDialogProps {
  walletId: string;
  walletName: string;
}

export const ShareWalletDialog = ({ walletId, walletName }: ShareWalletDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const { data: sharedAccess = [] } = useSharedWallets(walletId);
  const shareWallet = useShareWallet();
  const removeAccess = useRemoveSharedAccess();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) return;

    try {
      await shareWallet.mutateAsync({ 
        walletId, 
        userEmail: userEmail.trim() 
      });
      setUserEmail('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleRemoveAccess = async (sharedWalletId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus akses ini?')) {
      await removeAccess.mutateAsync(sharedWalletId);
    }
  };

  const userAccess = sharedAccess.filter(access => access.role === 'user') || [];

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
            Bagikan dompet "{walletName}" dengan pengguna lain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share Form */}
          <form onSubmit={handleShare} className="space-y-3">
            <div>
              <Label htmlFor="userEmail">Nama Lengkap atau Email Pengguna</Label>
              <Input
                id="userEmail"
                type="text"
                placeholder="Contoh: John Doe atau john@email.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan nama lengkap yang persis sama dengan yang terdaftar di aplikasi, atau email pengguna
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={shareWallet.isPending}
            >
              {shareWallet.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Membagikan...
                </>
              ) : (
                'Bagikan Dompet'
              )}
            </Button>
          </form>

          {/* Current Shared Access */}
          {userAccess.length > 0 && (
            <div className="space-y-3">
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Pengguna yang Memiliki Akses</h4>
                <div className="space-y-2">
                  {userAccess.map((access) => (
                    <div key={access.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {access.profiles?.full_name || 'Pengguna'}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {access.role === 'user' ? 'Dapat Transaksi' : access.role}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAccess(access.id)}
                        disabled={removeAccess.isPending}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        {removeAccess.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {userAccess.length === 0 && (
            <div className="text-center py-4 text-gray-500 border-t">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Belum ada pengguna yang memiliki akses</p>
              <p className="text-xs mt-1">
                Pengguna yang dibagikan dapat menambah dan mengedit transaksi
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
