import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Panel } from '../components/Panel';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { FormField } from '../components/FormField';
import style from './TemplateForm.module.css';

interface TemplateFormData {
  name: string;
  description: string;
  content: string;
}

export const TemplateEditPage = () => {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    content: '{}',
  });
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
        
        setFormData({
          name: template.name || '',
          description: template.description || '',
          content: JSON.stringify(template.content || {}, null, 2),
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load template');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [id, authClient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate JSON content
      let contentObj;
      try {
        contentObj = JSON.parse(formData.content);
      } catch (err) {
        throw new Error('Content must be valid JSON');
      }

      if (!id) {
        throw new Error('Template ID is missing');
      }

      const response = await authClient.PUT(`/cards/templates/${id}`, {
        body: {
          name: formData.name,
          description: formData.description,
          content: contentObj
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to update template');
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
          <FormField
            id="name"
            name="name"
            label="Template Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <FormField
            id="description"
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          
          <div className={style.formGroup}>
            <label htmlFor="content">Content (JSON format)</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              required
              className={style.jsonEditor}
            />
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
