"use client";

import { useApi } from "@/app/providers";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  categoryId?: string;
}

export function NoteInput({ value, onChange, categoryId }: NoteInputProps) {
  const api = useApi();

  const { data: suggestions = [] } = useQuery({
    queryKey: ["suggestedNotes", categoryId],
    queryFn: () => (categoryId ? api.getSuggestedNotes(categoryId) : Promise.resolve([])),
    enabled: !!categoryId,
  });

  return (
    <div className="space-y-3">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add a note (optional)"
        className="h-14 rounded-xl bg-white border-slate-200 text-lg"
      />

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((note) => (
            <Button
              key={note}
              variant="outline"
              size="sm"
              onClick={() => onChange(note)}
              className="rounded-full px-4 text-xs font-medium border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
              type="button"
            >
              {note}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
