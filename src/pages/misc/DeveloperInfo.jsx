import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Code2, 
  Cpu, 
  Globe, 
  ShieldCheck,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import apiService from "../../api/apiService";

const DeveloperInfo = () => {
  const { data: developer, isLoading } = useQuery({
    queryKey: ["developer"],
    queryFn: apiService.fetchDeveloper,
  });

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Developer Info</h1>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
            <Code2 size={40} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-800">Advanced App Engine</h2>
            <p className="text-blue-600 font-bold text-sm">Version 3.1.2-beta</p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-blue-600" size={24} />
            </div>
          ) : (
            <>
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl space-x-4">
                <Globe className="text-blue-500" size={20} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase">Deployed At</p>
                  <p className="text-sm font-bold text-gray-800">{developer?.deployed_at || "Global CDN"}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl space-x-4">
                <Cpu className="text-purple-500" size={20} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase">Powered by</p>
                  <p className="text-sm font-bold text-gray-800">{developer?.engine || "Vite & React 19"}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl space-x-4">
                <ShieldCheck className="text-green-500" size={20} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase">Security</p>
                  <p className="text-sm font-bold text-gray-800">SSL Encrypted</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="text-center font-bold text-gray-300 text-xs tracking-widest uppercase py-8">
        © 2024 AGS Solutions Ltd.
      </div>
    </div>
  );
};

export default DeveloperInfo;
