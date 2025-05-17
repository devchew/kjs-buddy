import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Panel } from '../components/Panel';
import { Button, LinkButton } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import style from './TemplateDetail.module.css';

// Use a simpler PanelData interface for display purposes
interface PanelData {
  number: number;
  name: string;
  // Could add other panel properties as needed
}

import { CardPanel } from '../types/Card';

interface Template {
  id: string;
  name: string;
  description: string;
  date: string;
  isPublic: boolean;
  panels: CardPanel[];
  createdAt: string;
  updatedAt: string;
  cardNumber?: number;
  carNumber?: number;
  logo?: string;
  sponsorLogo?: string;
}

export const TemplateDetailPage = () => {
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authClient } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        if (!id) return;
        
        // Use the correct TypeScript API client format with path parameter
        const { data, error } = await authClient.GET("/cards/templates/{id}", {
          params: {
            path: {
              id
            }
          }
        });
        
        if (error) {
          throw new Error('Failed to fetch template');
        }
          if (data) {
          // Make sure the data conforms to our Template interface
          const templateData: Template = {
            id: data.id,
            name: data.name,
            description: data.description,
            date: data.date,
            isPublic: data.isPublic,
            panels: Array.isArray(data.panels) ? data.panels : [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            cardNumber: data.cardNumber,
            carNumber: data.carNumber,
            logo: data.logo,
            sponsorLogo: data.sponsorLogo
          };
          
          setTemplate(templateData);
        } else {
          setError('No template data returned from API');
        }      } catch (err: any) {
        setError(err.message || 'Failed to load template');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [id, authClient]);
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      if (!id) return;
      
      // Use the correct TypeScript API client format with path parameter
      const { error } = await authClient.DELETE("/cards/templates/{id}", {
        params: {
          path: {
            id
          }
        }
      });
      
      if (error) {
        throw new Error('Failed to delete template');
      }
      
      navigate('/templates');
    } catch (err: any) {
      setError(err.message || 'Failed to delete template');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div>Loading template...</div>;
  }
  if (!template) {
    return <div className={style.error}>Template not found</div>;
  }
  
  // Get panels directly from the template
  const panels = template.panels?.map(panel => ({
    number: panel.number,
    name: panel.name
  } as PanelData)) || [];

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>{template.name}</h1>
        <div className={style.actions}>
          <LinkButton to={`/templates/edit/${template.id}`}>Edit</LinkButton>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {error && <div className={style.error}>{error}</div>}

      <Panel>        <div className={style.templateMeta}>
          <p><strong>Description:</strong> {template.description}</p>
          <p><strong>Date:</strong> {template.date || 'Not specified'}</p>
          <p><strong>Card Number:</strong> {template.cardNumber || 'Not specified'}</p>
          <p><strong>Car Number:</strong> {template.carNumber || 'Not specified'}</p>
          <p><strong>Public Template:</strong> {template.isPublic ? 'Yes' : 'No'}</p>
          <p><strong>Created:</strong> {new Date(template.createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(template.updatedAt).toLocaleString()}</p>
            {template.logo && (
            <div className={style.logoSection}>
              <p><strong>Logo:</strong></p>
              <img src={template.logo} alt="Template Logo" className={style.logoImage} />
            </div>
          )}
          
          {template.sponsorLogo && (
            <div className={style.logoSection}>
              <p><strong>Sponsor Logo:</strong></p>
              <img src={template.sponsorLogo} alt="Sponsor Logo" className={style.logoImage} />
            </div>
          )}
        </div>

        <div className={style.contentSection}>
          <h3>Panels ({panels.length})</h3>
          
          {panels.length === 0 ? (
            <p>This template has no panels configured.</p>
          ) : (
            <div className={style.panelsContainer}>              {panels.map((panel: PanelData) => (
                <div key={panel.number} className={style.panelItem}>
                  <div className={style.panelHeader}>
                    <strong>Panel {panel.number}</strong>
                  </div>
                  <div className={style.panelBody}>
                    <p><strong>Name:</strong> {panel.name || (panel.number === 1 ? 'Start' : `PS${panel.number-1}`) || 'Unnamed'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Panel>

      <div className={style.backButton}>
        <Button onClick={() => navigate('/templates')}>Back to Templates</Button>
      </div>
    </div>
  );
};
