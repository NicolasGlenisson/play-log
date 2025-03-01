"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { playListSchema } from "@/lib/schemas/playListSchema";
import { createPlaylist, updatePlaylist, fetchPlayList } from "@/lib/playlist";
import { Loader2 } from "lucide-react";
import SearchBar, { suggestionType } from "@/components/searchBar";

import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import SortableGameList from "../playlist/sortableGameList";

type PlayListType = Awaited<ReturnType<typeof fetchPlayList>>;

interface PlayListFormProps {
  playlist?: PlayListType;
  type: "edit" | "create";
}
export default function PlayListForm(props: PlayListFormProps) {
  const { playlist, type } = props;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues = playlist
    ? {
        name: playlist.name,
        description: playlist.description || "",
        tags: playlist.tags.join(",") || "",
      }
    : {
        name: "",
        description: "",
        tags: "",
      };
  const form = useForm({
    resolver: zodResolver(playListSchema),
    defaultValues: defaultValues,
  });

  let initSortableGames: suggestionType[] = [];
  if (playlist) {
    initSortableGames = playlist.playListGames.map((playlistGame) => {
      return {
        id: playlistGame.game.id,
        name: playlistGame.game.name,
        slug: playlistGame.game.slug,
      };
    });
  }
  const [sortableGames, setsortableGames] =
    useState<suggestionType[]>(initSortableGames);
  // Allows to change game order in the list
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortableGames.findIndex(
      (sortableGame) => sortableGame.slug === active.id
    );
    const newIndex = sortableGames.findIndex(
      (sortableGame) => sortableGame.slug === over.id
    );

    if (oldIndex !== -1 && newIndex !== -1) {
      setsortableGames((prevsortableGames) => {
        return arrayMove(prevsortableGames, oldIndex, newIndex);
      });
    }
  }
  // Allows to remove a game from the list
  function handleGameListRemove(gameSlug: string) {
    setsortableGames((prevsortableGames) =>
      prevsortableGames.filter((game) => game.slug !== gameSlug)
    );
  }

  async function onSubmit(values: z.infer<typeof playListSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description || "");
    formData.append("tags", values.tags || "");

    let result: { message: string; success: boolean };
    // Form action can be edit or create
    if (!playlist) {
      result = await createPlaylist(formData, sortableGames);
    } else {
      result = await updatePlaylist(playlist.id, formData, sortableGames);
    }
    if (!result.success) {
      setErrorMessage(result.message);
    }
  }
  // Allows to add game to the list via search input
  function handleClickSuggestion(game: suggestionType) {
    setsortableGames((prev) => {
      return [...prev, game];
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-xl p-6 bg-white rounded-2xl shadow-lg mt-10 flex-col space-y-6"
      >
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="w-full p-2 border rounded-md resize-none"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter tags separated by commas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Add games</FormLabel>
          <SearchBar handleClickSuggestion={handleClickSuggestion} />
          <FormDescription>Add game to the list</FormDescription>
          <FormMessage />
          <SortableGameList
            handleDragEnd={handleDragEnd}
            sortableGames={sortableGames}
            handleGameListRemove={handleGameListRemove}
          />
        </FormItem>

        <div className="flex justify-between items-center">
          {form.formState.isSubmitting ? (
            <Button disabled className="mt-10 w-full">
              <Loader2 className="animate-spin" />
              Submitting...
            </Button>
          ) : (
            <Button type="submit" className="mt-10 w-full">
              {type === "edit" ? "Edit Playlist" : "Create Playlist"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
