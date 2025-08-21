import { Rocket, Users, Shield, Sparkles } from 'lucide-react';
import LinkButton from '@/components/ui/LinkButton';

export default function Page() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white p-12 lg:p-16">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"></div>
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30 px-4 py-2 text-sm font-medium">
              <Sparkles size={16}/> 
              Mission-critical talent alignment
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-none">
                Align people to 
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  missions
                </span>
                with confidence
              </h1>
              <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                Members document skills. Supervisors evaluate personnel. Commanders create roles and run strategic matching.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <LinkButton href="/member-survey" variant="secondary" size="lg">
                <Users size={20} className="mr-2"/> I'm a Member
              </LinkButton>
              <LinkButton href="/supervisor-survey" variant="secondary" size="lg">
                <Shield size={20} className="mr-2"/> I'm a Supervisor
              </LinkButton>
              <LinkButton href="/match" variant="secondary" size="lg">
                <Rocket size={20} className="mr-2"/> Run Matching
              </LinkButton>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 ring-1 ring-white/20">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="space-y-2 animate-float" style={{animationDelay: '0s'}}>
                  <div className="text-4xl font-black">3</div>
                  <div className="text-white/80 text-sm font-medium">Active Roles</div>
                </div>
                <div className="space-y-2 animate-float" style={{animationDelay: '1s'}}>
                  <div className="text-4xl font-black">12</div>
                  <div className="text-white/80 text-sm font-medium">Members</div>
                </div>
                <div className="space-y-2 animate-float" style={{animationDelay: '2s'}}>
                  <div className="text-4xl font-black">8</div>
                  <div className="text-white/80 text-sm font-medium">Skills</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold gradient-text">Mission workflow</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Clear role-based access ensures proper data flow from member skills to supervisor evaluations to commander decisions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover-lift">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl"></div>
            <div className="relative space-y-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Users size={24}/>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Members</h3>
                <p className="text-slate-600 leading-relaxed">
                  Document your skills, certifications, experience, and preferences. Provide complete profile data for accurate matching.
                </p>
              </div>
              <LinkButton href="/member-survey" className="w-full">
                Complete Skills Profile
              </LinkButton>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 hover-lift">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-2xl"></div>
            <div className="relative space-y-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Shield size={24}/>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Supervisors</h3>
                <p className="text-slate-600 leading-relaxed">
                  Evaluate member performance, skills, and potential. Provide assessment data to inform strategic personnel decisions.
                </p>
              </div>
              <LinkButton href="/supervisor-survey" className="w-full">
                Evaluate Personnel
              </LinkButton>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-8 hover-lift">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-2xl"></div>
            <div className="relative space-y-6">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Rocket size={24}/>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Commanders</h3>
                <p className="text-slate-600 leading-relaxed">
                  Define mission-critical roles, set requirements, and execute strategic matching algorithms for optimal team composition.
                </p>
              </div>
              <LinkButton href="/roles" className="w-full">
                Create Roles & Match
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
