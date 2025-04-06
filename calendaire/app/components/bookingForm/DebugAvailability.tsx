"use client";

interface DebugAvailabilityProps {
  availability: Array<{
    id: string;
    day: string;
    isActive: boolean;
  }>;
}

export function DebugAvailability({ availability }: DebugAvailabilityProps) {
  return (
    <div className="border p-4 mt-4 rounded-md bg-slate-50">
      <h3 className="font-semibold mb-2">Availability Debug</h3>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(availability, null, 2)}
      </pre>
    </div>
  );
} 