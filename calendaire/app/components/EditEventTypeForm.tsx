import { CardContent } from "@/components/ui/card";

interface EditEventTypeFormProps {
  form: {
    id: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  };
  formAction: (formData: FormData) => Promise<void>;
  id: string;
}

export function EditEventTypeForm({ form, formAction, id }: EditEventTypeFormProps) {
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={formAction} noValidate>
      <input type="hidden" name="id" value={id} />
      <CardContent className="grid gap-y-4">
        <div className="flex flex-col gap-y-2">
        </div>
      </CardContent>
    </form>
  );
} 