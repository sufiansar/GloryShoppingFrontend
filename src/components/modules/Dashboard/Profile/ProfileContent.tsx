"use client";

import { IUser } from "@/types/User.interface";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileContentProps {
  userData: IUser | null;
}

export default function ProfileContent({ userData }: ProfileContentProps) {
  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 shadow-xl">
        <AlertCircle className="h-16 w-16 text-slate-300 mb-4" />
        <p className="text-xl font-bold text-slate-500">No profile data found.</p>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-10">
      {/* User Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-12 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-custom blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-secondary-custom blur-[80px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="relative group">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-linear-to-br from-primary-custom to-secondary-custom p-1.5 shadow-2xl shadow-primary-custom/30 ring-4 ring-white/10 transition-transform duration-500 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[2.2rem] bg-slate-900 overflow-hidden">
                {userData.profileImage ? (
                   <img src={userData.profileImage} alt={userData.name} className="h-full w-full object-cover" />
                ) : (
                   <User className="h-16 w-16 md:h-20 md:w-20 text-white/50" />
                )}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-xl shadow-slate-900/40 ring-4 ring-slate-900 transition-all hover:scale-110 active:scale-95 cursor-pointer">
              <Edit3 className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur-md ring-1 ring-white/20 tracking-wider uppercase">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Account</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white lg:text-5xl">
                {userData.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary-custom" />
                <span className="font-bold text-slate-300 uppercase tracking-widest">{userData.role || "User"}</span>
              </div>
              <div className="hidden md:block h-1.5 w-1.5 bg-slate-700 rounded-full" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-custom" />
                <span>Joined {formatDate(userData.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
             <Button className="rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 shadow-xl shadow-slate-900/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95">
               Edit Profile
             </Button>
          </div>
        </div>
      </section>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <Card className="rounded-[2rem] border-0 bg-white p-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-100">
          <CardHeader className="pt-6 px-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Contact Information</CardTitle>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                 <Mail className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email Address</span>
                <div className="flex items-center gap-3 group">
                   <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-primary-custom/10 group-hover:text-primary-custom transition-all duration-300">
                     <Mail className="h-4 w-4" />
                   </div>
                   <span className="text-sm font-bold text-slate-800">{userData.email}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Phone Number</span>
                <div className="flex items-center gap-3 group">
                   <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-primary-custom/10 group-hover:text-primary-custom transition-all duration-300">
                     <Phone className="h-4 w-4" />
                   </div>
                   <span className="text-sm font-bold text-slate-800">{userData.phone || "Not specified"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card className="rounded-[2rem] border-0 bg-white p-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-100">
          <CardHeader className="pt-6 px-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Account Status</CardTitle>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                 <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Verification</span>
                <div className="flex items-center gap-3 group">
                   <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                     <ShieldCheck className="h-4 w-4" />
                   </div>
                   <span className="text-sm font-bold text-emerald-600">Email Verified</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Profile Completion</span>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
                   <div className="bg-primary-custom h-full w-3/4 rounded-full shadow-[0_0_8px_rgba(194,88,145,0.4)]" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest text-right">75% Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics or Key Dates */}
        <Card className="rounded-[2rem] border-0 bg-white p-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-100">
          <CardHeader className="pt-6 px-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Timeline</CardTitle>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                 <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
             <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last Profile Update</span>
                <div className="flex items-center gap-3 group">
                   <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-primary-custom/10 group-hover:text-primary-custom transition-all duration-300">
                     <Calendar className="h-4 w-4" />
                   </div>
                   <span className="text-sm font-bold text-slate-800">{formatDate(userData.updatedAt)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Type</span>
                <div className="flex items-center gap-3 group">
                   <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-primary-custom/10 group-hover:text-primary-custom transition-all duration-300">
                     <User className="h-4 w-4" />
                   </div>
                   <span className="text-sm font-bold text-slate-800 uppercase tracking-widest leading-6">{userData.role}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Addresses Section */}
      <Card className="rounded-[2.5rem] border-0 bg-white p-4 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 ring-1 ring-slate-100">
        <CardHeader className="pt-8 px-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Saved Addresses</CardTitle>
              <p className="text-sm font-medium text-slate-500 italic">Manage your delivery and billing locations</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100">
               <MapPin className="h-6 w-6" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-6">
          {userData.addresses && userData.addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.addresses.map((address, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-3xl p-6 bg-slate-50 p-6 ring-1 ring-slate-200/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="absolute right-0 top-0 h-20 w-20 opacity-[0.03] group-hover:scale-150 transition-transform">
                     <MapPin className="h-full w-full" />
                  </div>
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-custom bg-primary-custom/10 px-2 py-1 rounded-lg ring-1 ring-primary-custom/20">
                         {address.label || "Address"}
                       </span>
                       {address.isDefault && (
                         <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg ring-1 ring-emerald-200/50 uppercase">
                           <CheckCircle2 className="h-3 w-3" />
                           Default
                         </div>
                       )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900 leading-snug">{address.name}</p>
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                        {address.street}, {address.city}<br />
                        {address.district}, {address.postalCode}<br />
                        {address.country}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-3xl ring-1 ring-inset ring-slate-100">
               <div className="p-4 rounded-full bg-slate-100 mb-4 transition-transform group-hover:scale-110">
                  <MapPin className="h-8 w-8 text-slate-400" />
               </div>
               <p className="text-sm font-bold text-slate-500">No addresses added yet.</p>
               <Button variant="link" className="text-primary-custom font-black uppercase text-xs tracking-widest mt-2 hover:no-underline hover:scale-105 transition-all">Add New Address</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
