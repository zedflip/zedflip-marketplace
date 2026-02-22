import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useListing } from '../hooks/useListings';
import { useAuth } from '../hooks/useAuth';
import { chatApi } from '../lib/api';
import ListingDetailComponent from '../components/listing/ListingDetail';
import ListingGrid from '../components/listing/ListingGrid';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listing, relatedListings, isLoading, error } = useListing(id!);
  const { isAuthenticated } = useAuth();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleContact = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!listing) return;

    setIsStartingChat(true);
    try {
      const response = await chatApi.startChat({ listingId: listing._id });
      navigate(`/messages?chat=${response.data.data?._id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsStartingChat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-zed-orange animate-spin" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-zed-text mb-4">Listing Not Found</h1>
        <p className="text-zed-text-muted mb-6">
          The listing you're looking for doesn't exist or has been removed.
        </p>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zed-text-muted hover:text-zed-text mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Listing Detail */}
      <ListingDetailComponent listing={listing} onContact={handleContact} />

      {/* Related Listings */}
      {relatedListings.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-zed-text mb-6">Similar Listings</h2>
          <ListingGrid listings={relatedListings} />
        </section>
      )}

      {/* Loading overlay for chat */}
      {isStartingChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-zed-orange animate-spin" />
            <span>Starting conversation...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetail;
