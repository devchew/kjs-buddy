import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from '../components/Panel';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { FormField } from '../components/FormField';
import style from './TemplateForm.module.css';

import { CardPanel } from '../types/Card';
import monte from "../assets/montecalvaria.png";
import pzm from "../assets/pzmot.png";

interface TemplateFormData {
  name: string;
  description: string;
  cardNumber: number;
  carNumber: number;
  date: string;
  logo: string;
  sponsorLogo: string;
  isPublic: boolean;
  panels: CardPanel[];
}

export const TemplateCreatePage: FunctionComponent = () => {  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    cardNumber: 1,
    carNumber: 1,
    date: new Date().toISOString().split('T')[0],
    logo: monte,
    sponsorLogo: pzm,
    isPublic: false,
    panels: [{ 
      number: 1, 
      name: '', 
      finishTime: 0,
      provisionalStartTime: 34200000, // 9:30 AM in milliseconds
      actualStartTime: 34200000,
      drivingTime: 0,
      resultTime: 0,
      nextPKCTime: 0,
      arrivalTime: 0
    }],
  });
  
  const [panelCount, setPanelCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authClient } = useAuth();
  const navigate = useNavigate();

  // Handle basic form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  // Handle panel count change
  const handlePanelCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value, 10) || 1;
    setPanelCount(newCount);
    
    // Update panels array
    const updatedPanels: CardPanel[] = [];
    for (let i = 1; i <= newCount; i++) {
      // Keep existing panel data if available
      const existingPanel = formData.panels.find(p => p.number === i);
      updatedPanels.push(
        existingPanel || 
        { 
          number: i, 
          name: i === 1 ? '' : `PS${i-1}`,
          finishTime: 0,
          provisionalStartTime: i === 1 ? 34200000 : 0, // 9:30 AM in milliseconds for first panel
          actualStartTime: i === 1 ? 34200000 : 0,
          drivingTime: 0,
          resultTime: 0,
          nextPKCTime: 0,
          arrivalTime: 0
        }
      );
    }
    
    setFormData(prev => ({
      ...prev,
      panels: updatedPanels
    }));
  };
  // Handle panel name change
  const handlePanelNameChange = (index: number, value: string) => {
    const updatedPanels = [...formData.panels];
    updatedPanels[index] = {
      ...updatedPanels[index],
      name: value
    };
    
    setFormData(prev => ({
      ...prev,
      panels: updatedPanels
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create the template data matching the server's expected format
      const templateData = {
        name: formData.name,
        description: formData.description,
        cardNumber: formData.cardNumber,
        carNumber: formData.carNumber,
        date: formData.date,
        logo: formData.logo,
        sponsorLogo: formData.sponsorLogo,
        isPublic: formData.isPublic,
        panels: formData.panels
      };

      const response = await authClient.POST('/cards/templates/create', {
        body: templateData,
      });

      if (response.error) {
        throw new Error('Failed to create template');
      }

      navigate('/templates');    } catch (err: any) {
      setError(err.message || 'Failed to create template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={style.container}>
      <h1>Create New Template</h1>
      
      {error && <div className={style.error}>{error}</div>}
      
      <Panel>
        <form onSubmit={handleSubmit} className={style.form}>
          {/* Basic Template Information */}          <div className={style.formSection}>
            <h3>Template Information</h3>
            
            <FormField
              id="name"
              name="name"
              label="Template Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <div className={style.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={style.textarea}
              />
            </div>
            
            <div className={style.formRow}>
              <div className={style.formGroup}>
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="number"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className={style.input}
                  min={1}
                  required
                />
              </div>
              
              <div className={style.formGroup}>
                <label htmlFor="carNumber">Car Number</label>
                <input
                  type="number"
                  id="carNumber"
                  name="carNumber"
                  value={formData.carNumber}
                  onChange={handleInputChange}
                  className={style.input}
                  min={1}
                  required
                />
              </div>
            </div>
            
            <div className={style.formRow}>
              <div className={style.formGroup}>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={style.input}
                  required
                />
              </div>
              
              <div className={style.formGroup}>
                <label className={style.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className={style.checkbox}
                  />
                  Public Template
                </label>
              </div>
            </div>
            
            {/* Logo selection would ideally be an upload or selection component */}
            {/* For now using default logos */}
            <div className={style.formRow}>
              <div className={style.formGroup}>
                <label>Event Logo</label>
                <div className={style.logoPreview}>
                  <img src={formData.logo} alt="Event Logo" height="40" />
                  <span>Using default event logo</span>
                </div>
              </div>
              
              <div className={style.formGroup}>
                <label>Sponsor Logo</label>
                <div className={style.logoPreview}>
                  <img src={formData.sponsorLogo} alt="Sponsor Logo" height="40" />
                  <span>Using default sponsor logo</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Panels Editor */}
          <div className={style.formSection}>
            <h3>Panels Configuration</h3>
            
            <div className={style.formGroup}>
              <label htmlFor="panelCount">Number of Panels</label>
              <input
                type="number"
                id="panelCount"
                value={panelCount}
                onChange={handlePanelCountChange}
                min={1}
                max={20}
                className={style.input}
              />
            </div>
            
            <div className={style.panelsContainer}>
              {formData.panels.map((panel, index) => (
                <div key={panel.number} className={style.panelItem}>
                  <div className={style.panelHeader}>
                    <strong>Panel {panel.number}</strong>
                  </div>
                  <div className={style.panelBody}>
                    <div className={style.formGroup}>
                      <label htmlFor={`panel-${panel.number}-name`}>Panel Name</label>
                      <input
                        type="text"
                        id={`panel-${panel.number}-name`}
                        value={panel.name}
                        onChange={(e) => handlePanelNameChange(index, e.target.value)}
                        placeholder={panel.number === 1 ? "Start" : `PS${panel.number-1}`}
                        className={style.input}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={style.formActions}>
            <Button type="button" onClick={() => navigate('/templates')}>Cancel</Button>
            <Button type="submit" primary disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
};
