"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function OpportunityHub() {
  const [items, setItems] = useState<any[]>([]);
  const [tokens, setTokens] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // FORM STATE: For student contributions
  const [newPost, setNewPost] = useState({ title: "", link: "", deadline: "", category: "Certificate" });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }

      // FETCH 1: Opportunities from the cloud
      const { data: opps } = await supabase.from('opportunities').select('*');
      if (opps) setItems(opps);

      // FETCH 2: User's token balance (Assuming a 'profiles' table exists)
      const { data: profile } = await supabase.from('profiles').select('tokens').eq('id', user.id).single();
      if (profile) setTokens(profile.tokens);
    };
    fetchData();
  }, [router]);

  // FUNCTION: Submit a new opportunity to earn tokens
  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Insert the post into Supabase
    const { error } = await supabase.from('opportunities').insert([
      { ...newPost, contributor_id: (await supabase.auth.getUser()).data.user?.id }
    ]);

    if (!error) {
      alert("Post submitted! Once verified, you will receive 10 Uniis Tokens.");
      setIsModalOpen(false);
      // In a real app, we would refresh the list here
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400 italic">Opportunity Hub</h1>
          <p className="text-zinc-500 text-sm">Verified by Uniis Community</p>
        </div>
        
        {/* TOKEN DISPLAY: Shows the student's "Wealth" */}
        <div className="bg-zinc-900 border border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="font-mono font-bold text-emerald-400">{tokens} TOKENS</span>
        </div>
      </div>

      {/* CONTRIBUTION TRIGGER */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="mb-10 w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 hover:text-white hover:border-zinc-500 transition-all font-medium"
      >
        + Post a Certificate or Job to Earn Tokens
      </button>

      {/* THE DATA LISTING (Active vs Expired) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isExpired = new Date(item.deadline) < new Date();
          return (
            <div key={item.id} className={`p-6 bg-zinc-900 rounded-2xl border ${isExpired ? 'border-zinc-900 opacity-40' : 'border-zinc-800'}`}>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-zinc-500 text-xs mb-4">{isExpired ? "EXPIRED" : `Ends: ${item.deadline}`}</p>
              {!isExpired && (
                <a href={item.link} className="text-emerald-400 text-sm font-bold underline">Verify & Apply →</a>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}