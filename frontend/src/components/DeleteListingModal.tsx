import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { listingApi } from '../lib/api';
import toast from 'react-hot-toast';

interface DeleteListingModalProps {
  listingId: string;
  listingTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteListingModal = ({ listingId, listingTitle, onClose, onSuccess }: DeleteListingModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await listingApi.delete(listingId);
      toast.success('Listing deleted successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete listing');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" disabled={isDeleting}>
          <X className="w-6 h-6" />
        </button>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Delete Listing?</h2>
        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">"{listingTitle}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50" disabled={isDeleting}>Cancel</button>
          <button onClick={handleDelete} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center">
            {isDeleting ? <><Loader2 className="animate-spin h-5 w-5 mr-2" />Deleting...</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListingModal;
