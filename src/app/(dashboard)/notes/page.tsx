"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Sparkles, Bold, Italic, List, Send, BrainCircuit, Wand2, Layers, FileText, X, Archive, Share2, Tag, Trash2, SortAsc, Check, Loader2, ChevronDown, FolderOpen, Menu } from "lucide-react";
import { useNotes } from "@/lib/notes-context";
import { useToast } from "@/components/ui/use-toast";
import { FOLDERS, Note } from "@/lib/types";
import { InlineQuiz } from "@/components/InlineQuiz";
import { InlineFlashcard } from "@/components/InlineFlashcard";

type SortOption = "newest" | "oldest" | "az";
type ChatMsg = {
  type: "ai" | "user";
  text: string;
  loading?: boolean;
  quizData?: any[];
  flashcardData?: any[];
};

async function callGroq(type: string, content?: string, userMessage?: string): Promise<{ text: string; parsed?: any }> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, content, userMessage }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function NotesPage() {
  const { notes, createNote, updateNote, deleteNote, archiveNote, toggleShare, incrementAI, saveStatus } = useNotes();
  const { toast } = useToast();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [aiPanelWidth, setAiPanelWidth] = useState(300);
  const aiIsDragging = useRef(false);
  const aiDragStartX = useRef(0);
  const aiDragStartWidth = useRef(0);

  // Sidebar resize
  const [sidebarWidth, setSidebarWidth] = useState(272);
  const sideIsDragging = useRef(false);
  const sideDragStartX = useRef(0);
  const sideDragStartWidth = useRef(0);

  // Collapsible sections
  const [secSearch, setSecSearch] = useState(true);
  const [secFolders, setSecFolders] = useState(true);
  const [secTags, setSecTags] = useState(true);
  const [secNotes, setSecNotes] = useState(true);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [showArchived, setShowArchived] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { type: "ai", text: "Hey! I'm Peblo Buddy 🤖 Ask me anything about your notes!" },
  ]);
  const [copiedShare, setCopiedShare] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Filtered + sorted note list
  const visibleNotes = notes
    .filter(n => n.archived === showArchived)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()) || n.tags.some(t => t.includes(search.toLowerCase())))
    .filter(n => !tagFilter || n.tags.includes(tagFilter))
    .filter(n => !folderFilter || n.folder === folderFilter)
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sort === "oldest") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return a.title.localeCompare(b.title);
    });

  const activeNote = notes.find(n => n.id === activeId) ?? visibleNotes[0] ?? null;

  // Set initial active note
  useEffect(() => {
    if (!activeId && visibleNotes.length > 0) setActiveId(visibleNotes[0].id);
  }, [notes]);

  // All unique tags across all notes
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags))).slice(0, 20);

  // Debounced content update
  const contentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleContentChange = useCallback((field: keyof Note, value: string) => {
    if (!activeNote) return;
    if (contentTimer.current) clearTimeout(contentTimer.current);
    contentTimer.current = setTimeout(() => updateNote(activeNote.id, { [field]: value }), 600);
  }, [activeNote, updateNote]);

  const handleNewNote = () => {
    const n = createNote();
    setActiveId(n.id);
    toast({ title: "Note Created! 🎉", description: "Your new adventure page is ready!" });
    setTimeout(() => titleRef.current?.focus(), 100);
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || !activeNote) return;
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!activeNote.tags.includes(tag)) {
      updateNote(activeNote.id, { tags: [...activeNote.tags, tag] });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    if (!activeNote) return;
    updateNote(activeNote.id, { tags: activeNote.tags.filter(t => t !== tag) });
  };

  const handleArchive = () => {
    if (!activeNote) return;
    archiveNote(activeNote.id);
    setActiveId(null);
    toast({ title: activeNote.archived ? "📂 Unarchived!" : "📦 Archived!", description: `"${activeNote.title}" moved.` });
  };

  const handleDelete = () => {
    if (!activeNote) return;
    const title = activeNote.title;
    deleteNote(activeNote.id);
    setActiveId(null);
    toast({ title: "🗑️ Deleted", description: `"${title}" was removed.` });
  };

  const handleShare = () => {
    if (!activeNote) return;
    toggleShare(activeNote.id);
    if (!activeNote.shared) {
      const url = `${window.location.origin}/share/${activeNote.shareId}`;
      navigator.clipboard.writeText(url).catch(() => {});
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
      toast({ title: "🔗 Share link copied!", description: "Anyone with the link can view this note." });
    } else {
      toast({ title: "🔒 Note made private", description: "The share link is now deactivated." });
    }
  };

  // Scroll chat to bottom after new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleAiAction = async (type: string, emoji: string, label: string) => {
    if (!activeNote?.content?.trim()) {
      toast({ title: "No content yet! 📝", description: "Write some notes first so Peblo can help!" });
      return;
    }
    if (activeNote) incrementAI(activeNote.id);
    setAiLoading(true);
    setChatMessages(prev => [...prev,
      { type: "user", text: `${emoji} ${label} my note` },
      { type: "ai", text: "", loading: true }
    ]);
    try {
      const { text, parsed } = await callGroq(type, activeNote.content);
      if (type === "quiz" && parsed?.length) {
        setChatMessages(prev => prev.slice(0, -1).concat({
          type: "ai", text: "", quizData: parsed
        }));
      } else if (type === "flashcards" && parsed?.length) {
        setChatMessages(prev => prev.slice(0, -1).concat({
          type: "ai", text: "", flashcardData: parsed
        }));
      } else {
        setChatMessages(prev => prev.slice(0, -1).concat({ type: "ai", text }));
      }
    } catch (e: any) {
      setChatMessages(prev => prev.slice(0, -1).concat({ type: "ai", text: "Oops! I couldn't connect. Check your internet and try again! 🔌" }));
      toast({ title: "AI Error", description: e.message });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || aiLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    if (activeNote) incrementAI(activeNote.id);
    setChatMessages(prev => [...prev, { type: "user", text: msg }, { type: "ai", text: "", loading: true }]);
    setAiLoading(true);
    try {
      const noteContext = activeNote?.content
        ? `(Context from current note titled "${activeNote.title}":\n${activeNote.content.slice(0, 800)})\n\n`
        : "";
      const { text } = await callGroq("chat", activeNote?.content, noteContext + msg);
      setChatMessages(prev => prev.slice(0, -1).concat({ type: "ai", text }));
    } catch {
      setChatMessages(prev => prev.slice(0, -1).concat({ type: "ai", text: "Hmm, something went wrong! Try again in a sec 🔄" }));
    } finally {
      setAiLoading(false);
    }
  };

  const saveLabel =
    saveStatus === "saving" ? "Saving... ✏️" :
    saveStatus === "saved" ? "Saved! ✓" : "Auto-save on";

  return (
    <div className="flex h-[calc(100vh-140px)] gap-4 overflow-hidden relative">

      {/* ── LEFT SIDEBAR ── */}
      <AnimatePresence initial={false}>
      {sidebarOpen && (
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: sidebarWidth, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ width: sidebarWidth }}
        className="glass-card rounded-3xl flex flex-col overflow-hidden shrink-0 border border-white/30 relative"
      >
        {/* Drag-to-resize handle (right edge) */}
        <div
          onPointerDown={(e) => {
            sideIsDragging.current = true;
            sideDragStartX.current = e.clientX;
            sideDragStartWidth.current = sidebarWidth;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!sideIsDragging.current) return;
            const delta = e.clientX - sideDragStartX.current;
            setSidebarWidth(Math.min(420, Math.max(200, sideDragStartWidth.current + delta)));
          }}
          onPointerUp={() => { sideIsDragging.current = false; }}
          className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-30 flex items-center justify-center group"
        >
          <div className="w-0.5 h-10 rounded-full bg-white/0 group-hover:bg-peblo-purple/40 transition-colors" />
        </div>

        {/* New Note button */}
        <div className="p-3 border-b border-white/10 bg-gradient-to-r from-peblo-purple/10 to-peblo-pink/10">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleNewNote}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-peblo-purple to-peblo-pink text-white py-2.5 rounded-2xl font-bold text-sm shadow-lg">
            <Plus size={15} /> New Adventure 🚀
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ── SECTION: Notes List ── */}
          <div>
            <button onClick={() => setSecNotes(v => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground/50">
                📚 {showArchived ? "Archived" : "My Notes"}
                <span className="text-[10px] bg-white/30 dark:bg-white/10 px-1.5 py-0.5 rounded-full normal-case font-bold">{visibleNotes.length}</span>
              </span>
              <motion.span animate={{ rotate: secNotes ? 0 : -90 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={13} className="text-foreground/40" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {secNotes && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                  <div className="px-2 pb-2">
                    {visibleNotes.length === 0 && (
                      <div className="text-center py-6 text-foreground/40 text-xs font-medium">
                        {search ? "No notes match 🔍" : showArchived ? "No archived notes 📦" : "Create your first adventure! 🚀"}
                      </div>
                    )}
                    {visibleNotes.map(note => (
                      <motion.div key={note.id} whileHover={{ x: 3 }} onClick={() => setActiveId(note.id)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 mb-1.5 ${activeNote?.id === note.id ? "bg-gradient-to-r from-peblo-purple/15 to-peblo-pink/10 border border-peblo-purple/25 shadow-sm" : "hover:bg-white/40 dark:hover:bg-white/5 border border-transparent"}`}>
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h4 className={`font-bold text-sm truncate leading-tight ${activeNote?.id === note.id ? "text-peblo-purple" : ""}`}>{note.emoji} {note.title}</h4>
                          {note.shared && <span className="shrink-0 text-[9px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">🔗</span>}
                        </div>
                        <div className="text-[10px] text-foreground/40 font-medium mb-1 truncate">{note.folder}</div>
                        {note.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {note.tags.slice(0, 2).map(t => (
                              <span key={t} className="text-[10px] font-bold bg-peblo-blue/10 text-peblo-blue px-1.5 py-0.5 rounded-full">#{t}</span>
                            ))}
                            {note.tags.length > 2 && <span className="text-[10px] text-foreground/30">+{note.tags.length - 2}</span>}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
      )}
      </AnimatePresence>

      {/* ── CENTER EDITOR ── */}
      <div className="flex-1 glass-card rounded-3xl flex flex-col border border-white/30 relative overflow-hidden min-w-0">

        {/* ── FILTER BAR (above notes, always visible) ── */}
        <div className="px-4 py-2 border-b border-white/10 bg-white/10 dark:bg-black/10 flex flex-wrap items-center gap-2 shrink-0">
          {/* Hamburger */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSidebarOpen(v => !v)}
            className="p-1.5 rounded-xl border border-white/20 bg-white/30 hover:bg-peblo-purple/10 hover:border-peblo-purple/30 text-foreground/60 hover:text-peblo-purple transition-all"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}>
            <Menu size={15} />
          </motion.button>
          {/* Search */}
          <div className="relative flex-1 min-w-[120px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text"
              placeholder="Search notes..."
              className="w-full pl-7 pr-7 py-1.5 bg-white/50 dark:bg-black/50 border border-white/20 rounded-xl text-xs focus:outline-none focus:border-peblo-purple/50 font-medium" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={10} className="text-foreground/40" /></button>}
          </div>
          {/* Folder chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button onClick={() => setFolderFilter(null)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${!folderFilter ? "bg-peblo-purple text-white border-transparent" : "bg-white/40 dark:bg-black/30 border-white/20 hover:border-peblo-purple/40"}` }>
              All
            </button>
            {FOLDERS.map(f => (
              <button key={f.value} onClick={() => setFolderFilter(folderFilter === f.value ? null : f.value)}
                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${folderFilter === f.value ? "bg-peblo-purple text-white border-transparent" : "bg-white/40 dark:bg-black/30 border-white/20 hover:border-peblo-purple/40"}` }>
                {f.label.split(" ")[0]} {f.value.split(" ")[0]}
              </button>
            ))}
          </div>
          {/* Sort */}
          <div className="relative shrink-0">
            <SortAsc size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-foreground/40" />
            <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
              className="pl-6 pr-2 py-1.5 bg-white/50 dark:bg-black/50 border border-white/20 rounded-xl text-[11px] font-bold focus:outline-none appearance-none">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A→Z</option>
            </select>
          </div>
          {/* Archive toggle */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowArchived(!showArchived)}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${showArchived ? "bg-peblo-purple text-white border-transparent" : "bg-white/40 dark:bg-black/30 border-white/20"}` }>
            <Archive size={11} /> {showArchived ? "Archived" : "Archive"}
          </motion.button>
        </div>

        {/* Toolbar */}
        <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-gradient-to-r from-white/20 to-peblo-purple/5 dark:from-black/20 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-1">
            {[{ icon: Bold }, { icon: Italic }, { icon: List }].map(({ icon: Icon }, i) => (
              <motion.button key={i} whileTap={{ scale: 0.9 }} onClick={() => toast({ title: "Formatting ✏️", description: "Rich text editor coming soon!" })} className="p-2 text-foreground/50 hover:text-peblo-purple hover:bg-peblo-purple/10 rounded-lg transition-all">
                <Icon size={16} />
              </motion.button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full transition-all ${saveStatus === "saving" ? "bg-yellow-100 text-yellow-700" : saveStatus === "saved" ? "bg-green-100 text-green-600" : "bg-white/30 text-foreground/40"}`}>
              {saveLabel}
            </span>
            {activeNote && (
              <>
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleShare}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${activeNote.shared ? "bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200" : "bg-white/30 border-white/20 text-foreground/50 hover:text-peblo-purple hover:border-peblo-purple/30"}`}>
                  {copiedShare ? <Check size={14} /> : <Share2 size={14} />}
                  <span className="hidden sm:inline">{activeNote.shared ? "Shared!" : "Share"}</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleArchive}
                  className="p-1.5 rounded-lg border border-white/20 text-foreground/50 hover:text-orange-500 hover:border-orange-300 transition-all bg-white/30">
                  <Archive size={14} />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleDelete}
                  className="p-1.5 rounded-lg border border-white/20 text-foreground/50 hover:text-red-500 hover:border-red-300 transition-all bg-white/30">
                  <Trash2 size={14} />
                </motion.button>
              </>
            )}
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-sm font-bold transition-all ${aiPanelOpen ? "bg-gradient-to-r from-peblo-purple to-peblo-pink text-white border-transparent" : "border-peblo-purple/30 text-peblo-purple"}`}>
              <Sparkles size={13} /> AI
            </motion.button>
          </div>
        </div>

        {/* Editor body */}
        {activeNote ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <input ref={titleRef} type="text" defaultValue={activeNote.title}
              key={activeNote.id + "-title"}
              onChange={e => handleContentChange("title", e.target.value)}
              className="w-full text-3xl md:text-4xl font-heading font-bold bg-transparent border-none outline-none mb-4 text-foreground placeholder-foreground/20"
              placeholder="Give this adventure a title..." />

            {/* Folder selector */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <select defaultValue={activeNote.folder} key={activeNote.id + "-folder"}
                onChange={e => updateNote(activeNote.id, { folder: e.target.value, emoji: FOLDERS.find(f => f.value === e.target.value)?.label.split(" ")[0] ?? "📚" })}
                className="px-3 py-1.5 bg-white/50 dark:bg-black/50 border border-white/20 rounded-full text-xs font-bold focus:outline-none focus:border-peblo-purple/50 appearance-none">
                {FOLDERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>

              {/* Tag chips */}
              <div className="flex flex-wrap gap-1.5 items-center">
                {activeNote.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-peblo-purple/10 text-peblo-purple border border-peblo-purple/20 rounded-full text-xs font-bold">
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-400 transition-colors ml-0.5"><X size={11} /></button>
                  </span>
                ))}
                {/* Tag input */}
                <div className="flex items-center gap-1">
                  <Tag size={12} className="text-foreground/40" />
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                    placeholder="Add tag..." className="w-20 text-xs bg-transparent border-b border-foreground/20 focus:outline-none focus:border-peblo-purple py-0.5 font-medium" />
                  {tagInput && <button onClick={handleAddTag} className="text-peblo-purple"><Check size={13} /></button>}
                </div>
              </div>
            </div>

            <textarea key={activeNote.id + "-content"}
              defaultValue={activeNote.content}
              onChange={e => handleContentChange("content", e.target.value)}
              className="w-full min-h-[350px] resize-none bg-transparent border-none outline-none text-foreground/75 leading-loose text-base font-medium"
              placeholder="Start your adventure here... What cool things did you learn today? 🚀" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="text-7xl mb-4">📚</div>
            <h2 className="text-2xl font-heading font-bold mb-2">No note selected</h2>
            <p className="text-foreground/50 mb-6">Pick a note from the sidebar or create a new adventure!</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNewNote}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-peblo-purple to-peblo-pink text-white rounded-2xl font-bold shadow-lg">
              <Plus size={18} /> New Note 🚀
            </motion.button>
          </div>
        )}
      </div>

      {/* ── AI BUDDY PANEL ── */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: aiPanelWidth, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: aiPanelWidth }}
            className="glass-card rounded-3xl flex flex-col shrink-0 overflow-hidden border border-white/30 absolute right-0 top-0 bottom-0 z-20 lg:relative"
          >
            {/* Drag-to-resize handle */}
            <div
              onPointerDown={(e) => {
                aiIsDragging.current = true;
                aiDragStartX.current = e.clientX;
                aiDragStartWidth.current = aiPanelWidth;
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!aiIsDragging.current) return;
                const delta = aiDragStartX.current - e.clientX;
                const newWidth = Math.min(600, Math.max(240, aiDragStartWidth.current + delta));
                setAiPanelWidth(newWidth);
              }}
              onPointerUp={() => { aiIsDragging.current = false; }}
              className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize z-30 flex items-center justify-center group"
              title="Drag to resize"
            >
              <div className="w-1 h-12 rounded-full bg-white/0 group-hover:bg-peblo-purple/40 transition-colors" />
            </div>

            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-peblo-purple/15 to-peblo-pink/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-peblo-purple to-peblo-pink flex items-center justify-center text-white text-sm shadow-lg">🤖</div>
                <div>
                  <p className="font-bold text-sm text-peblo-purple">Peblo Buddy</p>
                  <p className={`text-xs font-medium ${aiLoading ? "text-yellow-500" : "text-green-500"}`}>
                    {aiLoading ? "⏳ Thinking..." : "● Ready!"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Preset size buttons */}
                {[
                  { label: "S", width: 260, title: "Compact" },
                  { label: "M", width: 340, title: "Default" },
                  { label: "L", width: 480, title: "Wide" },
                ].map(({ label, width, title }) => (
                  <motion.button
                    key={label}
                    whileTap={{ scale: 0.85 }}
                    title={title}
                    onClick={() => setAiPanelWidth(width)}
                    className={`w-6 h-6 rounded-md text-[10px] font-black border transition-all ${
                      aiPanelWidth === width
                        ? "bg-gradient-to-br from-peblo-purple to-peblo-pink text-white border-transparent shadow"
                        : "bg-white/30 text-foreground/50 border-white/20 hover:border-peblo-purple/40 hover:text-peblo-purple"
                    }`}
                  >
                    {label}
                  </motion.button>
                ))}
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setAiPanelOpen(false)} className="p-1 bg-white/30 rounded-lg ml-1"><X size={14} /></motion.button>
              </div>
            </div>

            <div className="p-3 grid grid-cols-2 gap-2 border-b border-white/10 bg-white/10 dark:bg-black/10">
              {[
                { icon: FileText, label: "Summarize", emoji: "📋", type: "summarize" },
                { icon: Wand2, label: "Explain 🧠", emoji: "🤯", type: "explain" },
                { icon: BrainCircuit, label: "Gen Quiz 🎮", emoji: "🎯", type: "quiz" },
                { icon: Layers, label: "Flashcards 🃏", emoji: "⚡", type: "flashcards" },
              ].map(btn => (
                <motion.button key={btn.label} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleAiAction(btn.type, btn.emoji, btn.label)}
                  disabled={aiLoading}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${aiLoading ? "opacity-50 cursor-not-allowed bg-white/20 border-white/10" : "bg-white/40 dark:bg-white/5 border-white/20 hover:bg-peblo-purple/10 hover:border-peblo-purple/30"}`}>
                  {aiLoading ? <Loader2 size={16} className="text-foreground/40 mb-1 animate-spin" /> : <btn.icon size={16} className="text-foreground/50 mb-1" />}
                  <span className="text-[11px] font-bold leading-tight text-center">{btn.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
              {chatMessages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.type === "user"
                      ? "px-3 py-2.5 bg-gradient-to-r from-peblo-purple to-peblo-pink text-white self-end rounded-tr-sm shadow-md max-w-[92%]"
                      : msg.quizData || msg.flashcardData
                        ? "w-full bg-white/70 dark:bg-black/50 text-foreground/80 self-start rounded-tl-sm border border-white/30 p-3"
                        : "px-3 py-2.5 bg-white/70 dark:bg-black/50 text-foreground/80 self-start rounded-tl-sm border border-white/30 max-w-[92%]"
                  }`}>
                  {msg.type === "ai" && <p className="text-[10px] font-bold text-peblo-purple mb-1.5">🤖 Peblo</p>}

                  {/* Loading dots */}
                  {msg.loading && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-peblo-purple/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-peblo-purple/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-peblo-purple/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}

                  {/* Inline Quiz */}
                  {msg.quizData && <InlineQuiz questions={msg.quizData} />}

                  {/* Inline Flashcards */}
                  {msg.flashcardData && <InlineFlashcard cards={msg.flashcardData} />}

                  {/* Plain text */}
                  {!msg.loading && !msg.quizData && !msg.flashcardData && (
                    <span className="whitespace-pre-wrap">{msg.text}</span>
                  )}

                  {/* Add to notes for plain AI responses */}
                  {msg.type === "ai" && !msg.loading && !msg.quizData && !msg.flashcardData && i > 0 && msg.text && (
                    <button onClick={() => { if (activeNote) { updateNote(activeNote.id, { content: (activeNote.content || "") + "\n\n" + msg.text }); toast({ title: "Saved! 📝", description: "Added to your note." }); } }}
                      className="mt-2 text-[10px] bg-peblo-purple/10 text-peblo-purple font-bold px-2 py-1 rounded-lg border border-peblo-purple/20 block hover:bg-peblo-purple/20 transition-colors">
                      + Add to Notes
                    </button>
                  )}
                </motion.div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            <div className="p-3 border-t border-white/10 bg-white/20 dark:bg-black/20">
              <div className="relative">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendChat()}
                  disabled={aiLoading}
                  placeholder={aiLoading ? "Peblo is thinking... ⏳" : "Ask Peblo anything! 💬"}
                  className="w-full pl-4 pr-11 py-3 bg-white/80 dark:bg-black/60 border border-white/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-peblo-purple/40 font-medium disabled:opacity-60" />
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleSendChat} disabled={aiLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-peblo-purple to-peblo-pink rounded-xl flex items-center justify-center text-white shadow disabled:opacity-50">
                  {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
