import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-white grid place-content-center">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="font-bold gradient-text text-lg">MOSaic</div>
                <div className="text-xs text-slate-500">Mission-Oriented Skill Alignment</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 max-w-sm">
              Intelligent talent-mission alignment for modern organizations. 
              Connect skills with opportunities that matter.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Platform</h4>
              <div className="space-y-2 text-sm">
                <a href="/" className="block text-slate-600 hover:text-violet-700 transition-colors">Home</a>
                <a href="/member-survey" className="block text-slate-600 hover:text-violet-700 transition-colors">Member Survey</a>
                <a href="/supervisor-survey" className="block text-slate-600 hover:text-violet-700 transition-colors">Supervisor Survey</a>
                <a href="/roles" className="block text-slate-600 hover:text-violet-700 transition-colors">Roles</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Access</h4>
              <div className="space-y-2 text-sm">
                <a href="/login" className="block text-slate-600 hover:text-violet-700 transition-colors">Sign In</a>
                <a href="/register" className="block text-slate-600 hover:text-violet-700 transition-colors">Create Account</a>
                <a href="/match" className="block text-slate-600 hover:text-violet-700 transition-colors">Matching</a>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Ready to optimize your team?</h4>
            <div className="space-y-2">
              <a href="/register" className="inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 px-4 py-2 text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-violet-500/25">
                Get Started
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} MOSaic. All rights reserved.
          </div>
          <div className="text-xs text-slate-500">
            Built with modern web technologies for mission success.
          </div>
        </div>
      </div>
    </footer>
  );
}


