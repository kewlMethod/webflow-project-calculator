import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, ArrowLeft, CheckCircle, Mail, Phone, User, Building, Globe, Palette, Zap, Clock, DollarSign, Download, Send } from 'lucide-react';

const LeadCalculator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Project details
    projectType: '',
    complexity: '',
    pages: 5,
    features: [],
    timeline: '',
    budget: '',
    // Lead information
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    projectDescription: '',
    // Preferences
    preferredContact: 'email',
    startDate: ''
  });
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 6;

  // Pricing structure
  const pricing = {
    webflow: {
      basic: { base: 1500, perPage: 200 },
      intermediate: { base: 3000, perPage: 350 },
      advanced: { base: 5000, perPage: 500 },
      enterprise: { base: 8000, perPage: 750 }
    },
    branding: {
      basic: { base: 2000, logoVariations: 3 },
      intermediate: { base: 4000, logoVariations: 5 },
      advanced: { base: 7000, logoVariations: 8 },
      enterprise: { base: 12000, logoVariations: 12 }
    },
    combined: {
      basic: { base: 3000, perPage: 150 },
      intermediate: { base: 6000, perPage: 280 },
      advanced: { base: 10000, perPage: 400 },
      enterprise: { base: 16000, perPage: 600 }
    }
  };

  const additionalFeatures = {
    cms: { name: 'CMS Integration', price: 800 },
    ecommerce: { name: 'E-commerce Setup', price: 1200 },
    animations: { name: 'Custom Animations', price: 600 },
    seo: { name: 'SEO Optimization', price: 500 },
    forms: { name: 'Advanced Forms', price: 400 },
    integrations: { name: 'Third-party Integrations', price: 700 },
    multilingual: { name: 'Multi-language Support', price: 900 },
    brandGuide: { name: 'Brand Guidelines Document', price: 800 },
    socialMedia: { name: 'Social Media Kit', price: 600 },
    businessCards: { name: 'Business Card Design', price: 300 }
  };

  const timelineMultipliers = {
    rush: 1.5,
    standard: 1,
    flexible: 0.9
  };

  useEffect(() => {
    if (formData.projectType && formData.complexity) {
      calculateTotal();
    }
  }, [formData.projectType, formData.complexity, formData.pages, formData.features, formData.timeline]);

  const calculateTotal = () => {
    let baseCost = 0;
    let pageCost = 0;
    let featureCost = 0;
    
    if (formData.projectType === 'branding') {
      baseCost = pricing.branding[formData.complexity].base;
    } else {
      baseCost = pricing[formData.projectType][formData.complexity].base;
      if (formData.projectType !== 'branding') {
        pageCost = (formData.pages - 1) * pricing[formData.projectType][formData.complexity].perPage;
      }
    }

    featureCost = formData.features.reduce((total, feature) => {
      return total + (additionalFeatures[feature]?.price || 0);
    }, 0);

    const subtotal = baseCost + pageCost + featureCost;
    const timelineAdjustment = formData.timeline ? subtotal * timelineMultipliers[formData.timeline] : subtotal;
    const final = Math.round(timelineAdjustment);

    setTotalCost(final);
    setBreakdown({
      base: baseCost,
      pages: pageCost,
      features: featureCost,
      timeline: Math.round(timelineAdjustment - subtotal),
      subtotal: subtotal
    });
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature) 
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.projectType !== '';
      case 2: return formData.complexity !== '';
      case 3: return formData.timeline !== '';
      case 4: return formData.name && formData.email;
      case 5: return true;
      default: return true;
    }
  };

  const handleSubmit = () => {
    // Here you would normally send the data to your backend/CRM
    console.log('Lead data:', { ...formData, totalCost, breakdown });
    
    // You can integrate with services like:
    // - Netlify Forms
    // - Formspree
    // - EmailJS
    // - Your own backend API
    
    setIsSubmitted(true);
  };

  const getEstimatedDuration = () => {
    let weeks = 2;
    if (formData.complexity === 'intermediate') weeks = 4;
    if (formData.complexity === 'advanced') weeks = 6;
    if (formData.complexity === 'enterprise') weeks = 10;
    
    if (formData.projectType === 'branding') weeks += 2;
    if (formData.projectType === 'combined') weeks += 3;
    
    weeks += Math.floor(formData.features.length / 2);
    
    if (formData.timeline === 'rush') weeks = Math.max(1, Math.floor(weeks * 0.7));
    if (formData.timeline === 'flexible') weeks = Math.floor(weeks * 1.3);
    
    return weeks;
  };

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm font-medium text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your project estimate has been submitted. We'll get back to you within 24 hours with a detailed proposal.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-2">Your Project Estimate:</div>
            <div className="text-3xl font-bold text-indigo-600">${totalCost.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-2">Estimated Duration: {getEstimatedDuration()} weeks</div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start New Estimate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Get Your Project Estimate</h1>
          </div>
          <p className="text-gray-600">Professional Webflow Development & Brand Identity Services</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <ProgressBar />

          {/* Step 1: Project Type */}
          {currentStep === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What type of project do you need?</h2>
              <p className="text-gray-600 mb-8">Select the service that best fits your needs</p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { value: 'webflow', label: 'Webflow Development', icon: '🌐', desc: 'Custom website design & development' },
                  { value: 'branding', label: 'Brand Identity', icon: '🎨', desc: 'Logo, brand guidelines & visual identity' },
                  { value: 'combined', label: 'Complete Package', icon: '✨', desc: 'Full branding + website solution' }
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => updateFormData('projectType', type.value)}
                    className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.projectType === type.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-4">{type.icon}</div>
                    <div className="font-bold text-lg mb-2">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Complexity */}
          {currentStep === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What's your project complexity?</h2>
              <p className="text-gray-600 mb-8">This helps us understand your requirements better</p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  { value: 'basic', label: 'Basic', price: '$1,500+', desc: 'Simple design with essential features' },
                  { value: 'intermediate', label: 'Intermediate', price: '$3,000+', desc: 'Custom design with moderate complexity' },
                  { value: 'advanced', label: 'Advanced', price: '$5,000+', desc: 'Complex interactions and custom functionality' },
                  { value: 'enterprise', label: 'Enterprise', price: '$8,000+', desc: 'Full-scale solution with premium features' }
                ].map(level => (
                  <button
                    key={level.value}
                    onClick={() => updateFormData('complexity', level.value)}
                    className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                      formData.complexity === level.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-lg">{level.label}</div>
                      <div className="text-green-600 font-semibold">{level.price}</div>
                    </div>
                    <div className="text-gray-600">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Timeline & Additional Options */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-8">Project Details</h2>
              
              <div className="space-y-8">
                {/* Pages */}
                {formData.projectType !== 'branding' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">How many pages do you need?</h3>
                    <div className="flex items-center space-x-4 max-w-md">
                      <span className="text-sm">1</span>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={formData.pages}
                        onChange={(e) => updateFormData('pages', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm">20+</span>
                      <div className="text-2xl font-bold text-indigo-600 min-w-[3rem] text-center">
                        {formData.pages}
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">What additional features do you need?</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(additionalFeatures).slice(0, 8).map(([key, feature]) => (
                      <label key={key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.features.includes(key)}
                          onChange={() => handleFeatureToggle(key)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <div className="flex-1">
                          <span className="font-medium">{feature.name}</span>
                          <span className="text-green-600 font-medium ml-2">+${feature.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">When do you need this completed?</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { value: 'rush', label: 'ASAP', desc: 'Rush delivery (+50%)', icon: '⚡' },
                      { value: 'standard', label: 'Standard', desc: 'Normal timeline', icon: '📅' },
                      { value: 'flexible', label: 'Flexible', desc: 'I can wait (-10%)', icon: '🕐' }
                    ].map(time => (
                      <button
                        key={time.value}
                        onClick={() => updateFormData('timeline', time.value)}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          formData.timeline === time.value
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{time.icon}</div>
                        <div className="font-medium mb-1">{time.label}</div>
                        <div className="text-sm text-gray-600">{time.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-2">Let's get in touch!</h2>
              <p className="text-center text-gray-600 mb-8">We'll send you a detailed proposal within 24 hours</p>
              
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building className="w-4 h-4 inline mr-2" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => updateFormData('company', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Website (if any)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Project Description */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-2">Tell us about your project</h2>
              <p className="text-center text-gray-600 mb-8">Help us understand your vision and goals</p>
              
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => updateFormData('projectDescription', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your project goals, target audience, and any specific requirements..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => updateFormData('budget', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-20k">$10,000 - $20,000</option>
                      <option value="20k-plus">$20,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      value={formData.preferredContact}
                      onChange={(e) => updateFormData('preferredContact', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-8">Review Your Project Estimate</h2>
              
              <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-8 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">${totalCost.toLocaleString()}</div>
                    <div className="text-indigo-100">Estimated Project Cost</div>
                    <div className="text-indigo-100 text-sm mt-2">
                      Duration: {getEstimatedDuration()} weeks
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Project Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Type:</span> {formData.projectType === 'webflow' ? 'Webflow Development' : formData.projectType === 'branding' ? 'Brand Identity' : 'Complete Package'}</div>
                      <div><span className="font-medium">Complexity:</span> {formData.complexity.charAt(0).toUpperCase() + formData.complexity.slice(1)}</div>
                      {formData.projectType !== 'branding' && <div><span className="font-medium">Pages:</span> {formData.pages}</div>}
                      <div><span className="font-medium">Features:</span> {formData.features.length} selected</div>
                      <div><span className="font-medium">Timeline:</span> {formData.timeline.charAt(0).toUpperCase() + formData.timeline.slice(1)}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {formData.name}</div>
                      <div><span className="font-medium">Email:</span> {formData.email}</div>
                      {formData.phone && <div><span className="font-medium">Phone:</span> {formData.phone}</div>}
                      {formData.company && <div><span className="font-medium">Company:</span> {formData.company}</div>}
                      <div><span className="font-medium">Preferred Contact:</span> {formData.preferredContact}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={handleSubmit}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center mx-auto"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Get My Detailed Proposal
                  </button>
                  <p className="text-sm text-gray-600 mt-4">
                    We'll send you a detailed proposal within 24 hours
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < 6 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                  canProceed()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <div className="text-sm text-gray-500">Review and submit above</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCalculator;