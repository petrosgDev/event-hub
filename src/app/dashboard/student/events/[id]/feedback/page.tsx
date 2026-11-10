'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', params.id],
    queryFn: async () => {
      const res = await api.get(`/events/${params.id}`);
      return res.data.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/events/${params.id}/feedback`, { rating, comment });
    },
    onSuccess: () => {
      toast.success('Thank you for your feedback!');
      queryClient.invalidateQueries({ queryKey: ['event', params.id] });
      router.push('/dashboard/student/events');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    submitMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/student/events`}>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Event Feedback</h1>
          <p className="text-muted-foreground">Share your experience to help organizers improve.</p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">{event?.title}</CardTitle>
          <CardDescription>How was the event?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center mt-6">
            
            {/* Star Rating */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-2 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-12 h-12 transition-colors duration-200 ${
                      star <= (hoverRating || rating) 
                        ? 'fill-orange-400 text-orange-400' 
                        : 'text-muted-foreground/30'
                    }`} 
                  />
                </button>
              ))}
            </div>

            <div className="w-full space-y-3">
              <label htmlFor="comment" className="block text-sm font-medium text-left">
                Additional Comments (Optional)
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like? What could be better?"
                className="flex w-full rounded-md border bg-white/5 border-white/10 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-md" 
              disabled={submitMutation.isPending || rating === 0}
            >
              {submitMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {submitMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
