import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from './button';
import { cn } from '../lib/utils';
import { X, Check } from 'lucide-react';
import { Textarea } from './textarea';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@radix-ui/react-dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface TaskProps {
  id: string;
  initialHeading: string;
  initialDescription: string;
  completed: boolean;
  onToggleCompletion: () => void;
  onTitleChange: (newTitle: string) => void;
  onDescriptionChange: (newDescription: string) => void;
  onDelete: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({
  id,
  initialHeading,
  initialDescription,
  completed,
  onToggleCompletion,
  onTitleChange,
  onDescriptionChange,
  onDelete
}) => {
  const [heading, setHeading] = useState(initialHeading);
  const [description, setDescription] = useState(initialDescription);
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  console.log(id, initialHeading);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isEditingHeading && headingRef.current && !headingRef.current.contains(event.target as Node)) {
        handleHeadingBlur();
      }

      if (isEditingDescription && descriptionRef.current && !descriptionRef.current.contains(event.target as Node)) {
        handleDescriptionBlur();
      }
    };

    if (isEditingHeading || isEditingDescription) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isEditingHeading, isEditingDescription]);

  const handleHeadingClick = () => {
    setIsEditingHeading(true);
  };

  const handleHeadingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHeading(event.target.value);
  };

  const handleHeadingBlur = () => {
    setIsEditingHeading(false);
    onTitleChange(heading);
  };

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    onDescriptionChange(description);
  };

  const handleDeleteClick = () => {
    onDelete(id);
  }

  return (
    <Card className={cn("w-[380px]", "border-slate-500", "text-wrap", "task")}>
      <CardHeader>
        <CardTitle>
          {isEditingHeading ? (
            <input
              type="text"
              value={heading}
              onChange={handleHeadingChange}
              onBlur={handleHeadingBlur}
            />
          ) : (
            <h2
              onClick={handleHeadingClick}
              suppressContentEditableWarning={true}
              ref={headingRef}
            >
              {heading}
            </h2>
          )}
        </CardTitle>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={'outline'} size={'icon'}><MoreVertical className='h-4 w-4' /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-primary border text-primary-foreground w-41 p-4">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='w-full'>
              <Button onClick={() => handleDeleteClick()}>Delete</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </CardHeader>

      <CardContent className="grid gap-4 w-full">
        <Textarea
          className="flex items-center space-x-4 rounded-md border border-slate-500 p-4 w-11/12 resize-none"
          ref={descriptionRef}
          onClick={handleDescriptionClick}
          onBlur={handleDescriptionBlur}
          value={description}
          onChange={handleDescriptionChange}
        />

        <Button
          className={`w-5/12 ${completed ? 'bg-green-500' : 'border-slate-500'}`}
          variant={'outline'}
          onClick={onToggleCompletion}
        >
          {completed ? <><Check />Done</> : <><X />Not Done</>}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Task;
