"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Note, generateId, SEED_NOTES, FOLDER_EMOJIS } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

// Normalize MongoDB _id → id so the rest of the app can use note.id consistently
function normalizeNote(raw: any): Note {
  return { ...raw, id: raw._id ?? raw.id };
}

interface NotesContextValue {
  notes: Note[];
  createNote: (folder?: string) => Promise<Note>;
  updateNote: (id: string, patch: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  archiveNote: (id: string) => Promise<void>;
  toggleShare: (id: string) => Promise<void>;
  incrementAI: (id: string) => Promise<void>;
  saveStatus: "saved" | "saving" | "idle";
}

const NotesContext = createContext<NotesContextValue | null>(null);

const API_URL = "http://localhost:5000/api/notes";

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const { token, user } = useAuth();

  const fetchNotes = useCallback(async () => {
    if (!token) {
      setNotes([]);
      return;
    }
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotes((data.notes || []).map(normalizeNote));
      }
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  }, [token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

  const createNote = useCallback(async (folder = "General"): Promise<Note> => {
    setSaveStatus("saving");
    const payload = {
      title: "New Adventure ✨",
      content: "",
      folder,
      emoji: FOLDER_EMOJIS[folder] ?? "📚",
      tags: [],
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const note = normalizeNote(data.note);
    setNotes(prev => [note, ...prev]);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
    return note;
  }, [token]);

  const updateNote = useCallback(async (id: string, patch: Partial<Note>) => {
    setSaveStatus("saving");
    // Optimistic update
    setNotes(prev => prev.map(n => n._id === id || n.id === id ? { ...n, ...patch } : n));
    
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(patch)
    });
    
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, [token]);

  const deleteNote = useCallback(async (id: string) => {
    setNotes(prev => prev.filter(n => n._id !== id && n.id !== id));
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  }, [token]);

  const archiveNote = useCallback(async (id: string) => {
    const note = notes.find(n => n._id === id || n.id === id);
    if (note) {
      await updateNote(id, { archived: !note.archived });
    }
  }, [notes, updateNote]);

  const toggleShare = useCallback(async (id: string) => {
    const note = notes.find(n => n._id === id || n.id === id);
    if (note) {
      await updateNote(id, { shared: !note.shared });
    }
  }, [notes, updateNote]);

  const incrementAI = useCallback(async (id: string) => {
    setNotes(prev => prev.map(n => n._id === id || n.id === id ? { ...n, aiInteractions: (n.aiInteractions || 0) + 1 } : n));
    await fetch(`${API_URL}/${id}/ai-hit`, {
      method: "PATCH",
      headers: authHeaders(),
    });
  }, [token]);

  return (
    <NotesContext.Provider value={{ notes, createNote, updateNote, deleteNote, archiveNote, toggleShare, incrementAI, saveStatus }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used inside <NotesProvider>");
  return ctx;
}
