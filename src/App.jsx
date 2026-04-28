import React, { useState, useEffect } from 'react'; import { createClient } from '@supabase/supabase-js'; import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Trash2, Download } from 'lucide-react';

// Supabase config (faltará URL) const supabaseUrl = "https://ynceawlmfrfiqcxpdqkq.supabase.co"; const supabaseKey = "sb_publishable_q464KAL4-0508iS3Dc0UeA_Qj1juXhL"; const supabase = createClient(supabaseUrl, supabaseKey);

export default function ClanTracker() { const [sessions, setSessions] = useState([]); const [sessionName, setSessionName] = useState(''); const [adena, setAdena] = useState(''); const [items, setItems] = useState(''); const [members, setMembers] = useState('');

useEffect(() => { fetchSessions(); }, []);

const fetchSessions = async () => { const { data } = await supabase.from('sessions').select('*').order('id', { ascending: false }); if (data) setSessions(data); };

const addSession = async () => { if (!sessionName || !adena) return;

const newSession = {
  session_name: sessionName,
  adena: Number(adena),
  euro_value: Number(adena) * 0.0000021,
  participants: members.split(',').map(m => m.trim()),
  items: items.split(',').map(i => i.trim())
};

await supabase.from('sessions').insert([newSession]);
fetchSessions();

setSessionName('');
setAdena('');
setItems('');
setMembers('');

};

const deleteSession = async (id) => { await supabase.from('sessions').delete().eq('id', id); fetchSessions(); };

const totalAdena = sessions.reduce((acc, s) => acc + (s.adena || 0), 0); const totalEuros = (totalAdena * 0.0000021).toFixed(2);

return ( <div className="min-h-screen bg-black text-white p-6"> <div className="max-w-5xl mx-auto space-y-6">

<h1 className="text-4xl font-bold text-center">Clan Tracker Online</h1>

    <Card>
      <CardContent className="p-4 space-y-3">
        <Input placeholder="Nombre sesión" value={sessionName} onChange={e => setSessionName(e.target.value)} />
        <Input placeholder="Adena" type="number" value={adena} onChange={e => setAdena(e.target.value)} />
        <Input placeholder="Miembros (coma)" value={members} onChange={e => setMembers(e.target.value)} />
        <Input placeholder="Items (coma)" value={items} onChange={e => setItems(e.target.value)} />
        <Button onClick={addSession}>Guardar</Button>
      </CardContent>
    </Card>

    <div className="text-center">
      <p>Total Adena: {totalAdena.toLocaleString()}</p>
      <p>Total €: {totalEuros}</p>
    </div>

    {sessions.map(s => (
      <Card key={s.id} className="mt-3">
        <CardContent className="p-4">
          <div className="flex justify-between">
            <div>
              <h3>{s.session_name}</h3>
              <p>{s.adena} adena</p>
              <p>€{s.euro_value}</p>
              <p>Miembros: {(s.participants || []).join(', ')}</p>
              <p>Items: {(s.items || []).join(', ')}</p>
            </div>
            <Button onClick={() => deleteSession(s.id)}><Trash2/></Button>
          </div>
        </CardContent>
      </Card>
    ))}

  </div>
</div>

); }
