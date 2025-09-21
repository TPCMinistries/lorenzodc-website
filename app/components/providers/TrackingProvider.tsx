'use client';

interface TrackingProviderProps {
  children: React.ReactNode;
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  linkedInInsightId?: string;
}

export default function TrackingProvider({
  children,
  facebookPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  linkedInInsightId = process.env.NEXT_PUBLIC_LINKEDIN_INSIGHT_ID
}: TrackingProviderProps) {
  // Temporarily disabled for deployment
  return <>{children}</>;
}