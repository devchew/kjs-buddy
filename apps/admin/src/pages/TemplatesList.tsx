import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Panel } from "../components/Panel";
import { Button, LinkButton } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import style from "./TemplatesList.module.css";
import { CardPanel } from "../types/Card";

interface Template {
  id: string;
  name: string;
  description: string;
  date: string;
  isPublic: boolean;
  panels: Array<any>; // Ensure panels is treated as an array
  createdAt: string;
  updatedAt: string;
  cardNumber?: number;
  carNumber?: number;
  logo?: string;
  sponsorLogo?: string;
  userId?: string;
  [key: string]: any; // Add index signature to allow dynamic property access
}

export const TemplatesListPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authClient } = useAuth();
  // Helper function to get panel count, handling different API response structures
  const getPanelCount = (template: any): number => {
    if (!template) return 0;

    // If template.panels is an array (most common case)
    if (Array.isArray(template.panels)) {
      return template.panels.length;
    }

    // Try nested structure where panels might be inside a 'card' property
    if (template.card && Array.isArray(template.card.panels)) {
      return template.card.panels.length;
    }

    // In some nested structures, we need to check if the panels might be a record/object with numeric keys
    if (
      template.panels &&
      typeof template.panels === "object" &&
      !Array.isArray(template.panels)
    ) {
      return Object.keys(template.panels).length;
    }

    // Check if any property contains an array of objects with 'number' property (typical for panels)
    for (const key of Object.keys(template)) {
      const value = template[key];
      if (value && typeof value === "object") {
        if (
          Array.isArray(value) &&
          value.length > 0 &&
          value[0] &&
          typeof value[0] === "object" &&
          "number" in value[0]
        ) {
          return value.length;
        }
      }
    }

    return 0;
  };
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await authClient.GET("/cards/templates/all");
        if (error) {
          throw new Error(`Failed to fetch templates: ${error}`);
        }

        const templates = data || [];
        setTemplates(templates);
        setError(null);
      } catch (err) {
        setError("Błąd podczas pobierania szablonów. Spróbuj ponownie.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [authClient]);
  const handleDelete = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten szablon?")) {
      return;
    }

    try {
      const { error } = await authClient.DELETE("/cards/templates/{id}", {
        params: {
          path: {
            id,
          },
        },
      });
      if (error) {
        throw new Error("Failed to delete template");
      }
      setTemplates(templates.filter((t) => t.id !== id));
    } catch (err) {
      setError("Błąd podczas usuwania szablonu. Spróbuj ponownie.");
    }
  };
  if (isLoading) {
    return <div>Ładowanie szablonów...</div>;
  }

  return (
    <div className={style.container}>
      {" "}
      <div className={style.header}>
        <h1>Szablony kart</h1>
        <LinkButton to="/templates/create" primary>
          Utwórz nowy szablon
        </LinkButton>
      </div>
      {error && <div className={style.error}>{error}</div>}
      <div className={style.templatesList}>
        {templates.length === 0 ? (
          <Panel>
            <p>Nie znaleziono szablonów. Utwórz swój pierwszy szablon!</p>
            <LinkButton to="/templates/create" primary>
              Utwórz szablon
            </LinkButton>
          </Panel>
        ) : (
          templates.map((template) => (
            <Panel key={template.id}>
              <div className={style.templateItem}>
                <div className={style.templateInfo}>
                  <h2>{template.name}</h2>
                  <p>{template.description}</p>{" "}
                  <div className={style.templateMeta}>
                    <span>{template.date}</span>
                    {template.isPublic && (
                      <span className={style.publicBadge}>Publiczny</span>
                    )}
                    <span className={style.panelCount}>
                      Panele: {getPanelCount(template)}
                    </span>
                  </div>
                  <small>
                    Ostatnia aktualizacja:{" "}
                    {new Date(template.updatedAt).toLocaleString()}
                  </small>
                </div>
                <div className={style.actions}>
                  {" "}
                  <LinkButton to={`/templates/${template.id}`}>
                    Podgląd
                  </LinkButton>
                  <LinkButton to={`/templates/edit/${template.id}`}>
                    Edytuj
                  </LinkButton>
                  <Button onClick={() => handleDelete(template.id)}>
                    Usuń
                  </Button>
                </div>
              </div>
            </Panel>
          ))
        )}
      </div>
    </div>
  );
};
