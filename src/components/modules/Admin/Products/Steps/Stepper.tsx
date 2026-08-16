import React from"react";
import { Check } from"lucide-react";
import { cn } from"@/lib/utils";

interface StepperProps {
 currentStep: number;
 steps: {
 id: number;
 title: string;
 icon: React.ElementType;
 }[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
 // Calculate progress percentage
 const progressPercentage = Math.min(((currentStep - 1) / (steps.length - 1)) * 100, 100);

 return (
 <div className="w-full mb-10">
 <div className="p-4 md:p-8 relative overflow-hidden group">
 
 {/* Subtle background glow effect */}
 <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-custom/5 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700"/>
 <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700"/>

 <div className="flex items-center justify-between w-full relative z-10">
 {/* Background Timeline connecting line */}
 <div className="absolute left-[5%] top-[24px] w-[90%] h-[3px] bg-slate-200/80 dark:bg-slate-800/80 rounded-full -z-10"/>
 
 {/* Active Timeline connecting line */}
 <div 
 className="absolute left-[5%] top-[24px] h-[3px] bg-primary-custom rounded-full -z-10 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(194,88,145,0.4)]"
 style={{ width: `${progressPercentage * 0.9}%` }}
 />
 
 {steps.map((step) => {
 const isCompleted = currentStep > step.id;
 const isCurrent = currentStep === step.id;
 const Icon = step.icon;

 return (
 <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 w-24">
 {/* Ping Animation for Active Step */}
 {isCurrent && (
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary-custom/20 animate-ping"/>
 )}

 <div
 className={cn(
"w-12 h-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-500 relative bg-white dark:bg-slate-950",
 isCompleted
 ?"border-primary-custom bg-primary-custom text-white shadow-[0_0_15px_rgba(194,88,145,0.4)] scale-105"
 : isCurrent
 ?"border-primary-custom text-primary-custom shadow-[0_0_20px_rgba(194,88,145,0.3)] scale-110"
 :"border-slate-200 dark:border-slate-800 text-slate-400"
 )}
 >
 {isCompleted ? (
 <Check className="w-5 h-5 animate-in zoom-in duration-300"/>
 ) : (
 <Icon className={cn("w-5 h-5 transition-transform duration-300", isCurrent &&"scale-110")} />
 )}
 </div>
 
 <div className="flex flex-col items-center">
 <span
 className={cn(
"text-[9px] font-medium tracking-[0.15em] text-center transition-colors duration-300",
 isCompleted ?"text-primary-custom": isCurrent ?"text-slate-900 dark:text-white":"text-slate-400"
 )}
 >
 Step {step.id}
 </span>
 <span
 className={cn(
"text-sm font-bold text-center mt-0.5 transition-all duration-300",
 isCurrent || isCompleted ?"text-slate-600 dark:text-slate-300 opacity-100 translate-y-0":"text-slate-400 opacity-0 -translate-y-1 hidden md:block"
 )}
 >
 {step.title}
 </span>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
}
