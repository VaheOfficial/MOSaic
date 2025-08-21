'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Guard from '@/app/guard';
import TagInput from '@/components/TagInput';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { User, Award, Target, Settings } from 'lucide-react';

export default function MemberSurvey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingProfileId, setExistingProfileId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Personal Information
  const [fullName, setFullName] = useState('');
  const [rank, setRank] = useState('');
  const [unit, setUnit] = useState('');
  const [dutyPosition, setDutyPosition] = useState('');
  const [yearsService, setYearsService] = useState('');
  const [clearanceLevel, setClearanceLevel] = useState('');

  // Skills & Experience  
  const [primarySkills, setPrimarySkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [specialtyAreas, setSpecialtyAreas] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [experience, setExperience] = useState('');

  // Career Preferences
  const [careerGoals, setCareerGoals] = useState('');
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [avoidRoles, setAvoidRoles] = useState<string[]>([]);
  const [willingToRelocate, setWillingToRelocate] = useState<'Yes' | 'No' | 'Maybe'>('Maybe');
  const [deploymentAvailability, setDeploymentAvailability] = useState<'Available' | 'Limited' | 'Not Available'>('Available');

  // Additional Information
  const [languageSkills, setLanguageSkills] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Load existing profile on mount
  useEffect(() => {
    async function loadExistingProfile() {
      try {
        const profile = await api('/member/profile');
        if (profile && profile.data) {
          // Load existing data
          const data = profile.data;
          setExistingProfileId(profile.id);
          setFullName(data.identity?.full_name || '');
          setRank(data.identity?.grade || '');
          setUnit(data.identity?.unit || '');
          setDutyPosition(data.identity?.duty_title || '');
          setYearsService(data.years_service?.toString() || '');
          setClearanceLevel(data.clearance_level || '');
          setPrimarySkills(data.primary_skills || []);
          setCertifications(data.certifications || []);
          setSpecialtyAreas(data.secondary_skills || []);
          setTools(data.tools || []);
          setExperience(data.experience_summary || '');
          setCareerGoals(data.career_goals || '');
          setPreferredRoles(data.interested_roles || []);
          setAvoidRoles(data.avoid_roles || []);
          setWillingToRelocate(data.willing_pcs || 'Maybe');
          setDeploymentAvailability(data.deployment_availability || 'Available');
          setLanguageSkills(data.language_skills || []);
          setAdditionalInfo(data.additional_info || '');
        }
      } catch (error) {
        // No existing profile found, start fresh
        console.log('No existing profile found, starting fresh');
      }
      setIsLoading(false);
    }
    
    loadExistingProfile();
  }, []);

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: <User size={20} />,
      description: 'Basic military information'
    },
    {
      id: 'skills',
      title: 'Skills & Experience',
      icon: <Award size={20} />,
      description: 'Technical skills and certifications'
    },
    {
      id: 'preferences',
      title: 'Career Preferences',
      icon: <Target size={20} />,
      description: 'Future goals and preferences'
    },
    {
      id: 'additional',
      title: 'Additional Information',
      icon: <Settings size={20} />,
      description: 'Languages and other details'
    }
  ];

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const payload = {
        personal_info: {
          full_name: fullName,
          rank: rank,
          unit: unit,
          duty_position: dutyPosition,
          years_service: parseInt(yearsService) || 0,
          clearance_level: clearanceLevel
        },
        skills_experience: {
          primary_skills: primarySkills,
          certifications: certifications,
          specialty_areas: specialtyAreas,
          tools: tools,
          experience_summary: experience
        },
        career_preferences: {
          career_goals: careerGoals,
          preferred_roles: preferredRoles,
          avoid_roles: avoidRoles,
          willing_to_relocate: willingToRelocate,
          deployment_availability: deploymentAvailability
        },
        additional_info: {
          language_skills: languageSkills,
          additional_information: additionalInfo
        }
      };

      const method = existingProfileId ? 'PUT' : 'POST';
      const url = existingProfileId ? `/member/profile/${existingProfileId}` : '/member/profile';
      
      await api(url, { method, body: JSON.stringify(payload) });
      
      const message = existingProfileId ? 'Profile updated successfully!' : 'Profile submitted successfully!';
      window.dispatchEvent(new CustomEvent('toast', { 
        detail: { message, variant: 'success' } 
      }));
      
      if (!existingProfileId) {
        // After successful creation, switch to edit mode
        setIsEditMode(true);
      }
      
    } catch (error: any) {
      window.dispatchEvent(new CustomEvent('toast', { 
        detail: { message: 'Failed to submit profile', variant: 'error' } 
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  function isStepValid(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return fullName && rank && unit && dutyPosition;
      case 1:
        return primarySkills.length > 0;
      case 2:
        return careerGoals.trim().length > 0;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  }

  function nextStep() {
    if (currentStep < steps.length - 1 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  if (isLoading) {
    return (
      <Guard allow={["member", "supervisor", "commander"]}>
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading your profile...</p>
            </div>
          </Card>
        </div>
      </Guard>
    );
  }

  return (
    <Guard allow={["member", "supervisor", "commander"]}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold gradient-text">
            {existingProfileId ? 'Update Skills Profile' : 'Member Skills Profile'}
          </h1>
          <p className="text-slate-600">
            {existingProfileId 
              ? 'Update your profile information as needed' 
              : 'Complete your profile to enable accurate role matching'
            }
          </p>
          {existingProfileId && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Editing existing profile
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center space-y-2 relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  index <= currentStep 
                    ? 'bg-violet-600 border-violet-600 text-white' 
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  {step.icon}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${index <= currentStep ? 'text-violet-600' : 'text-slate-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500 hidden sm:block">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`absolute top-6 left-12 w-full h-0.5 -z-10 ${
                    index < currentStep ? 'bg-violet-600' : 'bg-slate-300'
                  }`} style={{ width: 'calc(100vw / 4 - 3rem)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Last, First M." />
                  </div>
                  <div>
                    <Label>Rank *</Label>
                    <Select value={rank} onChange={e=>setRank(e.target.value)}>
                      <option value="">Select rank</option>
                      <option value="Spc1">Amn</option>
                      <option value="A1C">A1C</option>
                      <option value="SrA" >SrA</option>
                      <option value="SSgt">SSgt</option>
                      <option value="TSgt">TSgt</option>
                      <option value="MSgt">MSgt</option>
                      <option value="SMSgt">SMSgt</option>
                      <option value="CMSgt">CMSgt</option>
                      <option value="2Lt">2Lt</option>
                      <option value="1Lt">1Lt</option>
                      <option value="Capt">Capt</option>
                      <option value="Maj">Maj</option>
                      <option value="Lt Col">Lt Col</option>
                      <option value="Col">Col</option>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Unit *</Label>
                    <Select value={unit} onChange={e=>setUnit(e.target.value)}>
                      <option value="">Select unit</option>
                      <option value="90 COS">90 COS</option>
                      <option value="90 COS/Det 1">90 COS/Det 1</option>
                      <option value="90 COS/Det 2">90 COS/Det 2</option>
                      <option value="16 AF">16 AF</option>
                      <option value="24 AF">24 AF</option>
                      <option value="25 AF">25 AF</option>
                      <option value="USCYBERCOM">USCYBERCOM</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Current Duty Position *</Label>
                    <Input value={dutyPosition} onChange={e=>setDutyPosition(e.target.value)} placeholder="e.g., Cyber Operations Specialist" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Years of Service</Label>
                    <Input type="number" value={yearsService} onChange={e=>setYearsService(e.target.value)} placeholder="e.g., 8" min="0" max="40" />
                  </div>
                  <div>
                    <Label>Clearance Level</Label>
                    <Select value={clearanceLevel} onChange={e=>setClearanceLevel(e.target.value)}>
                      <option value="">Select clearance</option>
                      <option value="None">None</option>
                      <option value="Secret">Secret</option>
                      <option value="Top Secret">Top Secret</option>
                      <option value="TS/SCI">TS/SCI</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Skills & Experience</h3>
              <div className="space-y-4">
                <TagInput 
                  label="Primary Skills *" 
                  value={primarySkills} 
                  onChange={setPrimarySkills}
                  placeholder="Add your main technical skills"
                />
                <TagInput 
                  label="Certifications" 
                  value={certifications} 
                  onChange={setCertifications}
                  placeholder="e.g., Security+, CISSP, CEH"
                />
                <TagInput 
                  label="Specialty Areas" 
                  value={specialtyAreas} 
                  onChange={setSpecialtyAreas}
                  placeholder="e.g., Red Teaming, Digital Forensics, Network Security"
                />
                <TagInput 
                  label="Tools & Technologies" 
                  value={tools} 
                  onChange={setTools}
                  placeholder="e.g., Wireshark, Metasploit, Python"
                />
                <Label>Experience Summary
                  <Textarea 
                    value={experience} 
                    onChange={e=>setExperience(e.target.value)}
                    rows={4}
                    placeholder="Briefly describe your relevant experience, projects, and accomplishments..."
                  />
                </Label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Career Preferences</h3>
              <div className="space-y-4">
                <Label>Career Goals *
                  <Textarea 
                    value={careerGoals} 
                    onChange={e=>setCareerGoals(e.target.value)}
                    rows={3}
                    placeholder="Describe your short and long-term career objectives..."
                  />
                </Label>
                <TagInput 
                  label="Preferred Role Types" 
                  value={preferredRoles} 
                  onChange={setPreferredRoles}
                  placeholder="e.g., Technical Lead, Instructor, Analyst"
                />
                <TagInput 
                  label="Roles to Avoid" 
                  value={avoidRoles} 
                  onChange={setAvoidRoles}
                  placeholder="Any roles you prefer not to be considered for"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label>Willing to Relocate
                    <Select value={willingToRelocate} onChange={e=>setWillingToRelocate(e.target.value as any)}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Maybe">Maybe</option>
                    </Select>
                  </Label>
                  <Label>Deployment Availability
                    <Select value={deploymentAvailability} onChange={e=>setDeploymentAvailability(e.target.value as any)}>
                      <option value="Available">Available</option>
                      <option value="Limited">Limited</option>
                      <option value="Not Available">Not Available</option>
                    </Select>
                  </Label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Additional Information</h3>
              <div className="space-y-4">
                <TagInput 
                  label="Language Skills" 
                  value={languageSkills} 
                  onChange={setLanguageSkills}
                  placeholder="e.g., Spanish (Fluent), French (Basic)"
                />
                <Label>Additional Information
                  <Textarea 
                    value={additionalInfo} 
                    onChange={e=>setAdditionalInfo(e.target.value)}
                    rows={4}
                    placeholder="Any other relevant information, awards, special qualifications, or notes..."
                  />
                </Label>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="secondary" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <div className="text-sm text-slate-500">
            Step {currentStep + 1} of {steps.length}
          </div>

          {currentStep === steps.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={!isStepValid(currentStep) || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Profile'}
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </Guard>
  );
}