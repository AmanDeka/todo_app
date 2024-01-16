import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from './button';
import { cn } from '../lib/utils';
import { X,Check } from 'lucide-react';
import { Textarea } from './textarea';

interface TaskProps {
  id: string;
  initialHeading: string;
  initialDescription: string;
  completed: boolean;
  onToggleCompletion: () => void;
}

const Task: React.FC<TaskProps> = ({ id, initialHeading, initialDescription, completed, onToggleCompletion }) => {
  const [heading, setHeading] = useState(initialHeading);
  const [description, setDescription] = useState(initialDescription);
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handleHeadingClick = () => {
    setIsEditingHeading(true);
  };

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
  };

  const handleHeadingChange: React.ChangeEventHandler<HTMLHeadingElement> = (event) => {
    setHeading(event.target.innerText);
  };

  const handleDescriptionChange: React.ChangeEventHandler<HTMLParagraphElement> = (event) => {
    setDescription(event.target.innerText);
  };

  const handleHeadingBlur = () => {
    setIsEditingHeading(false);
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
  };

  return (
    <Card className={cn("w-[380px]", "border-slate-500", "text-wrap", "task")}>
      <CardHeader >
        <CardTitle>
          <h2
            onClick={handleHeadingClick}
            onBlur={handleHeadingBlur}
            contentEditable={isEditingHeading}
            suppressContentEditableWarning={true}>{heading}</h2>
        </CardTitle>
      </CardHeader>



      <CardContent className="grid gap-4 w-full">
        <Textarea className="flex items-center space-x-4 rounded-md border border-slate-500 p-4 w-11/12 resize-none"
          onClick={handleDescriptionClick}
          onBlur={handleDescriptionBlur}
          contentEditable={isEditingDescription}
          suppressContentEditableWarning={true}
        >
          {description}
        </Textarea>


        <Button
          className={`w-5/12 ${completed ? 'bg-green-500' : 'border-slate-500'}`}
          variant={'outline'}
          onClick={onToggleCompletion}
        >
          {
            !completed
            ?
            (<><X />Not Done</>)
            :
            (<><Check />Done</>)
}
        </Button>


      </CardContent>
    </Card>
  );
};

export default Task;
