'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

type Course = { id: string; provider: string; title: string; url: string; skills: string[] };

export default function MemberSurvey() {
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('');
  const [unit, setUnit] = useState('Delta6Det4');
  const [dutyTitle, setDutyTitle] = useState('');

  const [primarySkills, setPrimarySkills] = useState('red teaming, recon');
  const [secondarySkills, setSecondarySkills] = useState('linux, python');
  const [yearsBySkill, setYearsBySkill] = useState('red teaming:2; recon:1');
  const [tools, setTools] = useState('Burp Suite, Nmap, Wireshark');
  const [certs, setCerts] = useState('Security+, OSCP');
  const [trainingInProgress, setTrainingInProgress] = useState('OSCP:40; SANS 504:20');
  const [interestedRoles, setInterestedRoles] = useState('Red Team Member, Threat Hunter');
  const [avoidRoles, setAvoidRoles] = useState('');
  const [prefTechLeadership, setPrefTechLeadership] = useState(3);
  const [prefOpsTraining, setPrefOpsTraining] = useState(3);
  const [willingPCS, setWillingPCS] = useState<'Yes'|'No'|'Later'>('Later');
  const [willingCrossCF, setWillingCrossCF] = useState<'Yes'|'No'>('Yes');
  const [timeConstraints, setTimeConstraints] = useState('');
  const [clearance, setClearance] = useState('Secret');
  const [freeText, setFreeText] = useState('I like red teaming, recon, linux, python.');
  const [learningGoals, setLearningGoals] = useState('Get better at opsec and reporting.');
  const [consent, setConsent] = useState(false);
  const [trainingReady, setTrainingReady] = useState(50);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data: Course[] = await api('/catalog/training');
        setCourses(data);
      } catch {}
    })();
  }, []);

  const toggleCourse = (id: string) => {
    setSelectedCourses(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const yearsParsed = useMemo(() => Object.fromEntries(yearsBySkill.split(';').map(s=>s.trim()).filter(Boolean).map(pair=>{
    const [skill, yrs] = pair.split(':').map(x=>x.trim());
    return [skill, Number(yrs||0)];
  })), [yearsBySkill]);

  async function submit() {
    const payload = {
      person_id: null,
      data: {
        identity: { full_name: fullName, grade, unit, duty_title: dutyTitle },
        primary_skills: primarySkills.split(',').map(s=>s.trim()).filter(Boolean),
        secondary_skills: secondarySkills.split(',').map(s=>s.trim()).filter(Boolean),
        years_by_skill: yearsParsed,
        tools: tools.split(',').map(s=>s.trim()).filter(Boolean),
        certifications: certs.split(',').map(s=>s.trim()).filter(Boolean),
        training_in_progress: trainingInProgress.split(';').map(s=>s.trim()).filter(Boolean).map(chunk => {
          const [name, pct] = chunk.split(':').map(x=>x.trim());
          return { name, pct: Number(pct||0) };
        }),
        interested_roles: interestedRoles.split(',').map(s=>s.trim()).slice(0,5),
        avoid_roles: avoidRoles ? avoidRoles.split(',').map(s=>s.trim()).slice(0,3) : [],
        preference_tech_vs_leadership: prefTechLeadership,
        preference_ops_vs_training: prefOpsTraining,
        willing_pcs: willingPCS,
        willing_cross_career_field: willingCrossCF,
        time_constraints: timeConstraints,
        clearance_level: clearance,
        self_rated_proficiency: {},
        learning_goals: learningGoals,
        desired_courses: selectedCourses,
        anything_else: freeText,
        consent: consent,
        relevant_years: Math.max(...Object.values(yearsParsed).map(Number).concat([0])),
        training_ready: trainingReady,
        skills: Array.from(new Set([
          ...primarySkills.split(',').map(s=>s.trim()),
          ...secondarySkills.split(',').map(s=>s.trim())
        ].filter(Boolean)))
      }
    };
    await api('/ingest/member-survey', { method: 'POST', body: JSON.stringify(payload) });
    alert('Submitted');
  }

  return (
    <main>
      <h2>Member Survey — Self-Profile & Preferences</h2>
      <div style={{display:'grid', gap:12}}>
        <label>Full name <input value={fullName} onChange={e=>setFullName(e.target.value)} style={{width:'100%'}}/></label>
        <div style={{display:'flex', gap:16}}>
          <label>Rank/Grade <input value={grade} onChange={e=>setGrade(e.target.value)} /></label>
          <label>Current unit <input value={unit} onChange={e=>setUnit(e.target.value)} /></label>
          <label>Duty title <input value={dutyTitle} onChange={e=>setDutyTitle(e.target.value)} /></label>
        </div>

        <label>Primary skill areas (comma)</label>
        <input value={primarySkills} onChange={e=>setPrimarySkills(e.target.value)} style={{width:'100%'}}/>
        <label>Secondary skill areas (comma)</label>
        <input value={secondarySkills} onChange={e=>setSecondarySkills(e.target.value)} style={{width:'100%'}}/>
        <label>Years of experience per skill (skill:years; skil2:years)</label>
        <input value={yearsBySkill} onChange={e=>setYearsBySkill(e.target.value)} style={{width:'100%'}}/>
        <label>Tools/technologies (comma)</label>
        <input value={tools} onChange={e=>setTools(e.target.value)} style={{width:'100%'}}/>
        <label>Certifications (comma)</label>
        <input value={certs} onChange={e=>setCerts(e.target.value)} style={{width:'100%'}}/>
        <label>Training in progress (Course:percent; ...)</label>
        <input value={trainingInProgress} onChange={e=>setTrainingInProgress(e.target.value)} style={{width:'100%'}}/>

        <label>Roles you’re interested in (up to 5, comma)</label>
        <input value={interestedRoles} onChange={e=>setInterestedRoles(e.target.value)} style={{width:'100%'}}/>
        <label>Roles you do not want (up to 3, comma)</label>
        <input value={avoidRoles} onChange={e=>setAvoidRoles(e.target.value)} style={{width:'100%'}}/>

        <div style={{display:'flex', gap:16}}>
          <label>Preference: technical vs. leadership (1–5) <input type="number" min={1} max={5} value={prefTechLeadership} onChange={e=>setPrefTechLeadership(Number(e.target.value))}/></label>
          <label>Preference: ops vs. training (1–5) <input type="number" min={1} max={5} value={prefOpsTraining} onChange={e=>setPrefOpsTraining(Number(e.target.value))}/></label>
        </div>

        <div style={{display:'flex', gap:16}}>
          <label>Willing to move units (PCS)
            <select value={willingPCS} onChange={e=>setWillingPCS(e.target.value as any)}>
              <option>Yes</option>
              <option>No</option>
              <option>Later</option>
            </select>
          </label>
          <label>Willing to cross-career-field
            <select value={willingCrossCF} onChange={e=>setWillingCrossCF(e.target.value as any)}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
          <label>Clearance level
            <select value={clearance} onChange={e=>setClearance(e.target.value)}>
              <option>Unclassified</option>
              <option>Secret</option>
              <option>Top Secret</option>
              <option>TS/SCI</option>
            </select>
          </label>
        </div>

        <label>Time constraints (free text)</label>
        <input value={timeConstraints} onChange={e=>setTimeConstraints(e.target.value)} style={{width:'100%'}}/>

        <label>Learning goals (6–12 months)</label>
        <textarea value={learningGoals} onChange={e=>setLearningGoals(e.target.value)} rows={3} style={{width:'100%'}}/>

        <div>
          <div>Courses you want to take (multi-select)</div>
          <div style={{display:'grid', gap:4, maxHeight:180, overflow:'auto', border:'1px solid #ccc', padding:8}}>
            {courses.map(c => (
              <label key={c.id} style={{display:'flex', gap:8, alignItems:'center'}}>
                <input type="checkbox" checked={selectedCourses.includes(c.id)} onChange={()=>toggleCourse(c.id)} />
                <span>{c.provider}: {c.title}</span>
              </label>
            ))}
          </div>
        </div>

        <label>Anything else MOSaic should consider?</label>
        <textarea value={freeText} onChange={e=>setFreeText(e.target.value)} rows={4} style={{width:'100%'}}/>

        <div style={{display:'flex', gap:16, alignItems:'center'}}>
          <label>Consent to use data <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} /></label>
          <label>Training readiness % <input type="number" value={trainingReady} onChange={e=>setTrainingReady(Number(e.target.value))}/></label>
        </div>

        <button onClick={submit} style={{marginTop:12}}>Submit</button>
      </div>
    </main>
  );
}
