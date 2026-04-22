import EditorPage from "@/components/admin/EditorPage";

export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-sm font-black uppercase tracking-[0.3em] text-popcorn-red mb-2">Content Creator</h1>
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-black">Draft New Post</h2>
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">v1.0</span>
        </div>
      </header>
      
      <EditorPage />
    </div>
  );
}