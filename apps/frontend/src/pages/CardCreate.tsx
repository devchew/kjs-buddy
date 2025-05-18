import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCardContext } from "@internal/rally-card";
import { useCardsStore } from "../contexts/CardsStoreContext";
import { CardInfo, CardPanel } from "../types/Card";
import monte from "../assets/montecalvaria.png";
import pzm from "../assets/pzmot.png";
import { TbPlus, TbSquareRoundedChevronLeft } from "react-icons/tb";
import { usePredefinedCards } from "../hooks/usePredefinedCards";
import { PredefinedCard } from "../types/Responses";
import { Button } from "../components/Button.tsx";
import { Pill } from "../components/Pill.tsx";
import { Panel } from "../components/Panel.tsx";

type CardCreationMode = "blank" | "template" | "details";

export const CardCreatePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { updateCardInfo, updatePanels } = useCardContext();
  const { saveCard } = useCardsStore();
  const { predefinedCards, loading: loadingTemplates } = usePredefinedCards();

  // Track creation mode (selecting template or entering details)
  const [creationMode, setCreationMode] =
    useState<CardCreationMode>("template");
  const [selectedTemplate, setSelectedTemplate] =
    useState<PredefinedCard | null>(null);

  // Default values for the card info
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    name: "",
    cardNumber: 1,
    carNumber: 1,
    date: new Date().toISOString().split("T")[0],
    logo: monte,
    sponsorLogo: pzm,
  });

  // Default single panel to start with
  const [panelCount, setPanelCount] = useState(1);

  useEffect(() => {
    if (selectedTemplate) {
      // Ensure panels array exists and set panel count
      const panelsCount = Array.isArray(selectedTemplate.panels)
        ? selectedTemplate.panels.length
        : 1;
      setPanelCount(panelsCount);
    }
  }, [selectedTemplate]);

  const handleCardInfoChange = (name: string, value: string | number) => {
    setCardInfo({
      ...cardInfo,
      [name]: value,
    });
  };

  const handleTemplateSelect = (template: PredefinedCard) => {
    setSelectedTemplate(template);
    // Update cardInfo using template properties directly since cardInfo is no longer a nested property
    setCardInfo({
      name: template.name,
      cardNumber: template.cardNumber,
      carNumber: template.carNumber,
      date: template.date,
      logo: template.logo || monte,
      sponsorLogo: template.sponsorLogo || pzm,
    });
    setPanelCount(template.panels?.length || 1);
    setCreationMode("details");
  };

  const handleStartBlank = () => {
    setSelectedTemplate(null);
    setCreationMode("details");
  };

  const handleBackToTemplates = () => {
    setCreationMode("template");
  };

  const handlePanelCountChange = (value: number | string) => {
    setPanelCount(typeof value === "number" ? value : parseInt(value) || 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let panels: CardPanel[] = [];

    // Generate panels based on the panel count
    for (let i = 1; i <= panelCount; i++) {
      panels.push({
        number: i,
        name: i === 1 ? "" : `PS${i - 1}`,
        finishTime: 0,
        provisionalStartTime: i === 1 ? 34200000 : 0, // 9:30 AM in milliseconds
        actualStartTime: i === 1 ? 34200000 : 0,
        drivingTime: 0,
        resultTime: 0,
        nextPKCTime: 0,
        arrivalTime: 0,
      });
    }

    // Update card info and panels in context
    updateCardInfo(cardInfo);
    updatePanels(panels);

    // Save to the cards store
    saveCard(cardInfo, panels).then(({ id }) => {
      // Navigate to the card view after saving
      navigate(`/cards/${id}`);
    });
  };

  // Template selection screen
  if (creationMode === "template") {
    return (
      <div>
        <div style={{ marginBottom: "2rem" }}>
          <h3>Wybierz szablon</h3>
          <p style={{ color: "#666" }}>
            Rozpocznij od predefiniowanego szablonu lub utwórz od podstaw.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            }}
            onClick={handleStartBlank}
          >
            <div
              style={{
                paddingTop: ".5rem",
                paddingBottom: ".5rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: ".1rem solid",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TbPlus size={24} color="#495057" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  margin: "0 0 8px 0",
                }}
              >
                Pusta karta
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#666",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                Zacznij od pustej karty
              </p>
            </div>
          </div>

          {/* Predefined templates */}
          {loadingTemplates ? (
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <p>Ładowanie szablonów...</p>
            </div>
          ) : (
            predefinedCards.map((template) => (
              <div
                key={template.id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => handleTemplateSelect(template)}
              >
                <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
                  {template.name}
                </h4>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#666",
                    marginBottom: "1.5rem",
                    flex: 1,
                  }}
                >
                  {template.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "auto",
                  }}
                >
                  <Pill>Etapy: {template.panels?.length || 0}</Pill>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Card details form (either blank or pre-filled from template)
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <Button onClick={handleBackToTemplates}>
          <TbSquareRoundedChevronLeft size={20} />
          Powrót do szablonów
        </Button>
        <h3>
          {selectedTemplate
            ? `Tworzenie karty ${selectedTemplate.name}`
            : "Tworzenie nowej karty"}
        </h3>
      </div>

      <Panel>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
            Informacje o karcie
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Nazwa wydarzenia
              </label>
              <input
                type="text"
                id="name"
                name="name"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #e0e0e0",
                  fontSize: "1rem",
                }}
                value={cardInfo.name}
                onChange={(e) => handleCardInfoChange("name", e.target.value)}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Data wydarzenia
              </label>
              <input
                type="date"
                id="date"
                name="date"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #e0e0e0",
                  fontSize: "1rem",
                }}
                value={cardInfo.date}
                onChange={(e) => handleCardInfoChange("date", e.target.value)}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Numer karty
              </label>
              <input
                type="number"
                id="cardNumber"
                name="cardNumber"
                min="1"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #e0e0e0",
                  fontSize: "1rem",
                }}
                value={cardInfo.cardNumber}
                onChange={(e) =>
                  handleCardInfoChange(
                    "cardNumber",
                    parseInt(e.target.value) || 1,
                  )
                }
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Numer auta
              </label>
              <input
                type="number"
                id="carNumber"
                name="carNumber"
                min="1"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #e0e0e0",
                  fontSize: "1rem",
                }}
                value={cardInfo.carNumber}
                onChange={(e) =>
                  handleCardInfoChange(
                    "carNumber",
                    parseInt(e.target.value) || 1,
                  )
                }
                required
              />
            </div>
          </div>

          <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Etapy</h3>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              Liczba paneli (punkty PKC)
            </label>
            <input
              type="number"
              id="panelCount"
              min="1"
              max="10"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
                fontSize: "1rem",
                maxWidth: "200px",
              }}
              value={panelCount}
              onChange={(e) => handlePanelCountChange(e.target.value)}
            />
          </div>

          {selectedTemplate && selectedTemplate.panels && (
            <div style={{ marginTop: "1rem" }}>
              <p style={{ marginBottom: "0.5rem" }}>
                {panelCount > selectedTemplate.panels.length
                  ? `Dodano ${panelCount - selectedTemplate.panels.length} dodatkowych paneli do szablonu.`
                  : panelCount < selectedTemplate.panels.length
                    ? `Usunięto ${selectedTemplate.panels.length - panelCount} paneli z szablonu.`
                    : "Używanie paneli zgodnie z szablonem."}
              </p>
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  padding: "0.5rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                }}
              >
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {Array.from({
                    length: Math.min(
                      panelCount,
                      selectedTemplate.panels.length,
                    ),
                  }).map((_, index) => (
                    <li key={index} style={{ padding: "0.25rem 0" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          PKC{index + 1}:{" "}
                          <strong>
                            {index === 0 ? "Start" : `PS${index}`}
                          </strong>
                        </span>
                      </div>
                    </li>
                  ))}
                  {panelCount > selectedTemplate.panels.length && (
                    <li
                      style={{
                        textAlign: "center",
                        color: "#666",
                        fontStyle: "italic",
                      }}
                    >
                      + {panelCount - selectedTemplate.panels.length}{" "}
                      dodatkowych paneli zostanie wygenerowanych
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          <Button type="submit" primary>
            Utwórz kartę
          </Button>
        </form>
      </Panel>
    </>
  );
};
