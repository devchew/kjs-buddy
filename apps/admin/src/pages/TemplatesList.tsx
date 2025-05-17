import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '../components/Panel';
import { Button, LinkButton } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import style from './TemplatesList.module.css';

interface Template {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const TemplatesListPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authClient } = useAuth();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await authClient.GET('/cards/templates/all');
        if (response.error) {
          throw new Error('Failed to fetch templates');
        }
        setTemplates(response.data || []);
        setError(null);
      } catch (err) {
        setError('Error fetching templates. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [authClient]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const response = await authClient.DELETE(`/cards/templates/${id}`);
      if (response.error) {
        throw new Error('Failed to delete template');
      }
      setTemplates(templates.filter(t => t.id !== id));
    } catch (err) {
      setError('Error deleting template. Please try again.');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1>Card Templates</h1>
        <LinkButton to="/templates/create" primary>Create New Template</LinkButton>
      </div>

      {error && <div className={style.error}>{error}</div>}

      <div className={style.templatesList}>
        {templates.length === 0 ? (
          <Panel>
            <p>No templates found. Create your first template!</p>
            <LinkButton to="/templates/create" primary>Create Template</LinkButton>
          </Panel>
        ) : (
          templates.map((template) => (
            <Panel key={template.id}>
              <div className={style.templateItem}>
                <div className={style.templateInfo}>
                  <h2>{template.name}</h2>
                  <p>{template.description}</p>
                  <small>Last updated: {new Date(template.updatedAt).toLocaleString()}</small>
                </div>
                <div className={style.actions}>
                  <LinkButton to={`/templates/${template.id}`}>View</LinkButton>
                  <LinkButton to={`/templates/edit/${template.id}`}>Edit</LinkButton>
                  <Button onClick={() => handleDelete(template.id)}>Delete</Button>
                </div>
              </div>
            </Panel>
          ))
        )}
      </div>
    </div>
  );
};
