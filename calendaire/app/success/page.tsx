import { Button } from "@/components/ui/button";
import { CalendarCheck, Calendar, Mail, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-green-100 dark:border-green-900/30 overflow-hidden animate-in slide-in-from-bottom-5 fade-in-50 duration-500">
        <div className="bg-green-50 dark:bg-green-900/20 p-6 border-b border-green-100 dark:border-green-900/30 flex items-center justify-center flex-col">
          <div className="bg-green-100 dark:bg-green-800/30 p-3 rounded-full mb-3">
            <CalendarCheck className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">Booking Confirmed!</h1>
        </div>
        
        <div className="p-6 space-y-5">
          <p className="text-center text-muted-foreground">
            Your meeting has been successfully scheduled. A confirmation email with all the details has been sent to your inbox.
          </p>
          
          <div className="space-y-4 py-3">
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <Calendar className="size-5 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium">Check Your Calendar</p>
                <p className="text-xs text-muted-foreground">The event has been added to your calendar</p>
              </div>
            </div>
            
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <Mail className="size-5 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium">Check Your Email</p>
                <p className="text-xs text-muted-foreground">We&apos;ve sent you an email with all the details</p>
              </div>
            </div>
            
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <LinkIcon className="size-5 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium">Meeting Link</p>
                <p className="text-xs text-muted-foreground">Meeting link will be provided in the calendar invitation</p>
              </div>
            </div>
          </div>
          
          <div className="pt-3">
            <Link href="/">
              <Button className="w-full">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 