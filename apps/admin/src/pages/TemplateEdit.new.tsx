import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Panel } from '../components/Panel';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { FormField } from '../components/FormField';
import style from './TemplateForm.module.css';

interface PanelData {
  number: number;
  name: string;
}

interface TemplateFormData {
  name: string;
  description: string;
  date: string;
  isPublic: boolean;
  panels: PanelData[];
}

export const TemplateEditPage = () => {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isPublic: false,
    panels: [{ number: 1, name: '' }],
  });
  
  const [panelCount, setPanelCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authClient } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        if (!id) return;
        
        const response = await authClient.GET(`/cards/templates/${id}`);
        
        if (response.error) {
          throw new Error('Failed to fetch template');
        }
        
        const template = response.data;
        if (!template) {
          throw new Error('Template not found');
        }
        
        // Extract panels from content
        let panels: PanelData[] = [];
        if (template.content && template.content.panels) {
          panels = template.content.panels;
        }
        
        setFormData({
          name: template.name || '',
          description: template.description || '',
          date: template.date || new Date().toISOString().split('T')[0],
          isPublic: template.isPublic || false,
          panels: panels.length ? panels : [{ number: 1, name: '' }],
        });
        
        setPanelCount(panels.length || 1);
      } catch (err: any) {
        setError(err.message || 'Failed to load template');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [id, authClient]);

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
    const updatedPanels: PanelData[] = [];
    for (let i = 1; i <= newCount; i++) {
      // Keep existing panel data if available
      const existingPanel = formData.panels.find(p => p.number === i);
      updatedPanels.push(
        existingPanel || 
        { number: i, name: i === 1 ? '' : `PS${i-1}` }
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
      if (!id) {
        throw new Error('Template ID is missing');
      }

      // Prepare data for API
      const templateData = {
        name: formData.name,
        description: formData.description,
        date: formData.date,
        isPublic: formData.isPublic,
        content: JSON.stringify({
          panels: formData.panels
        })
      };

      const response = await authClient.PUT(`/cards/templates/${id}`, {
        body: templateData,
      });

      if (response.error) {
        throw new Error('Failed to update template');
      }

      navigate('/templates');
    } catch (err: any) {
      setError(err.message || 'Failed to update template. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading template...</div>;
  }

  return (
    <div className={style.container}>
      <h1>Edit Template</h1>
      
      {error && <div className={style.error}>{error}</div>}
      
      <Panel>
        <form onSubmit={handleSubmit} className={style.form}>
          {/* Basic Template Information */}
          <div className={style.formSection}>
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
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={style.input}
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
};
