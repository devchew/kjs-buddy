import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const TemplateCreatePage = () => {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    content: '{}',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authClient } = useAuth();
  const navigate = useNavigate();

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
      try {
        JSON.parse(formData.content);
      } catch (err) {
        throw new Error('Content must be valid JSON');
      }

      const response = await authClient.POST('/cards/templates/create', {
        body: formData,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create template');
      }

      navigate('/templates');
    } catch (err: any) {
      setError(err.message || 'Failed to create template. Please try again.');
      console.error(err);
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
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
};
