import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, LineChart, Line
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PartyDashboard = () => {
  const data = {
    afd: {
      name: "AfD",
      textLength: 33419,
      sentiment: {
        average: -0.033,
        coverage: 0.064,
        maxPositive: 0.650,
        maxNegative: -1.0
      },
      readability: {
        avgSentenceLength: 18.57,
        avgWordLength: 6.83,
        syllablesPerWord: 2.03
      },
      vocabulary: {
        uniqueWords: 7242,
        typeTokenRatio: 0.374,
        hapaxlegomena: 5026
      },
      policyFocus: {
        wirtschaft: 6.07,
        umwelt: 1.86,
        soziales: 9.16,
        bildung: 5.03,
        sicherheit: 3.26
      },
      comparativeMetrics: {
        futureOrientation: 143,
        concreteMeasures: 3,
        intensityMarkers: 29
      }
    },
    union: {
      name: "Union",
      textLength: 29667,
      sentiment: {
        average: 0.017,
        coverage: 0.100,
        maxPositive: 0.609,
        maxNegative: -1.0
      },
      readability: {
        avgSentenceLength: 12.33,
        avgWordLength: 6.32,
        syllablesPerWord: 2.05
      },
      vocabulary: {
        uniqueWords: 5448,
        typeTokenRatio: 0.305,
        hapaxlegomena: 3439
      },
      policyFocus: {
        wirtschaft: 8.90,
        umwelt: 2.76,
        soziales: 9.30,
        bildung: 6.51,
        sicherheit: 7.35
      },
      comparativeMetrics: {
        futureOrientation: 113,
        concreteMeasures: 7,
        intensityMarkers: 23
      }
    },
    spd: {
      name: "SPD",
      textLength: 26376,
      sentiment: {
        average: 0.020,
        coverage: 0.098,
        maxPositive: 1.0,
        maxNegative: -1.0
      },
      readability: {
        avgSentenceLength: 14.53,
        avgWordLength: 7.11,
        syllablesPerWord: 2.17
      },
      vocabulary: {
        uniqueWords: 4256,
        typeTokenRatio: 0.292,
        hapaxlegomena: 2666
      },
      policyFocus: {
        wirtschaft: 6.82,
        umwelt: 3.53,
        soziales: 12.47,
        bildung: 6.10,
        sicherheit: 5.99
      },
      comparativeMetrics: {
        futureOrientation: 213,
        concreteMeasures: 12,
        intensityMarkers: 39
      }
    },
    gruene: {
      name: "Grüne",
      textLength: 34172,
      sentiment: {
        average: 0.025,
        coverage: 0.102,
        maxPositive: 0.602,
        maxNegative: -1.0
      },
      readability: {
        avgSentenceLength: 12.46,
        avgWordLength: 6.34,
        syllablesPerWord: 2.07
      },
      vocabulary: {
        uniqueWords: 5536,
        typeTokenRatio: 0.277,
        hapaxlegomena: 3497
      },
      policyFocus: {
        wirtschaft: 6.26,
        umwelt: 5.97,
        soziales: 9.28,
        bildung: 4.89,
        sicherheit: 5.30
      },
      comparativeMetrics: {
        futureOrientation: 227,
        concreteMeasures: 6,
        intensityMarkers: 51
      }
    },
    fdp: {
      name: "FDP",
      textLength: 20879,
      sentiment: {
        average: 0.022,
        coverage: 0.104,
        maxPositive: 1.0,
        maxNegative: -1.0
      },
      readability: {
        avgSentenceLength: 14.04,
        avgWordLength: 6.79,
        syllablesPerWord: 2.17
      },
      vocabulary: {
        uniqueWords: 4737,
        typeTokenRatio: 0.344,
        hapaxlegomena: 3165
      },
      policyFocus: {
        wirtschaft: 8.19,
        umwelt: 3.45,
        soziales: 8.96,
        bildung: 7.38,
        sicherheit: 4.84
      },
      comparativeMetrics: {
        futureOrientation: 82,
        concreteMeasures: 4,
        intensityMarkers: 28
      }
    }
  };

  const parties = Object.values(data);

  // Prepare data for different charts
  const sentimentData = parties.map(party => ({
    name: party.name,
    average: party.sentiment.average,
    coverage: party.sentiment.coverage
  }));

  const policyFocusData = parties.map(party => ({
    name: party.name,
    ...party.policyFocus
  }));

  const readabilityData = parties.map(party => ({
    name: party.name,
    ...party.readability
  }));

  const comparativeData = parties.map(party => ({
    name: party.name,
    ...party.comparativeMetrics
  }));

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Party Program Analysis Dashboard</h1>
      
      {/* Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#8884d8" name="Average Sentiment" />
                <Bar dataKey="coverage" fill="#82ca9d" name="Sentiment Coverage" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Policy Focus */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Focus (mentions per 1000 words)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={policyFocusData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar name="Wirtschaft" dataKey="wirtschaft" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Umwelt" dataKey="umwelt" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Radar name="Soziales" dataKey="soziales" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Radar name="Bildung" dataKey="bildung" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
                <Radar name="Sicherheit" dataKey="sicherheit" stroke="#0088fe" fill="#0088fe" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Readability Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Readability Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgSentenceLength" stroke="#8884d8" name="Avg Sentence Length" />
                <Line type="monotone" dataKey="avgWordLength" stroke="#82ca9d" name="Avg Word Length" />
                <Line type="monotone" dataKey="syllablesPerWord" stroke="#ffc658" name="Syllables per Word" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Comparative Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Comparative Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="futureOrientation" fill="#8884d8" name="Future Orientation" />
                <Bar dataKey="concreteMeasures" fill="#82ca9d" name="Concrete Measures" />
                <Bar dataKey="intensityMarkers" fill="#ffc658" name="Intensity Markers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartyDashboard;