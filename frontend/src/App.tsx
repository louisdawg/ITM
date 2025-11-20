import React, { useState, useEffect, useRef } from "react";
import { apiService, type Unit, type Personnel } from "./services/api";
import "./App.css";

interface TreeNode extends Unit {
  children: TreeNode[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

function App() {
  const [organisation, setOrganisation] = useState<Unit[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const organigramRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Lade Organisationsdaten...");
      const orgResponse = await apiService.getOrganisation();

      if (orgResponse.data.success) {
        setOrganisation(orgResponse.data.data);
      } else {
        setError("API Fehler: " + orgResponse.data.error);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message;
      setError("Fehler beim Laden der Daten: " + errorMsg);
      console.error("API Fehler:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPersonnel = async (unitId: number) => {
    try {
      const response = await apiService.getPersonnel(unitId);
      if (response.data.success) {
        setPersonnel(response.data.data);
        const unit = organisation.find((u) => u.id === unitId);
        setSelectedUnit(unit || null);
      }
    } catch (err) {
      console.error("Fehler beim Laden des Personals:", err);
    }
  };

  const buildTree = (units: Unit[]): TreeNode[] => {
    const unitMap = new Map<number, TreeNode>();
    const roots: TreeNode[] = [];
    units.forEach((unit) => {
      unitMap.set(unit.id, { ...unit, children: [] });
    });
    units.forEach((unit) => {
      const node = unitMap.get(unit.id);
      if (unit.parent_unit_id && unitMap.has(unit.parent_unit_id)) {
        const parent = unitMap.get(unit.parent_unit_id);
        if (parent && node) {
          parent.children.push(node);
        }
      } else if (node) {
        roots.push(node);
      }
    });

    return roots;
  };

  const treeData = buildTree(organisation);

  const positionNodes = (
    nodes: TreeNode[],
    startY: number = 100,
    level: number = 0
  ) => {
    const levelHeight = 120;
    let x = 100;

    nodes.forEach((node) => {
      node.x = x;
      node.y = startY + level * levelHeight;
      node.width = 180;
      node.height = 70;

      if (node.children.length > 0) {
        const totalChildWidth = (node.children.length - 1) * 200;
        const childStartX = x - totalChildWidth / 2;
        node.children.forEach((child, index) => {
          child.x = childStartX + index * 200;
        });
        positionNodes(node.children, startY, level + 1);
      }

      x += 250;
    });
  };

  if (treeData.length > 0) {
    positionNodes(treeData);
  }

  const renderConnections = () => {
    const connections: JSX.Element[] = [];

    const drawConnections = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        node.children.forEach((child) => {
          if (
            node.x &&
            node.y &&
            node.width &&
            node.height &&
            child.x &&
            child.y
          ) {
            connections.push(
              <line
                key={`${node.id}-${child.id}`}
                x1={node.x + node.width / 2}
                y1={node.y + node.height}
                x2={child.x + (child.width || 180) / 2}
                y2={child.y}
                stroke="#2C3E50"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          }
          drawConnections([child]);
        });
      });
    };

    drawConnections(treeData);
    return connections;
  };
  const renderNodes = (nodes: TreeNode[]) => {
    return nodes.map((node) => (
      <g key={node.id}>
        <rect
          x={node.x}
          y={node.y}
          width={node.width}
          height={node.height}
          rx="8"
          ry="8"
          fill={getNodeColor(node.level)}
          stroke={selectedUnit?.id === node.id ? "#CD212A" : "#2C3E50"}
          strokeWidth={selectedUnit?.id === node.id ? "3" : "2"}
          className="org-node"
          cursor="pointer"
          onClick={() => loadPersonnel(node.id)}
        />
        <text
          x={node.x! + (node.width || 180) / 2}
          y={node.y! + 20}
          textAnchor="middle"
          fill="#2C3E50"
          fontSize="10"
          fontWeight="600"
          className="org-node-text"
        >
          {truncateText(node.name, 20)}
        </text>

        <text
          x={node.x! + (node.width || 180) / 2}
          y={node.y! + 35}
          textAnchor="middle"
          fill="#7F8C8D"
          fontSize="8"
          fontWeight="500"
          className="org-node-text"
        >
          {node.type}
        </text>

        <text
          x={node.x! + (node.width || 180) / 2}
          y={node.y! + 50}
          textAnchor="middle"
          fill="#008C45"
          fontSize="7"
          fontWeight="600"
          className="org-node-text"
        >
          👥 {node.personnel_count || 0}
        </text>

        {node.children.length > 0 && renderNodes(node.children)}
      </g>
    ));
  };

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const getNodeColor = (level: number): string => {
    const colors = [
      "#FFE5E5",
      "#FFF5E6",
      "#E8F5E8",
      "#E8F4FD",
      "#F4ECF7",
      "#FFF0F5",
      "#F0FFF0",
    ];
    return colors[level] || "#F8F9FA";
  };

  const exportToPNG = async () => {
    if (!organigramRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(organigramRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `organigramm-esercito-italiano-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("Fehler beim PNG-Export:", err);
      alert(
        "PNG-Export fehlgeschlagen. Bitte html2canvas installieren: npm install html2canvas"
      );
    }
  };

  const exportToSVG = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = `organigramm-esercito-italiano-${
      new Date().toISOString().split("T")[0]
    }.svg`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  const groupPersonnelByRank = (personnelList: Personnel[]) => {
    const grouped: { [key: string]: Personnel[] } = {
      Offiziere: [],
      Unteroffiziere: [],
      Mannschaften: [],
    };

    personnelList.forEach((person) => {
      if (person.rang_code.startsWith("OF")) {
        grouped["Offiziere"].push(person);
      } else if (
        person.rang_code.startsWith("OR") &&
        parseInt(person.rang_code.split("-")[1]) >= 5
      ) {
        grouped["Unteroffiziere"].push(person);
      } else {
        grouped["Mannschaften"].push(person);
      }
    });

    return grouped;
  };

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Lade Organisationsdaten des Italienischen Heeres...</p>
      </div>
    );

  if (error)
    return (
      <div className="error">
        <h3>Fehler</h3>
        <p>{error}</p>
        <button onClick={loadData}>Erneut versuchen</button>
      </div>
    );

  const groupedPersonnel = groupPersonnelByRank(personnel);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="title-section">
            <h1>Esercito Italiano</h1>
            <p>Organigramm - Italienisches Heer</p>
          </div>
          <div className="export-buttons">
            <button onClick={exportToPNG} className="export-btn png-btn">
              Als PNG speichern
            </button>
            <button onClick={exportToSVG} className="export-btn svg-btn">
              Als SVG speichern
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="organigramm-container">
          <div className="organigramm-section">
            <div className="organigramm" ref={organigramRef}>
              <div className="org-title">
                <h2>Organigramm</h2>
                <div className="org-stats">
                  <span>Einheiten: {organisation.length}</span>
                </div>
              </div>

              <div className="svg-container">
                <svg
                  ref={svgRef}
                  width="100%"
                  height="800"
                  viewBox="0 0 2000 800"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#2C3E50" />
                    </marker>
                    <filter id="dropShadow">
                      <feDropShadow
                        dx="1"
                        dy="1"
                        stdDeviation="2"
                        floodColor="#000000"
                        floodOpacity="0.2"
                      />
                    </filter>
                  </defs>
                  <rect width="100%" height="100%" fill="#fafafa" />
                  {renderConnections()}
                  {treeData.length > 0 && renderNodes(treeData)}
                </svg>
              </div>
              <div className="legend">
                <h4>Hierarchie-Ebenen:</h4>
                <div className="legend-items">
                  <div className="legend-item">
                    <div className="legend-color level-0"></div>
                    <span>Ebene 0 - Oberkommando</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color level-1"></div>
                    <span>Ebene 1 - Korps</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color level-2"></div>
                    <span>Ebene 2 - Divisionen</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color level-3"></div>
                    <span>Ebene 3 - Brigaden</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color level-4"></div>
                    <span>Ebene 4 - Regimenter</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color level-5"></div>
                    <span>Ebene 5 - Bataillone</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color level-6"></div>
                    <span>Ebene 6 - Kompanien</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="personnel-section">
            <div className="personnel-view">
              <div className="personnel-header">
                <h3>
                  {selectedUnit
                    ? `Personal - ${selectedUnit.name}`
                    : "Personal"}
                </h3>
                {selectedUnit && (
                  <div className="unit-info">
                    <span className="unit-type">{selectedUnit.type}</span>
                    <span className="unit-location">
                      📍 {selectedUnit.location}
                    </span>
                  </div>
                )}
              </div>

              {selectedUnit ? (
                personnel.length > 0 ? (
                  <div className="personnel-content">
                    {Object.entries(groupedPersonnel).map(
                      ([category, persons]) =>
                        persons.length > 0 && (
                          <div key={category} className="rank-category">
                            <h4 className="category-title">
                              {category} ({persons.length})
                            </h4>
                            <div className="personnel-list">
                              {persons.map((person) => (
                                <div key={person.id} className="personnel-card">
                                  <div className="personnel-rank">
                                    <span
                                      className={`rank-badge ${
                                        person.rang_code.includes("OF")
                                          ? "officer"
                                          : person.rang_code.includes("OR-9") ||
                                            person.rang_code.includes("OR-8")
                                          ? "nco-senior"
                                          : person.rang_code.includes("OR-5") ||
                                            person.rang_code.includes("OR-6") ||
                                            person.rang_code.includes("OR-7")
                                          ? "nco-junior"
                                          : "enlisted"
                                      }`}
                                    >
                                      {person.rank}
                                    </span>
                                    <span className="rank-code">
                                      {person.rang_code}
                                    </span>
                                  </div>
                                  <div className="personnel-name">
                                    {person.name}
                                  </div>
                                  <div className="personnel-position">
                                    {person.position}
                                  </div>
                                  <div className="personnel-service">
                                    Dienstnummer: {person.service_number}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                ) : (
                  <div className="no-personnel">
                    <p>Kein Personal für diese Einheit gefunden</p>
                  </div>
                )
              ) : (
                <div className="no-selection">
                  <div className="hint-icon"></div>
                  <p>
                    Klicken Sie auf eine Einheit im Organigramm, um das Personal
                    anzuzeigen
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
