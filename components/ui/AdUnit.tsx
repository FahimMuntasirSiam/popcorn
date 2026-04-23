import React from 'react';

interface AdUnitProps {
  type: "banner" | "sidebar" | "interstitial" | "native";
  position: string;
}

const AdUnit = ({ type, position }: AdUnitProps) => {
  // Define responsive classes based on type
  const containerClasses = {
    banner: "w-full min-h-[50px] md:min-h-[90px] flex items-center justify-center bg-white/5 border border-dashed border-white/10 my-8 rounded-xl overflow-hidden",
    sidebar: "w-full min-h-[250px] flex items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-xl overflow-hidden",
    interstitial: "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm",
    native: "w-full p-4 bg-white/5 border border-white/10 rounded-2xl"
  };

  return (
    <>
      {/* ADSTERRA: Replace this div's contents with your ad code */}
      <div 
        data-ad-position={position} 
        className={`${containerClasses[type]} ad-container transition-all hover:bg-white/10`}
      >
        <div className="flex flex-col items-center space-y-2 opacity-20">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Advertisement</span>
          <div className="text-[8px] border border-white/20 px-2 py-0.5 rounded uppercase">{type} • {position}</div>
        </div>
        
        {/*
          PASTE YOUR AD SCRIPT BELOW THIS COMMENT
          EXAMPLE:
          <script type="text/javascript">
            atOptions = { 'key' : '...', 'format' : 'iframe', ... };
            document.write('<scr' + 'ipt type="text/javascript" src="..."></scr' + 'ipt>');
          </script>
        */}
      </div>
    </>
  );
};

export default AdUnit;
