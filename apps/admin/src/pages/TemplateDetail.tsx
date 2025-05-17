import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Panel } from '../components/Panel';
import { Button, LinkButton } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import style from './TemplateDetail.module.css';

interface Template {
  id: string;
  name: string;
  description: string;
  content: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export const TemplateDetailPage = () => {
  const [template, setTemplate] = useState<Template | null>(null);
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
        
        setTemplate(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load template');
        console.error(err);
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
      
      const response = await authClient.DELETE(`/cards/templates/${id}`);
      
      if (response.error) {
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

      <Panel>
        <div className={style.templateMeta}>
          <p><strong>Description:</strong> {template.description}</p>
          <p><strong>Created:</strong> {new Date(template.createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(template.updatedAt).toLocaleString()}</p>
        </div>

        <div className={style.contentSection}>
          <h2>Template Content</h2>
          <pre className={style.jsonDisplay}>
            {JSON.stringify(template.content, null, 2)}
          </pre>
        </div>
      </Panel>

      <div className={style.backButton}>
        <Button onClick={() => navigate('/templates')}>Back to Templates</Button>
      </div>
    </div>
  );
};
