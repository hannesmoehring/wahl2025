"use client";

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, LineChart, Line
} from 'recharts';

interface SentimentAnalysis {
  average_sentiment: number;
  sentiment_words_count: number;
  total_words: number;
  sentiment_coverage: number;
  max_positive_sentiment: number;
  max_negative_sentiment: number;
}

interface TextAnalysis {
  readability_metrics: {
    avg_sentence_length: number;
    avg_word_length: number;
    syllables_per_word: number;
  };
  vocabulary_richness: {
    unique_words: number;
    type_token_ratio: number;
    hapaxlegomena: number;
  };
  top_keywords: [string, number][]; 
  policy_focus: {
    wirtschaft: number;
    umwelt: number;
    soziales: number;
    bildung: number;
    sicherheit: number;
  };
  comparative_metrics: {
    future_orientation: number;
    concrete_measures: number;
    intensity_markers: number;
  };
}

interface PartyData {
  text_length: number;
  sentiment_analysis: SentimentAnalysis;
  text_analysis: TextAnalysis;
  mentioned_parties: Record<string, number>;
}

interface CombinedData {
  [party: string]: PartyData;
}

const PartyDashboard = () => {
  const [data, setData] = useState<CombinedData | null>(null);

  useEffect(() => {
    fetch('/combined_data.json')
      .then(response => response.json())
      .then((jsonData: CombinedData) => setData(jsonData))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  if (!data) return <div>Loading...</div>;

  // Fixed topKeywordsData
  const topKeywordsData = Object.entries(data).map(([party, details]) => {
    const top5 = details.text_analysis.top_keywords
      .slice(0, 5)
      .reduce<Record<string, number>>((obj, [word, count]) => {
        obj[word] = count;
        return obj;
      }, {});
    return {
      name: party.toUpperCase(),
      ...top5
    };
  });

  // Fixed partyMentionsData
  const partyMentionsData = Object.entries(data).map(([party, details]) => ({
    name: party.toUpperCase(),
    ...details.mentioned_parties
  }));

  // Fixed parties mapping
  const parties = Object.entries(data).map(([party, details]) => ({
    name: party.toUpperCase(),
    ...details
  }));

  const sentimentData = parties.map(party => ({
    name: party.name,
    average: party.sentiment_analysis.average_sentiment,
    coverage: party.sentiment_analysis.sentiment_coverage
  }));

  const readabilityData = parties.map(party => ({
    name: party.name,
    ...party.text_analysis.readability_metrics
  }));

  const comparativeData = parties.map(party => ({
    name: party.name,
    ...party.text_analysis.comparative_metrics
  }));

  // Get list of parties for mentions chart
  const partyList = Object.keys(Object.values(data)[0].mentioned_parties);
  
    return (
        
      <div className="w-full max-w-6xl mx-auto p-4 space-y-8 text-black">
        <title>Partei Programm Analyse</title>
        <h1 className="text-3xl font-bold mb-6">Analyse der Parteiprogramme</h1>
        
        {/* Sentiment Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sentiment Analysis</h2>
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
        </div>
  
        {/* Top Keywords */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Top 5 Keywords by Party</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topKeywordsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                {Object.keys(topKeywordsData[0]).filter(key => key !== 'name').map((word, index) => (
                  <Bar key={word} dataKey={word} fill={`hsl(${index * 60}, 70%, 60%)`} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Individual Policy Focus Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parties.map(party => (
            <div key={party.name} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">{party.name} Policy Focus</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[party.text_analysis.policy_focus]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="wirtschaft" fill="#8884d8" name="Economy" />
                    <Bar dataKey="umwelt" fill="#82ca9d" name="Environment" />
                    <Bar dataKey="soziales" fill="#ffc658" name="Social" />
                    <Bar dataKey="bildung" fill="#ff7300" name="Education" />
                    <Bar dataKey="sicherheit" fill="#0088fe" name="Security" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
  
        {/* Party Mentions section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Party Mentions</h2>
            <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={partyMentionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {partyList.map((party, index) => (
                    <Bar 
                    key={party} 
                    dataKey={party} 
                    fill={`hsl(${index * 60}, 70%, 60%)`} 
                    name={party.toUpperCase()}
                    />
                ))}
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
  
        {/* Readability Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Readability Metrics</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avg_sentence_length" 
                  stroke="#8884d8" 
                  name="Avg Sentence Length" 
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_word_length" 
                  stroke="#82ca9d" 
                  name="Avg Word Length" 
                />
                <Line 
                  type="monotone" 
                  dataKey="syllables_per_word" 
                  stroke="#ffc658" 
                  name="Syllables per Word" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Comparative Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Comparative Metrics</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="future_orientation" 
                  fill="#8884d8" 
                  name="Future Orientation" 
                />
                <Bar 
                  dataKey="concrete_measures" 
                  fill="#82ca9d" 
                  name="Concrete Measures" 
                />
                <Bar 
                  dataKey="intensity_markers" 
                  fill="#ffc658" 
                  name="Intensity Markers" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  export default PartyDashboard;