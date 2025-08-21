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
import { User, BarChart3, Target, FileText } from 'lucide-react';

type Member = {
  id: number;
  name: string;
  rank: string;
  unit: string;
};

export default function SupervisorEvaluation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  // Member & Evaluation Info
  const [memberName, setMemberName] = useState('');
  const [memberRank, setMemberRank] = useState('');
  const [memberUnit, setMemberUnit] = useState('');
  const [evaluationPeriod, setEvaluationPeriod] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [relationshipDuration, setRelationshipDuration] = useState('');

  // Performance Ratings
  const [technicalCompetence, setTechnicalCompetence] = useState(3);
  const [leadershipAbility, setLeadershipAbility] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [reliability, setReliability] = useState(3);
  const [adaptability, setAdaptability] = useState(3);
  const [initiative, setInitiative] = useState(3);
  const [teamwork, setTeamwork] = useState(3);
  const [professionalDevelopment, setProfessionalDevelopment] = useState(3);

  // Qualitative Assessment
  const [keyStrengths, setKeyStrengths] = useState<string[]>([]);
  const [improvementAreas, setImprovementAreas] = useState<string[]>([]);
  const [significantAchievements, setSignificantAchievements] = useState('');
  const [trainingRecommendations, setTrainingRecommendations] = useState<string[]>([]);

  // Career Development & Recommendations
  const [promotionReadiness, setPromotionReadiness] = useState<'Ready Now' | 'Ready in 6 months' | 'Ready in 1 year' | 'Needs Development'>('Ready in 6 months');
  const [careerAdvice, setCareerAdvice] = useState('');
  const [assignmentRecommendations, setAssignmentRecommendations] = useState('');
  const [overallAssessment, setOverallAssessment] = useState('');

  // Load available members on mount
  useEffect(() => {
    async function loadMembers() {
      try {
        const members = await api('/members/list');
        setAvailableMembers(members || []);
      } catch (error) {
        console.log('No members found');
        setAvailableMembers([]);
      }
      setIsLoading(false);
    }
    
    loadMembers();
  }, []);

  // Handle member selection
  function handleMemberSelection(memberId: string) {
    setSelectedMemberId(memberId);
    const member = availableMembers.find(m => m.id.toString() === memberId);
    if (member) {
      setMemberName(member.name);
      setMemberRank(member.rank);
      setMemberUnit(member.unit);
    }
  }

  const steps = [
    {
      id: 'member-info',
      title: 'Member Information',
      icon: <User size={20} />,
      description: 'Member and evaluation details'
    },
    {
      id: 'performance',
      title: 'Performance Ratings',
      icon: <BarChart3 size={20} />,
      description: 'Rate key competencies'
    },
    {
      id: 'assessment',
      title: 'Qualitative Assessment',
      icon: <Target size={20} />,
      description: 'Strengths and development areas'
    },
    {
      id: 'recommendations',
      title: 'Career Development',
      icon: <FileText size={20} />,
      description: 'Future recommendations'
    }
  ];

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const payload = {
        member_info: {
          name: memberName,
          rank: memberRank,
          unit: memberUnit
        },
        evaluation_info: {
          period: evaluationPeriod,
          supervisor_name: supervisorName,
          relationship_duration: relationshipDuration
        },
        performance_ratings: {
          technical_competence: technicalCompetence,
          leadership_ability: leadershipAbility,
          communication: communication,
          reliability: reliability,
          adaptability: adaptability,
          initiative: initiative,
          teamwork: teamwork,
          professional_development: professionalDevelopment
        },
        qualitative_assessment: {
          key_strengths: keyStrengths,
          improvement_areas: improvementAreas,
          significant_achievements: significantAchievements,
          training_recommendations: trainingRecommendations
        },
        career_development: {
          promotion_readiness: promotionReadiness,
          career_advice: careerAdvice,
          assignment_recommendations: assignmentRecommendations,
          overall_assessment: overallAssessment
        }
      };

      await api('/supervisor/evaluation', { method: 'POST', body: JSON.stringify(payload) });
      window.dispatchEvent(new CustomEvent('toast', { 
        detail: { message: 'Evaluation submitted successfully!', variant: 'success' } 
      }));
      
    } catch (error: any) {
      window.dispatchEvent(new CustomEvent('toast', { 
        detail: { message: 'Failed to submit evaluation', variant: 'error' } 
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  function isStepValid(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return selectedMemberId && evaluationPeriod && supervisorName;
      case 1:
        return true; // Ratings have defaults
      case 2:
        return keyStrengths.length > 0 && significantAchievements.trim().length > 0;
      case 3:
        return careerAdvice.trim().length > 0 && overallAssessment.trim().length > 0;
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

  const ratingLabels = ['Poor', 'Below Average', 'Meets Standards', 'Above Average', 'Exceptional'];

  if (isLoading) {
    return (
      <Guard allow={["supervisor", "commander"]}>
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading available members...</p>
            </div>
          </Card>
        </div>
      </Guard>
    );
  }

  return (
    <Guard allow={["supervisor", "commander"]}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold gradient-text">Personnel Evaluation</h1>
          <p className="text-slate-600">Comprehensive assessment for career development and placement decisions</p>
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
              <h3 className="text-xl font-semibold">Member & Evaluation Information</h3>
              
              <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                <h4 className="font-medium text-slate-800">Member Being Evaluated</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Select Member to Evaluate *</Label>
                    <Select value={selectedMemberId} onChange={e=>handleMemberSelection(e.target.value)}>
                      <option value="">Choose a member from your unit</option>
                      {availableMembers.map(member => (
                        <option key={member.id} value={member.id.toString()}>
                          {member.rank} {member.name} - {member.unit}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  {selectedMemberId && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
                      <div>
                        <Label>Full Name</Label>
                        <Input value={memberName} readOnly className="bg-gray-50" />
                      </div>
                      <div>
                        <Label>Rank</Label>
                        <Input value={memberRank} readOnly className="bg-gray-50" />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <Input value={memberUnit} readOnly className="bg-gray-50" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-violet-50 rounded-xl p-6 space-y-4">
                <h4 className="font-medium text-slate-800">Evaluation Details</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Evaluation Period *</Label>
                      <Select value={evaluationPeriod} onChange={e=>setEvaluationPeriod(e.target.value)}>
                        <option value="">Select period</option>
                        <option value="Q1 2024">Q1 2024 (Jan-Mar)</option>
                        <option value="Q2 2024">Q2 2024 (Apr-Jun)</option>
                        <option value="Q3 2024">Q3 2024 (Jul-Sep)</option>
                        <option value="Q4 2024">Q4 2024 (Oct-Dec)</option>
                        <option value="Annual 2024">Annual 2024</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Supervisor Name *</Label>
                      <Input value={supervisorName} onChange={e=>setSupervisorName(e.target.value)} placeholder="Your full name" />
                    </div>
                  </div>
                  <div>
                    <Label>How long have you supervised this member?</Label>
                    <Select value={relationshipDuration} onChange={e=>setRelationshipDuration(e.target.value)}>
                      <option value="">Select duration</option>
                      <option value="Less than 6 months">Less than 6 months</option>
                      <option value="6-12 months">6-12 months</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="2+ years">2+ years</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Performance Ratings</h3>
              <p className="text-sm text-slate-600">Rate each area from 1-5 based on observed performance</p>
              
              <div className="grid gap-6">
                {[
                  { label: 'Technical Competence', value: technicalCompetence, setter: setTechnicalCompetence },
                  { label: 'Leadership Ability', value: leadershipAbility, setter: setLeadershipAbility },
                  { label: 'Communication Skills', value: communication, setter: setCommunication },
                  { label: 'Reliability & Accountability', value: reliability, setter: setReliability },
                  { label: 'Adaptability', value: adaptability, setter: setAdaptability },
                  { label: 'Initiative & Innovation', value: initiative, setter: setInitiative },
                  { label: 'Teamwork & Collaboration', value: teamwork, setter: setTeamwork },
                  { label: 'Professional Development', value: professionalDevelopment, setter: setProfessionalDevelopment }
                ].map((rating, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="mb-0">{rating.label}</Label>
                      <span className="text-sm font-medium text-violet-600">
                        {rating.value} - {ratingLabels[rating.value - 1]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={rating.value}
                      onChange={e => rating.setter(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>1 - Poor</span>
                      <span>5 - Exceptional</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Qualitative Assessment</h3>
              
              <div className="space-y-4">
                <TagInput 
                  label="Key Strengths *" 
                  value={keyStrengths} 
                  onChange={setKeyStrengths}
                  placeholder="Add observed strengths"
                />
                <TagInput 
                  label="Areas for Improvement" 
                  value={improvementAreas} 
                  onChange={setImprovementAreas}
                  placeholder="Add development areas"
                />
                <Label>Significant Achievements *
                  <Textarea 
                    value={significantAchievements} 
                    onChange={e=>setSignificantAchievements(e.target.value)}
                    rows={4}
                    placeholder="Describe notable accomplishments, projects completed, or goals achieved during this period..."
                  />
                </Label>
                <TagInput 
                  label="Training Recommendations" 
                  value={trainingRecommendations} 
                  onChange={setTrainingRecommendations}
                  placeholder="Suggested courses or training"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Career Development & Recommendations</h3>
              
              <div className="space-y-4">
                <Label>Promotion Readiness
                  <Select value={promotionReadiness} onChange={e=>setPromotionReadiness(e.target.value as any)}>
                    <option value="Ready Now">Ready Now</option>
                    <option value="Ready in 6 months">Ready in 6 months</option>
                    <option value="Ready in 1 year">Ready in 1 year</option>
                    <option value="Needs Development">Needs Development</option>
                  </Select>
                </Label>
                
                <Label>Career Development Advice *
                  <Textarea 
                    value={careerAdvice} 
                    onChange={e=>setCareerAdvice(e.target.value)}
                    rows={3}
                    placeholder="Guidance for the member's career progression, skill development, or professional growth..."
                  />
                </Label>
                
                <Label>Assignment Recommendations
                  <Textarea 
                    value={assignmentRecommendations} 
                    onChange={e=>setAssignmentRecommendations(e.target.value)}
                    rows={3}
                    placeholder="Suggested roles, positions, or assignments that would benefit the member and organization..."
                  />
                </Label>
                
                <Label>Overall Assessment *
                  <Textarea 
                    value={overallAssessment} 
                    onChange={e=>setOverallAssessment(e.target.value)}
                    rows={4}
                    placeholder="Comprehensive summary of the member's performance, potential, and contribution to the mission..."
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
              {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
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