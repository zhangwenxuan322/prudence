import React, { useState, useEffect } from 'react';
import { riskService } from '../services/riskService';
import { Risk } from '../types';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface RiskMatrixData {
  x: number;
  y: number;
  risk: Risk;
}

interface MatrixCell {
  risks: Risk[];
  probability: number;
  impact: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const RiskMatrix: React.FC = () => {
  const [inherentData, setInherentData] = useState<RiskMatrixData[]>([]);
  const [residualData, setResidualData] = useState<RiskMatrixData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'inherent' | 'residual'>('inherent');
  const [selectedCell, setSelectedCell] = useState<MatrixCell | null>(null);

  const probabilityLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
  const impactLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
        setLoading(true);
        const data = await riskService.getRiskMatrix();
        setInherentData(data.inherent);
        setResidualData(data.residual);
      } catch (err) {
        setError('Failed to load risk matrix data');
        console.error('Error fetching risk matrix:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrixData();
  }, []);

  const getRiskLevel = (probability: number, impact: number): 'low' | 'medium' | 'high' | 'critical' => {
    const rating = probability * impact;
    if (rating >= 20) return 'critical';
    if (rating >= 15) return 'high';
    if (rating >= 10) return 'medium';
    return 'low';
  };

  const getCellColor = (level: 'low' | 'medium' | 'high' | 'critical'): string => {
    switch (level) {
      case 'low': return 'bg-green-100 border-green-300';
      case 'medium': return 'bg-yellow-100 border-yellow-300';
      case 'high': return 'bg-orange-100 border-orange-300';
      case 'critical': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getTextColor = (level: 'low' | 'medium' | 'high' | 'critical'): string => {
    switch (level) {
      case 'low': return 'text-green-800';
      case 'medium': return 'text-yellow-800';
      case 'high': return 'text-orange-800';
      case 'critical': return 'text-red-800';
      default: return 'text-gray-800';
    }
  };

  const createMatrix = (): MatrixCell[][] => {
    const matrix: MatrixCell[][] = [];
    const currentData = viewMode === 'inherent' ? inherentData : residualData;

    // Create 5x5 matrix (impact x probability)
    for (let impact = 5; impact >= 1; impact--) {
      const row: MatrixCell[] = [];
      for (let probability = 1; probability <= 5; probability++) {
        const risks = currentData
          .filter(item => item.x === probability && item.y === impact)
          .map(item => item.risk);

        row.push({
          risks,
          probability,
          impact,
          riskLevel: getRiskLevel(probability, impact)
        });
      }
      matrix.push(row);
    }

    return matrix;
  };

  const handleCellClick = (cell: MatrixCell) => {
    if (cell.risks.length > 0) {
      setSelectedCell(cell);
    }
  };

  const matrix = createMatrix();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Risk Matrix</h1>
        <p className="text-gray-600">
          Visualize risks based on probability and impact. Click on cells to see detailed risk information.
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('inherent')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'inherent'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inherent Risk
          </button>
          <button
            onClick={() => setViewMode('residual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'residual'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Residual Risk
          </button>
        </div>
      </div>

      {/* Risk Matrix Grid */}
      <div className="mb-6">
        <Card>
          <div className="p-4">
            <div className="relative">
              {/* Y-axis label */}
              <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90">
                <span className="text-sm font-semibold text-gray-700">Impact</span>
              </div>
              
              {/* Matrix */}
              <div className="ml-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-20"></th>
                      {probabilityLabels.map((label, index) => (
                        <th key={index} className="text-xs font-medium text-gray-700 p-2 border">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="text-xs font-medium text-gray-700 p-2 border text-center">
                          {impactLabels[4 - rowIndex]}
                        </td>
                        {row.map((cell, colIndex) => (
                          <td
                            key={colIndex}
                            className={`border-2 w-24 h-24 cursor-pointer transition-all hover:shadow-lg ${getCellColor(cell.riskLevel)}`}
                            onClick={() => handleCellClick(cell)}
                          >
                            <div className="flex flex-col items-center justify-center h-full p-2">
                              <div className={`text-lg font-bold ${getTextColor(cell.riskLevel)}`}>
                                {cell.risks.length}
                              </div>
                              <div className="text-xs text-gray-600 text-center">
                                {cell.risks.length === 1 ? 'risk' : 'risks'}
                              </div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* X-axis label */}
              <div className="text-center mt-4">
                <span className="text-sm font-semibold text-gray-700">Probability</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Level Legend */}
      <div className="mb-6">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Level Legend</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { level: 'low' as const, label: 'Low Risk (1-9)', color: 'bg-green-100 border-green-300 text-green-800' },
                { level: 'medium' as const, label: 'Medium Risk (10-14)', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
                { level: 'high' as const, label: 'High Risk (15-19)', color: 'bg-orange-100 border-orange-300 text-orange-800' },
                { level: 'critical' as const, label: 'Critical Risk (20-25)', color: 'bg-red-100 border-red-300 text-red-800' }
              ].map(({ level, label, color }) => (
                <div key={level} className={`px-3 py-2 rounded-lg border-2 ${color}`}>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Selected Cell Details */}
      {selectedCell && (
        <div className="mb-6">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Risks in {impactLabels[selectedCell.impact - 1]} Impact × {probabilityLabels[selectedCell.probability - 1]} Probability
              </h3>
              <div className="space-y-3">
                {selectedCell.risks.map((risk) => (
                  <div key={risk.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{risk.description}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getRiskLevel(
                          viewMode === 'inherent' ? risk.inherent_probability : risk.residual_probability,
                          viewMode === 'inherent' ? risk.inherent_impact : risk.residual_impact
                        ) === 'critical' ? 'bg-red-100 text-red-800' :
                        getRiskLevel(
                          viewMode === 'inherent' ? risk.inherent_probability : risk.residual_probability,
                          viewMode === 'inherent' ? risk.inherent_impact : risk.residual_impact
                        ) === 'high' ? 'bg-orange-100 text-orange-800' :
                        getRiskLevel(
                          viewMode === 'inherent' ? risk.inherent_probability : risk.residual_probability,
                          viewMode === 'inherent' ? risk.inherent_impact : risk.residual_impact
                        ) === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {getRiskLevel(
                          viewMode === 'inherent' ? risk.inherent_probability : risk.residual_probability,
                          viewMode === 'inherent' ? risk.inherent_impact : risk.residual_impact
                        ).toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Owner:</span> {risk.owner.first_name} {risk.owner.last_name}
                      </div>
                      <div>
                        <span className="font-medium">Risk Type:</span> {risk.risk_type?.name || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Controls:</span> {risk.controls.length}
                      </div>
                      <div>
                        <span className="font-medium">Last Assessed:</span> {risk.last_assessed ? new Date(risk.last_assessed).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close Details
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RiskMatrix;
