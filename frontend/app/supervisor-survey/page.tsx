'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function SupervisorSurvey() {
  const [roleId, setRoleId] = useState<number|''>('' as any);
  const [roleTitle, setRoleTitle] = useState('Red Team Member');
  const [billetId, setBilletId] = useState('RT-001');
  const [mustList, setMustList] = useState('red teaming:3:5; recon:2:3');
  const [niceList, setNiceList] = useState('linux:1:2; python:1:2');
  const [mandatoryCerts, setMandatoryCerts] = useState('Security+');
  const [minGrade, setMinGrade] = useState('SRA');
  const [clearance, setClearance] = useState('Secret');
  const [expReq, setExpReq] = useState('2 years in red teaming');
  const [missionContext, setMissionContext] = useState('Adversary emulation for training.');
  const [cmdPriority, setCmdPriority] = useState(3);
  const [relocation, setRelocation] = useState('Same squadron');
  const [shiftConstraints, setShiftConstraints] = useState('Day shift');
  const [trainRunway, setTrainRunway] = useState('90 days');
  const [disqualifiers, setDisqualifiers] = useState('None');
  const [diversityPref, setDiversityPref] = useState(3);
  const [suggestedCourses, setSuggestedCourses] = useState('du-cts-101, sans-504');
  const [stakeholders, setStakeholders] = useState('DO, SQ/CC');
  const [altTitles, setAltTitles] = useState('Adversary Emulator');
  const [notes, setNotes] = useState('');

  async function submit() {
    const payload = { role_id: roleId || null, data: {
      role_title: roleTitle,
      billet_id: billetId,
      must_have: mustList.split(';').map(s=>s.trim()).filter(Boolean).map(pair=>{
        const [skill, min, weight] = pair.split(':').map(x=>x.trim());
        return { skill, min_level: Number(min||1), weight: Number(weight||1) };
      }),
      nice_to_have: niceList.split(';').map(s=>s.trim()).filter(Boolean).map(pair=>{
        const [skill, weight] = pair.split(':').map(x=>x.trim());
        const w = Number((weight||'').split(':').pop() || 1);
        return { skill, weight: w };
      }),
      mandatory_certs: mandatoryCerts.split(',').map(s=>s.trim()).filter(Boolean),
      min_grade: minGrade,
      clearance_requirement: clearance,
      experience_requirement: expReq,
      mission_context: missionContext,
      commander_priority_weight: cmdPriority,
      relocation_allowed: relocation,
      shift_constraints: shiftConstraints,
      training_runway: trainRunway,
      disqualifiers: disqualifiers,
      diversity_of_experience_preference: diversityPref,
      suggested_courses: suggestedCourses.split(',').map(s=>s.trim()).filter(Boolean),
      stakeholders: stakeholders.split(',').map(s=>s.trim()).filter(Boolean),
      alternate_titles: altTitles,
      notes
    }};
    await api('/ingest/supervisor-survey', { method: 'POST', body: JSON.stringify(payload) });
    alert('Submitted');
  }

  return (
    <main>
      <h2>Supervisor Survey — Billet Requirements & Preferences</h2>
      <div style={{display:'grid', gap:12}}>
        <div style={{display:'flex', gap:16}}>
          <label>Role title <input value={roleTitle} onChange={e=>setRoleTitle(e.target.value)} /></label>
          <label>Billet ID <input value={billetId} onChange={e=>setBilletId(e.target.value)} /></label>
          <label>Role ID (optional) <input value={roleId as any} onChange={e=>setRoleId(Number(e.target.value))}/></label>
        </div>
        <label>Must-have skills (skill:min:weight; ...)</label>
        <input value={mustList} onChange={e=>setMustList(e.target.value)} style={{width:'100%'}}/>
        <label>Nice-to-have skills (skill:weight; ...)</label>
        <input value={niceList} onChange={e=>setNiceList(e.target.value)} style={{width:'100%'}}/>
        <label>Mandatory certs (comma)</label>
        <input value={mandatoryCerts} onChange={e=>setMandatoryCerts(e.target.value)} style={{width:'100%'}}/>
        <div style={{display:'flex', gap:16}}>
          <label>Minimum grade <input value={minGrade} onChange={e=>setMinGrade(e.target.value)} /></label>
          <label>Clearance requirement
            <select value={clearance} onChange={e=>setClearance(e.target.value)}>
              <option>Unclassified</option>
              <option>Secret</option>
              <option>Top Secret</option>
              <option>TS/SCI</option>
            </select>
          </label>
        </div>
        <label>Experience requirement (free text)</label>
        <input value={expReq} onChange={e=>setExpReq(e.target.value)} style={{width:'100%'}}/>
        <label>Mission context (success looks like)</label>
        <textarea value={missionContext} onChange={e=>setMissionContext(e.target.value)} rows={3} style={{width:'100%'}}/>
        <div style={{display:'flex', gap:16}}>
          <label>Commander priority (1–5) <input type="number" min={1} max={5} value={cmdPriority} onChange={e=>setCmdPriority(Number(e.target.value))}/></label>
          <label>Relocation allowed?
            <select value={relocation} onChange={e=>setRelocation(e.target.value)}>
              <option>No</option>
              <option>Same squadron</option>
              <option>Same group</option>
              <option>Cross-unit</option>
            </select>
          </label>
        </div>
        <label>Shift/availability constraints</label>
        <input value={shiftConstraints} onChange={e=>setShiftConstraints(e.target.value)} style={{width:'100%'}}/>
        <label>Training runway acceptable?</label>
        <input value={trainRunway} onChange={e=>setTrainRunway(e.target.value)} style={{width:'100%'}}/>
        <label>Disqualifiers</label>
        <input value={disqualifiers} onChange={e=>setDisqualifiers(e.target.value)} style={{width:'100%'}}/>
        <label>Diversity of experience preference (1–5)</label>
        <input type="number" min={1} max={5} value={diversityPref} onChange={e=>setDiversityPref(Number(e.target.value))}/>
        <label>Suggested courses (ids, comma)</label>
        <input value={suggestedCourses} onChange={e=>setSuggestedCourses(e.target.value)} style={{width:'100%'}}/>
        <label>Stakeholders who must approve (comma)</label>
        <input value={stakeholders} onChange={e=>setStakeholders(e.target.value)} style={{width:'100%'}}/>
        <label>Alternate titles that could fit</label>
        <input value={altTitles} onChange={e=>setAltTitles(e.target.value)} style={{width:'100%'}}/>
        <label>Notes for MOSaic</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} style={{width:'100%'}}/>
        <button onClick={submit} style={{marginTop:12}}>Submit</button>
      </div>
    </main>
  );
}
