'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, GripVertical, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguages } from '@/components/providers/LanguageProvider';
import { Language } from '@/types';
import { slugify } from '@/lib/slugify';

export default function LanguagesPage() {
  const { languages, refreshLanguages } = useLanguages();
  const [localLanguages, setLocalLanguages] = useState<Language[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<Language | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [flag, setFlag] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setLocalLanguages(languages);
  }, [languages]);

  const resetForm = () => {
    setName('');
    setSlug('');
    setFlag('');
    setSortOrder(localLanguages.length + 1);
    setIsActive(true);
    setEditingLang(null);
  };

  const openModal = (lang?: Language) => {
    if (lang) {
      setEditingLang(lang);
      setName(lang.name);
      setSlug(lang.slug);
      setFlag(lang.flag || '');
      setSortOrder(lang.sort_order);
      setIsActive(lang.is_active);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingLang) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error('Name and slug are required');
      return;
    }

    const payload = {
      id: editingLang?.id,
      name,
      slug,
      flag,
      sort_order: sortOrder,
      is_active: isActive
    };

    try {
      const method = editingLang ? 'PUT' : 'POST';
      const res = await fetch('/api/languages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(editingLang ? 'Language updated' : 'Language created');
      closeModal();
      await refreshLanguages();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this language?')) return;
    try {
      const res = await fetch('/api/languages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('Language deleted');
      await refreshLanguages();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  // Drag and drop sorting
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === id) return;

    const newLangs = [...localLanguages];
    const draggedIdx = newLangs.findIndex(l => l.id === draggedId);
    const targetIdx = newLangs.findIndex(l => l.id === id);

    const draggedItem = newLangs[draggedIdx];
    newLangs.splice(draggedIdx, 1);
    newLangs.splice(targetIdx, 0, draggedItem);
    
    // Update sort_order locally for visual
    const updated = newLangs.map((l, i) => ({ ...l, sort_order: i + 1 }));
    setLocalLanguages(updated);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedId(null);

    // Save all new sort orders to DB
    try {
      await Promise.all(
        localLanguages.map(l => 
          fetch('/api/languages', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: l.id, sort_order: l.sort_order })
          })
        )
      );
      await refreshLanguages();
      toast.success('Order updated');
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8 bg-popcorn-card border border-white/5 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-1">LANGUAGE MANAGEMENT</h1>
          <p className="text-sm font-bold text-popcorn-secondary uppercase tracking-widest">Manage site languages</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-popcorn-red text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neutral-100 hover:text-popcorn-red transition-all shadow-xl flex items-center gap-2"
        >
          <Plus size={16} />
          Add Language
        </button>
      </div>

      <div className="bg-popcorn-card border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-popcorn-secondary">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Flag</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-1 text-center">Sort</div>
          <div className="col-span-1 text-center">Active</div>
          <div className="col-span-2 text-right pr-4">Actions</div>
        </div>

        <div className="divide-y divide-white/5">
          {localLanguages.map((lang) => (
            <div 
              key={lang.id}
              draggable
              onDragStart={(e) => handleDragStart(e, lang.id)}
              onDragOver={(e) => handleDragOver(e, lang.id)}
              onDrop={handleDrop}
              className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-white/5 ${draggedId === lang.id ? 'opacity-50' : ''}`}
            >
              <div className="col-span-1 flex justify-center cursor-grab active:cursor-grabbing text-popcorn-secondary hover:text-white">
                <GripVertical size={16} />
              </div>
              <div className="col-span-1 text-center text-xl">{lang.flag}</div>
              <div className="col-span-3 font-bold text-white text-sm">{lang.name}</div>
              <div className="col-span-3 font-mono text-xs text-popcorn-secondary">{lang.slug}</div>
              <div className="col-span-1 text-center font-bold text-popcorn-secondary">{lang.sort_order}</div>
              <div className="col-span-1 flex justify-center">
                {lang.is_active ? (
                  <span className="w-12 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-[10px] font-black tracking-wider uppercase">On</span>
                ) : (
                  <span className="w-12 h-6 bg-white/10 text-popcorn-secondary rounded-full flex items-center justify-center text-[10px] font-black tracking-wider uppercase">Off</span>
                )}
              </div>
              <div className="col-span-2 flex justify-end gap-2 pr-2">
                <button 
                  onClick={() => openModal(lang)}
                  className="p-2 text-popcorn-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(lang.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {localLanguages.length === 0 && (
            <div className="p-12 text-center text-popcorn-secondary font-bold text-sm">
              No languages found. Add one to get started.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-popcorn-card border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-sm font-black text-white tracking-widest uppercase">
                {editingLang ? 'Edit Language' : 'Add Language'}
              </h2>
              <button onClick={closeModal} className="text-popcorn-secondary hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 space-y-1">
                  <label className="text-[10px] font-black text-popcorn-secondary uppercase tracking-widest">Flag</label>
                  <input 
                    type="text" 
                    value={flag}
                    onChange={e => setFlag(e.target.value)}
                    placeholder="🇬🇧"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-center text-xl focus:outline-none focus:border-popcorn-red transition-colors"
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <label className="text-[10px] font-black text-popcorn-secondary uppercase tracking-widest">Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="e.g. English"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-bold text-white focus:outline-none focus:border-popcorn-red transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-popcorn-secondary uppercase tracking-widest">Slug</label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase())}
                  placeholder="e.g. english"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-mono text-popcorn-secondary focus:outline-none focus:border-popcorn-red transition-colors"
                />
                <p className="text-[10px] text-neutral-500 italic px-1">Used in URLs. Must be lowercase, no spaces or special chars.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-popcorn-secondary uppercase tracking-widest">Sort Order</label>
                  <input 
                    type="number" 
                    value={sortOrder}
                    onChange={e => setSortOrder(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-bold text-white focus:outline-none focus:border-popcorn-red transition-colors"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-black/50 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={isActive}
                        onChange={e => setIsActive(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-white/10'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Active</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 bg-popcorn-red hover:bg-neutral-100 hover:text-popcorn-red text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-xl"
                >
                  {editingLang ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
