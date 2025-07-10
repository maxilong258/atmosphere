import { ListMusic, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { useSavedLinks } from "@/store/saved_link_store";

export const SaveList = ({onPlayListItem}: {onPlayListItem: (url: string) => void}) => {
  const [newLinkName, setNewLinkName] = useState("");
  const { links, addLink, removeLink } = useSavedLinks();

  // 保存新链接
  const saveCurrentLink = () => {
    if (!newLinkName.trim()) return;
    addLink(newLinkName, window.location.search);
    setNewLinkName("");
  };

  // 点击保存的链接
  const handleLinkClick = (url: string) => {
    onPlayListItem(url)
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ListMusic
            style={{
              filter:
                "drop-shadow(0px 0px 2px hsl(120, 100%, 80%)) drop-shadow(0px 0px 8px green)",
            }}
            color="#fbfbf3"
            strokeWidth={2.5}
            className="h-[1.5rem] w-[1.5rem]"
          />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-[20rem] bg-gray-900 text-white">
        <div className="flex p-2 gap-2">
          <Input
            placeholder="Input group name"
            value={newLinkName}
            onChange={(e) => setNewLinkName(e.target.value)}
            className="bg-gray-900 text-white"
          />
          <Button size="icon" className="w-[4rem] bg-gray-600 text-white" onClick={saveCurrentLink}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {links.map((link, index) => (
          <DropdownMenuItem
            key={index}
            className="flex justify-between items-center group"
          >
            <span 
              className="flex-1 cursor-pointer" 
              onClick={() => handleLinkClick(link.url)}
            >
              {link.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                removeLink(index);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};