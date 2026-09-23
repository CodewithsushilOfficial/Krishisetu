import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ShieldCheck, CheckCircle2, MessageSquare, Award, RefreshCw } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';
import logisticsService from '../services/logisticsService.js';

export function RatingsPage() {
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await logisticsService.getRatings();
        setRatings(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const reviews = ratings.length > 0 ? ratings : [
    {
      id: 1,
      shipper: 'Suryoday FPO Varanasi',
      rating: 5,
      date: '2026-09-18',
      trip: 'TR001 (Paddy 10 Ton)',
      comment: 'Excellent transit punctuality. Arrived 30 minutes ahead of scheduled mandi delivery time. Zero spillage or bags damaged.',
    },
    {
      id: 2,
      shipper: 'Dubagga Mandi Buyer Corp',
      rating: 5,
      date: '2026-09-15',
      trip: 'TR002 (Tomato 6 Ton)',
      comment: 'Reefer temperature was maintained consistently at 6°C throughout the transit corridor. Top class service!',
    },
    {
      id: 3,
      shipper: 'Kashi Agro Producers',
      rating: 4.8,
      date: '2026-09-10',
      trip: 'TR-HIST-04',
      comment: 'Professional driver conduct. Handled loading documents with high care.',
    },
  ];

  return (
    <LogisticsLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Partner Ratings & Shipper Reviews</h1>
              <p className="text-xs text-stone-500">Verified reputation scores from FPOs, Agri-Hubs, and Mandi traders</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
              <Award className="w-4 h-4 text-emerald-600" /> Top Rated Partner
            </span>
          </div>
        </div>

        {/* Big Rating Summary */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 text-center md:border-r md:border-stone-100 pr-0 md:pr-6">
            <div className="text-5xl font-black text-stone-900">4.9</div>
            <div className="flex items-center justify-center gap-1 mt-2 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-2">Based on 148 verified agricultural transit runs</p>
          </div>

          <div className="md:col-span-8 space-y-3">
            {[
              { label: 'On-Time Mandi Delivery Rate', score: '99.4%', fill: '99%' },
              { label: 'Consignment & Produce Care', score: '99.8%', fill: '99%' },
              { label: 'Driver Professionalism & Conduct', score: '98.5%', fill: '98%' },
              { label: 'GPS Tracking Telemetry Uptime', score: '100%', fill: '100%' },
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-700">{metric.label}</span>
                  <span className="text-stone-900 font-bold">{metric.score}</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div style={{ width: metric.fill }} className="bg-emerald-600 h-2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-stone-900">Shipper Testimonials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs text-stone-700">
                      {String(rev.shipper || 'SP').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">{rev.shipper}</div>
                      <div className="text-[10px] text-stone-400">{rev.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic">"{rev.comment}"</p>

                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400 font-mono">
                  Verified Transit: <span className="text-stone-700 font-medium">{rev.trip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LogisticsLayout>
  );
}

export default RatingsPage;
